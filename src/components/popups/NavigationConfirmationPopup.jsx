import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RefreshCw, ArrowUpDown, Flag } from 'lucide-react';
import './NavigationConfirmationPopup.css';

function NavigationConfirmationPopup({ checkpoint, onConfirm, onRecalculate, onDismiss }) {
  const title    = checkpoint?.title    ?? 'Checkpoint Reached!';
  const question = checkpoint?.question ?? 'Did you reach this checkpoint?';
  const detail   = checkpoint?.detail   ?? 'Staircase → 2nd Floor, CSE Block';
  const cpId     = checkpoint?.id       ?? 1;
  const cpTotal  = 3;

  const dots = [
    { size:6, color:'#4ade80', top:'18%', right:'12%', delay:0   },
    { size:5, color:'#60a5fa', top:'35%', right:'8%',  delay:0.6 },
    { size:4, color:'#c084fc', top:'12%', right:'28%', delay:1.2 },
    { size:7, color:'#22c55e', top:'55%', right:'6%',  delay:0.3 },
  ];

  return (
    <motion.div className="ncp-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:.22 }} onClick={onDismiss}>
      <motion.div className="ncp-sheet"
        initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
        transition={{ type:'spring', stiffness:320, damping:30 }}
        onClick={e => e.stopPropagation()}>

        {/* Floating dots */}
        {dots.map((d, i) => (
          <motion.span key={i} className="ncp-confetti-dot"
            style={{ width:d.size, height:d.size, background:d.color,
              top:d.top, right:d.right, animationDelay:`${d.delay}s` }}
            animate={{ y:[0,-10,0], opacity:[.6,.25,.6] }}
            transition={{ duration:2.8+i*.4, repeat:Infinity, ease:'easeInOut', delay:d.delay }} />
        ))}

        {/* Handle */}
        <div className="ncp-handle-wrap"><div className="ncp-handle" /></div>

        {/* Progress dots */}
        <div className="ncp-cp-progress">
          {Array.from({ length: cpTotal }, (_, i) => (
            <div key={i} className={`ncp-cp-pip${i < cpId ? ' active' : ''}`} />
          ))}
        </div>

        {/* Header */}
        <div className="ncp-header">
          <div className="ncp-icon-wrap green">
            <span className="ncp-icon-pulse" />
            <Flag size={20} />
          </div>
          <div>
            <div className="ncp-title">{title}</div>
            <div className="ncp-sub">{question}</div>
          </div>
        </div>

        {/* Detail pill */}
        <div className="ncp-floor-row">
          <div className="ncp-floor-icon"><ArrowUpDown size={16} /></div>
          <div>
            <div className="ncp-floor-label">Location</div>
            <div className="ncp-floor-val">{detail}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="ncp-actions">
          <motion.button className="ncp-btn ncp-btn-confirm"
            onClick={onConfirm} whileHover={{ scale:1.01 }} whileTap={{ scale:.97 }}>
            <CheckCircle2 size={17} />
            Yes, I'm here — Continue
          </motion.button>
          <motion.button className="ncp-btn ncp-btn-recalc"
            onClick={onRecalculate} whileTap={{ scale:.97 }}>
            <RefreshCw size={16} />
            Not yet — Recalculate Route
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NavigationConfirmationPopup;
