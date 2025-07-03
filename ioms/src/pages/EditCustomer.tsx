import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, Container, CircularProgress, Alert,
  Card, CardContent, Stack, InputAdornment, Chip, IconButton, Tooltip,
  Fade, Zoom, useTheme, Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ContactMail as ContactMailIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCustomers, updateCustomer } from '../services/api';
import type { CustomerFormData } from '../interface/interface';

const EditCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const theme = useTheme();
  const customerId = Number(id);

  const [formData, setFormData] = useState<Partial<CustomerFormData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("Invalid customer ID.");
      setLoading(false);
      return;
    }

    const loadCustomerData = async () => {
      try {
        const customers = await fetchCustomers();
        const customer = customers.find(c => c.id === customerId);
        if (!customer) {
          throw new Error('Customer not found');
        }
        setFormData({
          name: customer.name,
          email: customer.email,
          phone_number: customer.phone_number
        });
      } catch (err) {
        console.error('Failed to fetch customer data', err);
        setError('Customer not found or failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [customerId]); 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateCustomer(customerId, formData);
      setSuccessMessage('Customer updated successfully!');
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (err) {
      console.error('Failed to update customer', err);
      setError('Failed to update customer. Please check the details and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading customer details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !formData.name) { 
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Alert severity="error" sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Customer Not Found</Typography>
            <Typography variant="body2">{error}</Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/customers')}
              sx={{ mt: 2 }}
            >
              Back to Customers
            </Button>
          </Alert>
        </Fade>
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
                <Tooltip title="Back to Customers">
                  <IconButton 
                    onClick={() => navigate('/customers')} 
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
                    Edit Customer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Update customer information and contact details
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
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ContactMailIcon color="primary" sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="600" color="text.primary">
                      Customer Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update the customer's personal and contact information
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
 
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoFocus
                    value={formData.name || ''}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <Divider sx={{ my: 1 }} />

             
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" color="text.primary" sx={{ mb: 2 }}>
                      Contact Details
                    </Typography>
                    
                    <Stack spacing={3}>
             
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
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
                        id="phone_number"
                        label="Phone Number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
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
                  </Box>

                  
                  <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Customer Preview
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="600">
                          {formData.name || 'Customer Name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.email || 'email@example.com'} • {formData.phone_number || '+1234567890'}
                        </Typography>
                      </Box>
                    </Stack>
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
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving}
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
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/customers')}
                    disabled={saving}
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

export default EditCustomer;