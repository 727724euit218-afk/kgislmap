import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation } from 'lucide-react';
import './campusMap.css';

export default function RoutePanel({ landmarks, source, destination, onSourceChange, onDestinationChange, routeSteps }) {
  const navigate = useNavigate();

  return (
    <div className="route-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button onClick={() => navigate('/destination')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#4ade80' }}>Route Preview</h2>
      </div>

      <div className="rp-field">
        <label>From</label>
        <select 
          value={source ? source.id : ''} 
          onChange={e => onSourceChange(landmarks.find(l => l.id === +e.target.value) || null)}
        >
          <option value="">Select source...</option>
          {landmarks.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="rp-field">
        <label>To</label>
        <select 
          value={destination ? destination.id : ''} 
          onChange={e => onDestinationChange(landmarks.find(l => l.id === +e.target.value) || null)}
        >
          <option value="">Select destination...</option>
          {landmarks.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      {routeSteps && routeSteps.length > 0 && (
        <div className="directions">
          <h3>Directions</h3>
          <ol>
            {routeSteps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      )}

      {source && destination && (
        <button 
          onClick={() => navigate('/navigate')}
          style={{ padding: '0.8rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Navigation size={18} />
          Start Navigation
        </button>
      )}
    </div>
  );
}
