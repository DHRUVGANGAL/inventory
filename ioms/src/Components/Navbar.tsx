import React, { useContext, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const Navbar: FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-4  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-white"
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