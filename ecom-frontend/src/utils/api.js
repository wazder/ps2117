import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ecom177-backend.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  
  // Products
  products: '/api/products',
  productById: (id) => `/api/products/${id}`,
  searchProducts: '/api/products/search',
  
  // Categories
  categories: '/api/categories',
  categoryById: (id) => `/api/categories/${id}`,
  
  // Orders
  orders: '/api/orders',
  myOrders: '/api/orders/my-orders',
  orderById: (id) => `/api/orders/${id}`,
  updateOrderStatus: (id) => `/api/orders/${id}/status`,
  userOrders: (userId) => `/api/orders/user/${userId}`
};