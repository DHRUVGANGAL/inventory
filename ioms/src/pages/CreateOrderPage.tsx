import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Grid, Button,
  Stack, TextField, Autocomplete, IconButton, List, ListItem, ListItemText,
  Divider, Alert, Fade,  Avatar,
  Tooltip, InputAdornment, alpha, AppBar, Toolbar, Container
} from '@mui/material';
import { createOrder, fetchCustomer, fetchProducts, fetchCustomerDetails } from '../services/api';
import type { Customer, ProductInfo } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface OrderItem {
  product: number;
  product_name: string;
  product_price: string | number;
  quantity: number;
}

interface FormValues {
  customer: Customer | null;
  status: string;
  items: OrderItem[];
}

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [productOptions, setProductOptions] = useState<ProductInfo[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      customer: null,
      status: 'PE',
      items: [],
    },
    validationSchema: Yup.object({
      customer: Yup.object().nullable().required('A customer must be selected.'),
      items: Yup.array().min(1, 'Order must contain at least one item').required(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      setSuccess(null);
      setSubmitting(true);
      try {
        const payload = {
          customer: values.customer?.id,
          status: values.status,
          item: values.items.map(i => ({
            product: i.product,
            quantity: i.quantity,
          })),
        };
        const newOrder = await createOrder(payload);
        setSuccess('Order created successfully! Redirecting...');
        setTimeout(() => navigate(`/orders/${newOrder.order_id}`), 1500);
      } catch (err) {
        console.error('Failed to create order:', err);
        setError('Failed to create order. Please check the details and try again.');
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const customerId = searchParams.get('customerId');
    if (customerId) {
      const numericId = parseInt(customerId, 10);
      if (!isNaN(numericId)) {
        fetchCustomerDetails(numericId).then(customer => {
          formik.setFieldValue('customer', customer);
          setCustomerOptions([customer]);
        }).catch(err => {
          console.error("Failed to pre-fetch customer", err);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleCustomerSearch = useCallback(async (_: any, value: string) => {
    if (value) {
      try {
        setCustomerOptions(await fetchCustomer(value));
      } catch (err) { console.error('Failed to search customers:', err); }
    }
  }, []);

  const handleProductSearch = useCallback(async (_: any, value: string) => {
    if (value) {
      try {
        setProductOptions(await fetchProducts(value));
      } catch (err) { console.error('Failed to search products:', err); }
    }
  }, []);

  const handleAddItem = () => {
    if (selectedProduct && !formik.values.items.some(item => item.product === selectedProduct.id)) {
      const newItem: OrderItem = {
        product: selectedProduct.id,
        product_name: selectedProduct.name,
        product_price: selectedProduct.price,
        quantity: 1,
      };
      formik.setFieldValue('items', [...formik.values.items, newItem]);
      setSelectedProduct(null);
    }
  };

  const handleRemoveItem = (productIdToRemove: number) => {
    formik.setFieldValue('items', formik.values.items.filter(item => item.product !== productIdToRemove));
  };

  const handleQuantityChange = (productIdToUpdate: number, newQuantity: number) => {
    const quantity = Math.max(1, isNaN(newQuantity) ? 1 : newQuantity);
    formik.setFieldValue('items', formik.values.items.map(item =>
      item.product === productIdToUpdate ? { ...item, quantity } : item
    ));
  };

  const calculateTotal = () => {
    return formik.values.items.reduce((total, item) => {
      return total + (parseFloat(item.product_price.toString()) * item.quantity);
    }, 0);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <form onSubmit={formik.handleSubmit}>
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
          <Toolbar>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')}>Back to Orders</Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Create New Order
            </Typography>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Order'}
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {error && (
            <Fade in>
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
            </Fade>
          )}
          {success && (
            <Fade in>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>
            </Fade>
          )}
       
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: 'transparent' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'info.main' }}><AddIcon /></Avatar>
                      <Typography variant="h6" fontWeight="bold">Add Products</Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                      <Autocomplete
                        sx={{ flexGrow: 1 }}
                        options={productOptions}
                        getOptionLabel={(option) => `${option.name} - ₹${option.price}`}
                        value={selectedProduct}
                        onInputChange={handleProductSearch}
                        onChange={(_, newValue) => setSelectedProduct(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} label="Search Products" variant="outlined" InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>), }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}/>
                        )}
                      />
                      <Button variant="contained" onClick={handleAddItem} disabled={!selectedProduct} sx={{ borderRadius: 2, py: 1.5, px: 3 }}>Add Item</Button>
                    </Stack>
                  </Paper>

                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}><ShoppingCartIcon /></Avatar>
                        <Typography variant="h6" fontWeight="bold">Order Items</Typography>
                    </Box>
                    {formik.values.items.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                        <InventoryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6">Your cart is empty</Typography>
                        <Typography variant="body2">Add products using the search bar above.</Typography>
                      </Box>
                    ) : (
                      <List disablePadding>
                        {formik.values.items.map((item, index) => (
                          <Fade in key={item.product}>
                            <ListItem divider={index < formik.values.items.length - 1} sx={{ py: 2, px: 0 }}>
                              <ListItemText
                                primary={<Typography variant="subtitle1" fontWeight="medium">{item.product_name}</Typography>}
                                secondary={`Price: ₹${item.product_price} | Subtotal: ₹${(parseFloat(item.product_price.toString()) * item.quantity).toFixed(2)}`}
                              />
                              <Stack direction="row" spacing={2} alignItems="center">
                                <TextField type="number" size="small" label="Qty" sx={{ width: '100px', '& .MuiOutlinedInput-root': { borderRadius: 2 } }} value={item.quantity} onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value))} inputProps={{ min: 1 }} />
                                <Tooltip title="Remove item">
                                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.product)} sx={{ color: 'error.main', '&:hover': { bgcolor: alpha('#f44336', 0.1) } }}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </ListItem>
                          </Fade>
                        ))}
                      </List>
                    )}
                    {formik.touched.items && typeof formik.errors.items === 'string' && (
                      <Typography color="error" variant="caption" sx={{ ml: 2, mt: 1, display: 'block' }}>{formik.errors.items}</Typography>
                    )}
                  </Paper>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4} >
                <Stack spacing={3}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}><PersonIcon /></Avatar>
                      <Typography variant="h6" fontWeight="bold">Customer</Typography>
                    </Box>
                    <Autocomplete
                      options={customerOptions}
                      getOptionLabel={(option) => option.name || ''}
                      value={formik.values.customer}
                      onInputChange={handleCustomerSearch}
                      onChange={(_, newValue) => formik.setFieldValue('customer', newValue)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Customer" variant="outlined" error={formik.touched.customer && Boolean(formik.errors.customer)} helperText={formik.touched.customer && formik.errors.customer as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}/>
                      )}
                    />
                  </Paper>

                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Order Summary</Typography>
                    <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Subtotal</Typography><Typography>₹{calculateTotal().toFixed(2)}</Typography></Stack>
                        <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Taxes</Typography><Typography>₹0.00</Typography></Stack>
                        <Divider sx={{ my: 1 }}/>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="h6">Total</Typography><Typography variant="h6" color="primary">₹{calculateTotal().toFixed(2)}</Typography></Stack>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </form>
    </Box>
  );
};

export default CreateOrderPage;