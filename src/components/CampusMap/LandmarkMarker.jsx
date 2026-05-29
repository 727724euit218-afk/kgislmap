import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { categoryColors } from './campusData';

export default function LandmarkMarker({ landmark }) {
  const color = categoryColors[landmark.category] || '#E63946';

  const icon = L.divIcon({
    className: 'custom-landmark-icon',
    html: `<div style="background-color: ${color};" class="marker-circle">${landmark.id}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  return (
    <Marker position={landmark.position} icon={icon}>
      <Popup className="custom-popup">
        <div className="popup-content">
          {landmark.snapshot && (
            <div 
              style={{
                width: '100%',
                height: '100px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundImage: 'url(/map/kgisl_campus.jpg)',
                backgroundSize: '700% auto',
                backgroundPosition: `${landmark.snapshot.col * 16.66}% ${landmark.snapshot.row === 0 ? 92 : 100}%`,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              title="Street View"
            />
          )}
          <h4 style={{ color }}>{landmark.name}</h4>
          <span className="category-badge" style={{ backgroundColor: color }}>
            {landmark.category}
          </span>
          <p>{landmark.description}</p>
        </div>
      </Popup>
    </Marker>
  );
}
