import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Tooltip
} from '@mui/material';

import { fetchRecentOrders } from '../../services/api';
import type { Order } from '../../services/api';

const RecentOrdersTable: React.FC = () => {
 
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        const response = await fetchRecentOrders();
        setOrders(response);
      } catch (err) {
        console.error('Error fetching recent orders', err);
        setError('Failed to load recent orders.');
      } finally {
        setLoading(false);
      }
    };

    loadRecentOrders();
  }, []); 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 'full', height: 'full' }}>
      <Typography 
        variant="h6" 
        align="center" 
        gutterBottom 
        sx={{ 
          color: orders.length === 0 ? 'text.secondary' : 'inherit', 
          marginTop: 3, 
          fontWeight: 'bold' 
        }}
      >
        Recent Orders {orders.length > 0 ? `(${orders.length})` : '(No orders found)'}
      </Typography>
      <Table aria-label="recent orders table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.order_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
               
                <Tooltip title={order.order_id}>
                  <span>{order.order_id.substring(0, 8)}...</span>
                </Tooltip>
              </TableCell>
              <TableCell component="th" scope="row">
               
                
                  <span>{order.customer?.name}</span>
             
              </TableCell>
              <TableCell component="th" scope="row">
               
                
               <span>{order.total_quantity}</span>
          
           </TableCell>
              <TableCell>
                
                {new Date(order.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell align="right">${parseFloat(order.total_price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentOrdersTable;