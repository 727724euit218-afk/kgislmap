import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Navigation, Moon, Sun, Menu, X,
  ArrowRight, Map, Zap, Home, ChevronRight
} from 'lucide-react';
import BorderGlow from '../../components/shared/BorderGlow';
import LottieModule from 'lottie-react';
import locationAnimation from '../../assets/location.json';
import '../../index.css';

const Lottie = LottieModule.default || LottieModule;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } })
};

/* ── Mini animated campus map ── */
function MiniMap() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="320" height="200" rx="16" fill="var(--bg-alt)" />

      {/* Roads */}
      <rect x="0" y="90" width="320" height="18" fill="#e2e8f0" />
      <rect x="148" y="0" width="18" height="200" fill="#e2e8f0" />

      {/* Trees */}
      {[[20,20],[50,20],[20,60],[270,20],[295,20],[270,60],[20,130],[270,160]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="8" fill="#bbf7d0" opacity="0.7" />
          <circle cx={cx} cy={cy} r="5" fill="#4ade80" opacity="0.8" />
        </g>
      ))}

      {/* Buildings */}
      <rect x="68" y="20" width="72" height="60" rx="5" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1.5" />
      <text x="104" y="52" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="700">Block A</text>

      <rect x="172" y="20" width="80" height="60" rx="5" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5" />
      <text x="212" y="52" textAnchor="middle" fill="#4c1d95" fontSize="9" fontWeight="700">Auditorium</text>

      <rect x="40" y="118" width="90" height="60" rx="5" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
      <text x="85" y="150" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="700">Library</text>

      <rect x="178" y="118" width="90" height="60" rx="5" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="223" y="150" textAnchor="middle" fill="#7f1d1d" fontSize="9" fontWeight="700">Canteen</text>

      {/* Entrance */}
      <rect x="120" y="182" width="74" height="16" rx="4" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.5" />
      <text x="157" y="194" textAnchor="middle" fill="#166534" fontSize="7" fontWeight="700">Main Gate</text>

      {/* Animated route */}
      <path
        d="M157 182 L157 108 L212 108 L212 80"
        stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="7 5" fill="none"
        style={{
          strokeDashoffset: 0,
          animation: 'dash-draw 2.2s ease forwards 0.3s'
        }}
      />

      {/* Destination pin */}
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        <circle cx="212" cy="72" r="8" fill="#16a34a" />
        <circle cx="212" cy="72" r="4" fill="white" />
        <path d="M212 80 L208 74 L216 74 Z" fill="#16a34a" />
      </motion.g>

      {/* Source ping */}
      <motion.circle cx="157" cy="190" r="5" fill="#3b82f6" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <motion.circle cx="157" cy="190" r="8" stroke="#3b82f6" strokeWidth="1.5" fill="none"
        animate={{ r: [8, 13], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
    </svg>
  );
}

export default function LandingWelcomePage() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('wayfinder-theme') === 'dark';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('wayfinder-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const goNavigate = () => navigate('/source');

  const chips = [
    { icon: Map, label: 'Indoor / Outdoor' },
    { icon: Zap, label: 'Live Routes' },
  ];

  const drawerLinks = [
    { icon: Home,       label: 'Home', action: () => setMenuOpen(false) },
    { icon: Navigation, label: 'Start Navigation', action: () => { setMenuOpen(false); goNavigate(); } },
  ];

  return (
    <div className="sp-root">

      {/* ── Navbar ── */}
      <header className="sp-nav">
        <div className="sp-nav-inner">
          <div className="sp-logo">
            <div className="sp-logo-icon"><MapPin size={14} /></div>
            <div>
              <div className="sp-logo-name">WayFinder</div>
              <div className="sp-logo-sub">Campus Navigator</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button id="theme-toggle" className="sp-icon-btn" onClick={() => setIsDark(d => !d)} aria-label="Toggle theme">
              <motion.div key={isDark ? 'sun' : 'moon'} initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </motion.div>
            </button>
            <button id="menu-btn" className="sp-icon-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Side Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div className="sp-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
            <motion.div className="sp-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
              <div className="sp-drawer-header">
                <div className="sp-logo">
                  <div className="sp-logo-icon"><MapPin size={13} /></div>
                  <div className="sp-logo-name">WayFinder</div>
                </div>
                <button className="sp-icon-btn" onClick={() => setMenuOpen(false)}><X size={15} /></button>
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                {drawerLinks.map((l, i) => (
                  <motion.button key={i} className="sp-drawer-link" onClick={l.action}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <l.icon size={16} style={{ color: 'var(--green-600)', flexShrink: 0 }} />
                    {l.label}
                    <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.35 }} />
                  </motion.button>
                ))}
              </nav>
              <div className="sp-drawer-footer">
                <button className="sp-btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '0.875rem', padding: '0.85rem' }} onClick={() => { setMenuOpen(false); goNavigate(); }}>
                  <Navigation size={15} /> Start Navigation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Body ── */}
      <main className="sp-body">

        {/* Left / Top — text content */}
        <div className="sp-content">

          {/* Heading */}
          <motion.div 
            style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
          >
            <div style={{ textAlign: 'center' }}>
              <h1 className="sp-heading" style={{ margin: 0 }}>
                Navigate KGiSL Campus.<br />
                <span className="sp-green">Fast.</span>
              </h1>
            </div>
            <div style={{ flexShrink: 0, width: 140, height: 140 }}>
              <Lottie 
                animationData={locationAnimation} 
                loop={true} 
              />
            </div>
          </motion.div>

          {/* Sub */}
          <motion.p className="sp-sub" custom={2} variants={fadeUp} initial="hidden" animate="visible">
            Find buildings, labs, and campus spots with clear step-by-step routes.
          </motion.p>

          {/* Feature chips */}
          <motion.div className="sp-chips" custom={3} variants={fadeUp} initial="hidden" animate="visible">
            {chips.map((c, i) => (
              <div key={i} className="sp-chip">
                <c.icon size={12} style={{ color: 'var(--green-600)' }} />
                {c.label}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="sp-cta-glow-wrap"
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <BorderGlow
              className="sp-cta-glow"
              edgeSensitivity={22}
              glowColor="145 82 55"
              backgroundColor="var(--green-600)"
              borderRadius={999}
              glowRadius={28}
              glowIntensity={1.25}
              coneSpread={28}
              animated
              colors={['#22c55e', '#38bdf8', '#c084fc']}
              fillOpacity={0.28}
            >
              <button
                id="start-nav-btn"
                className="sp-btn-primary sp-cta"
                onClick={goNavigate}
              >
                <Navigation size={17} />
                Start Navigation
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.3 }}>
                  <ArrowRight size={15} />
                </motion.span>
              </button>
            </BorderGlow>
          </motion.div>
        </div>

        {/* Right / Bottom — Map */}
        <motion.div
          className="sp-map-panel"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <MiniMap />

          {/* Destination chip */}
          <motion.div className="sp-map-chip sp-map-chip-top"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            <span className="sp-dot sp-dot-green" />
            <div>
              <div className="sp-chip-title">Auditorium</div>
              <div className="sp-chip-meta">5 min · 350 m</div>
            </div>
          </motion.div>

          {/* Source chip */}
          <motion.div className="sp-map-chip sp-map-chip-bot"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
            <span className="sp-dot sp-dot-blue" />
            <div>
              <div className="sp-chip-title">Main Entrance</div>
              <div className="sp-chip-meta">You are here</div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <style>{`
        @keyframes dash-draw {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
