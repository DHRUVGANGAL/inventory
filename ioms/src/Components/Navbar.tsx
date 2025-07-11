import type{ FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import {logout} from '../features/auth/authSlice';
import { useDispatch,useSelector } from 'react-redux';




const Navbar: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <nav className="bg-blue-500 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white text-xl font-bold">
                Inventory Management
              </Link>
            </div>
          </div>
          <div className="flex  items-center">

            {isAuthenticated ? (
              <>
             <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 text-white"
                >
                 Dashboard 
                </Link>
                <Link
                  to="/products"
                  className="ml-4  px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 text-white"
                >
                  Products
                </Link>
                <Link
                  to="/customers"
                  className="ml-4  px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 text-white"
                >
                  Customers
                </Link>
                <Link
                  to="/orders"
                  className="ml-4  px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 text-white"
                >
                  Orders
                </Link>
                
            <Button
              variant="text"
              fullWidth
              onClick={handleLogout}
              sx={{
                marginLeft: '1rem',
                py: 1.5,
                textTransform: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                
              }}
            >
            Logout
            </Button>
           
            </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-4  px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;