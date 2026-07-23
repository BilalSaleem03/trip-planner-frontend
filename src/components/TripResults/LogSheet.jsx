// src/components/TripResults/LogSheet.jsx

import React from 'react';
import './LogSheet.css';
import { formatNumber } from '../../utils/helpers';

// Order of rows top -> bottom, matching row index used for the step-line graph
const STATUS_ROWS = ['OFF', 'SB', 'DRIVING', 'ON'];
const ROW_LABELS = [
  { key: 'OFF', label: 'Off Duty' },
  { key: 'SB', label: 'Sleeper Berth' },
  { key: 'DRIVING', label: 'Driving' },
  { key: 'ON', label: 'On Duty\n(Not Driving)' },
  { key: 'REMARKS', label: 'Remarks' },
];

// Layout constants for the SVG graph (kept in sync with the CSS custom
// properties of the same name so labels / gridlines / the step line agree)
const HOUR_WIDTH = 40; // svg units per hour column
const ROW_HEIGHT = 44; // svg units per row
const GRID_WIDTH = HOUR_WIDTH * 24;
const NUM_ROWS = ROW_LABELS.length; // 5, last one is the empty remarks band
const GRID_HEIGHT = ROW_HEIGHT * NUM_ROWS;

const LogSheet = ({ log, dayNumber, totalDays }) => {
  if (!log) {
    return <div className="log-sheet-container">No log data available</div>;
  }

  const gridData = log.hours || {};
  const statuses = log.statuses || [];

  // Forward-fill the status that is active during each hour of the day.
  // `statuses` is expected to be a sparse list of { hour, status } entries
  // marking the hour a status *begins*; anything not covered defaults to OFF.
  const hourlyStatus = React.useMemo(() => {
    const arr = new Array(24).fill('OFF');
    let current = 'OFF';
    for (let hour = 0; hour < 24; hour++) {
      const entry = statuses.find((s) => s.hour === hour);
      if (entry && STATUS_ROWS.includes(entry.status)) {
        current = entry.status;
      }
      arr[hour] = current;
    }
    return arr;
  }, [statuses]);

  // Build the continuous step-line path (the classic ELD duty-status line)
  // plus the list of filled rectangles that shade active Driving / On Duty
  // hours, the way a real logbook graph highlights on-the-clock time.
  const { linePath, fillRects } = React.useMemo(() => {
    let d = '';
    const rects = [];

    for (let hour = 0; hour < 24; hour++) {
      const rowIndex = STATUS_ROWS.indexOf(hourlyStatus[hour]);
      const y = rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
      const x0 = hour * HOUR_WIDTH;
      const x1 = (hour + 1) * HOUR_WIDTH;

      if (hour === 0) {
        d += `M ${x0} ${y} `;
      } else {
        const prevRowIndex = STATUS_ROWS.indexOf(hourlyStatus[hour - 1]);
        if (prevRowIndex !== rowIndex) {
          d += `L ${x0} ${y} `; // vertical jump between rows
        }
      }
      d += `L ${x1} ${y} `;

      if (hourlyStatus[hour] === 'DRIVING' || hourlyStatus[hour] === 'ON') {
        rects.push({
          hour,
          x: x0,
          y: rowIndex * ROW_HEIGHT,
          width: x1 - x0,
          height: ROW_HEIGHT,
        });
      }
    }

    return { linePath: d.trim(), fillRects: rects };
  }, [hourlyStatus]);

  const hourLabels = Array.from({ length: 24 }, (_, hour) => {
    if (hour === 0) return 'Midnight';
    if (hour === 12) return 'Noon';
    return `${hour}`;
  });

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
        <div className="eld-graph-title">Driver Activity Timeline</div>

        <div className="eld-graph-body">
          {/* Status Labels - Left side */}
          <div className="status-labels">
            {/* Spacer keeps the labels vertically aligned with the graph rows,
                offsetting by the same height as the hour-numbers bar above the grid */}
            <div className="status-labels-spacer" aria-hidden="true" />
            {ROW_LABELS.map((row) => (
              <div className="status-label-row" key={row.key}>
                {row.label.split('\n').map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="eld-grid">
            {/* Hour Labels - Top */}
            <div className="hour-labels">
              {hourLabels.map((label, i) => (
                <span key={i} className="hour-label">{label}</span>
              ))}
            </div>

            {/* Graph - continuous step line across all status rows */}
            <svg
              className="eld-svg"
              viewBox={`0 0 ${GRID_WIDTH} ${GRID_HEIGHT}`}
              preserveAspectRatio="none"
              style={{ height: GRID_HEIGHT }}
            >
              {/* row bands */}
              {ROW_LABELS.map((row, i) => (
                <rect
                  key={row.key}
                  x={0}
                  y={i * ROW_HEIGHT}
                  width={GRID_WIDTH}
                  height={ROW_HEIGHT}
                  className="eld-row-band"
                />
              ))}

              {/* shaded active driving / on-duty cells */}
              {fillRects.map((r) => (
                <rect
                  key={r.hour}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  className="eld-fill-rect"
                />
              ))}

              {/* vertical hour gridlines */}
              {Array.from({ length: 25 }, (_, i) => (
                <line
                  key={i}
                  x1={i * HOUR_WIDTH}
                  x2={i * HOUR_WIDTH}
                  y1={0}
                  y2={GRID_HEIGHT}
                  className={i % 24 === 0 ? 'eld-gridline-major' : 'eld-gridline-minor'}
                />
              ))}

              {/* horizontal row separators */}
              {Array.from({ length: NUM_ROWS + 1 }, (_, i) => (
                <line
                  key={i}
                  x1={0}
                  x2={GRID_WIDTH}
                  y1={i * ROW_HEIGHT}
                  y2={i * ROW_HEIGHT}
                  className="eld-gridline-row"
                />
              ))}

              {/* the continuous duty-status step line */}
              <path d={linePath} className="eld-step-line" />
            </svg>
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