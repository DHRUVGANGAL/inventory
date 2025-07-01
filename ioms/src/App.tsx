import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import Navbar from './Components/Navbar'
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/Customer';
import CreateCustomerPage from './pages/Createcustomer';
import EditCustomerPage from './pages/EditCustomerPage';
import CustomerDetailPage from './pages/CustomerDetails';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetail';
import EditOrderPage from './pages/EditOrderPage';
import ProductsPage from './pages/ProductsPage';
import CreateProduct from './pages/CreateProduct';
import EditProductPage from './pages/EditProductPage';
import ProductDetailPage from './pages/ProductDetail';
import CreateOrderPage from './pages/CreateOrderPage';



const App = () => {
  return (
    <AuthProvider>
      
      <Router>
       
        <div className="min-h-screen bg-gray-100  transition-colors duration-200">
        <Navbar/>
          <Routes>
            
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/" element={<Dashboard/>} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/create" element={<CreateCustomerPage />} />
            <Route path="/customers/edit/:id" element={<EditCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} /> 
            <Route path="/orders/edit/:id" element={<EditOrderPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/create" element={<CreateProduct />} /> 
            <Route path="/products/edit/:id" element={<EditProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage/>} /> 
            <Route path="/orders/new" element={<CreateOrderPage />} />
          </Routes>
        </div>
      </Router>

    </AuthProvider>
  );
};

export default App;