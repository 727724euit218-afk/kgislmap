import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, MapPin, Navigation, Clock,
  Footprints, Home, ChevronRight, Award
} from 'lucide-react';
import './DestinationReachedPage.css';

/* ─── Confetti particle data ─────────────────────────────── */
const COLORS = ['#4ade80','#22c55e','#60a5fa','#c084fc','#fb923c','#f9a8d4','#fbbf24'];
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  size: 5 + Math.random() * 7,
  left: `${4 + Math.random() * 92}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${3.5 + Math.random() * 3}s`,
}));

/* ─── Star Rating ────────────────────────────────────────── */
function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="drp-rating-section">
      <div className="drp-rating-title">Rate your experience</div>
      <div className="drp-stars">
        {[1, 2, 3, 4, 5].map(n => (
          <motion.span
            key={n}
            className={`drp-star ${n <= (hover || rating) ? 'lit' : ''}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            whileTap={{ scale: 0.8 }}
          >
            ⭐
          </motion.span>
        ))}
      </div>
      <AnimatePresence>
        {rating > 0 && (
          <motion.p
            key={rating}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '.6rem', fontSize: '.78rem', color: '#4ade80', fontWeight: 700 }}
          >
            {['', 'Poor 😕', 'Okay 🤔', 'Good 🙂', 'Great 😊', 'Excellent! 🎉'][rating]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DestinationReachedPage() {
  const navigate = useNavigate();

  const source      = localStorage.getItem('wayfinder-source')      || 'Main Entrance Gate';
  const destination = localStorage.getItem('wayfinder-destination') || 'CSE Block';

  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Stagger variants */
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: .5, delay, ease: [.22, 1, .36, 1] },
  });

  const stats = [
    { icon: Clock,      color: '#4ade80', bg: 'rgba(22,163,74,.15)',   value: '5 min',  label: 'Time'     },
    { icon: Footprints, color: '#60a5fa', bg: 'rgba(59,130,246,.15)',  value: '350 m',  label: 'Distance' },
    { icon: Award,      color: '#fbbf24', bg: 'rgba(251,191,36,.15)',  value: '100%',   label: 'Accuracy' },
  ];

  return (
    <div className="drp-root">
      {/* Ambient background glow */}
      <div className="drp-bg-glow" />

      {/* Confetti particles */}
      <div className="drp-particles">
        {show && PARTICLES.map(p => (
          <span
            key={p.id}
            className="drp-particle"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: p.left,
              top: '-12px',
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: .8,
            }}
          />
        ))}
      </div>

      {/* ── Content card ── */}
      <div className="drp-card">

        {/* Success icon with pulsing rings */}
        <motion.div
          className="drp-icon-outer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: .55, ease: [.22, 1, .36, 1], delay: .1 }}
        >
          <span className="drp-icon-ring-1" />
          <span className="drp-icon-ring-2" />
          <span className="drp-icon-ring-3" />
          <div className="drp-icon-circle">
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div {...fadeUp(0.25)}>
          <div className="drp-heading">You've arrived!</div>
        </motion.div>

        {/* Sub-text */}
        <motion.p className="drp-sub" {...fadeUp(0.35)}>
          You have successfully reached your destination.
          Great navigation! 🎉
        </motion.p>

        {/* Route pill */}
        <motion.div className="drp-route-pill" {...fadeUp(0.42)}>
          <span className="drp-route-pill-dot" style={{ background: '#22c55e' }} />
          <span style={{ color: '#f0f6ff', fontWeight: 700, fontSize: '.8rem' }}>{source}</span>
          <span className="drp-route-arrow">→</span>
          <span className="drp-route-pill-dot" style={{ background: '#60a5fa' }} />
          <span style={{ color: '#f0f6ff', fontWeight: 700, fontSize: '.8rem' }}>{destination}</span>
        </motion.div>

        {/* Stats */}
        <motion.div className="drp-stats" {...fadeUp(0.5)}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                className="drp-stat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .4, delay: .55 + i * .07, ease: [.22, 1, .36, 1] }}
              >
                <div className="drp-stat-icon" style={{ background: s.bg }}>
                  <Icon size={14} color={s.color} />
                </div>
                <span className="drp-stat-value" style={{ color: s.color }}>{s.value}</span>
                <span className="drp-stat-label">{s.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Star rating */}
        <motion.div style={{ width: '100%' }} {...fadeUp(0.68)}>
          <StarRating />
        </motion.div>

        {/* Action buttons */}
        <motion.div className="drp-actions" {...fadeUp(0.78)}>
          <motion.button
            className="drp-btn-primary"
            onClick={() => {
              localStorage.removeItem('wayfinder-source');
              localStorage.removeItem('wayfinder-destination');
              navigate('/');
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: .97 }}
          >
            <Navigation size={16} />
            Navigate Again
            <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
          </motion.button>

          <motion.button
            className="drp-btn-secondary"
            onClick={() => navigate('/')}
            whileTap={{ scale: .97 }}
          >
            <Home size={15} />
            Back to Home
          </motion.button>
        </motion.div>

        {/* Brand footer */}
        <motion.div className="drp-brand-footer" {...fadeUp(0.88)}>
          <MapPin size={11} color="#16a34a" />
          WayFinder
          <span className="drp-brand-dot" />
          KGiSL Campus Navigator
        </motion.div>
      </div>
    </div>
  );
}
