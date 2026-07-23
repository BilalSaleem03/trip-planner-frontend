// src/utils/helpers.js

/**
 * Format a number with comma separators
 */
export const formatNumber = (num, decimals = 1) => {
  if (!num && num !== 0) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format time (HH:MM)
 */
export const formatTime = (hour) => {
  if (!hour && hour !== 0) return '--:--';
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Get stop type icon name
 */
export const getStopIcon = (type) => {
  const icons = {
    FUEL: 'fuel',
    REST: 'rest',
    PICKUP: 'pickup',
    DROPOFF: 'dropoff',
    MEAL: 'meal',
    OTHER: 'other',
  };
  return icons[type] || 'other';
};

/**
 * Get stop type label
 */
export const getStopLabel = (type) => {
  const labels = {
    FUEL: 'Fuel Stop',
    REST: 'Rest Break',
    PICKUP: 'Pickup',
    DROPOFF: 'Dropoff',
    MEAL: 'Meal Break',
    OTHER: 'Other',
  };
  return labels[type] || type;
};

/**
 * Get stop type color
 */
export const getStopColor = (type) => {
  const colors = {
    FUEL: '#F59E0B',
    REST: '#3B82F6',
    PICKUP: '#10B981',
    DROPOFF: '#EF4444',
    MEAL: '#8B5CF6',
    OTHER: '#6B7280',
  };
  return colors[type] || '#6B7280';
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get status color for ELD grid
 */
export const getStatusColor = (status) => {
  const colors = {
    OFF: '#E8E8E8',
    SB: '#FFD700',
    DRIVING: '#4CAF50',
    ON: '#FF6B6B',
  };
  return colors[status] || '#FFFFFF';
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    OFF: 'Off Duty',
    SB: 'Sleeper Berth',
    DRIVING: 'Driving',
    ON: 'On Duty',
  };
  return labels[status] || status;
};