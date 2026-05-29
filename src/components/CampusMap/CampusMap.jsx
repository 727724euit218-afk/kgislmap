import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, ImageOverlay, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import './campusMap.css';
import { landmarks } from './campusData';
import RoutePanel from './RoutePanel';
import LandmarkMarker from './LandmarkMarker';
import { useCampusRoute } from '../../hooks/useCampusRoute';

const IMAGE_BOUNDS = [[0, 0], [1500, 1000]];
const MAP_CENTER = [750, 500];

export default function CampusMap() {
  const [map, setMap] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const savedSource = localStorage.getItem('wayfinder-source');
    const savedDest = localStorage.getItem('wayfinder-destination');
    
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

  // Integrate routing
  useCampusRoute(map, source, destination, setRouteSteps);

  const [calibrationPoints, setCalibrationPoints] = useState([]);
  
  // Setup click logger for coordinate calibration
  useEffect(() => {
    if (map) {
      const onClick = (e) => {
        const pt = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];
        setCalibrationPoints(prev => [...prev, pt]);
      };
      map.on('click', onClick);
      return () => map.off('click', onClick);
    }
  }, [map]);

  return (
    <div className="campus-map-wrapper" style={{ position: 'relative' }}>
      <RoutePanel
        landmarks={landmarks}
        source={source}
        destination={destination}
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        routeSteps={routeSteps}
      />
      <div className="campus-map-container">
        <MapContainer
          center={MAP_CENTER}
          zoom={0}
          minZoom={-2}
          maxZoom={2}
          zoomSnap={0.5}
          crs={L.CRS.Simple}
          bounds={IMAGE_BOUNDS}
          ref={setMap}
          style={{ height: '100%', width: '100%', backgroundColor: '#060d14', cursor: 'crosshair' }}
        >
          <ImageOverlay
            url="/map/kgisl_campus.jpg?v=2"
            bounds={IMAGE_BOUNDS}
          />
          {landmarks.map(landmark => (
            <LandmarkMarker key={landmark.id} landmark={landmark} />
          ))}
          
          {/* Calibration Visualization */}
          {calibrationPoints.length > 1 && (
            <Polyline positions={calibrationPoints} color="#f59e0b" weight={3} dashArray="5, 5" />
          )}
          {calibrationPoints.map((pt, i) => (
            <CircleMarker key={i} center={pt} radius={6} color="#f59e0b" fillColor="#f59e0b" fillOpacity={0.8}>
              <Tooltip permanent direction="right" offset={[10, 0]} className="calibration-tooltip">
                {i}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Calibration UI Overlay */}
      <div style={{ position: 'absolute', right: 10, bottom: 10, zIndex: 1000, background: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 8, color: 'white', width: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong>Calibration Mode (Leaflet)</strong>
        <span>Points: {calibrationPoints.length}</span>
        <textarea 
          readOnly 
          value={JSON.stringify(calibrationPoints)} 
          style={{ width: '100%', height: '80px', fontSize: '10px', color: '#000', padding: '4px', borderRadius: '4px' }}
          onClick={(e) => e.target.select()}
        />
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={() => {
            try {
              navigator.clipboard.writeText(JSON.stringify(calibrationPoints));
              alert('Copied!');
            } catch (err) {
              alert('Copy failed. Manually copy the text.');
            }
          }} style={{ flex: 1, padding: '4px 8px', background: '#3b82f6', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>Copy JSON</button>
          <button onClick={() => setCalibrationPoints([])} style={{ padding: '4px 8px', background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>Clear</button>
        </div>
      </div>
    </div>
  );
}
