import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Compass,
  FlaskConical,
  GraduationCap,
  Hotel,
  Laptop,
  Library,
  MapPin,
  Menu,
  Moon,
  Navigation,
  Search,
  Sun,
  TreePine,
  Utensils,
  Calendar,
  LayoutGrid,
} from 'lucide-react';
import BorderGlow from '../../components/shared/BorderGlow';
import './DestinationSelectionPage.css';

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Destination data ───────────────────────────────────── */
const destinations = [
  { id: 'admin',       name: 'Admin Block',      meta: 'Main Building • 1st Floor',             icon: Building2,    category: 'academic' },
  { id: 'library',     name: 'Library',           meta: 'Main Building • Ground Floor',          icon: Library,      category: 'academic' },
  { id: 'cse',         name: 'CSE Block',         meta: 'CSE Block • Various Floors',            icon: Laptop,       category: 'academic' },
  { id: 'auditorium',  name: 'Auditorium',        meta: 'Seminar Block • Ground Floor',          icon: Calendar,     category: 'events' },
  { id: 'ailab',       name: 'AI Lab 302',        meta: 'CSE Block • 3rd Floor',                 icon: FlaskConical, category: 'labs' },
  { id: 'placement',   name: 'Placement Cell',    meta: 'Admin Block • Ground Floor',            icon: GraduationCap,category: 'offices' },
  { id: 'seminar1',    name: 'Seminar Hall 1',    meta: 'Seminar Block • Ground Floor',          icon: Calendar,     category: 'events' },
  { id: 'cafeteria',   name: 'Cafeteria',         meta: 'Food Court • Ground Floor',             icon: Utensils,     category: 'facilities' },
  { id: 'hostel',      name: 'Hostel Block',      meta: 'Hostel Area • Various Floors',          icon: Hotel,        category: 'facilities' },
  { id: 'sports',      name: 'Sports Complex',    meta: 'Sports Block • Ground Floor',           icon: TreePine,     category: 'facilities' },
];

const categories = [
  { id: 'all',        label: 'All',        icon: LayoutGrid },
  { id: 'academic',   label: 'Academic',   icon: GraduationCap },
  { id: 'labs',       label: 'Labs',       icon: FlaskConical },
  { id: 'offices',    label: 'Offices',    icon: Building2 },
  { id: 'events',     label: 'Events',     icon: Calendar },
  { id: 'facilities', label: 'Facilities', icon: TreePine },
];

/* ── Progress Steps Component ───────────────────────────── */
function ProgressSteps() {
  const steps = ['Source', 'Destination', 'Preview', 'Navigate', 'Arrived'];

  return (
    <motion.div className="dst-progress" variants={fadeUp} custom={0} initial="hidden" animate="visible">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`dst-step ${index < 1 ? 'is-completed' : ''} ${index === 1 ? 'is-active' : ''}`}>
            <span>
              {index < 1 ? <Check size={10} strokeWidth={3} /> : index + 1}
            </span>
            <p>{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={`dst-step-line ${index < 1 ? 'is-done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

/* ── Main Page Component ────────────────────────────────── */
function DestinationSelectionPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Filter destinations by search + category */
  const filtered = useMemo(() => {
    let list = destinations;
    if (activeCategory !== 'all') {
      list = list.filter((d) => d.category === activeCategory);
    }
    const term = query.trim().toLowerCase();
    if (term) {
      list = list.filter((d) =>
        d.name.toLowerCase().includes(term) ||
        d.meta.toLowerCase().includes(term)
      );
    }
    return list;
  }, [query, activeCategory]);

  const selectedDest = useMemo(
    () => destinations.find((d) => d.id === selectedId),
    [selectedId]
  );

  const goToPreview = () => {
    if (!selectedDest) return;
    localStorage.setItem('wayfinder-destination', selectedDest.name);
    navigate('/preview');
  };

  return (
    <div className="dst-root">

      {/* ── Navbar ── */}
      <header className="dst-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem' }}>
          <motion.button
            className="dst-back-arrow"
            onClick={() => navigate('/source')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div className="dst-brand">
            <div className="dst-brand-icon"><MapPin size={16} /></div>
            <div>
              <strong>WayFinder</strong>
              <span>KGiSL Campus Navigator</span>
            </div>
          </div>
        </div>

        <div className="dst-nav-actions">
          <button
            className="dst-icon-btn"
            type="button"
            onClick={() => setIsDark((v) => !v)}
            aria-label="Toggle theme"
          >
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
          <button className="dst-icon-btn" type="button" aria-label="Open menu">
            <Menu size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="dst-shell">
        <ProgressSteps />

        {/* Title */}
        <motion.div className="dst-title-block" variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <h1>Where do you want to go?</h1>
          <p>Search or select your destination on campus</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
          <div className="dst-search-bar">
            <Search size={16} />
            <input
              id="destination-search"
              type="text"
              placeholder="Search destination..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  border: 'none',
                  background: 'var(--dst-line)',
                  borderRadius: '50%',
                  width: '1.4rem',
                  height: '1.4rem',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <span style={{ fontSize: '.65rem', fontWeight: 900, color: 'var(--dst-muted)' }}>✕</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Category filter chips */}
        <motion.div className="dst-categories" variants={fadeUp} custom={3} initial="hidden" animate="visible">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                className={`dst-cat-chip ${activeCategory === cat.id ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon size={13} />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Results count */}
        <motion.div variants={fadeUp} custom={3.5} initial="hidden" animate="visible">
          <div className="dst-results-count">
            <Compass size={11} />
            {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Section label */}
        <motion.span className="dst-section-label" variants={fadeUp} custom={3.8} initial="hidden" animate="visible">
          {activeCategory === 'all' ? 'All Destinations' : categories.find(c => c.id === activeCategory)?.label}
        </motion.span>

        {/* Destination list */}
        <div className="dst-list">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((dest, index) => {
                const Icon = dest.icon;
                const isSelected = selectedId === dest.id;
                return (
                  <motion.button
                    key={dest.id}
                    type="button"
                    className={`dst-row ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedId(isSelected ? null : dest.id)}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.15 + index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    layout
                  >
                    <span className="dst-row-icon">
                      <Icon size={16} />
                    </span>
                    <div className="dst-row-info">
                      <span className="dst-row-name">{dest.name}</span>
                      <span className="dst-row-meta">{dest.meta}</span>
                    </div>
                    <motion.span
                      className="dst-row-check"
                      animate={isSelected ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </motion.span>
                  </motion.button>
                );
              })
            ) : (
              <motion.div
                className="dst-no-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Search size={28} />
                <p>No destinations found for "{query}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <motion.div className="dst-actions" variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <button className="dst-back-btn" type="button" onClick={() => navigate('/source')}>
            <ArrowLeft size={16} />
            Back
          </button>

          <BorderGlow
            className="dst-cta-glow"
            edgeSensitivity={18}
            glowColor="145 82 55"
            backgroundColor="var(--dst-green)"
            borderRadius={12}
            glowRadius={18}
            glowIntensity={1.1}
            coneSpread={28}
            animated={!!selectedId}
            colors={['#22c55e', '#38bdf8', '#a7f3d0']}
            fillOpacity={0.18}
          >
            <button
              className="dst-cta-btn"
              type="button"
              onClick={goToPreview}
              disabled={!selectedId}
              style={{ opacity: selectedId ? 1 : 0.5, cursor: selectedId ? 'pointer' : 'not-allowed' }}
            >
              <Navigation size={15} />
              {selectedId ? `Go to ${selectedDest?.name}` : 'Select a Destination'}
              {selectedId && (
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.3 }}
                  style={{ display: 'flex' }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              )}
            </button>
          </BorderGlow>
        </motion.div>
      </main>
    </div>
  );
}

export default DestinationSelectionPage;
