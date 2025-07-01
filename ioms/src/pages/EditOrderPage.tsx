import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Grid, Button,
  Stack, TextField, MenuItem, Autocomplete, IconButton, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { fetchOrderDeatil, updateOrder, fetchCustomer, fetchProducts } from '../services/api';
import type { Customer } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
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

const EditOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [productOptions, setProductOptions] = useState<ProductInfo[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [existingItems, setExistingItems] = useState<OrderItem[]>([]);
  const existingItemsRef = useRef<OrderItem[]>([]); 

  const formik = useFormik<FormValues>({
    initialValues: {
      customer: null,
      status: 'pending',
      items: [],
    },
    validationSchema: Yup.object({
      customer: Yup.object().nullable().required('Customer is required'),
      status: Yup.string().required('Status is required'),
      items: Yup.array().min(1, 'Order must have at least one item').required(),
    }),
    onSubmit: async (values) => {
      if (!id) return;
      try {
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

        console.log('Final Payload:', payload);
        await updateOrder(id, payload);
        alert('Order updated successfully!');
        navigate(`/orders/${id}`);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/orders/${id}`)}>
          Back to Order
        </Button>
        <Typography variant="h4" component="h1">Edit Order #{id}</Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
                    error={formik.touched.customer && Boolean(formik.errors.customer)}
                    helperText={formik.touched.customer && formik.errors.customer}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value="PE">Pending</MenuItem>
                <MenuItem value="CO">Completed</MenuItem>
                <MenuItem value="CA">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}><Divider>Order Items</Divider></Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Autocomplete
                  sx={{ flexGrow: 1 }}
                  options={productOptions}
                  getOptionLabel={(option) => `${option.name} - ₹${option.price}`}
                  value={selectedProduct}
                  onInputChange={handleProductSearch}
                  onChange={(_, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => <TextField {...params} label="Search and Add Product" />}
                />
                <Button variant="outlined" onClick={handleAddItem} disabled={!selectedProduct}>
                  Add Item
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <List>
                {[...existingItems, ...formik.values.items].map(item => (
                  <ListItem key={item.product} divider>
                    <ListItemText
                      primary={item.product_name}
                      secondary={`Price: ₹${item.product_price}`}
                    />
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        type="number"
                        size="small"
                        sx={{ width: '80px' }}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveItem(item.product)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Stack>
                  </ListItem>
                ))}
              </List>
              {formik.touched.items && typeof formik.errors.items === 'string' && (
                <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                  {formik.errors.items}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditOrderPage;
