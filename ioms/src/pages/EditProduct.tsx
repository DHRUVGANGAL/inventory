import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Container,
  CircularProgress, Alert, FormControlLabel, Switch, Stack,
  Card, CardContent, Divider, InputAdornment, Chip,
  IconButton, Tooltip, Fade, Zoom, useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, fetchProductDetails } from '../services/api';
import type { ProductInfo } from '../interface/interface';




const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();


  const [formData, setFormData] = useState<Partial<ProductInfo>>({
    name: '',
    description: '',
    price: '',
    stock: 0,
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);



  useEffect(() => {
    if (!id) {
        setError("No product ID provided.");
        setLoading(false);
        return;
    }
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
    }

    const loadProduct = async () => {
      try {
        const product = await fetchProductDetails(numericId);
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          active: product.active,
        });
      } catch (err) {
        console.error("Failed to fetch product details", err);
        setError("Could not load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const numericId = parseInt(id, 10);
     
      const productDataToSubmit = {
          ...formData,
          price: String(formData.price),
          stock: Number(formData.stock)
      };
      await updateProduct(numericId, productDataToSubmit);
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      console.error('Failed to update product', err);
      setError('Failed to update product. Please check the details and try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading product details...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          
          <Card 
            elevation={0} 
            sx={{ 
              mb: 3, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip title="Back to Products">
                  <IconButton 
                    onClick={() => navigate('/products')} 
                    sx={{ 
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                    Edit Product
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Update product information and settings
                  </Typography>
                </Box>
                <Chip 
                  icon={<EditIcon />} 
                  label="Edit Mode" 
                  color="primary" 
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>

        
          {error && (
            <Zoom in>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Zoom>
          )}
          
          {successMessage && (
            <Zoom in>
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            </Zoom>
          )}

          
          <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ p: 0 }}
            >
         
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'grey.50',
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Product Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in the details below to update your product
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Product Name"
                    name="name"
                    autoFocus
                    value={formData.name || ''}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                
                  <TextField
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description || ''}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <DescriptionIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      required
                      fullWidth
                      id="price"
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon color="action" />
                            <Typography sx={{ ml: 0.5 }}>₹</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    
                    <TextField
                      required
                      fullWidth
                      id="stock"
                      label="Stock Quantity"
                      name="stock"
                      type="number"
                      value={formData.stock || 0}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InventoryIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                 
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.active || false}
                          onChange={handleChange}
                          name="active"
                          color="primary"
                          size="medium"
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {formData.active ? <VisibilityIcon color="primary" /> : <VisibilityOffIcon color="disabled" />}
                          <Box>
                            <Typography variant="body1" fontWeight="500">
                              Product Status
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formData.active ? 'Product is visible to customers' : 'Product is hidden from customers'}
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Box>
                </Stack>
              </CardContent>

          
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'grey.50',
                  borderTop: `1px solid ${theme.palette.divider}`
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={submitting}
                    sx={{ 
                      minHeight: 48,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      }
                    }}
                  >
                    {submitting ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/products')}
                    disabled={submitting}
                    sx={{ 
                      minHeight: 48,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default EditProduct;
