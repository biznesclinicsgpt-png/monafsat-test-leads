import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Target,
  Users,
  Sparkles,
  Layers,
  ArrowDown,
  Award,
  Activity,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle,
  FileText,
  Handshake,
  TrendingUp,
  RefreshCw,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';

const PIPELINE_CONFIG = {
  targetAmount: "المستهدف البيعي",
  subText: "كل فرصة تتحرك داخل القمع تقرب فريقك من هذا الرقم."
};

const useLocalMotion = () => {
  const shouldReduce = useReducedMotion();
  const reveal = {
    hidden: {
      opacity: 0,
      y: shouldReduce ? 0 : 25,
      filter: shouldReduce ? 'none' : 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'none',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0.02 : 0.06,
        delayChildren: shouldReduce ? 0.01 : 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: shouldReduce ? 0 : 15,
      filter: shouldReduce ? 'none' : 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'none',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return { shouldReduce, reveal, container, item };
};

export const DualStreamPipelineSection = () => {
  const { shouldReduce, reveal, container, item } = useLocalMotion();
  // Synchronized hover section state ('before' | 'during' | 'after' | null)
  const [hoveredSection, setHoveredSection] = React.useState<'before' | 'during' | 'after' | null>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (section: 'before' | 'during' | 'after') => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(null);
    }, 180);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Mobile accordion active state
  const [activeMobileSection, setActiveMobileSection] = React.useState<string | null>(null);

  const toggleMobileSection = (section: string) => {
    if (activeMobileSection === section) {
      setActiveMobileSection(null);
    } else {
      setActiveMobileSection(section);
    }
  };

  return (
	    <motion.section
	      initial="hidden"
	      whileInView="visible"
	      viewport={{ once: true, amount: 0.12 }}
	      variants={container}
	      className="py-20 bg-[#04080F] border-t border-slate-900/60 relative overflow-hidden"
	      id="dual-stream-pipeline"
	    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-950/5 rounded-full blur-[140px] pointer-events-none select-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* Section Header */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-4 select-none">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">تكامل منظومة المبيعات</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            نزيد حصيلة الفرص التي تصل لفريق مبيعاتك
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            مسار قيادة النمو الذي يفتح محادثات مؤهلة، وكادر منافسات يرصد فرصاً مباشرة من السوق، ثم تلتقي الفرص في حصيلة واحدة ليبدأ فريقك من فرص أجهز وأقرب للتحويل.
          </p>
        </motion.div>

	          <motion.div variants={container} className="hidden lg:grid grid-cols-12 gap-6 items-center relative text-right z-10" dir="rtl">

          {/* SVG Connector Overlay Behind Columns */}
	          <motion.div variants={item} className="absolute inset-0 pointer-events-none z-0">
	            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              {/* Soft glow behind the connector path */}
	              <motion.path
	                d="M 32 40 C 35 26, 37 18, 38 12"
	                stroke="rgba(6, 182, 212, 0.04)"
	                strokeWidth="2.2"
	                className="transition-all duration-300"
	                initial={{ pathLength: shouldReduce ? 1 : 0 }}
	                whileInView={{ pathLength: 1 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
	              />
              {/* Ultra-soft dotted line from Sales Rep (Left) to top of Funnel */}
	              <motion.path
	                d="M 32 40 C 35 26, 37 18, 38 12"
	                stroke="rgba(6, 182, 212, 0.08)"
	                strokeWidth="0.5"
	                strokeDasharray="2 3"
	                className="transition-all duration-300"
	                initial={{ pathLength: shouldReduce ? 1 : 0 }}
	                whileInView={{ pathLength: 1 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
	              />

              {/* Dotted Line from Monafsat Badge (Right of Center) to Funnel Rim */}
	              <motion.path
	                d="M 72 0 C 69 3, 67 5, 65.5 7.5"
	                stroke="rgba(16, 185, 129, 0.22)"
	                strokeWidth="0.8"
	                strokeDasharray="3 3"
	                initial={{ pathLength: shouldReduce ? 1 : 0 }}
	                whileInView={{ pathLength: 1 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
	              />

              {/* Dotted Lines from Nodes (Right) to Funnel stages */}
	              <motion.path
	                d="M 70 12 L 68 12"
                stroke="rgba(6, 182, 212, 0.22)"
                strokeWidth="0.6"
	                strokeDasharray="1.5 1.5"
	                initial={{ pathLength: shouldReduce ? 1 : 0 }}
	                whileInView={{ pathLength: 1 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.45, delay: 0.75, ease: "easeOut" }}
	              />
	              <motion.path
	                d="M 70 35 L 66 35"
                stroke="rgba(6, 182, 212, 0.22)"
                strokeWidth="0.6"
	                strokeDasharray="1.5 1.5"
	                initial={{ pathLength: shouldReduce ? 1 : 0 }}
	                whileInView={{ pathLength: 1 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.45, delay: 0.85, ease: "easeOut" }}
	              />
	              <motion.path
	                d="M 70 66 L 62.5 66"
                stroke="rgba(16, 185, 129, 0.22)"
                strokeWidth="0.6"
	                strokeDasharray="1.5 1.5"
	                initial={{ pathLength: shouldReduce ? 1 : 0 }}
	                whileInView={{ pathLength: 1 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.45, delay: 0.95, ease: "easeOut" }}
	              />
	            </svg>
	          </motion.div>

          {/* ================= COLUMN 1: SUPPORT NODES (RIGHT) ================= */}
	          <motion.div variants={item} className="col-span-2 flex flex-col justify-start z-10 relative pt-12 lg:-ml-35 transition-all duration-300">
            <div className="flex flex-col justify-between h-[380px] relative">

              {/* Node 1: Before Opportunities */}
              <div className="relative flex items-center justify-end">
	                <motion.div
	                  layout
	                  className={cn(
                    "px-2.5 py-1.5 rounded-full border cursor-pointer flex items-center gap-1 transition-all duration-300 select-none z-30",
                    hoveredSection === 'before'
                      ? "border-cyan-400 bg-cyan-950/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                  )}
                  onMouseEnter={() => handleMouseEnter('before')}
	                  onMouseLeave={handleMouseLeave}
	                  whileHover={shouldReduce ? {} : { y: -1 }}
	                >
	                  {hoveredSection === 'before' && (
	                    <motion.span layoutId="pipeline-node-glow" className="absolute inset-0 rounded-full bg-cyan-400/10" transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 32 }} />
	                  )}
	                  <Target className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="text-[9px] font-black">قبل الفرص</span>
	                </motion.div>

                {/* Hover Popover */}
                <AnimatePresence>
                  {hoveredSection === 'before' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: 5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 5 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => handleMouseEnter('before')}
                      onMouseLeave={handleMouseLeave}
                      className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-[185px] p-3 rounded-2xl border border-cyan-500/12 bg-[#04080f]/96 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.7)] z-40 text-right pointer-events-auto"
                    >
                      <h4 className="text-[10px] font-black text-cyan-400 mb-0.5">قبل الفرص</h4>
                      <h5 className="text-[10.5px] font-black text-white mb-1.5 leading-tight">تجهيز السوق والبيانات والاستهداف</h5>
                      <div className="h-[1px] bg-slate-900/80 my-1.5" />
                      <ul className="space-y-1 text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-cyan-400/80 shrink-0 select-none">•</span>
                          <span>تجهيز البيانات وملفات الحسابات</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-cyan-400/80 shrink-0 select-none">•</span>
                          <span>تحديد صناع القرار والتأثير</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-cyan-400/80 shrink-0 select-none">•</span>
                          <span>تجهيز الرسائل وقنوات التواصل</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Node 2: During Opportunities */}
              <div className="relative flex items-center justify-end">
	                <motion.div
	                  layout
                  className={cn(
                    "px-2.5 py-1.5 rounded-full border cursor-pointer flex items-center gap-1 transition-all duration-300 select-none z-30",
                    hoveredSection === 'during'
                      ? "border-cyan-400 bg-cyan-950/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                  )}
                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  whileHover={shouldReduce ? {} : { y: -1 }}
	                >
	                  {hoveredSection === 'during' && (
	                    <motion.span layoutId="pipeline-node-glow" className="absolute inset-0 rounded-full bg-cyan-400/10" transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 32 }} />
	                  )}
	                  <TrendingUp className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="text-[9px] font-black">أثناء الفرص</span>
	                </motion.div>

                {/* Hover Popover */}
                <AnimatePresence>
                  {hoveredSection === 'during' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: 5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 5 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => handleMouseEnter('during')}
                      onMouseLeave={handleMouseLeave}
                      className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-[185px] p-3 rounded-2xl border border-cyan-500/12 bg-[#04080f]/96 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.7)] z-40 text-right pointer-events-auto"
                    >
                      <h4 className="text-[10px] font-black text-cyan-400 mb-0.5">أثناء الفرص</h4>
                      <h5 className="text-[10.5px] font-black text-white mb-1.5 leading-tight">دعم التحريك والمتابعة والتحويل</h5>
                      <div className="h-[1px] bg-slate-900/80 my-1.5" />
                      <ul className="space-y-1 text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-cyan-400/80 shrink-0 select-none">•</span>
                          <span>فتح قنوات تواصل وبناء الاهتمام</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-cyan-400/80 shrink-0 select-none">•</span>
                          <span>دعم الردود لزيادة الاستجابة</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-cyan-400/80 shrink-0 select-none">•</span>
                          <span>تأهيل وتوجيه الخطوة التالية</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Node 3: After Opportunities */}
              <div className="relative flex items-center justify-end">
	                <motion.div
	                  layout
                  className={cn(
                    "px-2.5 py-1.5 rounded-full border cursor-pointer flex items-center gap-1 transition-all duration-300 select-none z-30",
                    hoveredSection === 'after'
                      ? "border-emerald-400 bg-emerald-950/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                  )}
                  onMouseEnter={() => handleMouseEnter('after')}
	                  onMouseLeave={handleMouseLeave}
	                  whileHover={shouldReduce ? {} : { y: -1 }}
	                >
	                  {hoveredSection === 'after' && (
	                    <motion.span layoutId="pipeline-node-glow" className="absolute inset-0 rounded-full bg-emerald-400/10" transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 32 }} />
	                  )}
	                  <RefreshCw className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-[9px] font-black">بعد الفرص</span>
	                </motion.div>

                {/* Hover Popover */}
                <AnimatePresence>
                  {hoveredSection === 'after' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: 5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 5 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => handleMouseEnter('after')}
                      onMouseLeave={handleMouseLeave}
                      className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-[185px] p-3 rounded-2xl border border-emerald-500/12 bg-[#020805]/96 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.7)] z-40 text-right pointer-events-auto"
                    >
                      <h4 className="text-[10px] font-black text-emerald-400 mb-0.5">بعد الفرص</h4>
                      <h5 className="text-[10.5px] font-black text-white mb-1.5 leading-tight">تحليل الأداء والتحسين المستمر</h5>
                      <div className="h-[1px] bg-slate-900/80 my-1.5" />
                      <ul className="space-y-1 text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-400/80 shrink-0 select-none">•</span>
                          <span>تحليل الأداء وأسباب التعثر</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-400/80 shrink-0 select-none">•</span>
                          <span>تطوير الرسائل والتعامل مع الاعتراضات</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-400/80 shrink-0 select-none">•</span>
                          <span>تدريب وتحسين مستمر لأداء الفريق</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
	              </div>

	            </div>
	          </motion.div>

          {/* ================= COLUMN 2: THE ENLARGED FUNNEL (CENTER) ================= */}
	          <motion.div variants={item} className="col-span-6 flex flex-col items-center justify-start z-10 px-1 relative">

            {/* Top Monafsat node as a source (Positioned to the right of funnel center) */}
	            <motion.div variants={item} className="absolute top-[-22px] left-[72%] -translate-x-1/2 z-20">
              <div className="px-2 py-0.5 rounded-full border border-emerald-500/20 bg-[#030906]/98 flex items-center gap-1 shadow-sm text-center transition-all duration-300 hover:border-emerald-500/40 select-none">
                <ClipboardList className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="text-[8.5px] font-black text-emerald-100 whitespace-nowrap">كادر فرص منافسات المباشرة</span>
	              </div>
	            </motion.div>

            {/* Funnel Container Box */}
	            <motion.div
	              initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.985 }}
	              whileInView={{ opacity: 1, scale: 1 }}
	              viewport={{ once: true, amount: 0.25 }}
	              transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
	              className="relative w-full h-[520px] select-none"
              onMouseLeave={handleMouseLeave}
            >

              {/* 3D Funnel SVG Drawing (Enlarged by 30%) */}
	              <motion.svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 460 530" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Glowing vertical gradient for the glass funnel faces */}
                  <linearGradient id="funnel-top-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.30" />
                  </linearGradient>
                  <linearGradient id="funnel-top-inactive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.10" />
                  </linearGradient>
                  <linearGradient id="funnel-grad-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.22" />
                  </linearGradient>
                  <linearGradient id="funnel-grad-inactive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.06" />
                  </linearGradient>
                  <linearGradient id="funnel-emerald-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.22" />
                  </linearGradient>

                  <radialGradient id="rim-glow-cyan" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* --- SEGMENT 1: حصيلة الفرص --- */}
	                <motion.ellipse
                  cx="230" cy="40" rx="190" ry="32"
                  fill="url(#rim-glow-cyan)" fillOpacity="0.25"
                  stroke={hoveredSection === 'before' ? "#22d3ee" : "rgba(6, 182, 212, 0.65)"}
                  strokeWidth={hoveredSection === 'before' ? 3.5 : 2.5}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('before')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.75, delay: 0.32, ease: "easeOut" }}
	                />
	                <motion.path
                  d="M 40 40 A 190 32 0 0 0 420 40 L 390 105 A 160 27 0 0 1 70 105 Z"
                  fill={hoveredSection === 'before' ? "url(#funnel-top-active)" : "url(#funnel-top-inactive)"}
                  stroke={hoveredSection === 'before' ? "#22d3ee" : "rgba(6, 182, 212, 0.5)"}
                  strokeWidth={hoveredSection === 'before' ? 2.5 : 2.0}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('before')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.75, delay: 0.38, ease: "easeOut" }}
	                />

                {/* --- SEGMENT 2: فرص جاهزة للتحريك --- */}
	                <motion.ellipse
                  cx="230" cy="105" rx="160" ry="27"
                  fill="none"
                  stroke={hoveredSection === 'during' ? "#22d3ee" : "rgba(6, 182, 212, 0.45)"}
                  strokeWidth={hoveredSection === 'during' ? 2.8 : 2.0}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.65, delay: 0.48, ease: "easeOut" }}
	                />
	                <motion.path
                  d="M 70 105 A 160 27 0 0 0 390 105 L 360 170 A 130 22 0 0 1 100 170 Z"
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"}
                  stroke={hoveredSection === 'during' ? "#22d3ee" : "rgba(6, 182, 212, 0.35)"}
                  strokeWidth="2.0"
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.65, delay: 0.54, ease: "easeOut" }}
	                />

                {/* --- SEGMENT 3: اجتماعات مؤهلة --- */}
	                <motion.ellipse
                  cx="230" cy="170" rx="130" ry="22"
                  fill="none"
                  stroke={hoveredSection === 'during' ? "#22d3ee" : "rgba(6, 182, 212, 0.45)"}
                  strokeWidth={hoveredSection === 'during' ? 2.8 : 2.0}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
	                />
	                <motion.path
                  d="M 100 170 A 130 22 0 0 0 360 170 L 335 235 A 105 18 0 0 1 125 235 Z"
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"}
                  stroke={hoveredSection === 'during' ? "#22d3ee" : "rgba(6, 182, 212, 0.35)"}
                  strokeWidth="2.0"
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.6, delay: 0.66, ease: "easeOut" }}
	                />

                {/* --- SEGMENT 4: عروض سعر --- */}
	                <motion.ellipse
	                  cx="230" cy="235" rx="105" ry="18"
                  fill="none"
                  stroke={hoveredSection === 'during' ? "#22d3ee" : "rgba(6, 182, 212, 0.45)"}
                  strokeWidth={hoveredSection === 'during' ? 2.8 : 2.0}
	                  className="pointer-events-auto cursor-pointer"
	                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.55, delay: 0.72, ease: "easeOut" }}
	                />
	                <motion.path
	                  d="M 125 235 A 105 18 0 0 0 335 235 L 315 300 A 85 15 0 0 1 145 300 Z"
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"}
                  stroke={hoveredSection === 'during' ? "#22d3ee" : "rgba(6, 182, 212, 0.35)"}
                  strokeWidth="2.0"
	                  className="pointer-events-auto cursor-pointer"
	                  onMouseEnter={() => handleMouseEnter('during')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.55, delay: 0.78, ease: "easeOut" }}
	                />

                {/* --- SEGMENT 5: تفاوض --- */}
	                <motion.ellipse
	                  cx="230" cy="300" rx="85" ry="15"
                  fill="none"
                  stroke={hoveredSection === 'after' ? "#34d399" : "rgba(16, 185, 129, 0.45)"}
                  strokeWidth={hoveredSection === 'after' ? 2.8 : 2.0}
	                  className="pointer-events-auto cursor-pointer"
	                  onMouseEnter={() => handleMouseEnter('after')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.5, delay: 0.84, ease: "easeOut" }}
	                />
	                <motion.path
	                  d="M 145 300 A 85 15 0 0 0 315 300 L 298 365 A 68 12 0 0 1 162 365 Z"
                  fill={hoveredSection === 'after' ? "url(#funnel-emerald-active)" : "url(#funnel-grad-inactive)"}
                  stroke={hoveredSection === 'after' ? "#34d399" : "rgba(16, 185, 129, 0.35)"}
                  strokeWidth="2.0"
	                  className="pointer-events-auto cursor-pointer"
	                  onMouseEnter={() => handleMouseEnter('after')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
	                />

                {/* --- SEGMENT 6: صفقات --- */}
	                <motion.ellipse
	                  cx="230" cy="365" rx="68" ry="12"
                  fill="none"
                  stroke={hoveredSection === 'after' ? "#34d399" : "rgba(16, 185, 129, 0.45)"}
                  strokeWidth={hoveredSection === 'after' ? 2.8 : 2.0}
	                  className="pointer-events-auto cursor-pointer"
	                  onMouseEnter={() => handleMouseEnter('after')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.45, delay: 0.96, ease: "easeOut" }}
	                />
	                <motion.path
	                  d="M 162 365 A 68 12 0 0 0 298 365 L 282 430 A 52 9 0 0 1 178 430 Z"
                  fill={hoveredSection === 'after' ? "url(#funnel-emerald-active)" : "url(#funnel-grad-inactive)"}
                  stroke={hoveredSection === 'after' ? "#34d399" : "rgba(16, 185, 129, 0.35)"}
                  strokeWidth="2.0"
	                  className="pointer-events-auto cursor-pointer"
	                  onMouseEnter={() => handleMouseEnter('after')}
	                  onMouseLeave={handleMouseLeave}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.45, delay: 1.02, ease: "easeOut" }}
	                />

	                {/* Bottom opening ellipse */}
	                <motion.ellipse
	                  cx="230"
	                  cy="430"
	                  rx="52"
	                  ry="9"
	                  fill="none"
	                  stroke={hoveredSection === 'after' ? "#34d399" : "rgba(16, 185, 129, 0.3)"}
	                  strokeWidth={1}
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.4, delay: 1.08, ease: "easeOut" }}
	                />

                {/* Connector line down to target */}
	                <motion.path
	                  d="M 230 439 L 230 452"
                  stroke="rgba(245, 158, 11, 0.35)"
	                  strokeWidth="1.2"
	                  strokeDasharray="2 2"
	                  initial={{ pathLength: shouldReduce ? 1 : 0, opacity: shouldReduce ? 1 : 0 }}
	                  whileInView={{ pathLength: 1, opacity: 1 }}
	                  viewport={{ once: true }}
	                  transition={{ duration: 0.35, delay: 1.12, ease: "easeOut" }}
	                />
              </motion.svg>

              {/* Absolute HTML Overlays for Text & Icons inside Funnel segments */}
              {/* 1. حصيلة الفرص (نقطة التلاقي) */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.32, delay: 0.95 }}
	                className="absolute top-[44px] left-1/2 -translate-x-1/2 w-[280px] h-[55px] flex flex-col items-center justify-center text-center cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter('before')}
                onMouseLeave={handleMouseLeave}
	              >
	                <div className="text-[9.5px] font-black text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/35 mb-1.5 select-none uppercase tracking-widest shadow-[0_0_12px_rgba(6,182,212,0.15)]">
	                  نقطة التلاقي
	                </div>
	                <div className="flex items-center gap-1.5 justify-center">
	                  <Filter className="w-5 h-5 text-cyan-300 shrink-0 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
	                  <span className="text-[18px] md:text-[20px] font-black text-white select-none tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">حصيلة الفرص</span>
	                </div>
	                <span className="text-[11px] font-extrabold text-slate-200 select-none mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">محادثات مؤهلة + فرص مباشرة</span>
	              </motion.div>

              {/* 2. فرص جاهزة للتحريك */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.28, delay: 1.02 }}
	                className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[200px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter('during')}
                onMouseLeave={handleMouseLeave}
              >
                <Target className="w-4.5 h-4.5 text-cyan-400 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span className="text-[16px] font-black text-white select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">فرص جاهزة للتحريك</span>
	              </motion.div>

              {/* 3. اجتماعات مؤهلة */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.28, delay: 1.08 }}
	                className="absolute top-[185px] left-1/2 -translate-x-1/2 w-[160px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter('during')}
                onMouseLeave={handleMouseLeave}
              >
                <Users className="w-4.5 h-4.5 text-cyan-400 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span className="text-[15.5px] font-black text-white select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">اجتماعات مؤهلة</span>
	              </motion.div>

              {/* 4. عروض سعر */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.28, delay: 1.14 }}
	                className="absolute top-[250px] left-1/2 -translate-x-1/2 w-[130px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter('during')}
                onMouseLeave={handleMouseLeave}
              >
                <FileText className="w-4.5 h-4.5 text-cyan-400 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span className="text-[15.5px] font-black text-white select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">عروض سعر</span>
	              </motion.div>

              {/* 5. تفاوض */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.28, delay: 1.2 }}
	                className="absolute top-[315px] left-1/2 -translate-x-1/2 w-[110px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter('after')}
                onMouseLeave={handleMouseLeave}
              >
                <Handshake className="w-4.5 h-4.5 text-emerald-400 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span className="text-[15.5px] font-black text-emerald-50 select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">تفاوض</span>
	              </motion.div>

              {/* 6. صفقات */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.28, delay: 1.26 }}
	                className="absolute top-[380px] left-1/2 -translate-x-1/2 w-[90px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter('after')}
                onMouseLeave={handleMouseLeave}
              >
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span className="text-[15.5px] font-black text-emerald-50 select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">صفقات</span>
	              </motion.div>

              {/* Bottom Target Card (Connected to funnel bottom) */}
	              <motion.div
	                initial={{ opacity: 0, y: shouldReduce ? 0 : 10 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                viewport={{ once: true }}
	                transition={{ duration: 0.3, delay: 1.34 }}
	                className="absolute top-[452px] left-1/2 -translate-x-1/2 w-full max-w-[220px] z-20"
	              >
	                <motion.div
	                  whileHover={shouldReduce ? {} : { y: -2 }}
	                  className={cn(
                    "px-3 py-2 rounded-xl border text-center transition-all duration-300 bg-[#07070a]/95 backdrop-blur-sm flex items-center justify-center gap-2",
                    hoveredSection === 'after'
                      ? "border-amber-500/40 bg-[#141008]/85 shadow-[0_0_12px_rgba(245,158,11,0.12)] scale-[1.01]"
                      : "border-slate-900 bg-slate-950/60"
                  )}
                  onMouseEnter={() => handleMouseEnter('after')}
                  onMouseLeave={handleMouseLeave}
	                >
                  <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-right">
                    <div className="text-[8.5px] text-slate-400 font-extrabold leading-none uppercase tracking-wider">
                      المستهدف خلال 90 يوم
                    </div>
	                    <div className="text-xs font-black text-amber-400 leading-normal mt-0.5">
	                      1,000,000 ريال
	                    </div>
	                  </div>
	                </motion.div>
	              </motion.div>

            </motion.div>

          </motion.div>

          {/* ================= COLUMN 3: CLIENT'S SALES REPRESENTATIVE (LEFT) ================= */}
	          <motion.div
	            variants={{
	              hidden: { opacity: 0, x: shouldReduce ? 0 : -18 },
	              visible: { opacity: 1, x: 0, transition: { duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] } },
	            }}
	            className="col-span-4 flex flex-col justify-center items-center z-10 pl-4 relative select-none"
	          >
            {/* Soft ambient back glows for the person (dim Cyan/Teal, very soft) */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/[0.12] blur-[120px] pointer-events-none" />
            <div className="absolute top-[48%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-teal-500/[0.06] blur-[80px] pointer-events-none" />

            <div className="relative w-full max-w-[360px] h-[520px] flex items-center justify-center select-none lg:-mr-32 transition-all duration-300">
              <img
                src="/saudi_sales_rep.png"
                alt="مسؤول مبيعات العميل"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_40px_rgba(6,182,212,0.06)] select-none pointer-events-none"
	              />
	              {/* Soft bottom fade to merge the cutout organically with the background */}
	              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080F] via-[#04080F]/90 via-[#04080F]/30 to-transparent z-20 pointer-events-none" />
	            </div>
	          </motion.div>

        </motion.div>

        {/* ======================================================== */}
        {/* ================= MOBILE LAYOUT (RTL) ================== */}
        {/* ======================================================== */}
        <div className="lg:hidden flex flex-col gap-6 max-w-md mx-auto text-right z-10 relative" dir="rtl">

          {/* 1. Saudi Sales Representative cutout (Top mobile) */}
          <div className="relative w-full max-w-[200px] mx-auto h-[280px] flex items-end justify-center select-none overflow-visible mb-2">
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-cyan-500/[0.03] blur-[40px] pointer-events-none" />
            <img
              src="/saudi_sales_rep.png"
              alt="مسؤول مبيعات العميل"
              className="w-full h-full object-contain relative z-10 select-none pointer-events-none"
            />
          </div>

          {/* 2. Source Node: كادر فرص منافسات المباشرة */}
          <div className="flex justify-center">
            <div className="px-3 py-1 rounded-full border border-emerald-500/20 bg-slate-950/90 flex items-center gap-1.5 shadow-sm text-center">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-black text-white whitespace-nowrap">كادر فرص منافسات المباشرة</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-3">
            <ArrowDown className="w-3 h-3 text-slate-800" />
          </div>

          {/* 3. Central Meeting Point */}
          <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#061017] text-center">
            <div className="text-[9px] font-black text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full inline-block mb-1 border border-cyan-500/10">
              نقطة التلاقي
            </div>
            <h3 className="text-xs font-black text-white mb-0.5 flex items-center justify-center gap-1.5">
              <Filter className="w-4 h-4 text-cyan-400" />
              حصيلة الفرص
            </h3>
            <p className="text-[9.5px] text-slate-300 font-extrabold mt-1">محادثات مؤهلة + فرص مباشرة</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="w-4 h-4 text-slate-800" />
          </div>

          {/* 4. Vertical Stepper */}
          <div className="space-y-3 relative before:absolute before:right-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900/60 z-0">
            {[
              { id: "m-ready", label: "فرص جاهزة للتحريك", color: "border-cyan-500/10 text-cyan-200", icon: Target },
              { id: "m-meetings", label: "اجتماعات مؤهلة", color: "border-cyan-500/10 text-cyan-200", icon: Users },
              { id: "m-offers", label: "عروض سعر", color: "border-cyan-500/10 text-cyan-200", icon: FileText },
              { id: "m-negotiate", label: "تفاوض", color: "border-emerald-500/10 text-emerald-200", icon: Handshake },
              { id: "m-deals", label: "صفقات", color: "border-emerald-500/10 text-emerald-200", icon: CheckCircle }
            ].map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <div key={stage.id} className="flex items-center gap-4 relative z-10 pr-2">
                  {/* Bullet node */}
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                    {idx + 1}
                  </div>
                  <div className={cn("flex-1 py-2.5 px-4 rounded-xl border bg-gradient-to-b from-slate-950/60 to-slate-950/20 text-xs font-black flex items-center gap-2", stage.color)}>
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    {stage.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="w-4 h-4 text-slate-800" />
          </div>

          {/* 5. Target Card (Mobile) */}
          <div className="px-4 py-3 rounded-xl border border-amber-500/20 bg-[#141008]/80 text-center flex items-center justify-center gap-2.5 max-w-[240px] mx-auto">
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-extrabold leading-none uppercase tracking-wider">
                المستهدف خلال 90 يوم
              </div>
              <div className="text-xs font-black text-amber-400 leading-normal mt-0.5">
                1,000,000 ريال
              </div>
            </div>
          </div>

          {/* 6. Growth Team Nodes (Mobile Accordions) */}
          <div className="space-y-3 border-t border-slate-900 pt-6 mt-4">
            <h4 className="text-[11px] font-black text-slate-500 mb-3 select-none">مراحل دعم النمو:</h4>
            {[
              {
                id: "before",
                label: "قبل الفرص",
                sub: "تجهيز السوق والبيانات والاستهداف",
                icon: Target,
                color: "border-cyan-500/20 text-cyan-300 bg-[#060b12]/60",
                bullets: [
                  "تجهيز البيانات والملفات الخاصة بالحسابات المستهدفة",
                  "تحديد الحسابات وصناع القرار وصناع التأثير",
                  "تجهيز الرسائل المخصصة وقنوات التواصل الفعالة"
                ]
              },
              {
                id: "during",
                label: "أثناء الفرص",
                sub: "دعم التحريك والمتابعة والتحويل",
                icon: TrendingUp,
                color: "border-cyan-500/20 text-cyan-300 bg-[#060b12]/60",
                bullets: [
                  "فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام",
                  "دعم الردود والمحادثات لضمان أعلى نسبة استجابة",
                  "تأهيل وتوجيه الخطوة التالية لبناء الزخم البيعي"
                ]
              },
              {
                id: "after",
                label: "بعد الفرص",
                sub: "تحليل الأداء والتحسين المستمر",
                icon: RefreshCw,
                color: "border-emerald-500/20 text-emerald-300 bg-[#030d09]/60",
                bullets: [
                  "تحليل الأداء والوقوف على أسباب تعثر الصفقات",
                  "تطوير الرسائل والتعامل مع الاعتراضات الشائعة",
                  "تدريب وتحسين مستمر لأداء الفريق بشكل أسبوعي"
                ]
              }
            ].map((node) => {
              const NodeIcon = node.icon;
              const isOpen = activeMobileSection === node.id;
              return (
                <div key={node.id} className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/20">
                  <button
                    onClick={() => toggleMobileSection(node.id)}
                    className={cn(
                      "w-full py-3 px-4 flex items-center justify-between text-right transition-all duration-300",
                      isOpen ? "bg-slate-900/40" : "hover:bg-slate-900/20"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn("p-1.5 rounded-lg border", isOpen ? "bg-cyan-500/10 border-cyan-500/25" : "bg-slate-950 border-slate-800")}>
                        <NodeIcon className={cn("w-4 h-4", isOpen ? "text-cyan-400" : "text-slate-400")} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block">{node.label}</span>
                        <span className="text-[9.5px] text-slate-400 font-bold block mt-0.5">{node.sub}</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className={cn("p-4 border-t border-slate-900/60", node.color)}>
                          <ul className="space-y-1.5 text-[10px] text-slate-300 font-extrabold leading-relaxed">
                            {node.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1.5">
                                <span className="text-cyan-400 shrink-0">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* ==================== FOOTER GRID ======================= */}
        {/* ======================================================== */}
	        <motion.div
	          variants={container}
	          initial="hidden"
	          whileInView="visible"
	          viewport={{ once: true, amount: 0.2 }}
	          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right border-t border-slate-900 pt-8"
	          dir="rtl"
	        >

	          {/* Item 1 */}
	          <motion.div variants={item} whileHover={shouldReduce ? {} : { y: -2 }} className="group flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
	            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
	              <Sparkles className="w-5 h-5" />
	            </div>
            <div>
              <h4 className="text-xs font-black text-white">تقنية ذكية</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">ذكاء اصطناعي وبيانات موثوقة</p>
            </div>
	          </motion.div>

	          {/* Item 2 */}
	          <motion.div variants={item} whileHover={shouldReduce ? {} : { y: -2 }} className="group flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
	            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
              {/* Palm tree SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 fill-none stroke-current" strokeWidth="2">
                <path d="M12 22V12M12 12c-2-2-5-1-6-3M12 12c2-2 5-1 6-3M12 12c0-3-2-6-5-7M12 12c0-3 2-6 5-7" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-black text-white">للسوق السعودي</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">مصمم للسوق المحلي</p>
            </div>
	          </motion.div>

	          {/* Item 3 */}
	          <motion.div variants={item} whileHover={shouldReduce ? {} : { y: -2 }} className="group flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">نتائج حقيقية</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">تنعكس على الإيرادات</p>
            </div>
	          </motion.div>

	          {/* Item 4 */}
	          <motion.div variants={item} whileHover={shouldReduce ? {} : { y: -2 }} className="group flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">تنمية أعمالك B2B</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">بفرص ذات جودة أعلى</p>
            </div>
	          </motion.div>

	        </motion.div>

        {/* Bottom original role banner card */}
	        <motion.div variants={item} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-10 bg-gradient-to-br from-slate-950/80 to-slate-900/20 border border-slate-900 rounded-3xl p-6 md:p-8 text-right relative overflow-hidden">
	          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500/40 via-emerald-500/40 to-transparent" />

	          <div className="flex items-center gap-2.5 mb-4 select-none">
	            <Award className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-lg font-black text-white">دورنا: قيادة نمو كاملة حول فريقك</h3>
	        </div>

          <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6 font-bold max-w-4xl">
            لسنا شركة تدريب فقط، ولا بيع عملاء محتملين فقط، ولا حجز اجتماعات فقط. نحن نبني ونقود منظومة تشغيل تجمع بين الاستشارات، التدريب، القيادة، المتابعة، التطوير، الأتمتة، الذكاء الاصطناعي، وفرص منافسات المباشرة.
          </p>
        </motion.div>

      </div>
    </motion.section>
  );
};
