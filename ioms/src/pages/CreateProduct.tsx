import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Container,
  CircularProgress, Alert, FormControlLabel, Switch
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api';
import type { ProductInfo} from '../interface/interface';





type CreateProductData = Omit<ProductInfo, 'id'>;

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: '', 
    stock: 0,
    active: true, 
  });



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

   
    const productDataToSubmit = {
      ...formData,
      price: String(formData.price), 
      stock: Number(formData.stock),   
    };

    try {
      await createProduct(productDataToSubmit);
      alert('Product created successfully!');
      navigate('/products'); 
    } catch (err) {
      console.error('Failed to create product', err);
      setError('Failed to create product. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, mt: 5, width: '100%', maxWidth: '600px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Product
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 0.5 }}>₹</Typography>,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="stock"
            label="Stock Quantity"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={handleChange}
                name="active"
                color="primary"
              />
            }
            label="Product is Active"
            sx={{ mt: 1 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: "3rem" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Product'}
          </Button>
          <Button
            fullWidth
            sx={{ height: "3rem" }}
            variant="outlined"
            onClick={() => navigate('/products')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProduct;