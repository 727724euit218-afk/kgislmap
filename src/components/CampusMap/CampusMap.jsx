import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveCampusMap from '../map/InteractiveCampusMap';
import { landmarks } from './campusData';
import RoutePanel from './RoutePanel';
import './campusMap.css';

export default function CampusMap() {
  const navigate = useNavigate();
  const [source, setSource]           = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeSteps, setRouteSteps]   = useState([]);

  // Load source + destination from localStorage
  useEffect(() => {
    const savedSource = localStorage.getItem('wayfinder-source');
    const savedDest   = localStorage.getItem('wayfinder-destination');

    if (savedSource) {
      const s = landmarks.find(l => l.name === savedSource);
      if (s) setSource(s);
    }
    if (savedDest) {
      const d = landmarks.find(l => l.name === savedDest);
      if (d) setDestination(d);
    }
  }, []);

  const handleSourceChange = (newSource) => {
    setSource(newSource);
    if (newSource) localStorage.setItem('wayfinder-source', newSource.name);
    else localStorage.removeItem('wayfinder-source');
  };

  const handleDestinationChange = (newDest) => {
    setDestination(newDest);
    if (newDest) localStorage.setItem('wayfinder-destination', newDest.name);
    else localStorage.removeItem('wayfinder-destination');
  };

  return (
    <div className="campus-map-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <RoutePanel
        landmarks={landmarks}
        source={source}
        destination={destination}
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        routeSteps={routeSteps}
      />

      {/* Interactive SVG Campus Map */}
      <InteractiveCampusMap
        theme="light"
        progress={0}
        showFullRoute={true}
        source={source}
        destination={destination}
      />

      {/* Navigate Button */}
      {source && destination && (
        <button
          onClick={() => navigate('/navigate')}
          style={{
            margin: '0 auto',
            padding: '0.75rem 2rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #16a34a, #4ade80)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
          }}
        >
          Start Navigation →
        </button>
      )}
    </div>
  );
}
