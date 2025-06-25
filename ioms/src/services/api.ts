import axios from 'axios';

import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const signUp = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await api.post('/signin', credentials);
  return response.data;
};


export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export default api;