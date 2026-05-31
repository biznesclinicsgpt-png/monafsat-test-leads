import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SectionBridgeProps {
  label: string;
  className?: string;
  color?: 'aqua' | 'purple' | 'emerald';
}

export const SectionBridge: React.FC<SectionBridgeProps> = ({
  label,
  className,
  color = 'aqua'
}) => {
  const colors = {
    aqua: {
      text: 'text-cyan-400 bg-cyan-950/20 border-cyan-500/20',
      pulse: 'bg-cyan-400',
      line: 'from-cyan-500/20 via-cyan-500 to-transparent',
    },
    purple: {
      text: 'text-purple-400 bg-purple-950/20 border-purple-500/20',
      pulse: 'bg-purple-400',
      line: 'from-purple-500/20 via-purple-500 to-transparent',
    },
    emerald: {
      text: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20',
      pulse: 'bg-emerald-400',
      line: 'from-emerald-500/20 via-emerald-500 to-transparent',
    }
  };

  const activeColor = colors[color];

  return (
    <div className={cn("relative w-full flex flex-col items-center justify-center py-10 overflow-hidden pointer-events-none select-none z-20", className)}>
      {/* Light ray stream going down */}
      <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-800 to-transparent" />

      {/* Moving energy particle down the rail */}
      <motion.div
        animate={{ y: [-40, 60] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute w-1 h-3 rounded-full bg-gradient-to-b", activeColor.line)}
      />

      {/* Glassmorphic Indicator Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn(
          "px-4 py-2 rounded-xl border text-[10px] md:text-xs font-extrabold tracking-wider shadow-xl flex items-center gap-2 backdrop-blur-md relative z-10",
          activeColor.text
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", activeColor.pulse)} />
        <span>{label}</span>
      </motion.div>

      {/* Downward indicators */}
      <div className="mt-2.5 flex flex-col items-center gap-1.5 opacity-60">
        <ChevronDown className={cn("w-3.5 h-3.5 animate-bounce", activeColor.text.split(' ')[0])} />
      </div>
    </div>
  );
};
