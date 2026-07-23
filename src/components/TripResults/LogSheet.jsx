// src/components/TripResults/LogSheet.jsx

import React from 'react';
import './LogSheet.css';
import { formatNumber } from '../../utils/helpers';

const LogSheet = ({ log, dayNumber, totalDays, tripData }) => {
  if (!log) {
    return <div className="log-sheet-container">No log data available</div>;
  }

  const gridData = log.hours || {};

  // Create status timeline for 24 hours
  const createStatusTimeline = () => {
    const timeline = [];
    const startHour = 6;
    
    for (let hour = 0; hour < 24; hour++) {
      if (hour < startHour) {
        timeline.push({ hour, status: 'OFF' });
      } else if (hour < startHour + (gridData.drive_hours || 0)) {
        timeline.push({ hour, status: 'DRIVING' });
      } else {
        timeline.push({ hour, status: 'OFF' });
      }
    }
    return timeline;
  };

  const statusTimeline = log.statuses || createStatusTimeline();

  // Get status for a specific hour
  const getStatusAtHour = (hour, statusType) => {
    const status = statusTimeline.find(s => s.hour === hour);
    return status ? status.status === statusType : false;
  };

  // Check if there's a continuous block for each status type
  const getStatusBlocks = (statusType) => {
    const blocks = [];
    let start = null;
    let inBlock = false;
    
    for (let hour = 0; hour < 24; hour++) {
      const isActive = getStatusAtHour(hour, statusType);
      if (isActive && !inBlock) {
        start = hour;
        inBlock = true;
      } else if (!isActive && inBlock) {
        blocks.push({ start, end: hour - 1 });
        inBlock = false;
      }
    }
    if (inBlock) {
      blocks.push({ start, end: 23 });
    }
    return blocks;
  };

  const offBlocks = getStatusBlocks('OFF');
  const sbBlocks = getStatusBlocks('SB');
  const drivingBlocks = getStatusBlocks('DRIVING');
  const onBlocks = getStatusBlocks('ON');

  // Check if a cell is the start of a block
  const isBlockStart = (hour, statusType) => {
    if (hour === 0 && getStatusAtHour(0, statusType)) return true;
    return getStatusAtHour(hour, statusType) && !getStatusAtHour(hour - 1, statusType);
  };

  // Check if a cell is the end of a block
  const isBlockEnd = (hour, statusType) => {
    if (hour === 23 && getStatusAtHour(23, statusType)) return true;
    return getStatusAtHour(hour, statusType) && !getStatusAtHour(hour + 1, statusType);
  };

  // Render status row with lines
  const renderStatusRow = (statusType, color, label) => {
    const blocks = getStatusBlocks(statusType);
    
    return (
      <div className="status-row">
        {Array.from({ length: 24 }, (_, hour) => {
          const isActive = getStatusAtHour(hour, statusType);
          const isStart = isBlockStart(hour, statusType);
          const isEnd = isBlockEnd(hour, statusType);
          
          let className = 'status-cell';
          if (isActive) {
            className += ` active-${statusType.toLowerCase()}`;
          }
          if (isStart) className += ' block-start';
          if (isEnd) className += ' block-end';
          
          return (
            <div 
              key={hour} 
              className={className}
              data-active={isActive}
              data-start={isStart}
              data-end={isEnd}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="log-sheet-container">
      {/* Header */}
      <div className="log-sheet-header">
        <div className="log-title">
          <h3>Day {log.day || dayNumber} of {totalDays || '?'}</h3>
        </div>
        <div className="log-stats">
          <span>Drive: {formatNumber(gridData.drive_hours || 0)}h</span>
          <span>On Duty: {formatNumber(gridData.on_duty_hours || 0)}h</span>
          <span>Miles: {formatNumber(gridData.miles_driven || 0)}mi</span>
        </div>
      </div>

      {/* ELD Graph */}
      <div className="eld-graph">
        {/* Status Labels - Left side */}
        <div className="status-labels">
          <div className="status-label-row">
            <span className="label-off">OFF DUTY</span>
          </div>
          <div className="status-label-row">
            <span className="label-sb">SLEEPER BERTH</span>
          </div>
          <div className="status-label-row">
            <span className="label-driving">DRIVING</span>
          </div>
          <div className="status-label-row">
            <span className="label-on">ON DUTY<br/>(NOT DRIVING)</span>
          </div>
        </div>

        {/* Grid */}
        <div className="eld-grid">
          {/* Hour Labels - Top */}
          <div className="hour-labels">
            <span className="hour-label">Midnight</span>
            {Array.from({ length: 23 }, (_, i) => {
              const hour = i + 1;
              let label;
              if (hour === 12) label = 'Noon';
              else if (hour > 12) label = `${hour}`;
              else label = `${hour}`;
              return <span key={i} className="hour-label">{label}</span>;
            })}
          </div>

          {/* Status Bars - Using line-based rendering */}
          <div className="status-bars">
            {/* Off Duty Row */}
            {renderStatusRow('OFF', '#E8E8E8', 'Off Duty')}
            {/* Sleeper Berth Row */}
            {renderStatusRow('SB', '#FFD700', 'Sleeper Berth')}
            {/* Driving Row */}
            {renderStatusRow('DRIVING', '#4CAF50', 'Driving')}
            {/* On Duty Row */}
            {renderStatusRow('ON', '#FF6B6B', 'On Duty')}
          </div>

          {/* Midnight Labels - Bottom */}
          <div className="midnight-labels">
            <span>Midnight</span>
            <span>Midnight</span>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="driver-info-grid">
        <div className="driver-info-row">
          <span>Vehicle: Truck #001</span>
          <span>Total Miles Today: {formatNumber(gridData.miles_driven || 0)}</span>
        </div>
        <div className="driver-info-row">
          <span>Co-Driver: N/A</span>
          <span>Shipping Documents: Various</span>
        </div>
      </div>

      {/* Remarks */}
      <div className="remarks-section">
        <div className="remarks-label">REMARKS</div>
        <div className="remarks-content">
          {log.remarks && log.remarks.length > 0 ? (
            log.remarks.map((remark, idx) => (
              <div key={idx} className="remark-item">
                {remark.time || ''} - {remark.location || ''} ({remark.status || ''})
              </div>
            ))
          ) : (
            <>
              <div className="remark-item">06:00 - Start of duty</div>
              <div className="remark-item">12:00 - Lunch break</div>
              <div className="remark-item">18:00 - End of driving</div>
            </>
          )}
        </div>
      </div>

      {/* Hours Summary */}
      <div className="hours-summary-box">
        <div className="summary-title">HOURS SUMMARY</div>
        <div className="summary-grid">
          <div className="summary-row">
            <span>Driving</span>
            <span>{formatNumber(gridData.drive_hours || 0)}</span>
          </div>
          <div className="summary-row">
            <span>On Duty</span>
            <span>{formatNumber(gridData.on_duty_hours || 0)}</span>
          </div>
          <div className="summary-row">
            <span>Off Duty</span>
            <span>{formatNumber(gridData.off_duty_hours || 10)}</span>
          </div>
          <div className="summary-row">
            <span>Sleeper Berth</span>
            <span>{formatNumber(gridData.sleeper_berth_hours || 0)}</span>
          </div>
          <div className="summary-row total">
            <span>TOTAL</span>
            <span>{formatNumber((gridData.drive_hours || 0) + (gridData.on_duty_hours || 0) + (gridData.off_duty_hours || 10) + (gridData.sleeper_berth_hours || 0))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogSheet;