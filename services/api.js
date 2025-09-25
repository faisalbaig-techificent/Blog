import axios from 'axios';
import API_CONFIG from '../config/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
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

// API functions with message extraction
export const getPosts = async (page = 1, limit = 6) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return {
    data: response.data || response,
    message: response.message,
    success: response.success,
    pagination: {
      currentPage: response.currentPage,
      totalPages: response.totalPages,
      totalPosts: response.totalPosts,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      limit: response.limit
    }
  };
};

export const getPost = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return {
    data: response.data || response,
    message: response.message,
    success: response.success
  };
};

export const createPost = async (postData) => {
  // Handle FormData for file uploads
  const config = {};
  if (postData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const response = await api.post('/posts', postData, config);
  return {
    data: response.data || response,
    message: response.message,
    success: response.success
  };
};

export const updatePost = async (id, postData) => {
  // Handle FormData for file uploads
  const config = {};
  if (postData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const response = await api.put(`/posts/${id}`, postData, config);
  return {
    data: response.data || response,
    message: response.message,
    success: response.success
  };
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return {
    data: response.data || response,
    message: response.message,
    success: response.success
  };
};

export default api;
