import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress
} from '@mui/material';
import { fetchLowStock } from '../../services/api'; 


export interface Low_Stock {
    id: number;
    name: string;
    description: string; 
    price: string;        
    stock: number;
    active: boolean;
  }

const LowStockTable: React.FC = () => {
  const [data, setData] = useState<Low_Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLowStock_ = async () => {
      try {
        const response = await fetchLowStock();
        setData(response);
      } catch (error) {
        console.error('Error fetching low stock products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock_();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1000, height: 'full',  }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: data.length === 0 ? 'red' : 'inherit', marginTop:3, fontWeight: 'bold'}}>
        Low Stock Products {data.length > 0 ? `(${data.length})` : ''}
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Product Name</strong></TableCell>
            <TableCell><strong>Stock</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell sx={{ color: product.stock === 0 ? 'red' : 'inherit' }}>
                {product.name}
              </TableCell>
              <TableCell sx={{ color: product.stock === 0 ? 'red' : 'inherit' }}>
                {product.stock}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LowStockTable;
