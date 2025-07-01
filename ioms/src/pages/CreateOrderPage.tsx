import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Grid, Button,
  Stack, TextField, MenuItem, Autocomplete, IconButton, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { createOrder, fetchCustomer, fetchProducts, fetchCustomerDetails } from '../services/api';
import type { OrderItem, Customer } from '../services/api';
import type { Product } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';


interface FormValues {
  customer: Customer | null;
  status: string;
  items: OrderItem[];
}

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPreloading, setIsPreloading] = useState(true);

  const formik = useFormik<FormValues>({
    initialValues: {
      customer: null,
      status: 'Pending', // Default status for new orders
      items: [],
    },
    validationSchema: Yup.object({
      customer: Yup.object().nullable().required('A customer must be selected.'),
      items: Yup.array().min(1, 'Order must contain at least one item.').required(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const payload = {
          customer: values.customer?.id,
          status: values.status,
          item: values.items.map(i => ({
            product: i.id,
            quantity: i.quantity,
          })),
        };
        const newOrder = await createOrder(payload);
        alert('Order created successfully!');
        navigate(`/orders/${newOrder.order_id}`); 
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
      fetchCustomerDetails(numericId).then(customer => {
        formik.setFieldValue('customer', customer);
        setCustomerOptions([customer]);
      }).catch(err => {
        console.error("Failed to pre-fetch customer", err);
      }).finally(() => {
        setIsPreloading(false);
      });
    } else {
        setIsPreloading(false);
    }
  }, [searchParams]);


  const handleCustomerSearch = async (event: React.SyntheticEvent, value: string) => {
    if (value) {
      try {
        const customers = await fetchCustomer(value);
        setCustomerOptions(customers);
      } catch (err) { console.error('Failed to search customers:', err); }
    }
  };

  const handleProductSearch = async (event: React.SyntheticEvent, value: string) => {
    if (value) {
      try {
        const products = await fetchProducts(value);
        setProductOptions(products);
      } catch (err) { console.error('Failed to search products:', err); }
    }
  };


  const handleAddItem = () => {
    if (selectedProduct && !formik.values.items.some(item => item.product === selectedProduct.id)) {
      const newItem: OrderItem = {
        product: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity: 1,
        product_price: selectedProduct.price,
      };
      formik.setFieldValue('items', [...formik.values.items, newItem]);
      setSelectedProduct(null);
    }
  };

  const handleRemoveItem = (productId: number) => {
    formik.setFieldValue('items', formik.values.items.filter(item => item.product !== productId));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const newQuantity = Math.max(1, quantity);
    formik.setFieldValue('items', formik.values.items.map(item =>
      item.product === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  if (isPreloading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1">Create New Order</Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
           
            <Grid item xs={12}>
              <Autocomplete
                options={customerOptions}
                getOptionLabel={(option) => option.name || ""}
                value={formik.values.customer}
                onInputChange={handleCustomerSearch}
                onChange={(event, newValue) => { formik.setFieldValue('customer', newValue); }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and Select Customer"
                    error={formik.touched.customer && Boolean(formik.errors.customer)}
                    helperText={formik.touched.customer && formik.errors.customer}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}><Divider>Order Items</Divider></Grid>
            
            {/* Add Item Section */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Autocomplete
                  sx={{ flexGrow: 1 }}
                  options={productOptions}
                  getOptionLabel={(option) => `${option.name} - ₹${option.price}`}
                  value={selectedProduct}
                  onInputChange={handleProductSearch}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => <TextField {...params} label="Search and Add Product" />}
                />
                <Button variant="outlined" onClick={handleAddItem} disabled={!selectedProduct}>Add Item</Button>
              </Stack>
            </Grid>

            {/* Items List */}
            <Grid item xs={12}>
              <List>
                {formik.values.items.map(item => (
                  <ListItem key={item.product} divider>
                    <ListItemText primary={item.product_name} secondary={`Price: ₹${item.product_price}`} />
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField type="number" size="small" sx={{ width: '80px' }} value={item.quantity} onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value))} inputProps={{ min: 1 }}/>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.product)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Stack>
                  </ListItem>
                ))}
              </List>
              {formik.touched.items && typeof formik.errors.items === 'string' && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>{formik.errors.items}</Typography>
              )}
            </Grid>

      
            <Grid item xs={12}>
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? <CircularProgress size={24} /> : 'Create Order'}
                </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateOrderPage;