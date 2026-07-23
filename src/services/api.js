// src/services/api.js

import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return Promise.reject({ message, status: error.response.status, data: error.response.data });
    } else if (error.request) {
      return Promise.reject({ message: 'No response from server. Please check your connection.' });
    } else {
      return Promise.reject({ message: error.message || 'Request failed' });
    }
  }
);

export const tripAPI = {
  calculateTrip: async (data) => {
    const response = await api.post('/api/trips/calculate/', data);
    return response.data;
  },
  getApiInfo: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default api;