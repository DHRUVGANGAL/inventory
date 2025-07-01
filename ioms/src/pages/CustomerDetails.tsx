import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Stack, Card, CardContent, Chip, Avatar, IconButton,
  Tooltip, Alert, Fade, Container
} from '@mui/material';
import { fetchCustomerDetails } from '../services/api';
import type { Customer, OrderDetail } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
    isAuthenticated: boolean;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'success';
    case 'pending':
    case 'processing':
      return 'warning';
    case 'cancelled':
    case 'failed':
      return 'error';
    case 'shipped':
      return 'info';
    default:
      return 'default';
  }
};

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [customer, setCustomer] = useState<Customer | null>(null);
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
      setError("No customer ID provided.");
      setLoading(false);
      return;
    }

    const loadCustomerDetails = async () => {
      try {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
          throw new Error("Invalid customer ID.");
        }
        const response = await fetchCustomerDetails(numericId);
        setCustomer(response);
      } catch (err) {
        console.error('Error fetching customer details', err);
        setError('Failed to load customer details.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomerDetails();
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
            Loading customer details...
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
            onClick={() => navigate('/customers')}
            variant="outlined"
          >
            Back to Customers
          </Button>
        </Box>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No customer data found.
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/customers')}
            variant="outlined"
          >
            Back to Customers
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={500}>
        <Box sx={{ py: 3 }}>

          <Card sx={{ 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            overflow: 'visible'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  onClick={() => navigate('/customers')}
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
                  Back to Customers
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/orders/new?customerId=${customer.id}`)}
                  sx={{ 
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#45a049' },
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  New Order
                </Button>
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
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="600" mb={1}>
                    {customer.name}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Customer ID: #{customer.id}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>


          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2', 
                    width: 56, 
                    height: 56, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <EmailIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {customer.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    backgroundColor: '#f3e5f5', 
                    color: '#7b1fa2', 
                    width: 56, 
                    height: 56, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <PhoneIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {customer.phone_number}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    backgroundColor: '#e8f5e8', 
                    color: '#2e7d32', 
                    width: 56, 
                    height: 56, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <ShoppingCartIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="primary">
                    {customer.OrderCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

     
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="h5" component="h2" fontWeight="600">
                    Order History
                  </Typography>
                  <Chip 
                    label={`${customer.OrderDetail?.length || 0} orders`} 
                    color="primary" 
                    variant="outlined" 
                  />
                </Stack>
              </Box>
              
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="order history table">
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: '#f8f9fa',
                      '& th': { 
                        fontWeight: '600',
                        color: '#495057',
                        borderBottom: '2px solid #dee2e6'
                      } 
                    }}>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customer.OrderDetail && customer.OrderDetail.length > 0 ? (
                      customer.OrderDetail.map((order: OrderDetails, index: number) => (
                        <TableRow 
                          key={order.order_id} 
                          hover
                          sx={{ 
                            '&:hover': { backgroundColor: '#f8f9fa' },
                            '& td': { borderBottom: '1px solid #e9ecef' }
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight="600" color="primary">
                              #{order.order_id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CalendarTodayIcon fontSize="small" color="disabled" />
                              <Typography>
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.status} 
                              color={getStatusColor(order.status) as any}
                              size="small"
                              sx={{ fontWeight: '500' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Order Details">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => navigate(`/orders/${order.order_id}`)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          <Stack alignItems="center" spacing={2}>
                            <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                            <Typography variant="h6" color="text.secondary">
                              No orders found for this customer
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => navigate(`/orders/new?customerId=${customer.id}`)}
                            >
                              Create First Order
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default CustomerDetailPage;