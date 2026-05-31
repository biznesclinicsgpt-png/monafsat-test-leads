import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowOrbProps {
  color?: 'aqua' | 'purple' | 'emerald';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  color = 'aqua',
  className,
  size = 'md'
}) => {
  const colorMap = {
    aqua: {
      glow: 'bg-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.4)]',
      border: 'border-cyan-500/20',
      line: 'stroke-cyan-500/30',
      pulse: 'bg-cyan-400',
    },
    purple: {
      glow: 'bg-purple-500/20 shadow-[0_0_80px_rgba(168,85,247,0.4)]',
      border: 'border-purple-500/20',
      line: 'stroke-purple-500/30',
      pulse: 'bg-purple-400',
    },
    emerald: {
      glow: 'bg-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.4)]',
      border: 'border-emerald-500/20',
      line: 'stroke-emerald-500/30',
      pulse: 'bg-emerald-400',
    }
  };

  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48 md:w-64 md:h-64',
    lg: 'w-72 h-72 md:w-[450px] md:h-[450px]',
  };

  const activeColor = colorMap[color];

  return (
    <div className={cn("relative flex items-center justify-center pointer-events-none select-none", className)}>
      {/* Outer concentric rotating ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute rounded-full border border-dashed border-spacing-2",
          activeColor.border,
          size === 'lg' ? 'w-[110%] h-[110%]' : size === 'md' ? 'w-[130%] h-[130%]' : 'w-[140%] h-[140%]'
        )}
      />

      {/* Rotating ring 2 */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute rounded-full border border-double border-spacing-4",
          activeColor.border,
          size === 'lg' ? 'w-[90%] h-[90%]' : size === 'md' ? 'w-[105%] h-[105%]' : 'w-[115%] h-[115%]'
        )}
      >
        {/* Orbital data points in ring */}
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full", activeColor.pulse)} />
        <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full", activeColor.pulse)} />
      </motion.div>

      {/* Rotating ring 3 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute rounded-full border border-slate-900/40",
          activeColor.border,
          size === 'lg' ? 'w-[70%] h-[70%]' : size === 'md' ? 'w-[80%] h-[80%]' : 'w-[90%] h-[90%]'
        )}
      >
        <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full", activeColor.pulse)} />
      </motion.div>

      {/* SVG Central Radar Sweeper */}
      <svg className="absolute w-full h-full inset-0 z-0 opacity-40" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="url(#radial-sweeper)"
          strokeWidth="0.5"
          className={activeColor.line}
        />
        <defs>
          <radialGradient id="radial-sweeper" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="90%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>

      {/* Glassmorphic Glowing Core */}
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={cn(
          "rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center relative",
          sizeMap[size],
          activeColor.glow
        )}
      >
        {/* Core Center Pulse Dot */}
        <div className={cn("w-4 h-4 rounded-full animate-ping absolute", activeColor.pulse)} />
        <div className={cn("w-3 h-3 rounded-full absolute shadow-inner", activeColor.pulse)} />
      </motion.div>
    </div>
  );
};
