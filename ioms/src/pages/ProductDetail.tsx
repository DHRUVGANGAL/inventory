import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Grid,
  Button, Stack, Chip, Divider, Card, CardContent, Avatar,
  Alert, Fade, Container,
} from '@mui/material';
import { fetchProductDetails } from '../services/api';
import type { ProductInfo } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
    isAuthenticated: boolean;
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'error', icon: <CancelIcon /> };
  if (stock <= 10) return { label: 'Low Stock', color: 'warning', icon: <TrendingUpIcon /> };
  return { label: 'In Stock', color: 'success', icon: <CheckCircleIcon /> };
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [product, setProduct] = useState<ProductInfo | null>(null);
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
      setError("No product ID provided.");
      setLoading(false);
      return;
    }
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        setError("Invalid Product ID.");
        setLoading(false);
        return;
    }

    const loadProductDetails = async () => {
      try {
        const response = await fetchProductDetails(numericId);
        setProduct(response);
      } catch (err) {
        console.error('Error fetching product details', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
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
            Loading product details...
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
            onClick={() => navigate('/products')}
            variant="outlined"
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No product data found.
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/products')}
            variant="outlined"
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  const stockStatus = getStockStatus(product.stock);

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
                  onClick={() => navigate('/products')}
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
                  Back to Products
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                  sx={{ 
                    backgroundColor: '#9c27b0',
                    '&:hover': { backgroundColor: '#7b1fa2' },
                    boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)'
                  }}
                >
                  Edit Product
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
                  <InventoryIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="600" mb={1}>
                    {product.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Product ID: #{product.id}
                    </Typography>
                    <Chip 
                      label={product.active ? 'Active' : 'Inactive'}
                      color={product.active ? 'success' : 'default'}
                      icon={product.active ? <CheckCircleIcon /> : <CancelIcon />}
                      sx={{ 
                        backgroundColor: product.active ? 'rgba(76, 175, 80, 0.9)' : 'rgba(158, 158, 158, 0.9)',
                        color: 'white',
                        fontWeight: '600'
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

   
          <Grid container spacing={3} sx={{ mb: 4 }}>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                } 
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    backgroundColor: '#e8f5e8', 
                    color: '#2e7d32', 
                    width: 56, 
                    height: 56, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <PriceChangeIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Current Price
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="primary">
                    ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                } 
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2', 
                    width: 56, 
                    height: 56, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <WarehouseIcon />
                  </Avatar>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Stock Level
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="primary" mb={1}>
                    {product.stock}
                  </Typography>
                  <Chip 
                    label={stockStatus.label}
                    color={stockStatus.color as any}
                    icon={stockStatus.icon}
                    size="small"
                    sx={{ fontWeight: '500' }}
                  />
                </CardContent>
              </Card>
            </Grid>
            

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                } 
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    backgroundColor: product.active ? '#e8f5e8' : '#ffebee', 
                    color: product.active ? '#2e7d32' : '#d32f2f', 
                    width: 56, 
                    height: 56, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    {product.active ? <CheckCircleIcon /> : <CancelIcon />}
                  </Avatar>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Product Status
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight="600" 
                    color={product.active ? 'success.main' : 'error.main'}
                    mb={1}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.active ? 'Available for sale' : 'Not available for sale'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

       
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ 
                  backgroundColor: '#f3e5f5', 
                  color: '#7b1fa2',
                  width: 48,
                  height: 48
                }}>
                  <DescriptionIcon />
                </Avatar>
                <Typography variant="h5" component="h2" fontWeight="600">
                  Product Description
                </Typography>
              </Stack>
              
              <Divider sx={{ mb: 3 }} />
              
              {product.description ? (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    color: 'text.secondary'
                  }}
                >
                  {product.description}
                </Typography>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DescriptionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No description available
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Consider adding a description to help customers understand this product better.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                    sx={{ mt: 2 }}
                  >
                    Add Description
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

 
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Quick Actions
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                >
                  Edit Product
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate(`/orders/new?productId=${product.id}`)}
                >
                  Create Order
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default ProductDetailPage;