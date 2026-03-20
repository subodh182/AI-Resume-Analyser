import axios from 'axios';

// API Base URL - fallback to localhost if env var not set
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

console.log('🔗 API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // ✅ IMPORTANT: Enable credentials for CORS
  timeout: 30000 // ✅ 30 second timeout
});

// Request Interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          console.log('🔒 Unauthorized - Redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login' && 
              window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          console.error('🚫 Forbidden:', data.message);
          break;
          
        case 404:
          // Not Found
          console.error('❌ Not Found:', data.message);
          break;
          
        case 500:
          // Server Error
          console.error('💥 Server Error:', data.message);
          break;
          
        default:
          console.error(`❌ Error ${status}:`, data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('📡 Network Error - No response from server');
      console.error('Please check if backend is running');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
