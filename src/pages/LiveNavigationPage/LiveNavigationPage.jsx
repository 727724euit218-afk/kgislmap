import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Navigation, ArrowUp, CornerUpRight, CornerUpLeft,
  Clock, Footprints, Route, Menu, Check, X, AlertTriangle, Sun, Moon, Flag, RefreshCw
} from 'lucide-react';
import './LiveNavigationPage.css';
import NavigationConfirmationPopup from '../../components/popups/NavigationConfirmationPopup';
import InteractiveCampusMap from '../../components/map/InteractiveCampusMap';
import { landmarks } from '../../components/CampusMap/campusData';

/* ── Route steps ── */
const STEPS = [
  { id: 1, icon: ArrowUp,       text: 'Walk straight through Main Entrance Gate', dist: '120 m',  done: true  },
  { id: 2, icon: CornerUpRight, text: 'Turn right near the Admin Block',           dist: '80 m',   done: true  },
  { id: 3, icon: ArrowUp,       text: 'Continue straight past the Library',        dist: '70 m',   done: false, active: true },
  { id: 4, icon: CornerUpLeft,  text: 'Turn left towards CSE Block corridor',      dist: '50 m',   done: false },
  { id: 5, icon: ArrowUp,       text: 'Take staircase to 2nd floor',               dist: '1 floor',done: false },
  { id: 6, icon: MapPin,        text: 'Arrive at CSE Block – Room 302',            dist: '30 m',   done: false },
];

const INSTRUCTIONS = [
  { step: 'Step 3', main: 'Continue straight past the Library', dist: 'In 70 m', icon: ArrowUp },
  { step: 'Step 4', main: 'Turn left towards CSE Block',        dist: 'In 50 m', icon: CornerUpLeft },
];

/* ── Auto-trigger checkpoints ── */
const CHECKPOINTS = [
  { id: 1, triggerAt: 20.3, title: 'Checkpoint 1 of 3', question: 'Have you turned right near the Admin Block?',         detail: 'Admin Block → Continue to Library' },
  { id: 2, triggerAt: 55,   title: 'Checkpoint 2 of 3', question: 'Have you passed straight through the Library area?',  detail: 'Library → CSE Block Corridor' },
  { id: 3, triggerAt: 82,   title: 'Checkpoint 3 of 3', question: 'Did you take the staircase to the 2nd Floor?',        detail: 'Staircase → 2nd Floor, CSE Block' },
];

