import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress,  Grid, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
  Stack, Chip, Link as  Card, CardContent, Avatar, Alert,
  Fade, Container, 
} from '@mui/material';
import { fetchOrderDeatil } from '../services/api';
import type { Order, OrderItem } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmailIcon from '@mui/icons-material/Email';
import LaunchIcon from '@mui/icons-material/Launch';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
    isAuthenticated: boolean;
}

const getStatusChipColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'success';
    case 'processing':
    case 'shipped':
      return 'info';
    case 'pending':
      return 'warning';
    case 'cancelled':
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    const loadOrderDetails = async () => {
      try {
        const response = await fetchOrderDeatil(id);
        setOrder(response);
      } catch (err) {
        console.error('Error fetching order details', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading order details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/orders')}
            variant="outlined"
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No order data found.
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/orders')}
            variant="outlined"
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
    );
  }

  const totalItems = order.item?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={500}>
        <Box sx={{ py: 3 }}>
      
          <Card sx={{ 
            mb: 4, 
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
            color: 'white',
            overflow: 'visible'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => navigate('/orders')}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { 
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  variant="outlined"
                >
                  Back to Orders
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Chip 
                  label={order.status} 
                  color={getStatusChipColor(order.status) as any}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#333',
                    fontWeight: '600'
                  }}
                />
              </Stack>
              
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    fontSize: '2rem'
                  }}
                >
                  <ReceiptIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="600" mb={1}>
                    Order #{order.order_id}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CalendarTodayIcon fontSize="small" />
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          
          <Grid container spacing={3} sx={{ mb: 4 }}>
        
            <Grid >
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                } 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Avatar sx={{ 
                      backgroundColor: '#e8f5e8', 
                      color: '#2e7d32',
                      width: 56,
                      height: 56
                    }}>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600">
                        Order Total
                      </Typography>
                      <Typography variant="h4" color="primary" fontWeight="700">
                        ₹{parseFloat(order.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Items:</Typography>
                      <Typography fontWeight="500">{totalItems}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Status:</Typography>
                      <Chip 
                        label={order.status} 
                        color={getStatusChipColor(order.status) as any}
                        size="small"
                        sx={{ fontWeight: '500' }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
      
            <Grid >
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                } 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Avatar sx={{ 
                      backgroundColor: '#e3f2fd', 
                      color: '#1976d2',
                      width: 56,
                      height: 56
                    }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">
                      Customer Information
                    </Typography>
                  </Stack>
                  
                  {order.customer ? (
                    <Grid container spacing={2}>
                      <Grid >
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Customer ID
                          </Typography>
                          <Typography variant="body1" fontWeight="500" mb={2}>
                            #{order.customer.id}
                          </Typography>
                          
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Full Name
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {order.customer.name}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid >
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Email Address
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <EmailIcon fontSize="small" color="disabled" />
                            <Typography variant="body1" fontWeight="500">
                              {order.customer.email}
                            </Typography>
                          </Stack>
                          
                          <Button
                            component={Link}
                            to={`/customers/${order.customer.id}`}
                            variant="outlined"
                            size="small"
                            endIcon={<LaunchIcon />}
                            sx={{ mt: 1 }}
                          >
                            View Customer Profile
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      No customer associated with this order.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

     
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <InventoryIcon color="primary" />
                  <Typography variant="h5" component="h2" fontWeight="600">
                    Order Items
                  </Typography>
                  <Chip 
                    label={`${order.item?.length || 0} products`} 
                    color="primary" 
                    variant="outlined" 
                  />
                </Stack>
              </Box>
              
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="order items table">
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: '#f8f9fa',
                      '& th': { 
                        fontWeight: '600',
                        color: '#495057',
                        borderBottom: '2px solid #dee2e6'
                      } 
                    }}>
                      <TableCell>Product Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.item && order.item.length > 0 ? (
                      order.item.map((item: OrderItem, index: number) => {
                        const subtotal = item.quantity * parseFloat(item.product_price);
                        return (
                          <TableRow 
                            key={`${item.product_name}-${index}`} 
                            hover
                            sx={{ 
                              '&:hover': { backgroundColor: '#f8f9fa' },
                              '& td': { borderBottom: '1px solid #e9ecef' }
                            }}
                          >
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  backgroundColor: '#f3e5f5',
                                  color: '#7b1fa2'
                                }}>
                                  <ShoppingCartIcon fontSize="small" />
                                </Avatar>
                                <Typography fontWeight="500">
                                  {item.product_name || 'N/A'}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={item.quantity}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="500">
                                ₹{parseFloat(item.product_price).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="600" color="primary">
                                ₹{subtotal.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          <Stack alignItems="center" spacing={2}>
                            <InventoryIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                            <Typography variant="h6" color="text.secondary">
                              No items found in this order
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>


              {order.item && order.item.length > 0 && (
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: '#f8f9fa',
                  borderTop: '2px solid #dee2e6'
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="600">
                      Order Total:
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight="700">
                      ₹{parseFloat(order.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default OrderDetailPage;