import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Download, Plus, Trash2, Sun, Moon,
  MapPin, Edit3, Check, X, Copy
} from 'lucide-react';
import campusMapImg from '../../assets/campus_map.jpg';
import { landmarks as originalLandmarks } from '../../components/CampusMap/campusData';
import './NodeEditorPage.css';

const VIEWBOX_W = 855;
const VIEWBOX_H = 1079;

const CATEGORIES = ['academic', 'hostel', 'facility', 'admin', 'medical', 'entry'];

const CAT_COLOR = {
  academic: '#1D3557',
  hostel:   '#457B9D',
  facility: '#F4A261',
  admin:    '#E63946',
  medical:  '#2A9D8F',
  entry:    '#16a34a',
};

/* ── Deep-clone landmark list so edits don't mutate the source ── */
function cloneLandmarks(list) {
  return list.map(l => ({ ...l, position: [...l.position] }));
}

export default function NodeEditorPage() {
  const navigate = useNavigate();

  /* ── Theme ── */
  const [isDark, setIsDark] = useState(() => localStorage.getItem('wayfinder-theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('wayfinder-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* ── Node state ── */
  const [nodes, setNodes] = useState(() => cloneLandmarks(originalLandmarks));
  const [selectedId, setSelectedId] = useState(null);
  const [editField, setEditField] = useState({}); // live-edited values for panel

  /* ── SVG interaction refs ── */
  const svgRef = useRef(null);
  const dragging = useRef(null); // { id, offsetX, offsetY }

  /* ── Toast ── */
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  /* ── Helpers: svg coords from mouse event ── */
  const toSvgCoords = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  }, []);

  /* ── Select a node (and populate edit panel) ── */
  const selectNode = useCallback((id) => {
    setSelectedId(id);
    const node = nodes.find(n => n.id === id);
    if (node) setEditField({ name: node.name, category: node.category, description: node.description });
  }, [nodes]);

  /* ── Drag start ── */
  const onNodeMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    e.preventDefault();
    selectNode(id);
    const node = nodes.find(n => n.id === id);
    const svgPt = toSvgCoords(e);
    dragging.current = {
      id,
      offsetX: svgPt.x - node.position[0],
      offsetY: svgPt.y - node.position[1],
    };
  }, [nodes, selectNode, toSvgCoords]);

  /* ── Drag move ── */
  const onSvgMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const { id, offsetX, offsetY } = dragging.current;
    const svgPt = toSvgCoords(e);
    const nx = Math.max(0, Math.min(VIEWBOX_W, svgPt.x - offsetX));
    const ny = Math.max(0, Math.min(VIEWBOX_H, svgPt.y - offsetY));
    setNodes(prev => prev.map(n => n.id === id ? { ...n, position: [Math.round(nx), Math.round(ny)] } : n));
  }, [toSvgCoords]);

  /* ── Drag end ── */
  const onSvgMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  /* ── Click on empty map area to deselect ── */
  const onSvgClick = useCallback((e) => {
    if (e.target === svgRef.current || e.target.tagName === 'image') {
      setSelectedId(null);
    }
  }, []);

  /* ── Save panel edits back to node list ── */
  const savePanel = () => {
    if (!selectedId) return;
    setNodes(prev => prev.map(n =>
      n.id === selectedId
        ? { ...n, name: editField.name, category: editField.category, description: editField.description }
        : n
    ));
    showToast('Node updated ✓');
  };

  /* ── Delete selected node ── */
  const deleteNode = () => {
    if (!selectedId) return;
    setNodes(prev => prev.filter(n => n.id !== selectedId));
    setSelectedId(null);
    showToast('Node deleted', 'warn');
  };

  /* ── Add new node ── */
  const addNode = () => {
    const maxId = nodes.reduce((m, n) => Math.max(m, typeof n.id === 'number' ? n.id : 0), 0);
    const newNode = {
      id: maxId + 1,
      name: `New Node ${maxId + 1}`,
      position: [Math.round(VIEWBOX_W / 2), Math.round(VIEWBOX_H / 2)],
      category: 'facility',
      description: '',
    };
    setNodes(prev => [...prev, newNode]);
    selectNode(newNode.id);
    setTimeout(() => selectNode(newNode.id), 0);
    showToast('New node added — drag to position it');
  };

  /* ── Reset to original ── */
  const resetNodes = () => {
    setNodes(cloneLandmarks(originalLandmarks));
    setSelectedId(null);
    showToast('Reset to original data', 'warn');
  };

  /* ── Export JSON ── */
  const exportJson = () => {
    const json = JSON.stringify(
      nodes.map(n => ({
        id: n.id,
        name: n.name,
        position: n.position,
        category: n.category,
        description: n.description,
      })),
      null, 2
    );
    navigator.clipboard.writeText(json)
      .then(() => showToast('JSON copied to clipboard — paste into campusData.js'))
      .catch(() => {
        const el = document.createElement('textarea');
        el.value = json;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('JSON copied to clipboard — paste into campusData.js');
      });
  };

  /* ── Download JSON as file ── */
  const downloadJson = () => {
    const json = JSON.stringify(
      nodes.map(n => ({
        id: n.id,
        name: n.name,
        position: n.position,
        category: n.category,
        description: n.description,
      })),
      null, 2
    );
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campusNodes.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded campusNodes.json');
  };

  const selectedNode = nodes.find(n => n.id === selectedId) || null;

  return (
    <div className={`ne-root${isDark ? ' ne-dark' : ''}`}>

      {/* ── Toast ── */}
      {toast && (
        <div className={`ne-toast ${toast.type === 'warn' ? 'ne-toast-warn' : ''}`}>
          {toast.type === 'warn' ? <X size={14} /> : <Check size={14} />}
          {toast.msg}
        </div>
      )}

      {/* ── Navbar ── */}
      <header className="ne-nav">
        <div className="ne-nav-left">
          <button className="ne-icon-btn" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          <div className="ne-brand">
            <MapPin size={16} color="var(--green-600)" />
            <div>
              <strong>Node Editor</strong>
              <span>KGiSL Campus Map</span>
            </div>
          </div>
        </div>
        <div className="ne-nav-right">
          <button className="ne-icon-btn" onClick={() => setIsDark(d => !d)} aria-label="Toggle theme">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="ne-btn ne-btn-outline" onClick={resetNodes}>
            <X size={14} /> Reset
          </button>
          <button className="ne-btn ne-btn-outline" onClick={exportJson}>
            <Copy size={14} /> Copy JSON
          </button>
          <button className="ne-btn ne-btn-green" onClick={downloadJson}>
            <Download size={14} /> Download
          </button>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="ne-body">

        {/* ── Map canvas ── */}
        <div className="ne-map-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            className="ne-svg"
            onMouseMove={onSvgMouseMove}
            onMouseUp={onSvgMouseUp}
            onMouseLeave={onSvgMouseUp}
            onClick={onSvgClick}
            style={{ cursor: dragging.current ? 'grabbing' : 'default' }}
          >
            {/* Campus image */}
            <image
              href={campusMapImg}
              x="0" y="0"
              width={VIEWBOX_W}
              height={VIEWBOX_H}
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Dark overlay */}
            {isDark && (
              <rect x="0" y="0" width={VIEWBOX_W} height={VIEWBOX_H}
                fill="rgba(6,13,20,0.42)" style={{ pointerEvents: 'none' }} />
            )}

            {/* Node badges */}
            {nodes.map(lm => {
              const [x, y] = lm.position;
              const fill = CAT_COLOR[lm.category] || '#888';
              const isSelected = lm.id === selectedId;
              return (
                <g
                  key={lm.id}
                  transform={`translate(${x},${y})`}
                  style={{ cursor: 'grab' }}
                  onMouseDown={e => onNodeMouseDown(e, lm.id)}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <circle r="18" fill="none" stroke="#facc15" strokeWidth="2.5"
                      strokeDasharray="5 3" className="ne-selected-ring" />
                  )}
                  <circle r="11" fill={fill} stroke="#fff" strokeWidth={isSelected ? 2.5 : 1.5} />
                  <text
                    textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontSize="8" fontWeight="800"
                    fontFamily="Inter,system-ui,sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {lm.id}
                  </text>
                  {/* Label */}
                  {isSelected && (
                    <text
                      y="20" textAnchor="middle"
                      fill={isDark ? '#facc15' : '#1e293b'}
                      fontSize="9" fontWeight="700"
                      stroke={isDark ? '#0d1b2a' : '#fff'}
                      strokeWidth="3" paintOrder="stroke"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {lm.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map hint */}
          <div className="ne-map-hint">
            Click a node to select · Drag to reposition · Use the panel to edit details
          </div>
        </div>

        {/* ── Side panel ── */}
        <aside className="ne-panel">

          {/* ── Add button ── */}
          <button className="ne-btn ne-btn-green ne-add-btn" onClick={addNode}>
            <Plus size={15} /> Add Node
          </button>

          {/* ── Edit form ── */}
          {selectedNode ? (
            <div className="ne-form">
              <div className="ne-form-title">
                <Edit3 size={14} />
                <span>Edit Node #{selectedNode.id}</span>
              </div>

              <label className="ne-label">Position (x, y)</label>
              <div className="ne-coord-row">
                <input
                  className="ne-input"
                  type="number"
                  value={selectedNode.position[0]}
                  onChange={e => setNodes(prev => prev.map(n =>
                    n.id === selectedId ? { ...n, position: [Number(e.target.value), n.position[1]] } : n
                  ))}
                />
                <input
                  className="ne-input"
                  type="number"
                  value={selectedNode.position[1]}
                  onChange={e => setNodes(prev => prev.map(n =>
                    n.id === selectedId ? { ...n, position: [n.position[0], Number(e.target.value)] } : n
                  ))}
                />
              </div>

              <label className="ne-label">Name</label>
              <input
                className="ne-input"
                value={editField.name ?? selectedNode.name}
                onChange={e => setEditField(f => ({ ...f, name: e.target.value }))}
              />

              <label className="ne-label">Category</label>
              <select
                className="ne-input ne-select"
                value={editField.category ?? selectedNode.category}
                onChange={e => setEditField(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="ne-label">Description</label>
              <textarea
                className="ne-input ne-textarea"
                value={editField.description ?? selectedNode.description}
                onChange={e => setEditField(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />

              <div className="ne-form-actions">
                <button className="ne-btn ne-btn-green ne-full" onClick={savePanel}>
                  <Save size={14} /> Save Changes
                </button>
                <button className="ne-btn ne-btn-danger ne-full" onClick={deleteNode}>
                  <Trash2 size={14} /> Delete Node
                </button>
              </div>
            </div>
          ) : (
            <div className="ne-empty">
              <MapPin size={32} opacity={0.25} />
              <p>Select a node on the map to edit its properties</p>
            </div>
          )}

          {/* ── Node list ── */}
          <div className="ne-list-header">All Nodes ({nodes.length})</div>
          <ul className="ne-node-list">
            {nodes.map(n => (
              <li
                key={n.id}
                className={`ne-node-item ${n.id === selectedId ? 'is-selected' : ''}`}
                onClick={() => selectNode(n.id)}
              >
                <span
                  className="ne-cat-dot"
                  style={{ background: CAT_COLOR[n.category] || '#888' }}
                />
                <span className="ne-node-id">#{n.id}</span>
                <span className="ne-node-name">{n.name}</span>
                <span className="ne-node-pos">[{n.position[0]},{n.position[1]}]</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
