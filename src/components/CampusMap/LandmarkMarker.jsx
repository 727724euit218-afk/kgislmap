import React from 'react';
import { categoryColors } from './campusData';

// SVG-based landmark marker — no Leaflet dependency.
// Used as a simple display card when needed outside the interactive map.
export default function LandmarkMarker({ landmark }) {
  const color = categoryColors[landmark.category] || '#E63946';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.75rem',
        borderRadius: '999px',
        background: color,
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: '1.2rem',
          height: '1.2rem',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem',
          fontWeight: 900,
        }}
      >
        {landmark.id}
      </span>
      {landmark.name}
    </div>
  );
}
