// src/hooks/useTripCalculation.js

import { useState, useCallback } from 'react';
import { tripAPI } from '../services/api';

export const useTripCalculation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const calculateTrip = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setData(null);
    setProgress(10);

    try {
      // Validate input
      if (!formData.current_location || !formData.pickup_location || !formData.dropoff_location) {
        throw new Error('Please fill in all location fields');
      }

      if (formData.current_cycle_hours < 0 || formData.current_cycle_hours > 70) {
        throw new Error('Cycle hours must be between 0 and 70');
      }

      setProgress(30);

      // Make API call
      const response = await tripAPI.calculateTrip(formData);
      
      setProgress(80);

      if (!response.success) {
        throw new Error(response.error || 'Trip calculation failed');
      }

      setProgress(100);
      setData(response);
      return response;

    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setProgress(0);
  }, []);

  return {
    data,
    loading,
    error,
    progress,
    calculateTrip,
    reset,
  };
};