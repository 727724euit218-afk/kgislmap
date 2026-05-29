import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, HelpCircle, Crosshair } from 'lucide-react';
import './InteractiveCampusMap.css';
import campusMapImg from '../../assets/campus_map.png';

// Predefined approximate coordinate nodes based on 800x1130 viewBox
const NODES = {
  entrance: { x: 400, y: 1050, name: 'Main Entrance Gate' },
  admin: { x: 450, y: 650, name: 'Admin Block' },
  library: { x: 300, y: 550, name: 'Library' },
  seminarHall: { x: 300, y: 450, name: 'Seminar Hall' },
  cafeteria: { x: 600, y: 500, name: 'Cafeteria' },
  cseBlock: { x: 250, y: 350, name: 'CSE Block' },
  cseRoom302: { x: 250, y: 330, name: 'CSE Block – Room 302' },
};

// Route path points (from entrance, ending at CSE Block)
const ROUTE_POINTS = [
  NODES.entrance,
  { x: 400, y: 800 }, 
  NODES.admin,
  { x: 450, y: 550 },
  NODES.library,
  { x: 250, y: 450 },
  NODES.cseBlock,
  NODES.cseRoom302,
];

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

export default function InteractiveCampusMap({ theme = 'light', progress = 0, showFullRoute = true }) {
  const isDark = theme === 'dark';
  const [lastClickCoords, setLastClickCoords] = useState(null);
  const [isInspectorMode, setIsInspectorMode] = useState(true);

  // Get user coordinates dynamically
  const userPos = useMemo(() => getPositionAtProgress(ROUTE_POINTS, progress), [progress]);

  // Construct SVG path string for the route
  const routePathD = useMemo(() => {
    return ROUTE_POINTS.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  }, []);

  const handleMapClick = (e) => {
    if (!isInspectorMode) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    setLastClickCoords({ x: Math.round(svgP.x), y: Math.round(svgP.y) });
  };

  return (
    <div className="icm-wrapper" data-theme={theme}>
      <div className="icm-card">
        <svg
          viewBox="0 0 800 1130"
          className={`icm-svg ${isInspectorMode ? 'inspector-mode' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleMapClick}
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
          {showFullRoute && (
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
          {/* Start Marker */}
          <g transform={`translate(${NODES.entrance.x}, ${NODES.entrance.y})`}>
            <circle cx="0" cy="0" r="14" fill="rgba(34, 197, 94, 0.2)" className="icm-marker-pulse" />
            <circle cx="0" cy="0" r="6" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
          </g>

          {/* Destination Pin */}
          <g transform={`translate(${NODES.cseRoom302.x}, ${NODES.cseRoom302.y - 12})`}>
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

          {/* Active User Marker */}
          <g transform={`translate(${userPos.x}, ${userPos.y})`}>
            <circle cx="0" cy="0" r="18" fill="rgba(59, 130, 246, 0.25)" className="icm-user-pulse" />
            <circle cx="0" cy="0" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#fff" />
          </g>
          
          {/* Calibration Click Indicator */}
          {lastClickCoords && isInspectorMode && (
             <g transform={`translate(${lastClickCoords.x}, ${lastClickCoords.y})`}>
                <circle cx="0" cy="0" r="10" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#f59e0b" strokeWidth="2" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="#f59e0b" strokeWidth="2" />
             </g>
          )}
        </svg>
        
        {/* Coordinate Inspector Overlay */}
        {isInspectorMode && lastClickCoords && (
          <div className="icm-inspector-tooltip">
            <strong>x:</strong> {lastClickCoords.x} <strong>y:</strong> {lastClickCoords.y}
          </div>
        )}

        {/* Legend */}
        <div className="icm-legend">
          <div className="icm-legend-item">
            <span className="icm-legend-dot green"></span>
            <span>Entrance</span>
          </div>
          <div className="icm-legend-item">
            <span className="icm-legend-dot blue-pulse"></span>
            <span>Your Position</span>
          </div>
          <div className="icm-legend-item">
            <span className="icm-legend-dot red"></span>
            <span>Destination</span>
          </div>
          
          {/* Dev Toggle */}
          <button 
            className={`icm-inspector-toggle ${isInspectorMode ? 'active' : ''}`}
            onClick={() => setIsInspectorMode(!isInspectorMode)}
            title="Toggle coordinate inspector"
          >
            <Crosshair size={14} />
            <span>Dev Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
