import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, Button, Stack, Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCustomers } from '../services/api';
import type { Customer} from '../interface/interface';
import AddIcon from '@mui/icons-material/Add';

import {deleteCustomer} from '../services/api';



const Customers: React.FC = () => {

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleDelete = async (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        setCustomers(customers.filter(customer => customer.id !== customerId));
      } catch (err) {
        console.error('Error deleting customer', err);
        setError('Failed to delete customer.');
      }
    }
  };
  


  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetchCustomers();
        setCustomers(response);
      } catch (err) {
        console.error('Error fetching customers', err);
        setError('Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 5 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/customers/create')}
        >
          Add New Customer
        </Button>
      </Box>
     
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>NAME</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>PHONE</TableCell>
              <TableCell align="center">ORDERS</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} hover>
               
                <TableCell component="th" scope="row">
                  <MuiLink 
                    component={Link} 
                    to={`/customers/${customer.id}`} 
                    underline="hover"
                    sx={{ fontWeight: 'medium', color: 'primary.main' }}
                  >
                    {customer.name}
                  </MuiLink>
                </TableCell>
               
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell align="center">
                   {typeof customer.OrderCount === 'number'
                       ? customer.OrderCount
                      : typeof customer.OrderCount === 'object'
                       ? JSON.stringify(customer.OrderCount)
                       : '-'}
                     </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <MuiLink component={Link} to={`/orders/new?customerId=${customer.id}`} sx={{cursor: 'pointer'}}>
                      New Order
                    </MuiLink>
                    <MuiLink component={Link} to={`/customers/edit/${customer.id}`} sx={{cursor: 'pointer'}}>
                      Edit
                    </MuiLink>
                    <MuiLink 
                      component="button" 
                      onClick={() => handleDelete(customer.id)}
                      sx={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}
                    >
                      Delete
                    </MuiLink>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers;