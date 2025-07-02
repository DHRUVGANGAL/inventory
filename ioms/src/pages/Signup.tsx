import React from 'react';
import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/api'; 
import { Button, CircularProgress, TextField } from '@mui/material';

interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string; 
  password: string;
  confirmPassword: string;
}


interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const SignupPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '', 
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
     
      const { confirmPassword, ...signupData } = formData;
      await signUp(signupData);
      
      navigate('/signin', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Registration failed. Please try again.';
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
              className="h-24 w-auto"
              src="/images.png"
              alt="Your Company Logo"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <TextField
            id="first_name"
            name="first_name" 
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={formData.first_name}
            onChange={handleChange}
          />
          
          <TextField
            id="last_name"
            name="last_name" 
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={formData.last_name}
            onChange={handleChange}
          />
          
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
            id="phone_number"
            name="phone_number"
            label="Phone Number"
            type="tel" 
            variant="outlined"
            fullWidth
            required
            value={formData.phone_number}
            onChange={handleChange}
          />
          
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            variant="outlined"

            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
          />
          
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            variant="outlined"
            fullWidth
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
          />
          
          <div>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
              sx={{ py: 1.5, fontWeight: 500, textTransform: 'none' }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/signin" className="font-medium text-blue-500 hover:text-blue-900">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;