import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './InteractiveCampusMap.css';
import campusMapImg from '../../assets/campus_map.jpg';
import { getNearestNode, findShortestPath } from '../../hooks/useCampusRoute';
import { roadNodes } from '../CampusMap/campusData';

// Map Leaflet [lat, lng] (0-1500, 0-1000) to SVG [x, y] (0-800, 0-1130)
const mapToSvg = ([lat, lng]) => ({
  x: (lng / 1000) * 800,
  y: 1130 - (lat / 1500) * 1130
});

// Traces segments and calculates user coordinate on path based on progress (0-100)
function getPositionAtProgress(points, progress) {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  let totalLength = 0;
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i+1].x - points[i].x;
    const dy = points[i+1].y - points[i].y;
    const len = Math.sqrt(dx*dx + dy*dy);
    segments.push({ from: points[i], to: points[i+1], length: len });
    totalLength += len;
  }

  const targetLen = (progress / 100) * totalLength;
  let currentLen = 0;

  for (const seg of segments) {
    if (currentLen + seg.length >= targetLen) {
      const ratio = seg.length === 0 ? 0 : (targetLen - currentLen) / seg.length;
      return {
        x: seg.from.x + ratio * (seg.to.x - seg.from.x),
        y: seg.from.y + ratio * (seg.to.y - seg.from.y)
      };
    }
    currentLen += seg.length;
  }
  return points[points.length - 1];
}

export default function InteractiveCampusMap({ theme = 'light', progress = 0, showFullRoute = true, source, destination }) {
  const isDark = theme === 'dark';
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [isInspectorMode, setIsInspectorMode] = useState(false); // Hidden by default

  // Compute dynamic route points based on source and destination
  const routePoints = useMemo(() => {
    if (!source || !destination) return [];
    const startNode = getNearestNode(source.position);
    const endNode = getNearestNode(destination.position);
    if (!startNode || !endNode) return [];
    
    const pathIds = findShortestPath(startNode.id, endNode.id);
    return [
      mapToSvg(source.position),
      ...pathIds.map(id => {
        const node = roadNodes.find(n => n.id === id);
        return mapToSvg(node.position);
      }),
      mapToSvg(destination.position)
    ];
  }, [source, destination]);

  // Get user coordinates dynamically
  const userPos = useMemo(() => getPositionAtProgress(routePoints, progress), [routePoints, progress]);

  // Construct SVG path string for the route
  const routePathD = useMemo(() => {
    if (routePoints.length === 0) return '';
    return routePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  }, [routePoints]);

  const handleMapClick = (e) => {
    if (!isInspectorMode) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const coords = { x: Math.round(svgP.x), y: Math.round(svgP.y) };
    setCalibrationPoints(prev => [...prev, coords]);
  };

  return (
    <div className="icm-wrapper" data-theme={theme}>
      <div className="icm-card">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <svg
              viewBox="0 0 800 1130"
              className={`icm-svg ${isInspectorMode ? 'inspector-mode' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleMapClick}
              style={{ width: "100%", height: "100%", cursor: isInspectorMode ? "crosshair" : "grab" }}
            >
              {/* Real Map Image */}
              <image 
                href={campusMapImg} 
                x="0" 
                y="0" 
                width="800" 
                height="1130" 
                preserveAspectRatio="xMidYMid slice" 
                className="icm-bg-image"
              />
              
              {/* Dark mode overlay for better contrast over bright maps */}
              {isDark && <rect x="0" y="0" width="800" height="1130" fill="rgba(6, 13, 20, 0.4)" style={{ pointerEvents: 'none' }} />}

              {/* ── Navigation Route Overlay ── */}
              {showFullRoute && routePathD && (
                <>
                  {/* Backing path glow */}
                  <path
                    d={routePathD}
                    className="icm-route-glow"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Core animated route path */}
                  <path
                    d={routePathD}
                    className="icm-route-path"
                    fill="none"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* ── Markers ── */}
              {source && (
                <g transform={`translate(${mapToSvg(source.position).x}, ${mapToSvg(source.position).y})`}>
                  <circle cx="0" cy="0" r="14" fill="rgba(34, 197, 94, 0.2)" className="icm-marker-pulse" />
                  <circle cx="0" cy="0" r="6" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
                </g>
              )}

              {destination && (
                <g transform={`translate(${mapToSvg(destination.position).x}, ${mapToSvg(destination.position).y - 12})`}>
                  <motion.g
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="#ef4444"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="9" r="3" fill="#fff" />
                  </motion.g>
                </g>
              )}

              {/* Active User Marker */}
              {routePoints.length > 0 && (
                <g transform={`translate(${userPos.x}, ${userPos.y})`}>
                  <circle cx="0" cy="0" r="18" fill="rgba(59, 130, 246, 0.25)" className="icm-user-pulse" />
                  <circle cx="0" cy="0" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#fff" />
                </g>
              )}
              
            {/* Calibration Click Indicator */}
            {isInspectorMode && calibrationPoints.map((pt, i) => (
               <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <text x="12" y="4" fill="#f59e0b" fontSize="12" fontWeight="bold">{i}</text>
               </g>
            ))}
            {/* Draw lines between calibration points to visualize roads */}
            {isInspectorMode && calibrationPoints.length > 1 && (
               <path
                  d={`M ${calibrationPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
               />
            )}
          </svg>
        </TransformComponent>
      </TransformWrapper>
      
      {/* Enhanced Coordinate Inspector Overlay */}
      {isInspectorMode && (
        <div className="icm-inspector-tooltip" style={{ right: '10px', left: 'auto', bottom: '10px', top: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', width: '300px' }}>
          <strong>Calibration Mode</strong>
          <span>Points Recorded: {calibrationPoints.length}</span>
          <textarea 
            readOnly 
            value={JSON.stringify(calibrationPoints)} 
            style={{ width: '100%', height: '80px', fontSize: '10px', color: '#000', padding: '4px', borderRadius: '4px' }}
            onClick={(e) => e.target.select()}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => {
              try {
                navigator.clipboard.writeText(JSON.stringify(calibrationPoints));
                alert('Copied JSON to clipboard!');
              } catch (err) {
                alert('Clipboard copy failed. Please manually copy from the text box above.');
              }
            }} style={{ flex: 1, padding: '4px 8px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>Copy JSON</button>
            <button onClick={() => setCalibrationPoints([])} style={{ padding: '4px 8px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>Clear</button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
