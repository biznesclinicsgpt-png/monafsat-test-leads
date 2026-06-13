import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Rocket, Sparkles, ChevronLeft } from 'lucide-react';
import { GlowOrb } from './GlowOrb';

export const FinalCtaSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Magnetic Hover Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth reaction
  const springConfig = { damping: 20, stiffness: 120 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax glow orb reaction (extremely subtle)
  const orbX = useTransform(springX, (val) => val * 0.15);
  const orbY = useTransform(springY, (val) => val * 0.15);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Coordinates relative to center of the container
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    // Apply limited sensitivity pull
    mouseX.set(x * 0.3);
    mouseY.set(y * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-40 bg-black relative overflow-hidden flex flex-col justify-center items-center border-t border-slate-900/60 min-h-[750px]"
    >

      {/* Convergence SVG paths (Desktop only) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block select-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 800" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="main-path-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="alt-path-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Main path from top-right (Pricing / Revenue Share) to center (500, 400) */}
          <motion.path
            d="M 750 0 C 750 250, 500 200, 500 400"
            stroke="url(#main-path-grad)"
            strokeWidth="3.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />
          {/* Animated particle for main path */}
          <circle
            cx="0" cy="0" r="3" fill="#10b981"
            style={{ filter: "drop-shadow(0 0 5px #10b981)" }}
          >
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 750 0 C 750 250, 500 200, 500 400" />
          </circle>

          {/* Alternative dashed blue path from top-left (SmartPortfolio) to center (500, 400) */}
          <motion.path
            d="M 250 0 C 250 250, 500 200, 500 400"
            stroke="url(#alt-path-grad)"
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.3 }}
          />
          {/* Animated particle for alternative path */}
          <circle
            cx="0" cy="0" r="2" fill="#3b82f6"
            style={{ filter: "drop-shadow(0 0 4px #3b82f6)" }}
          >
            <animateMotion dur="4s" repeatCount="indefinite" path="M 250 0 C 250 250, 500 200, 500 400" />
          </circle>
        </svg>
      </div>

      {/* Cinematic Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(isMobile ? 8 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500/40 rounded-full blur-[1px]"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Parallax Concentric GlowOrb behind the text/CTA */}
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-80"
      >
        <GlowOrb color="emerald" size="lg" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative px-6 py-12 md:px-12 md:py-16 rounded-3xl bg-[#090D16]/75 border border-slate-900/80 backdrop-blur-md max-w-4xl mx-auto shadow-2xl z-10 flex flex-col items-center select-none"
        >
          {/* Inner reflection gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-black text-white mb-12 leading-tight max-w-3xl mx-auto relative z-10">
            الشركات التي ستقود السوق ليست الأكثر إرسالًا للرسائل… <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-4 block">
              بل الأكثر حضورًا، وصولًا، متابعة، وفهمًا لحركة الفرص.
            </span>
          </h2>

          {/* Magnetic CTA Button Container */}
          <motion.div
            style={{ x: isMobile ? 0 : springX, y: isMobile ? 0 : springY }}
            className="relative z-20"
          >
            <motion.button
              ref={buttonRef}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollToSection('pricing')}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-6 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-slate-950" />
                ابدأ بناء منظومة النمو الخاصة بك
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity z-0" />

              {/* Sparkle effect on hover */}
              {!isMobile && (
                <Sparkles className="absolute top-2 left-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:animate-ping text-white z-10" />
              )}
            </motion.button>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
};
