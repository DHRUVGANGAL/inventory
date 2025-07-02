import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Button,
  Stack, TextField, MenuItem, Autocomplete, IconButton, List, ListItem, ListItemText,
  Card, CardContent, Chip, Alert, Fade, Zoom, Avatar,
  Tooltip, InputAdornment, alpha
} from '@mui/material';
import { fetchOrderDeatil, updateOrder, fetchCustomer, fetchProducts } from '../services/api';
import type { Customer } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export interface ProductInfo {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  active: boolean;
}

interface OrderItem {
  order_item_id?: number;
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

const statusConfig = {
  'PE': { label: 'Pending', color: 'warning' as const, icon: '⏳' },
  'CO': { label: 'Completed', color: 'success' as const, icon: '✅' },
  'CA': { label: 'Cancelled', color: 'error' as const, icon: '❌' },
};

const EditOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [productOptions, setProductOptions] = useState<ProductInfo[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [existingItems, setExistingItems] = useState<OrderItem[]>([]);
  const existingItemsRef = useRef<OrderItem[]>([]);

  const formik = useFormik<FormValues>({
    initialValues: {
      customer: null,
      status: 'PE',
      items: [],
    },
    validationSchema: Yup.object({
      customer: Yup.object().nullable().required('Customer is required'),
      status: Yup.string().required('Status is required'),
      items: Yup.array().when([], {
        is: () => existingItemsRef.current.length === 0,
        then: schema => schema.min(1, 'Order must have at least one item').required(),
        otherwise: schema => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      if (!id) return;
      try {
        setError(null);
        const mergedItems = [
          ...existingItemsRef.current.filter(i => i.quantity > 0),
          ...values.items.filter(i => i.quantity > 0),
        ];
        const payload = {
          customer: values.customer?.id,
          status: values.status,
          item: mergedItems.map(i => ({
            ...(i.order_item_id ? { id: i.order_item_id } : {}),
            product: i.product,
            quantity: i.quantity,
          })),
        };
        await updateOrder(id, payload);
        setSuccess('Order updated successfully!');
        setTimeout(() => navigate(`/orders/${id}`), 1500);
      } catch (err) {
        console.error('Failed to update order:', err);
        setError('Failed to update order. Please try again.');
      }
    },
  });

  useEffect(() => {
    if (!id) return;
    const loadOrder = async () => {
      try {
        const orderData = await fetchOrderDeatil(id);
        if (orderData.customer) {
          setCustomerOptions([orderData.customer]);
        }
        const existing = orderData.item.map((item: any) => ({
          order_item_id: item.id,
          product: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
          quantity: item.quantity,
        }));
        setExistingItems(existing);
        existingItemsRef.current = existing;

        formik.setValues({
          customer: orderData.customer,
          status: orderData.status,
          items: [],
        });
      } catch (err) {
        setError('Failed to load order data.');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleCustomerSearch = async (_: any, value: string) => {
    if (value) {
      try {
        const customers = await fetchCustomer(value);
        setCustomerOptions(customers);
      } catch (err) {
        console.error('Failed to search customers:', err);
      }
    }
  };

  const handleProductSearch = async (_: any, value: string) => {
    if (value) {
      try {
        const products = await fetchProducts(value);
        setProductOptions(products);
      } catch (err) {
        console.error('Failed to search products:', err);
      }
    }
  };

  const handleAddItem = () => {
    if (
      selectedProduct &&
      !formik.values.items.some(item => item.product === selectedProduct.id) &&
      !existingItemsRef.current.some(item => item.product === selectedProduct.id)
    ) {
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
    setExistingItems(prev => {
      const updated = prev.filter(item => item.product !== productIdToRemove);
      existingItemsRef.current = updated;
      return updated;
    });
    formik.setFieldValue(
      'items',
      formik.values.items.filter(item => item.product !== productIdToRemove)
    );
  };

  const handleQuantityChange = (productIdToUpdate: number, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity);
    setExistingItems(prev => {
      const updated = prev.map(item =>
        item.product === productIdToUpdate ? { ...item, quantity } : item
      );
      existingItemsRef.current = updated;
      return updated;
    });
    formik.setFieldValue(
      'items',
      formik.values.items.map(item =>
        item.product === productIdToUpdate ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    const allItems = [...existingItems, ...formik.values.items];
    return allItems.reduce((total, item) => {
      return total + (parseFloat(item.product_price.toString()) * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="h6" color="text.secondary">Loading order details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Fade in timeout={500}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/orders/${id}`)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                Back to Order
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}><EditIcon /></Avatar>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" color="primary">Edit Order #{id}</Typography>
                  <Typography variant="body2" color="text.secondary">Modify order details and items</Typography>
                </Box>
              </Box>
            </Stack>
            {formik.values.status && (
              <Chip label={`${statusConfig[formik.values.status as keyof typeof statusConfig]?.icon} ${statusConfig[formik.values.status as keyof typeof statusConfig]?.label}`} color={statusConfig[formik.values.status as keyof typeof statusConfig]?.color} variant="filled" size="medium" sx={{ fontWeight: 'bold' }} />
            )}
          </Stack>
        </Paper>
      </Fade>

      {error && (
        <Fade in><Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert></Fade>
      )}
      {success && (
        <Fade in><Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert></Fade>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Zoom in timeout={600}>
            <Card elevation={0} sx={{ borderRadius: 3, overflow: 'visible' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}><PersonIcon /></Avatar>
                  <Typography variant="h6" fontWeight="bold">Order Information</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
                    <Autocomplete
                      options={customerOptions}
                      getOptionLabel={(option) => option.name || ''}
                      value={formik.values.customer}
                      onInputChange={handleCustomerSearch}
                      onChange={(_, newValue) => formik.setFieldValue('customer', newValue)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer"
                          variant="outlined"
                          fullWidth
                          error={formik.touched.customer && Boolean(formik.errors.customer)}
                          helperText={formik.touched.customer && formik.errors.customer}
                          InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>), }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                    <TextField select fullWidth label="Status" name="status" value={formik.values.status} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <MenuItem key={value} value={value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{config.icon}</span>
                            {config.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          <Zoom in timeout={700}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'info.main' }}><AddIcon /></Avatar>
                  <Typography variant="h6" fontWeight="bold">Add Products</Typography>
                </Box>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="end">
                  <Autocomplete
                    sx={{ flexGrow: 1 }}
                    options={productOptions}
                    getOptionLabel={(option) => `${option.name} - ₹${option.price}`}
                    value={selectedProduct}
                    onInputChange={handleProductSearch}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Search and Select Product" variant="outlined" InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>), }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    )}
                  />
                  <Button variant="contained" onClick={handleAddItem} disabled={!selectedProduct} startIcon={<AddIcon />} sx={{ borderRadius: 2, py: 1.5, px: 3, textTransform: 'none', fontWeight: 600, minWidth: 120 }}>
                    Add Item
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>

          <Zoom in timeout={800}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}><ShoppingCartIcon /></Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">Order Items</Typography>
                      <Typography variant="body2" color="text.secondary">{[...existingItems, ...formik.values.items].length} items</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">Total: ₹{calculateTotal().toFixed(2)}</Typography>
                  </Box>
                </Box>
                {[...existingItems, ...formik.values.items].length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    <InventoryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6">No items in this order</Typography>
                    <Typography variant="body2">Add products to get started</Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {[...existingItems, ...formik.values.items].map((item, index) => (
                      <Fade in key={item.product} timeout={300 + index * 100}>
                        <ListItem divider={index < [...existingItems, ...formik.values.items].length - 1} sx={{ py: 2, px: 0, '&:hover': { backgroundColor: alpha('#000', 0.02), borderRadius: 2 } }}>
                          <ListItemText primary={<Typography variant="subtitle1" fontWeight="medium">{item.product_name}</Typography>} secondary={<Typography variant="body2" color="text.secondary">Price: ₹{item.product_price} | Subtotal: ₹{(parseFloat(item.product_price.toString()) * item.quantity).toFixed(2)}</Typography>} />
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
              </CardContent>
            </Card>
          </Zoom>

          <Zoom in timeout={900}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate(`/orders/${id}`)} sx={{ borderRadius: 2, py: 1.5, px: 4, textTransform: 'none', fontWeight: 600 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={formik.isSubmitting} startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />} sx={{ borderRadius: 2, py: 1.5, px: 4, textTransform: 'none', fontWeight: 600, minWidth: 140 }}>
                {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Zoom>
        </Stack>
      </form>
    </Box>
  );
};

export default EditOrderPage;