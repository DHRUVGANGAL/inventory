import React, { useState,useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCustomer} from '../services/api';
import type { CreateCustomerData } from '../services/api'; 
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
interface AuthContextType {
  isAuthenticated: boolean;
}


const CreateCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [formData, setFormData] = useState<CreateCustomerData>({
    name: '',
    email: '',
    phone_number: '',
    OrderCount: 0, 
    OrderDetail: [ ], 
  });
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createCustomer(formData);
      alert('Customer created successfully!');
      navigate('/customers'); 
    } catch (err) {
      console.error('Failed to create customer', err);
      setError('Failed to create customer. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container  sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Customer
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone_number"
            label="Phone Number"
            name="phone_number"
            autoComplete="tel"
            value={formData.phone_number}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height:"3rem" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Customer'}
          </Button>
          <Button
            fullWidth
            sx={{ height:"3rem"}}
            variant="outlined"
            onClick={() => navigate('/customers')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCustomerPage;