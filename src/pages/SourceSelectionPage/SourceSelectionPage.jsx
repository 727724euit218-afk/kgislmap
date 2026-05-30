import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Heart,
  Home,
  MapPin,
  Menu,
  Moon,
  Navigation,
  Search,
  Sparkles,
  Sun,
  Utensils,
} from 'lucide-react';
import BorderGlow from '../../components/shared/BorderGlow';
import './SourceSelectionPage.css';
import { landmarks } from '../../components/CampusMap/campusData';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] },
  }),
};

const categoryIconMap = {
  academic: Building2,
  hostel:   Home,
  facility: Utensils,
  admin:    Building2,
  medical:  Heart,
  entry:    MapPin,
};

// Derive sources from landmarks – mark Node 1 (Main Entrance Gate) as detected
const sources = landmarks.map(lm => ({
  id:       String(lm.id),
  name:     lm.name,
  meta:     lm.description,
  icon:     categoryIconMap[lm.category] || MapPin,
  detected: lm.id === 1,
  landmark: lm,
}));

function ProgressSteps() {
  const steps = ['Source', 'Destination', 'Preview', 'Navigate', 'Arrived'];

  return (
    <motion.div className="src-progress" variants={fadeUp} custom={0} initial="hidden" animate="visible">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`src-step ${index === 0 ? 'is-active' : ''}`}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </div>
          {index < steps.length - 1 && <div className="src-step-line" />}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

function CampusMap({ selectedName, onSelectSource }) {
  return (
    <div className="src-map-scene" style={{ height: '100%', minHeight: '14rem' }} aria-label={`Map preview with ${selectedName} selected`}>
      <motion.div
        className="src-map-grid"
        animate={{ backgroundPosition: ['0px 0px', '22px 22px'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`src-building src-building-${index + 1}`}
          initial={{ opacity: 0, y: 18, rotate: -45 }}
          animate={{ opacity: 1, y: 0, rotate: -45 }}
          transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span />
        </motion.div>
      ))}

      <motion.div
        className="src-route-line"
        initial={{ scaleX: 0, rotate: -18 }}
        animate={{ scaleX: 1, rotate: -18 }}
        transition={{ duration: .75, delay: .45, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.button
        type="button"
        className="src-map-pin src-map-pin-a"
        aria-label="Select main entrance"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => onSelectSource('entrance')}
      >
        <MapPin size={18} />
      </motion.button>

      <motion.button
        type="button"
        className="src-map-pin src-map-pin-b"
        aria-label="Select auditorium"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        onClick={() => onSelectSource('auditorium')}
      >
        <MapPin size={18} />
      </motion.button>

      <motion.div
        className="src-user-dot"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span />
      </motion.div>
    </div>
  );
}

function SourceSelectionPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('wayfinder-theme') === 'dark';
  });
  const [selectedId, setSelectedId] = useState('1'); // Node 1 = Main Entrance Gate
  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('wayfinder-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const selectedSource = useMemo(
    () => sources.find((source) => source.id === selectedId) || sources[0],
    [selectedId]
  );

  const filteredSources = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sources.filter((source) => !source.detected);
    return sources.filter((source) => source.name.toLowerCase().includes(term));
  }, [query]);

  const chooseSource = (id) => {
    setSelectedId(id);
    setPickerOpen(false);
  };

  const continueToDestination = () => {
    localStorage.setItem('wayfinder-source', selectedSource.name);
    localStorage.setItem('wayfinder-source-id', selectedSource.id);
    navigate('/destination');
  };

  return (
    <div className="src-root">
      <header className="src-nav">
        <div className="src-brand">
          <div className="src-brand-icon"><MapPin size={16} /></div>
          <div>
            <strong>WayFinder</strong>
            <span>KGiSL Campus Navigator</span>
          </div>
        </div>

        <div className="src-nav-actions">
          <button className="src-icon-btn" type="button" onClick={() => setIsDark((value) => !value)} aria-label="Toggle theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -20, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 20, scale: 0.85 }}
                transition={{ duration: 0.18 }}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="src-icon-btn" type="button" aria-label="Open menu">
            <Menu size={15} />
          </button>
        </div>
      </header>

      <main className="src-shell">
        <ProgressSteps />

        <section className="src-grid">
          <div className="src-column">
            <motion.div className="src-title-block" variants={fadeUp} custom={1} initial="hidden" animate="visible">
              <h1>Choose Your <span>Starting Point</span></h1>
              <p>We found your location from the QR scan. Confirm it or choose a nearby campus spot.</p>
            </motion.div>

            <motion.div className="src-card src-detected-card" variants={fadeUp} custom={2} initial="hidden" animate="visible">
              <div className="src-card-label">
                <Sparkles size={14} />
                {selectedSource.detected ? 'QR Detected Location' : 'Selected Location'}
              </div>

              <div className="src-detected-body">
                <div className="src-location-photo" aria-hidden="true">
                  <span className="src-photo-sky" />
                  <span className="src-photo-building" />
                  <span className="src-photo-tree src-photo-tree-a" />
                  <span className="src-photo-tree src-photo-tree-b" />
                  <span className="src-photo-path" />
                </div>
                <div className="src-detected-copy">
                  <strong>{selectedSource.name}</strong>
                  <span>{selectedSource.detected ? 'Current Source' : 'Selected Location'}</span>
                  <p>{selectedSource.meta !== 'Current Source' ? selectedSource.meta : 'KGiSL Campus'}</p>
                </div>
              </div>

              <BorderGlow
                className="src-use-glow"
                edgeSensitivity={18}
                glowColor="145 82 55"
                backgroundColor="var(--src-green)"
                borderRadius={12}
                glowRadius={18}
                glowIntensity={1.1}
                coneSpread={28}
                colors={['#22c55e', '#38bdf8', '#a7f3d0']}
                fillOpacity={0.18}
              >
                <button className="src-use-btn" type="button" onClick={continueToDestination}>
                  <Check size={14} />
                  Confirm & Continue
                </button>
              </BorderGlow>
            </motion.div>

            <motion.div className="src-card src-picker-card" variants={fadeUp} custom={3} initial="hidden" animate="visible">
              <label className="src-field-label" htmlFor="source-search">Choose a Different Source</label>
              <div className={`src-select-shell ${pickerOpen ? 'is-open' : ''}`}>
                <button className="src-select-trigger" type="button" onClick={() => setPickerOpen((value) => !value)}>
                  <span>{selectedSource.detected ? 'Select a location' : selectedSource.name}</span>
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {pickerOpen && (
                    <motion.div
                      className="src-select-popover"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="src-search">
                        <Search size={14} />
                        <input
                          id="source-search"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search locations"
                          autoComplete="off"
                        />
                      </div>
                      <div className="src-source-list">
                        {filteredSources.map((source, index) => {
                          const Icon = source.icon;
                          const isSelected = selectedId === source.id;
                          return (
                            <motion.button
                              key={source.id}
                              type="button"
                              className={`src-source-row ${isSelected ? 'is-selected' : ''}`}
                              onClick={() => chooseSource(source.id)}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 + index * 0.035 }}
                            >
                              <span className="src-source-icon"><Icon size={15} /></span>
                              <span>{source.name}</span>
                              {isSelected && <Check size={15} className="src-row-check" />}
                            </motion.button>
                          );
                        })}
                        {filteredSources.length === 0 && (
                          <div className="src-no-results">
                            No locations found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
            <CampusMap selectedName={selectedSource.name} onSelectSource={chooseSource} />
          </motion.div>
        </section>

        <motion.section className="src-card src-recent-card" variants={fadeUp} custom={5} initial="hidden" animate="visible">
          <div className="src-section-title">
            <Navigation size={14} />
            <strong>Campus Locations</strong>
          </div>
          <div className="src-recent-list">
            {sources.slice(1, 5).map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                className="src-recent-item"
                onClick={() => chooseSource(item.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + index * 0.04 }}
              >
                <span>{item.name}</span>
                <small>{item.meta.slice(0, 40)}</small>
                <ArrowRight size={13} />
              </motion.button>
            ))}
          </div>
        </motion.section>

        <motion.div className="src-selection-summary" variants={fadeUp} custom={6} initial="hidden" animate="visible" style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.85rem', background: 'var(--src-green-soft)', border: '1px solid rgba(22, 163, 74, 0.18)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--src-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--src-green)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Source</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--src-ink)', fontWeight: 850 }}>{selectedSource.name}</div>
          </div>
        </motion.div>

        <motion.div className="src-actions" variants={fadeUp} custom={7} initial="hidden" animate="visible" style={{ marginTop: '0.75rem' }}>
          <button className="src-back-btn" type="button" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back
          </button>
          <button className="src-next-btn" type="button" onClick={continueToDestination}>
            Continue
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default SourceSelectionPage;
