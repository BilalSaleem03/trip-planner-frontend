// src/components/TripForm/TripForm.jsx

import React, { useState } from 'react';
import './TripForm.css';

const TripForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_hours: 0,
    average_speed: 55,
    fuel_interval: 1000,
    pickup_duration: 1,
    dropoff_duration: 1,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'current_cycle_hours' || name === 'average_speed' || 
                       name === 'fuel_interval' || name === 'pickup_duration' || 
                       name === 'dropoff_duration' 
                       ? parseFloat(value) || 0 
                       : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.current_location.trim()) {
      newErrors.current_location = 'Current location is required';
    }
    
    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = 'Pickup location is required';
    }
    
    if (!formData.dropoff_location.trim()) {
      newErrors.dropoff_location = 'Dropoff location is required';
    }
    
    if (formData.current_cycle_hours < 0 || formData.current_cycle_hours > 70) {
      newErrors.current_cycle_hours = 'Must be between 0 and 70';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h1>Plan Your Trip</h1>
        <p className="subtitle">Enter your trip details below</p>
      </div>

      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="current_location">
              Current Location <span className="required">*</span>
            </label>
            <input
              id="current_location"
              type="text"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              placeholder="e.g., Los Angeles, CA"
              className={errors.current_location ? 'error' : ''}
            />
            {errors.current_location && (
              <span className="error-text">{errors.current_location}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="pickup_location">
              Pickup Location <span className="required">*</span>
            </label>
            <input
              id="pickup_location"
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA"
              className={errors.pickup_location ? 'error' : ''}
            />
            {errors.pickup_location && (
              <span className="error-text">{errors.pickup_location}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="dropoff_location">
              Dropoff Location <span className="required">*</span>
            </label>
            <input
              id="dropoff_location"
              type="text"
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="e.g., Chicago, IL"
              className={errors.dropoff_location ? 'error' : ''}
            />
            {errors.dropoff_location && (
              <span className="error-text">{errors.dropoff_location}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="current_cycle_hours">
              Current Cycle Used <span className="required">*</span>
            </label>
            <input
              id="current_cycle_hours"
              type="number"
              name="current_cycle_hours"
              value={formData.current_cycle_hours}
              onChange={handleChange}
              placeholder="0-70"
              min="0"
              max="70"
              step="0.5"
              className={errors.current_cycle_hours ? 'error' : ''}
            />
            {errors.current_cycle_hours && (
              <span className="error-text">{errors.current_cycle_hours}</span>
            )}
            <small>70-hour limit in 8-day period</small>
          </div>

          <div className="form-group">
            <label htmlFor="average_speed">Average Speed (mph)</label>
            <input
              id="average_speed"
              type="number"
              name="average_speed"
              value={formData.average_speed}
              onChange={handleChange}
              placeholder="55"
              min="30"
              max="75"
              step="1"
            />
            <small>Default: 55 mph</small>
          </div>

          <div className="form-group">
            <label htmlFor="fuel_interval">Fuel Interval (miles)</label>
            <input
              id="fuel_interval"
              type="number"
              name="fuel_interval"
              value={formData.fuel_interval}
              onChange={handleChange}
              placeholder="1000"
              min="500"
              max="1500"
              step="50"
            />
            <small>Default: 1000 miles</small>
          </div>

          <div className="form-group">
            <label htmlFor="pickup_duration">Pickup Duration (hours)</label>
            <input
              id="pickup_duration"
              type="number"
              name="pickup_duration"
              value={formData.pickup_duration}
              onChange={handleChange}
              placeholder="1"
              min="0"
              max="4"
              step="0.5"
            />
            <small>Default: 1 hour</small>
          </div>

          <div className="form-group">
            <label htmlFor="dropoff_duration">Dropoff Duration (hours)</label>
            <input
              id="dropoff_duration"
              type="number"
              name="dropoff_duration"
              value={formData.dropoff_duration}
              onChange={handleChange}
              placeholder="1"
              min="0"
              max="4"
              step="0.5"
            />
            <small>Default: 1 hour</small>
          </div>
        </div>

        {error && (
          <div className="form-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loader-spinner"></span>
              Calculating...
            </>
          ) : (
            'Plan Trip'
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;