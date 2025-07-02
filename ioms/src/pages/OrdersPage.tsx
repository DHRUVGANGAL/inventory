import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, Button, Stack, Link as MuiLink,
  Pagination
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import fetchPaginatedOrders, { deleteOrder } from '../services/api'; 
import type { Order } from '../services/api';
import AddIcon from '@mui/icons-material/Add';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


interface AuthContextType {
    isAuthenticated: boolean;
}

const OrdersPage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  const navigate = useNavigate();


  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter(o => o.order_id !== orderId));
        setCount(count - 1);
  
        if (page > 1 && orders.length === 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error('Error deleting order', err);
        setError('Failed to delete order.');
      }
    }
  };
  

 





  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {

        const response = await fetchPaginatedOrders(`/orders?page=${page}`); 
        setOrders(response.data.results);
        setCount(response.data.count);
        

      } catch (err) {
        console.error('Error fetching orders', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [page]); 

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 5 }}>{error}</Typography>;
  }

 
  const totalPages = Math.ceil(count / (orders[0] ? orders.length : 10));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/orders/new')}
        >
          Create New Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>ORDER ID</TableCell>
              <TableCell>CUSTOMER</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell align="right">TOTAL</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id} hover>
                <TableCell component="th" scope="row">
                  <MuiLink
                    component={Link}
                    to={`/orders/${order.order_id}`}
                    underline="hover"
                    sx={{ fontWeight: 'medium', color: 'primary.main' }}
                  >
                    #{order.order_id}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  {order.customer ? (
                    <MuiLink component={Link} to={`/customers/${order.customer}`}>
                      Customer #{order.customer.name}
                    </MuiLink>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell align="right">₹{order.total_price}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <MuiLink component={Link} to={`/orders/${order.order_id}`} sx={{cursor: 'pointer'}}>
                      View
                    </MuiLink>
                    <MuiLink
                      component="button"
                      onClick={() => navigate(`/orders/edit/${order.order_id}`)}
                      sx={{ color: 'primary.main', cursor: 'pointer', border: 'none', background: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit' }}
                    >
                      edit
                    </MuiLink>
                    <MuiLink
                      component="button"
                      onClick={() => handleDelete(order.order_id)}
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

     
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default OrdersPage;