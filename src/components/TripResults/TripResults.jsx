// src/components/TripResults/TripResults.jsx

import React, { useState, useEffect } from 'react';
import './TripResults.css';
import RouteMap from './RouteMap';
import LogSheet from './LogSheet';
import Button from '../common/Button';

const TripResults = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    setActiveTab('timeline');
    if (data?.logs?.length > 0) {
      setSelectedDay(0);
    }
  }, [data]);

  if (!data || !data.success) {
    return (
      <div className="trip-results error">
        <p>No trip data available</p>
        <Button onClick={onReset}>Try Again</Button>
      </div>
    );
  }

  const { trip, route, logs, stops } = data;

  // Get locations from trip data - with fallbacks
  const currentLocation = trip?.current_location || 'N/A';
  const pickupLocation = trip?.pickup_location || 'N/A';
  const dropoffLocation = trip?.dropoff_location || 'N/A';

  return (
    <div className="trip-results">
      <div className="results-container">
        {/* Left Sidebar */}
        <div className="results-sidebar">
          <div className="sidebar-header">
            <h3>Trip #1 Activities</h3>
            <div className="trip-meta">
              <span className="trip-miles">{Math.round(trip?.total_miles || 0)} miles</span>
              <span className="trip-hours">{Math.round(trip?.total_driving_hours || 0)} hours</span>
            </div>
            <div className="trip-route">
              <span>{currentLocation} → {pickupLocation} → {dropoffLocation}</span>
            </div>
          </div>

          <div className="trip-summary-sidebar">
            <h4>Trip Summary</h4>
            <div className="summary-item">
              <span className="summary-label">Departure</span>
              <span className="summary-value">{currentLocation}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pickup</span>
              <span className="summary-value">{pickupLocation}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Delivery</span>
              <span className="summary-value">{dropoffLocation}</span>
            </div>
          </div>

          <div className="day-selector">
            <h4>Driver Activity Timeline</h4>
            <p className="day-selector-hint">Select a day to view activity details</p>
            <div className="day-list">
              {logs && logs.map((log, index) => (
                <button
                  key={index}
                  className={`day-btn ${selectedDay === index ? 'active' : ''}`}
                  onClick={() => setSelectedDay(index)}
                >
                  Day {log.day}
                  <span className="day-date">
                    {new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="results-content">
          <div className="content-header">
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                Timeline
              </button>
              <button
                className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                Map
              </button>
            </div>
            <Button variant="outline" size="small" onClick={onReset}>
              New Trip
            </Button>
          </div>

          <div className="tab-content">
            {activeTab === 'timeline' && logs && logs[selectedDay] && (
              <LogSheet 
                log={logs[selectedDay]} 
                dayNumber={selectedDay + 1}
                totalDays={logs.length}
              />
            )}
            
            {activeTab === 'map' && (
              <RouteMap route={route} stops={stops} tripData={data} />
            )}

            {activeTab === 'timeline' && (!logs || logs.length === 0) && (
              <div className="no-data-message">No timeline data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripResults;