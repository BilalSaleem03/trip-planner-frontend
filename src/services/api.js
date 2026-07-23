// src/services/api.js

import axios from 'axios';

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
      // Server responded with error
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return Promise.reject({ message, status: error.response.status, data: error.response.data });
    } else if (error.request) {
      // No response from server
      return Promise.reject({ message: 'No response from server. Please check your connection.' });
    } else {
      // Request setup error
      return Promise.reject({ message: error.message || 'Request failed' });
    }
  }
);

export const tripAPI = {
  /**
   * Calculate trip route and generate ELD logs
   * @param {Object} data - Trip data
   * @param {string} data.current_location - Current location
   * @param {string} data.pickup_location - Pickup location
   * @param {string} data.dropoff_location - Dropoff location
   * @param {number} data.current_cycle_hours - Hours used in cycle (0-70)
   * @param {number} data.average_speed - Average speed (30-75, default 55)
   * @param {number} data.fuel_interval - Fuel interval in miles (500-1500, default 1000)
   * @param {number} data.pickup_duration - Pickup duration in hours (0-4, default 1)
   * @param {number} data.dropoff_duration - Dropoff duration in hours (0-4, default 1)
   */
  calculateTrip: async (data) => {
    const response = await api.post('/api/trips/calculate/', data);
    return response.data;
  },

  /**
   * Get API health / info
   */
  getApiInfo: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default api;