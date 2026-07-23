// src/components/TripResults/RouteMap.jsx

import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Big custom markers matching your image
const createCustomIcon = (color, label, size = 32) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; 
        align-items: center; 
        justify-content: center;
        font-size: ${size > 30 ? '12px' : '10px'}; 
        color: white; 
        font-weight: bold;
        position: relative;
      ">
        ${label}
        <div style="
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          white-space: nowrap;
          font-weight: normal;
        ">${label === 'S' ? 'Start' : label === 'P' ? 'Pickup' : label === 'D' ? 'Dropoff' : label === 'F' ? 'Fuel' : label === 'R' ? 'Rest' : ''}</div>
      </div>
    `,
    iconSize: [size, size + 25],
    iconAnchor: [size/2, size/2],
  });
};

const RouteMap = ({ route, stops, tripData }) => {
  const defaultCenter = [39.8283, -98.5795];
  const positions = route?.geometry || [];
  const hasRoute = positions.length > 0;

  // Get bounds
  const getBounds = () => {
    if (hasRoute && positions.length > 0) {
      const lats = positions.map(p => p[0]);
      const lngs = positions.map(p => p[1]);
      const padding = 3;
      return [
        [Math.min(...lats) - padding, Math.min(...lngs) - padding],
        [Math.max(...lats) + padding, Math.max(...lngs) + padding]
      ];
    }
    return null;
  };

  const bounds = getBounds();

  // Activity types for legend
  const activityTypes = [
    { type: 'START', label: 'Start', color: '#545333' },
    { type: 'PICKUP', label: 'Pickup', color: '#10B981' },
    { type: 'DROPOFF', label: 'Dropoff', color: '#EF4444' },
    { type: 'FUEL', label: 'Fuel', color: '#F59E0B' },
    { type: 'REST', label: 'Rest', color: '#3B82F6' },
  ];

  // Get stop color
  const getStopColor = (type) => {
    const colors = {
      FUEL: '#F59E0B',
      REST: '#3B82F6',
      PICKUP: '#10B981',
      DROPOFF: '#EF4444',
      START: '#545333',
    };
    return colors[type] || '#6B7280';
  };

  return (
    <div className="route-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ height: '550px', width: '100%' }}
        bounds={bounds}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route Line */}
        {hasRoute && (
          <Polyline
            positions={positions}
            color="#545333"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Start Marker */}
        {positions && positions.length > 0 && (
          <Marker
            position={positions[0]}
            icon={createCustomIcon('#545333', 'S', 36)}
          >
            <Popup>
              <strong>Start</strong>
              <br />
              {tripData?.trip?.current_location || 'Starting Point'}
            </Popup>
          </Marker>
        )}

        {/* Stops Markers */}
        {stops && stops.map((stop, index) => {
          // Approximate position on route
          let lat, lng;
          if (stop.lat && stop.lng) {
            lat = stop.lat;
            lng = stop.lng;
          } else if (positions.length > 0) {
            const ratio = stop.mile_marker / (route?.distance_miles || 1);
            const idx = Math.floor(ratio * (positions.length - 1));
            if (positions[idx]) {
              lat = positions[idx][0];
              lng = positions[idx][1];
            }
          }
          
          if (!lat || !lng) return null;
          
          const label = stop.stop_type === 'PICKUP' ? 'P' :
                       stop.stop_type === 'DROPOFF' ? 'D' :
                       stop.stop_type === 'FUEL' ? 'F' :
                       stop.stop_type === 'REST' ? 'R' : '';
          
          const color = getStopColor(stop.stop_type);
          const size = stop.stop_type === 'PICKUP' || stop.stop_type === 'DROPOFF' ? 40 : 32;
          
          return (
            <Marker
              key={index}
              position={[lat, lng]}
              icon={createCustomIcon(color, label, size)}
            >
              <Popup>
                <strong>{stop.stop_type}</strong>
                <br />
                Mile: {stop.mile_marker?.toFixed(1) || 'N/A'}
                <br />
                Duration: {stop.duration_hours || 0}h
                <br />
                {stop.description || ''}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-title">Activity Types</div>
        <div className="legend-items">
          {activityTypes.map((item, index) => (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ 
                  background: item.color,
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '6px',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              ></span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="legend-credit">Leaflet | OpenStreetMap contributors</div>
      </div>
    </div>
  );
};

export default RouteMap;