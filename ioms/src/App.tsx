import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Navbar from './Components/Navbar'
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customer';
import CreateCustomer from './pages/Createcustomer';
import EditCustomer from './pages/EditCustomer';
import CustomerDetail from './pages/CustomerDetails';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import EditOrder from './pages/EditOrder';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import CreateOrder from './pages/CreateOrder';
import PrivateRoute from './PrivateRoute/PrivateRote';



const App = () => {
  return (
    <AuthProvider>
      
      <Router>
       
        <div className="min-h-screen bg-gray-100  transition-colors duration-200">
        <Navbar/>
          <Routes>
            
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
            <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
            <Route path="/customers/create" element={<PrivateRoute><CreateCustomer /></PrivateRoute>} />
            <Route path="/customers/edit/:id" element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
            <Route path="/customers/:id" element={<PrivateRoute><CustomerDetail /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} /> 
            <Route path="/orders/edit/:id" element={<PrivateRoute><EditOrder /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            <Route path="/products/create" element={<PrivateRoute><CreateProduct /></PrivateRoute> }/> 
            <Route path="/products/edit/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/products/:id" element={<PrivateRoute><ProductDetail/></PrivateRoute>} /> 
            <Route path="/orders/new" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>

    </AuthProvider>
  );
};

export default App;