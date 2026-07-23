// src/components/TripResults/StopsList.jsx

import React from 'react';
import './StopsList.css';
import Card from '../common/Card';
import { getStopLabel, getStopColor, formatNumber } from '../../utils/helpers';

const StopsList = ({ stops }) => {
  if (!stops || stops.length === 0) {
    return (
      <Card className="stops-list">
        <p className="no-stops">No stops planned for this trip</p>
      </Card>
    );
  }

  // Group stops by day
  const stopsByDay = stops.reduce((acc, stop) => {
    const day = stop.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(stop);
    return acc;
  }, {});

  return (
    <div className="stops-list">
      {Object.entries(stopsByDay).map(([day, dayStops]) => (
        <Card key={day} className="day-stops">
          <h3 className="day-title">Day {day}</h3>
          <div className="stops-timeline">
            {dayStops.map((stop, index) => (
              <div key={index} className="stop-item">
                <div className="stop-marker">
                  <div 
                    className="stop-dot" 
                    style={{ background: getStopColor(stop.stop_type) }}
                  />
                  {index < dayStops.length - 1 && (
                    <div className="stop-line" />
                  )}
                </div>
                <div className="stop-content">
                  <div className="stop-header">
                    <span className="stop-type">{getStopLabel(stop.stop_type)}</span>
                    <span className="stop-mile">Mile {formatNumber(stop.mile_marker)}</span>
                  </div>
                  <div className="stop-details">
                    <span className="stop-duration">{stop.duration_hours}h</span>
                    {stop.description && (
                      <span className="stop-description">{stop.description}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StopsList;