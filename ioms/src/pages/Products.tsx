import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, Button, Stack, Link as MuiLink,
  Pagination, Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { deleteProduct, fetchProduct } from '../services/api';
import type { ProductInfo,AuthContextType } from '../interface/interface';
import AddIcon from '@mui/icons-material/Add';




const Products: React.FC = () => {

  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();


  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        console.error('Error deleting customer', err);
        setError('Failed to delete customer.');
      }
    }
  };




  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProduct(page);
        setProducts(response.results);
        setCount(response.count);
      } catch (err) {
        console.error('Error fetching products', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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


  const totalPages = Math.ceil(count / 5);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/create')}
        >
          Add New Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>PRODUCT NAME</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell align="center">STOCK</TableCell>
              <TableCell align="right">PRICE</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell component="th" scope="row">
                  <MuiLink
                    component={Link}
                    to={`/products/${product.id}`} 
                    underline="hover"
                    sx={{ fontWeight: 'medium', color: 'primary.main' }}
                  >
                    {product.name}
                  </MuiLink>
                </TableCell>
                <TableCell>
                    <Chip 
                        label={product.active ? 'Active' : 'Inactive'}
                        color={product.active ? 'success' : 'default'}
                        size="small"
                    />
                </TableCell>
                <TableCell align="center">{product.stock}</TableCell>
                <TableCell align="right">₹{product.price}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <MuiLink component={Link} to={`/products/edit/${product.id}`} sx={{cursor: 'pointer'}}>
                      Edit
                    </MuiLink>
                    <MuiLink
                      component="button"
                      onClick={() => handleDelete(product.id)}
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

export default Products;