// src/components/TripResults/TripSummary.jsx

import React from 'react';
import './TripSummary.css';
import Card from '../common/Card';
import { formatNumber } from '../../utils/helpers';

const TripSummary = ({ trip, summary, logs }) => {
  const statItems = [
    { label: 'Total Miles', value: formatNumber(summary.total_miles), suffix: 'mi' },
    { label: 'Driving Hours', value: formatNumber(summary.total_driving_hours), suffix: 'hrs' },
    { label: 'Total Days', value: summary.total_days, suffix: 'days' },
    { label: 'Fuel Stops', value: summary.fuel_stops, suffix: 'stops' },
    { label: 'Rest Breaks', value: summary.rest_stops, suffix: 'breaks' },
  ];

  return (
    <div className="trip-summary">
      <div className="summary-stats">
        {statItems.map((item, index) => (
          <Card key={index} variant="secondary" className="stat-card">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
            {item.suffix && <div className="stat-suffix">{item.suffix}</div>}
          </Card>
        ))}
      </div>

      <div className="summary-days">
        <h3>Daily Breakdown</h3>
        <div className="days-grid">
          {logs && logs.map((log, index) => (
            <Card key={index} className="day-card">
              <div className="day-header">
                <span className="day-number">Day {log.day}</span>
                <span className="day-status">✓ Completed</span>
              </div>
              <div className="day-details">
                <div>
                  <span className="detail-label">Drive</span>
                  <span className="detail-value">{formatNumber(log.hours.drive_hours)} hrs</span>
                </div>
                <div>
                  <span className="detail-label">On Duty</span>
                  <span className="detail-value">{formatNumber(log.hours.on_duty_hours)} hrs</span>
                </div>
                <div>
                  <span className="detail-label">Miles</span>
                  <span className="detail-value">{formatNumber(log.hours.miles_driven)} mi</span>
                </div>
              </div>
              <div className="day-time">
                <span>{log.hours.start_time}</span>
                <span>→</span>
                <span>{log.hours.end_time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripSummary;