import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './InteractiveCampusMap.css';
import campusMapImg from '../../assets/campus_map.jpg';
import { getNearestNode, findShortestPath } from '../../hooks/useCampusRoute';
import { landmarks } from '../CampusMap/campusData';

// Coordinate system: positions in campusData are direct SVG [x, y] pixels.
// viewBox is "0 0 855 1079" matching the campus map image dimensions.
const mapToSvg = ([x, y]) => ({ x, y });

// Traces segments and calculates user position on path based on progress (0-100)
function getPositionAtProgress(points, progress) {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  let totalLength = 0;
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segments.push({ from: points[i], to: points[i + 1], length: len });
    totalLength += len;
  }

  const targetLen = (progress / 100) * totalLength;
  let currentLen = 0;

  for (const seg of segments) {
    if (currentLen + seg.length >= targetLen) {
      const ratio = seg.length === 0 ? 0 : (targetLen - currentLen) / seg.length;
      return {
        x: seg.from.x + ratio * (seg.to.x - seg.from.x),
        y: seg.from.y + ratio * (seg.to.y - seg.from.y),
      };
    }
    currentLen += seg.length;
  }
  return points[points.length - 1];
}

// Category badge colours (fill for the node circle)
const CATEGORY_FILL = {
  academic: '#1D3557',
  hostel:   '#457B9D',
  facility: '#F4A261',
  admin:    '#E63946',
  medical:  '#2A9D8F',
  entry:    '#16a34a',
};

export default function InteractiveCampusMap({
  theme = 'light',
  progress = 0,
  showFullRoute = true,
  source,
  destination,
}) {
  const isDark = theme === 'dark';
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [isInspectorMode, setIsInspectorMode] = useState(false);

  // Build landmark lookup map once
  const lmMap = useMemo(() => {
    const m = {};
    for (const lm of landmarks) m[lm.id] = lm;
    return m;
  }, []);

  // Compute route points: findShortestPath now returns landmark IDs directly
  const routePoints = useMemo(() => {
    if (!source || !destination) return [];
    const pathIds = findShortestPath(source.id, destination.id);
    if (!pathIds || pathIds.length < 2) {
      // Fallback: straight line between source and destination
      return [mapToSvg(source.position), mapToSvg(destination.position)];
    }
    return pathIds
      .map(id => lmMap[id])
      .filter(Boolean)
      .map(lm => mapToSvg(lm.position));
  }, [source, destination, lmMap]);

  const userPos = useMemo(
    () => getPositionAtProgress(routePoints, progress),
    [routePoints, progress]
  );

  const routePathD = useMemo(() => {
    if (routePoints.length === 0) return '';
    return routePoints
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
      .join(' ');
  }, [routePoints]);

  const handleMapClick = (e) => {
    if (!isInspectorMode) return;
    const svg = e.currentTarget;
    const pt  = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP   = pt.matrixTransform(svg.getScreenCTM().inverse());
    const coords = { x: Math.round(svgP.x), y: Math.round(svgP.y) };
    setCalibrationPoints(prev => [...prev, coords]);
  };

  return (
    <div className="icm-wrapper" data-theme={theme}>
      <div className="icm-card">
        <TransformWrapper
          initialScale={1}
          minScale={0.4}
          maxScale={5}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <svg
              viewBox="0 0 855 1079"
              className={`icm-svg ${isInspectorMode ? 'inspector-mode' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleMapClick}
              style={{
                width: '100%',
                height: '100%',
                cursor: isInspectorMode ? 'crosshair' : 'grab',
              }}
            >
              {/* ── Campus Map Image ── */}
              <image
                href={campusMapImg}
                x="0"
                y="0"
                width="855"
                height="1079"
                preserveAspectRatio="xMidYMid meet"
                className="icm-bg-image"
              />

              {/* Dark-mode overlay */}
              {isDark && (
                <rect
                  x="0" y="0" width="855" height="1079"
                  fill="rgba(6,13,20,0.45)"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* ── Numbered Node Badges ── */}
              {landmarks.map(lm => {
                const { x, y } = mapToSvg(lm.position);
                const fill = CATEGORY_FILL[lm.category] || '#c0392b';
                const isSource = source && source.id === lm.id;
                const isDest   = destination && destination.id === lm.id;
                const highlight = isSource || isDest;
                return (
                  <g key={lm.id} transform={`translate(${x},${y})`} style={{ pointerEvents: 'none' }}>
                    {highlight && (
                      <circle
                        r="16"
                        fill={isSource ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}
                        className="icm-marker-pulse"
                      />
                    )}
                    <circle
                      r="11"
                      fill={highlight ? (isSource ? '#22c55e' : '#ef4444') : fill}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="800"
                      fontFamily="Inter, system-ui, sans-serif"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {lm.id}
                    </text>
                  </g>
                );
              })}

              {/* ── Navigation Route Overlay ── */}
              {showFullRoute && routePathD && (
                <>
                  <path
                    d={routePathD}
                    className="icm-route-glow"
                    fill="none"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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

              {/* ── Source Marker ── */}
              {source && (
                <g transform={`translate(${mapToSvg(source.position).x},${mapToSvg(source.position).y})`}>
                  <circle cx="0" cy="0" r="16" fill="rgba(34,197,94,0.2)" className="icm-marker-pulse" />
                  <circle cx="0" cy="0" r="7" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
                </g>
              )}

              {/* ── Destination Marker ── */}
              {destination && (
                <g transform={`translate(${mapToSvg(destination.position).x},${mapToSvg(destination.position).y - 14})`}>
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

              {/* ── User Position Marker ── */}
              {routePoints.length > 0 && (
                <g transform={`translate(${userPos.x},${userPos.y})`}>
                  <circle cx="0" cy="0" r="18" fill="rgba(59,130,246,0.25)" className="icm-user-pulse" />
                  <circle cx="0" cy="0" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#fff" />
                </g>
              )}

              {/* ── Inspector / Calibration Overlay ── */}
              {isInspectorMode && calibrationPoints.map((pt, i) => (
                <g key={i} transform={`translate(${pt.x},${pt.y})`}>
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <text x="12" y="4" fill="#f59e0b" fontSize="11" fontWeight="bold">{i}</text>
                </g>
              ))}
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

        {/* Inspector Panel */}
        {isInspectorMode && (
          <div
            className="icm-inspector-tooltip"
            style={{ right: '10px', left: 'auto', bottom: '10px', top: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', width: '300px' }}
          >
            <strong>Calibration Mode</strong>
            <span>Points Recorded: {calibrationPoints.length}</span>
            <textarea
              readOnly
              value={JSON.stringify(calibrationPoints)}
              style={{ width: '100%', height: '80px', fontSize: '10px', color: '#000', padding: '4px', borderRadius: '4px' }}
              onClick={e => e.target.select()}
            />
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => {
                  try { navigator.clipboard.writeText(JSON.stringify(calibrationPoints)); alert('Copied!'); }
                  catch { alert('Copy failed – copy manually from box above.'); }
                }}
                style={{ flex: 1, padding: '4px 8px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
              >Copy JSON</button>
              <button
                onClick={() => setCalibrationPoints([])}
                style={{ padding: '4px 8px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
              >Clear</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
