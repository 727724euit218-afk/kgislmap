import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Menu,
  Clock,
  Compass,
  Building2,
  ArrowUpDown,
  ArrowUp,
  CornerUpRight,
  Edit2,
  Navigation,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import './RoutePreviewPage.css';
import InteractiveCampusMap from '../../components/map/InteractiveCampusMap';
import { landmarks } from '../../components/CampusMap/campusData';

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Progress Steps Component ───────────────────────────── */
function ProgressSteps() {
  const steps = ['Source', 'Destination', 'Preview', 'Navigate', 'Arrived'];

  return (
    <motion.div className="rp-progress" variants={fadeUp} custom={0} initial="hidden" animate="visible">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`rp-step ${index < 2 ? 'is-completed' : ''} ${index === 2 ? 'is-active' : ''}`}>
            <span>
              {index + 1}
            </span>
            <p>{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={`rp-step-line ${index < 2 ? 'is-done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

export default function RoutePreviewPage() {
  const navigate = useNavigate();
  const [navType, setNavType] = useState('staircase'); // 'staircase' or 'lift'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wayfinder-theme') || 'light';
  });
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('wayfinder-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = 'auto';

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

    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="rp-root">
      {/* ── Navbar ── */}
      <header className="rp-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem' }}>
          <motion.button
            className="rp-back-arrow"
            onClick={() => navigate('/destination')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div className="rp-brand">
            <div className="rp-brand-icon"><MapPin size={16} /></div>
            <div>
              <strong>WayFinder</strong>
              <span>KGiSL Campus Navigator</span>
            </div>
          </div>
        </div>

        <div className="rp-nav-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="rp-icon-btn" type="button" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="rp-icon-btn" type="button" aria-label="Open menu">
            <Menu size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="rp-shell">
        <ProgressSteps />

        {/* Title */}
        <motion.div className="rp-title-block" variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <h1>Route Preview</h1>
          <p>Review your route before starting navigation</p>
        </motion.div>

        {/* From / To Cards */}
        <motion.div className="rp-locations" variants={fadeUp} custom={2} initial="hidden" animate="visible">
          <div className="rp-loc-card">
            <div className="rp-loc-icon source"><MapPin size={18} /></div>
            <div className="rp-loc-info">
              <span className="rp-loc-label">From</span>
              <span className="rp-loc-name">{source ? source.name : 'Main Entrance Gate'}</span>
              <span className="rp-loc-meta">KGiSL Campus</span>
            </div>
          </div>
          <div className="rp-loc-divider">
            <ArrowRight size={16} />
          </div>
          <div className="rp-loc-card">
            <div className="rp-loc-icon dest"><MapPin size={18} /></div>
            <div className="rp-loc-info">
              <span className="rp-loc-label">To</span>
              <span className="rp-loc-name">{destination ? destination.name : 'CSE Block'}</span>
              <span className="rp-loc-meta">KGiSL Campus</span>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div className="rp-metrics" variants={fadeUp} custom={3} initial="hidden" animate="visible">
          <div className="rp-metric">
            <div className="rp-metric-icon" style={{ color: '#22c55e', background: '#dcfce7' }}><Clock size={16} /></div>
            <span className="rp-metric-label">Estimated Time</span>
            <span className="rp-metric-val">3 min</span>
          </div>
          <div className="rp-metric">
            <div className="rp-metric-icon" style={{ color: '#3b82f6', background: '#dbeafe' }}><Compass size={16} /></div>
            <span className="rp-metric-label">Distance</span>
            <span className="rp-metric-val">240 m</span>
          </div>
          <div className="rp-metric">
            <div className="rp-metric-icon" style={{ color: '#a855f7', background: '#f3e8ff' }}><Building2 size={16} /></div>
            <span className="rp-metric-label">Route Type</span>
            <span className="rp-metric-val">Outdoor</span>
          </div>
          <div className="rp-metric">
            <div className="rp-metric-icon" style={{ color: '#f97316', background: '#ffedd5' }}><ArrowUpDown size={16} /></div>
            <span className="rp-metric-label">Floors to Cross</span>
            <span className="rp-metric-val">0</span>
          </div>
        </motion.div>

        {/* Route Map Section */}
        <motion.div className="rp-section" variants={fadeUp} custom={4} initial="hidden" animate="visible">
          <div className="rp-section-header">
            <h3>Route Map (2D View)</h3>
            <span className="rp-tag rp-tag-orange"><ArrowUpDown size={12} /> Standard Route</span>
          </div>
          <div className="rp-map-container" style={{ padding: 0, overflow: 'hidden', borderRadius: '1.25rem', border: 'none' }}>
            <InteractiveCampusMap
              theme={theme}
              progress={0}
              showFullRoute={true}
              source={source}
              destination={destination}
            />
          </div>
        </motion.div>

        {/* Route Details */}
        <motion.div className="rp-section" variants={fadeUp} custom={5} initial="hidden" animate="visible">
          <div className="rp-section-header">
            <h3>Route Details</h3>
          </div>
          <div className="rp-details-list">
            <div className="rp-detail-item">
              <div className="rp-detail-icon"><ArrowUp size={16} /></div>
              <span className="rp-detail-text">Start at {source ? source.name : 'Main Entrance Gate'}</span>
              <span className="rp-detail-dist">0 m</span>
            </div>
            <div className="rp-detail-item">
              <div className="rp-detail-icon blue"><MapPin size={16} /></div>
              <span className="rp-detail-text">Arrive at {destination ? destination.name : 'CSE Block'}</span>
              <span className="rp-detail-dist">240 m</span>
            </div>
          </div>
        </motion.div>



        {/* Bottom Actions */}
        <motion.div className="rp-actions" variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <button className="rp-btn-outline" onClick={() => navigate(-1)}>
            <Edit2 size={16} />
            Change Route
          </button>
          <button className="rp-btn-primary" onClick={() => navigate('/navigate')}>
            <Navigation size={16} />
            Start Navigation
          </button>
        </motion.div>
      </main>
    </div>
  );
}
