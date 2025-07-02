import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signIn } from '../services/api';
import { AuthContext } from "../context/AuthContext";
import { Button, CircularProgress, TextField } from '@mui/material';


interface SigninFormData {
  email: string;
  password: string;
}


interface AuthContextType {
  login: (user: { email: string }, token: string) => void;
}


interface LocationState {
  message?: string;
}


interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const SigninPage: FC = () => {
  const navigate = useNavigate();
 
  const location = useLocation();
  const locationState = location.state as LocationState | null;


  const { login } = useContext(AuthContext) as AuthContextType;
  
  const [formData, setFormData] = useState<SigninFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
 
  const [successMessage, _] = useState<string>(locationState?.message || '');

  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
     
      const response = await signIn(formData);
      login({ email: formData.email }, response.access);
      console.log('Login successful:', response.access);
      navigate('/');
    } catch (err) {
      
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img
              className="h-30 w-auto"
              src="/images.png"
              alt="Your Company Logo"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 ">
            Sign in to your account
          </h2>
        </div>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700  px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700   px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <TextField
            id="email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            variant="outlined"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
          />
          
          <div>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-900">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;