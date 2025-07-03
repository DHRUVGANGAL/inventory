import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Typography
} from '@mui/material';
import { Top_Products } from '../../services/api';


interface TopProduct {
  id: number;
  name: string;
  price: number;
  total_sold: number;
  }
const TopSelling: React.FC = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const data = await Top_Products();
        setProducts(data);
      } catch (err) {
        setError('Failed to load top products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    
    
    <TableContainer component={Paper}>
        <Typography variant="h6" align="left" gutterBottom sx={{fontWeight: 'bold',margin:2}}>
      Top Selling Products 
    </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Product Name</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Total Sold</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell sx={{width:'30rem'}}>{product.name}</TableCell>
              <TableCell>₹{product.price}</TableCell>
              <TableCell>{product.total_sold}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopSelling;