/* ── Main Component ── */
export default function LiveNavigationPage() {
  const navigate = useNavigate();

  const [theme,           setTheme]           = useState(() => {
    return localStorage.getItem('wayfinder-theme') || 'light';
  });
  const [progress,        setProgress]        = useState(20);
  const [showAbortConfirm,setShowAbortConfirm]= useState(false);
  const [instrIdx,        setInstrIdx]        = useState(0);
  const [elapsed,         setElapsed]         = useState(0);
  const [cpsDone,         setCpsDone]         = useState(0);
  const [showCpPopup,     setShowCpPopup]     = useState(false);
  const [activeCp,        setActiveCp]        = useState(null);
  const [isPaused,        setIsPaused]        = useState(false);
  const [showRecalcPopup, setShowRecalcPopup] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  
  const timerRef    = useRef(null);
  const triggeredRef= useRef(new Set());

  // Load source and destination from localStorage
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

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleRecalculate = () => {
    setShowCpPopup(false);
    setShowRecalcPopup(true);
    setIsRecalculating(true);
    setIsPaused(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 1500);
  };

  /* Sync body/html dark class */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('wayfinder-theme', theme);
  }, [theme]);

  /* Simulate progress (faster for demonstration/testing) */
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused && !showCpPopup && !showAbortConfirm) {
        setProgress(p => Math.min(p + 1.5, 100));
      }
    }, 600);
    return () => clearInterval(id);
  }, [isPaused, showCpPopup, showAbortConfirm]);

  /* Auto-trigger checkpoints */
  useEffect(() => {
    if (showCpPopup) return;
    const next = CHECKPOINTS.find(cp => progress >= cp.triggerAt && !triggeredRef.current.has(cp.id));
    if (next) {
      triggeredRef.current.add(next.id);
      setActiveCp(next);
      setShowCpPopup(true);
      setIsPaused(true);
    }
  }, [progress, showCpPopup]);

  /* Elapsed timer */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused && !showCpPopup && !showAbortConfirm) {
        setElapsed(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, showCpPopup, showAbortConfirm]);

  /* Cycle instructions */
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused && !showCpPopup && !showAbortConfirm) {
        setInstrIdx(i => (i + 1) % INSTRUCTIONS.length);
      }
    }, 6000);
    return () => clearInterval(id);
  }, [isPaused, showCpPopup, showAbortConfirm]);

  const fmtTime = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const currentInstr = INSTRUCTIONS[instrIdx];
  const InstrIcon    = currentInstr.icon;
  const etaMinutes   = Math.max(1, Math.round((100 - progress) / 14));

  const handleCpConfirm = () => {
    setShowCpPopup(false);
    setIsPaused(false);
    const newDone = cpsDone + 1;
    setCpsDone(newDone);
    if (activeCp?.id === CHECKPOINTS.length) {
      navigate('/reached');
    }
  };

  const handleCpDismiss = () => {
    setShowCpPopup(false);
    setIsPaused(false);
  };

  return (
    <div className="lnp-root" data-theme={theme}>
      <div className="lnp-glow-orb lnp-glow-orb-1" />
      <div className="lnp-glow-orb lnp-glow-orb-2" />

      {/* ── Navbar ── */}
      <header className="lnp-nav">
        <div className="lnp-brand">
          <div className="lnp-brand-icon"><MapPin size={14} /></div>
          <div>
            <strong>WayFinder</strong>
            <span>KGiSL Campus Navigator</span>
          </div>
        </div>
        <div className="lnp-nav-right">
          <div className="lnp-live-badge"><span className="lnp-live-dot" />LIVE</div>
          <button
            className={`lnp-icon-btn lnp-theme-toggle${theme === 'light' ? ' is-light' : ''}`}
            onClick={toggleTheme} aria-label="Toggle theme"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button className="lnp-icon-btn" aria-label="Menu"><Menu size={14} /></button>
        </div>
      </header>

      {/* ── Scrollable body ── */}
      <main className="lnp-shell">

        {/* Progress */}
        <motion.div className="lnp-progress-bar-wrap"
          initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.45 }}>
          <Route size={14} style={{ color:'#16a34a', flexShrink:0 }} />
          <div className="lnp-progress-track">
            <div className="lnp-progress-fill" style={{ width:`${progress}%` }} />
          </div>
          <span className="lnp-progress-pct">{Math.round(progress)}%</span>
        </motion.div>

        {/* ETA row */}
        <motion.div className="lnp-eta-row"
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.45, delay:.08 }}>
          <div className="lnp-eta-card">
            <div className="lnp-eta-icon" style={{ background:'rgba(22,163,74,.15)', color:'#16a34a' }}><Clock size={15} /></div>
            <span className="lnp-eta-label">ETA</span>
            <span className="lnp-eta-value" style={{ color:'#16a34a' }}>{etaMinutes} min</span>
          </div>
          <div className="lnp-eta-card">
            <div className="lnp-eta-icon" style={{ background:'rgba(59,130,246,.15)', color:'#3b82f6' }}><Footprints size={15} /></div>
            <span className="lnp-eta-label">Distance</span>
            <span className="lnp-eta-value" style={{ color:'#3b82f6' }}>150 m</span>
          </div>
          <div className="lnp-eta-card">
            <div className="lnp-eta-icon" style={{ background:'rgba(168,85,247,.15)', color:'#9333ea' }}><Clock size={15} /></div>
            <span className="lnp-eta-label">Elapsed</span>
            <span className="lnp-eta-value" style={{ color:'#9333ea' }}>{fmtTime(elapsed)}</span>
          </div>
        </motion.div>

        {/* Checkpoint strip */}
        <motion.div className="lnp-cp-strip"
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, delay:.1 }}>
          <Flag size={12} style={{ flexShrink:0 }} />
          <span className="lnp-cp-label">Checkpoints</span>
          <div className="lnp-cp-dots">
            {CHECKPOINTS.map(cp => (
              <motion.div key={cp.id}
                className={`lnp-cp-dot${cpsDone >= cp.id ? ' done' : ''}`}
                animate={cpsDone >= cp.id ? { scale:[1,1.3,1] } : {}}
                transition={{ duration:.4 }}
              />
            ))}
          </div>
          <span className="lnp-cp-count">{cpsDone}/{CHECKPOINTS.length}</span>
        </motion.div>

        {/* Map */}
        <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.5, delay:.12 }}>
          <InteractiveCampusMap theme={theme} progress={progress} source={source} destination={destination} />
        </motion.div>

        {/* Instruction card */}
        <AnimatePresence mode="wait">
          <motion.div key={instrIdx} className="lnp-instruction-card"
            initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-30 }} transition={{ duration:.35, ease:[.22,1,.36,1] }}>
            <div className="lnp-instruction-icon"><InstrIcon size={20} /></div>
            <div className="lnp-instruction-text">
              <div className="lnp-instruction-step">{currentInstr.step}</div>
              <div className="lnp-instruction-main">{currentInstr.main}</div>
              <div className="lnp-instruction-dist">{currentInstr.dist}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Steps */}
        <div className="lnp-steps-section">
          <div className="lnp-steps-title">Route Steps</div>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  className={`lnp-step-item${step.done ? ' is-done' : ''}${step.active ? ' is-active' : ''}`}
                  initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
                  transition={{ duration:.35, delay:.2 + i*.05, ease:[.22,1,.36,1] }}>
                  <div className="lnp-step-num">
                    {step.done ? <Check size={10} strokeWidth={3} /> : step.id}
                  </div>
                  <div className="lnp-step-body">
                    <div className="lnp-step-text">{step.text}</div>
                    {step.active && <div className="lnp-step-meta">You are here</div>}
                  </div>
                  <div className="lnp-step-dist">{step.dist}</div>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className={`lnp-step-connector${step.done ? ' done' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </main>

      {/* ── Bottom panel (Abort only) ── */}
      <div className="lnp-bottom-panel">
        <div className="lnp-bottom-info">
          <Flag size={12} />
          <span>{cpsDone} of {CHECKPOINTS.length} checkpoints passed</span>
        </div>
        <motion.button className="lnp-btn-abort"
          onClick={() => setShowAbortConfirm(true)} whileTap={{ scale:.96 }}>
          <X size={15} /> Abort Navigation
        </motion.button>
      </div>

      {/* ── Checkpoint popup (auto) ── */}
      <AnimatePresence>
        {showCpPopup && (
          <NavigationConfirmationPopup
            checkpoint={activeCp}
            onConfirm={handleCpConfirm}
            onRecalculate={handleRecalculate}
            onDismiss={() => {
              setShowCpPopup(false);
              setIsPaused(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Recalculate popup ── */}
      <AnimatePresence>
        {showRecalcPopup && (
          <motion.div
            style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,.6)',
              backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          >
            <motion.div
              style={{
                width:'100%',
                maxWidth:'400px',
                background: theme==='dark' ? '#0d1b2a' : '#f8fafc',
                border:`1px solid ${theme==='dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'}`,
                borderRadius:'1.5rem',
                padding:'2rem 1.5rem',
                boxShadow:'0 20px 40px rgba(0,0,0,0.3)',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                textAlign:'center'
              }}
              initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
              transition={{ type:'spring', stiffness:300, damping:25 }}
            >
              {isRecalculating ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.2rem', padding:'1rem 0' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <RefreshCw size={36} />
                  </motion.div>
                  <div style={{ fontWeight:700, fontSize:'1.1rem', color: theme==='dark' ? '#f0f6ff' : '#0f172a' }}>
                    Recalculating Route...
                  </div>
                  <div style={{ fontSize:'.82rem', color:'#64748b' }}>
                    Finding the fastest alternative path to CSE Block
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
                  <div style={{ width:'3.5rem', height:'3.5rem', borderRadius:'50%',
                    background:'rgba(22,163,74,.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.2rem' }}>
                    <MapPin size={24} color="#22c55e" />
                  </div>
                  
                  <div style={{ fontWeight:800, fontSize:'1.2rem', color: theme==='dark' ? '#f0f6ff' : '#0f172a', marginBottom:'.4rem' }}>
                    Route Recalculated!
                  </div>
                  <div style={{ fontSize:'.82rem', color:'#64748b', marginBottom:'1.5rem' }}>
                    Here is the last navigation step to reach your destination:
                  </div>

                  {/* Last Step Card */}
                  <div style={{
                    width: '100%',
                    background: theme==='dark' ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.02)',
                    border: `1px solid ${theme==='dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'}`,
                    borderRadius: '1rem',
                    padding: '1.2rem 1rem',
                    marginBottom: '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.8rem',
                    textAlign: 'left'
                  }}>
                    <div style={{
                      width: '2.2rem',
                      height: '2.2rem',
                      borderRadius: '.6rem',
                      background: 'linear-gradient(135deg, #16a34a, #4ade80)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      <MapPin size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.65rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.1rem' }}>
                        Step {STEPS[STEPS.length - 1].id} (Final Destination)
                      </div>
                      <div style={{ fontSize: '.88rem', fontWeight: 700, color: theme==='dark' ? '#f0f6ff' : '#0f172a' }}>
                        {STEPS[STEPS.length - 1].text}
                      </div>
                    </div>
                    <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#3b82f6' }}>
                      {STEPS[STEPS.length - 1].dist}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowRecalcPopup(false);
                      setIsPaused(false);
                    }}
                    style={{
                      width: '100%',
                      height: '3rem',
                      borderRadius: '.8rem',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '.5rem'
                    }}
                  >
                    Resume Navigation
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Abort confirm ── */}
      <AnimatePresence>
        {showAbortConfirm && (
          <motion.div
            style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,.6)',
              backdropFilter:'blur(6px)', display:'flex', alignItems:'flex-end' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowAbortConfirm(false)}>
            <motion.div
              style={{ width:'100%',
                background: theme==='dark' ? '#0d1b2a' : '#f8fafc',
                borderTop:`1px solid ${theme==='dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'}`,
                borderRadius:'1.5rem 1.5rem 0 0', padding:'1.5rem 1.25rem 2rem' }}
              initial={{ y:120 }} animate={{ y:0 }} exit={{ y:120 }}
              transition={{ type:'spring', stiffness:300, damping:28 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display:'flex', alignItems:'center', gap:'.7rem', marginBottom:'1rem' }}>
                <div style={{ width:'2.4rem', height:'2.4rem', borderRadius:'50%',
                  background:'rgba(239,68,68,.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <AlertTriangle size={18} color="#f87171" />
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'1rem', color: theme==='dark' ? '#f0f6ff' : '#0f172a' }}>
                    Abort Navigation?
                  </div>
                  <div style={{ fontSize:'.78rem', color:'#64748b' }}>Your progress will be lost</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'.75rem' }}>
                <button onClick={() => setShowAbortConfirm(false)}
                  style={{ flex:1, height:'3rem', borderRadius:'.8rem',
                    border:`1px solid ${theme==='dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'}`,
                    background:'transparent', color:'#94a3b8', fontWeight:700, cursor:'pointer' }}>
                  Continue
                </button>
                <button onClick={() => navigate('/')}
                  style={{ flex:1, height:'3rem', borderRadius:'.8rem', border:'none',
                    background:'rgba(239,68,68,.18)', color:'#f87171', fontWeight:700, cursor:'pointer' }}>
                  Yes, Abort
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
