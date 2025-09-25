import axios from 'axios';
import API_CONFIG from '../config/api';

// Create axios instance with base configuration
const datsttore = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return the full response data including backend messages
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const responseData = error.response.data;
      
      // Extract message from backend response structure
      let serverMessage = responseData?.message;
      
      // Handle validation errors from backend
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        serverMessage = responseData.errors.map(err => err.msg).join(', ');
      }
      
      switch (status) {
        case 400:
          errorMessage = serverMessage || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in.';
          break;
        case 403:
          errorMessage = 'Access denied. You don\'t have permission for this action.';
          break;
        case 404:
          errorMessage = serverMessage || 'Resource not found.';
          break;
        case 409:
          errorMessage = serverMessage || 'Conflict. This resource already exists.';
          break;
        case 422:
          errorMessage = serverMessage || 'Validation error. Please check your input.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = serverMessage || `Server error (${status}). Please try again.`;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      // Something else happened
      errorMessage = error.message || 'An unexpected error occurred';
    }
    
    throw new Error(errorMessage);
  }
);

// Helper function to format API response
const formatApiResponse = (response) => {
  return {
    data: response.data || response,
    message: response.message,
    success: response.success
  };
};

export { apiClient, formatApiResponse };
export default apiClient;
