import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export const DualStreamPipelineSection = () => {
  // Synchronized hover section state ('before' | 'during' | 'after' | null)
  const [hoveredSection, setHoveredSection] = React.useState<'before' | 'during' | 'after' | null>(null);
  
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
    <section 
      className="py-20 bg-[#04080F] border-t border-slate-900/60 relative overflow-hidden" 
      id="dual-stream-pipeline"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-950/5 rounded-full blur-[140px] pointer-events-none select-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
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
        </div>

        {/* ======================================================== */}
        {/* ================= DESKTOP LAYOUT (RTL) ================= */}
        {/* ======================================================== */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-stretch relative text-right z-10" dir="rtl">
          
          {/* SVG Connector Overlay Behind Columns */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              {/* Connector lines from Left (Support Nodes) to Center (Funnel stages) */}
              {/* 1. Before Opportunities -> Funnel Top (x=28 to x=45, y=20) */}
              <path 
                d="M 28 20 L 45 20" 
                stroke={hoveredSection === 'before' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                strokeWidth={hoveredSection === 'before' ? 2 : 1}
                strokeDasharray="4 4" 
                className="transition-all duration-300"
              />
              {/* 2. During Opportunities -> Funnel Middle (x=28 to x=47, y=50) */}
              <path 
                d="M 28 50 L 47 50" 
                stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                strokeWidth={hoveredSection === 'during' ? 2 : 1}
                strokeDasharray="4 4" 
                className="transition-all duration-300"
              />
              {/* 3. After Opportunities -> Funnel Bottom (x=28 to x=48, y=78) */}
              <path 
                d="M 28 80 L 48 80" 
                stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.15)"} 
                strokeWidth={hoveredSection === 'after' ? 2 : 1}
                strokeDasharray="4 4" 
                className="transition-all duration-300"
              />

              {/* Connecting line from Sales Rep on the right (x=72) to Funnel Top (x=55) */}
              <path 
                d="M 72 40 Q 64 25, 55 18" 
                stroke="rgba(6, 182, 212, 0.25)" 
                strokeWidth={hoveredSection ? 1.6 : 1.2} 
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />

              {/* Flow particles from Support Nodes into Funnel */}
              <circle r="1.8" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 28 20 L 45 20" />
              </circle>
              <circle r="1.8" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 28 50 L 47 50" />
              </circle>
              <circle r="1.8" fill="#10b981" filter="drop-shadow(0 0 2px #10b981)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 28 80 L 48 80" />
              </circle>
              <circle r="1.8" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 72 40 Q 64 25, 55 18" />
              </circle>
              
              {/* Connector from Monafsat node (top-right of funnel) into funnel top rim */}
              <path 
                d="M 42 10 C 44 14, 45 15, 47 17" 
                stroke="rgba(16, 185, 129, 0.25)" 
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle r="1.5" fill="#10b981">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 42 10 C 44 14, 45 15, 47 17" />
              </circle>
            </svg>
          </div>

          {/* ================= COLUMN 1: CLIENT'S SALES REPRESENTATIVE (RIGHT) ================= */}
          <div className="col-span-4 flex flex-col justify-start z-10 pr-4">
            <div className="flex flex-col h-[560px] justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-2 select-none">
                  <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-white">مسؤول مبيعات العميل</h3>
                </div>

                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-1">
                  يبدأ من فرص أجهز، مدعومة بالبيانات والسياق، ويتحرك بها نحو الاجتماعات والعروض والصفقات.
                </p>
                <span className="text-[9px] font-black text-cyan-400 tracking-wider">
                  هذا القمع يعمل لصالح مسؤول المبيعات
                </span>
              </div>

              {/* Saudi Business Professional - Transparent Cutout standing tall next to funnel */}
              <div className="relative w-full max-w-[280px] mx-auto h-[460px] flex items-end justify-center overflow-visible select-none">
                {/* Circular neon backdrop glow behind the person (no box container) */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-gradient-to-br from-cyan-500/10 via-cyan-950/20 to-transparent blur-[50px] z-0 pointer-events-none" />
                
                {/* Standing illustration - transparent background, direct integration into site */}
                <img 
                  src="/saudi_sales_rep.png" 
                  alt="مسؤول مبيعات العميل" 
                  className="w-full h-[95%] object-contain relative z-10 drop-shadow-[0_0_20px_rgba(6,182,212,0.18)] select-none pointer-events-none transition-all duration-300"
                />
              </div>

            </div>
          </div>

          {/* ================= COLUMN 2: THE ENLARGED FUNNEL (CENTER) ================= */}
          <div className="col-span-5 flex flex-col items-center justify-start z-10 px-1 relative">
            
            {/* Top Left/Center Monafsat node as a source */}
            <div className="absolute top-[-30px] right-[52%] z-20">
              <div 
                className={cn(
                  "px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300 cursor-default bg-slate-950/80 shadow-md",
                  hoveredSection === 'before' 
                    ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)] scale-[1.02]" 
                    : "border-slate-800"
                )}
                onMouseEnter={() => setHoveredSection('before')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <ClipboardList className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-black text-white whitespace-nowrap">كادر فرص منافسات المباشرة</span>
              </div>
              
              {/* Tooltip for Monafsat */}
              <AnimatePresence>
                {hoveredSection === 'before' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-[-50px] right-0 translate-x-[15%] w-[200px] p-2 rounded-xl border border-emerald-500/20 bg-[#030d09]/95 backdrop-blur-sm text-right z-30 shadow-lg pointer-events-none"
                  >
                    <p className="text-[9px] font-bold text-emerald-300 leading-relaxed">
                      يرصد فرصًا مباشرة من السوق ويضيفها إلى حصيلة الفرص.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Funnel Container Box */}
            <div className="relative w-full h-[520px] select-none">
              
              {/* 3D Funnel SVG Drawing (Enlarged by 30%) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 460 530" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Glowing vertical gradient for the glass funnel faces */}
                  <linearGradient id="funnel-grad-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="funnel-grad-inactive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="funnel-emerald-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>

                  <radialGradient id="rim-glow-cyan" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* --- SEGMENT 1: حصيلة الفرص --- */}
                <ellipse cx="230" cy="40" rx="190" ry="32" fill="url(#rim-glow-cyan)" fillOpacity="0.1" stroke={hoveredSection === 'before' ? "#06b6d4" : "rgba(6, 182, 212, 0.2)"} strokeWidth={hoveredSection === 'before' ? 1.8 : 1.2} />
                <path 
                  d="M 40 40 A 190 32 0 0 0 420 40 L 390 105 A 160 27 0 0 1 70 105 Z" 
                  fill={hoveredSection === 'before' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'before' ? "#06b6d4" : "rgba(6, 182, 212, 0.12)"} 
                  strokeWidth="1.2"
                />

                {/* --- SEGMENT 2: فرص جاهزة للتحريك --- */}
                <ellipse cx="230" cy="105" rx="160" ry="27" fill="none" stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} strokeWidth={hoveredSection === 'during' ? 1.5 : 1} />
                <path 
                  d="M 70 105 A 160 27 0 0 0 390 105 L 360 170 A 130 22 0 0 1 100 170 Z" 
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.12)"} 
                  strokeWidth="1.2"
                />

                {/* --- SEGMENT 3: اجتماعات مؤهلة --- */}
                <ellipse cx="230" cy="170" rx="130" ry="22" fill="none" stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} strokeWidth={hoveredSection === 'during' ? 1.5 : 1} />
                <path 
                  d="M 100 170 A 130 22 0 0 0 360 170 L 335 235 A 105 18 0 0 1 125 235 Z" 
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.12)"} 
                  strokeWidth="1.2"
                />

                {/* --- SEGMENT 4: عروض سعر --- */}
                <ellipse cx="230" cy="235" rx="105" ry="18" fill="none" stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} strokeWidth={hoveredSection === 'during' ? 1.5 : 1} />
                <path 
                  d="M 125 235 A 105 18 0 0 0 335 235 L 315 300 A 85 15 0 0 1 145 300 Z" 
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.12)"} 
                  strokeWidth="1.2"
                />

                {/* --- SEGMENT 5: تفاوض --- */}
                <ellipse cx="230" cy="300" rx="85" ry="15" fill="none" stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.15)"} strokeWidth={hoveredSection === 'after' ? 1.5 : 1} />
                <path 
                  d="M 145 300 A 85 15 0 0 0 315 300 L 298 365 A 68 12 0 0 1 162 365 Z" 
                  fill={hoveredSection === 'after' ? "url(#funnel-emerald-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.12)"} 
                  strokeWidth="1.2"
                />

                {/* --- SEGMENT 6: صفقات --- */}
                <ellipse cx="230" cy="365" rx="68" ry="12" fill="none" stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.15)"} strokeWidth={hoveredSection === 'after' ? 1.5 : 1} />
                <path 
                  d="M 162 365 A 68 12 0 0 0 298 365 L 282 430 A 52 9 0 0 1 178 430 Z" 
                  fill={hoveredSection === 'after' ? "url(#funnel-emerald-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.12)"} 
                  strokeWidth="1.2"
                />
                
                {/* Bottom opening ellipse */}
                <ellipse cx="230" cy="430" rx="52" ry="9" fill="none" stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.2)"} strokeWidth={1} />
                
                {/* Connector line down to target */}
                <path 
                  d="M 230 439 L 230 452" 
                  stroke="rgba(245, 158, 11, 0.3)" 
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
              </svg>

              {/* Absolute HTML Overlays for Text & Icons inside Funnel segments */}
              {/* 1. حصيلة الفرص (نقطة التلاقي) */}
              <div 
                className="absolute top-[48px] left-1/2 -translate-x-1/2 w-[280px] h-[50px] flex flex-col items-center justify-center text-center cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => setHoveredSection('before')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="text-[9px] font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/20 mb-0.5 select-none uppercase tracking-widest">
                  نقطة التلاقي
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-[12px] font-black text-white select-none">حصيلة الفرص</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 select-none mt-0.5">محادثات مؤهلة + فرص مباشرة</span>
              </div>

              {/* 2. فرص جاهزة للتحريك */}
              <div 
                className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[200px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => setHoveredSection('during')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[12px] font-black text-cyan-100 select-none">فرص جاهزة للتحريك</span>
              </div>

              {/* 3. اجتماعات مؤهلة */}
              <div 
                className="absolute top-[185px] left-1/2 -translate-x-1/2 w-[160px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => setHoveredSection('during')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-black text-cyan-100 select-none">اجتماعات مؤهلة</span>
              </div>

              {/* 4. عروض سعر */}
              <div 
                className="absolute top-[250px] left-1/2 -translate-x-1/2 w-[130px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => setHoveredSection('during')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-black text-cyan-100 select-none">عروض سعر</span>
              </div>

              {/* 5. تفاوض */}
              <div 
                className="absolute top-[315px] left-1/2 -translate-x-1/2 w-[110px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => setHoveredSection('after')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Handshake className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-black text-emerald-100 select-none">تفاوض</span>
              </div>

              {/* 6. صفقات */}
              <div 
                className="absolute top-[380px] left-1/2 -translate-x-1/2 w-[90px] h-[36px] flex items-center justify-center gap-1.5 cursor-default z-20 pointer-events-auto"
                onMouseEnter={() => setHoveredSection('after')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-black text-emerald-100 select-none">صفقات</span>
              </div>

              {/* Bottom Target Card (Connected to funnel bottom) */}
              <div className="absolute top-[455px] left-1/2 -translate-x-1/2 w-full max-w-[240px] z-20">
                <div 
                  className={cn(
                    "px-5 py-3 rounded-xl border text-center transition-all duration-300 bg-[#0a0a0d] flex items-center justify-center gap-3",
                    hoveredSection === 'after'
                      ? "border-amber-400 bg-[#141008] shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.02]"
                      : "border-slate-800"
                  )}
                  onMouseEnter={() => setHoveredSection('after')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 font-extrabold leading-none">
                      المستهدف البيعي
                    </div>
                    <div className="text-xs md:text-sm font-black text-amber-400 tracking-tight leading-normal mt-0.5">
                      1,000,000 ريال خلال 90 يوم
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ================= COLUMN 3: SUPPORT NODES (LEFT) ================= */}
          <div className="col-span-3 flex flex-col justify-start z-10 border-r border-slate-900/40 pr-6 relative">
            
            <div className="flex items-center gap-2 mb-8 select-none">
              <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-white">كادر فريق النمو الذكي</h3>
            </div>

            <div className="flex flex-col justify-between h-[420px] relative">
              
              {/* Node 1: Before Opportunities */}
              <div className="relative flex items-center justify-start">
                <div 
                  className={cn(
                    "px-4 py-2.5 rounded-full border cursor-pointer flex items-center gap-2.5 transition-all duration-300 select-none z-30",
                    hoveredSection === 'before'
                      ? "border-cyan-500/60 bg-[#07131a]/85 shadow-[0_0_12px_rgba(6,182,212,0.15)] scale-[1.03]"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                  )}
                  onMouseEnter={() => setHoveredSection('before')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <Target className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-black text-white">قبل الفرص</span>
                </div>
                
                {/* Hover Popover */}
                <AnimatePresence>
                  {hoveredSection === 'before' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute left-full ml-4 w-[280px] p-4 rounded-2xl border border-cyan-500/20 bg-[#060b12]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(6,182,212,0.15)] z-40 text-right"
                    >
                      <h4 className="text-xs font-black text-cyan-400 mb-1">قبل الفرص</h4>
                      <h5 className="text-[11px] font-black text-white mb-2.5 leading-normal">تجهيز السوق والبيانات والاستهداف</h5>
                      <div className="h-[1px] bg-slate-900/60 my-2" />
                      <ul className="space-y-1.5 text-[10px] text-slate-400 font-bold leading-relaxed">
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>تجهيز البيانات والملفات الخاصة بالحسابات المستهدفة</span>
                        </li>
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>تحديد الحسابات وصناع القرار وصناع التأثير</span>
                        </li>
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>تجهيز الرسائل المخصصة وقنوات التواصل الفعالة</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Node 2: During Opportunities */}
              <div className="relative flex items-center justify-start">
                <div 
                  className={cn(
                    "px-4 py-2.5 rounded-full border cursor-pointer flex items-center gap-2.5 transition-all duration-300 select-none z-30",
                    hoveredSection === 'during'
                      ? "border-cyan-500/60 bg-[#07131a]/85 shadow-[0_0_12px_rgba(6,182,212,0.15)] scale-[1.03]"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                  )}
                  onMouseEnter={() => setHoveredSection('during')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-black text-white">أثناء الفرص</span>
                </div>
                
                {/* Hover Popover */}
                <AnimatePresence>
                  {hoveredSection === 'during' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute left-full ml-4 w-[280px] p-4 rounded-2xl border border-cyan-500/20 bg-[#060b12]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(6,182,212,0.15)] z-40 text-right"
                    >
                      <h4 className="text-xs font-black text-cyan-400 mb-1">أثناء الفرص</h4>
                      <h5 className="text-[11px] font-black text-white mb-2.5 leading-normal">دعم التحريك والمتابعة والتحويل</h5>
                      <div className="h-[1px] bg-slate-900/60 my-2" />
                      <ul className="space-y-1.5 text-[10px] text-slate-400 font-bold leading-relaxed">
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام</span>
                        </li>
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>دعم الردود والمحادثات لضمان أعلى نسبة استجابة</span>
                        </li>
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>تأهيل وتوجيه الخطوة التالية لبناء الزخم البيعي</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Node 3: After Opportunities */}
              <div className="relative flex items-center justify-start">
                <div 
                  className={cn(
                    "px-4 py-2.5 rounded-full border cursor-pointer flex items-center gap-2.5 transition-all duration-300 select-none z-30",
                    hoveredSection === 'after'
                      ? "border-emerald-500/60 bg-[#051a11]/85 shadow-[0_0_12px_rgba(16,185,129,0.15)] scale-[1.03]"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                  )}
                  onMouseEnter={() => setHoveredSection('after')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-black text-white">بعد الفرص</span>
                </div>
                
                {/* Hover Popover */}
                <AnimatePresence>
                  {hoveredSection === 'after' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute left-full ml-4 w-[280px] p-4 rounded-2xl border border-emerald-500/20 bg-[#030d09]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(16,185,129,0.15)] z-40 text-right"
                    >
                      <h4 className="text-xs font-black text-emerald-400 mb-1">بعد الفرص</h4>
                      <h5 className="text-[11px] font-black text-white mb-2.5 leading-normal">تحليل الأداء والتحسين المستمر</h5>
                      <div className="h-[1px] bg-slate-900/60 my-2" />
                      <ul className="space-y-1.5 text-[10px] text-slate-400 font-bold leading-relaxed">
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>تحليل الأداء والوقوف على أسباب تعثر الصفقات</span>
                        </li>
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>تطوير الرسائل والتعامل مع الاعتراضات الشائعة</span>
                        </li>
                        <li className="flex items-start gap-1.5 justify-start">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>تدريب وتحسين مستمر لأداء الفريق بشكل أسبوعي</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ================= MOBILE LAYOUT (RTL) ================== */}
        {/* ======================================================== */}
        <div className="lg:hidden flex flex-col gap-6 max-w-md mx-auto text-right z-10 relative" dir="rtl">
          
          {/* 1. Client's Sales Representative (Top mobile) */}
          <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center gap-4">
            {/* Small Saudi avatar */}
            <div className="w-14 h-14 bg-[#0a0f18] rounded-xl border border-slate-800 shrink-0 overflow-hidden relative">
              <img 
                src="/saudi_sales_rep.png" 
                alt="مسؤول مبيعات العميل" 
                className="w-full h-full object-cover object-top relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent z-0" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white">مسؤول مبيعات العميل</h3>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-0.5">
                يبدأ من فرص أجهز، مدعومة بالبيانات والسياق، ويتحرك بها نحو الصفقات.
              </p>
              <span className="text-[9px] text-cyan-400 font-bold block mt-1">
                هذا القمع يعمل لصالح مسؤول المبيعات
              </span>
            </div>
          </div>

          {/* 2. Source Node: كادر فرص منافسات المباشرة */}
          <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 text-center">
            <ClipboardList className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <h4 className="text-[11px] font-black text-white">كادر فرص منافسات المباشرة</h4>
            <p className="text-[9px] text-slate-400 font-bold mt-1">
              يرصد فرصًا مباشرة من السوق ويضيفها إلى حصيلة الفرص.
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="w-4 h-4 text-slate-800" />
          </div>

          {/* 3. Central Meeting Point */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-[#07131a] text-center">
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
          <div className="p-4 rounded-xl border border-amber-500/20 bg-[#141008] text-center flex items-center justify-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-extrabold leading-none">
                المستهدف البيعي
              </div>
              <div className="text-sm font-black text-amber-400 mt-1">
                1,000,000 ريال خلال 90 يوم
              </div>
            </div>
          </div>

          {/* 6. Growth Team Nodes (Mobile Accordions) */}
          <div className="space-y-3 border-t border-slate-900 pt-6 mt-4">
            <h4 className="text-xs font-black text-slate-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              دعم كادر فريق النمو الذكي:
            </h4>
            
            {/* Node Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "before", label: "قبل الفرص", icon: Target },
                { id: "during", label: "أثناء الفرص", icon: TrendingUp },
                { id: "after", label: "بعد الفرص", icon: RefreshCw }
              ].map((btn) => {
                const BtnIcon = btn.icon;
                const isActive = activeMobileSection === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => toggleMobileSection(btn.id)}
                    className={cn(
                      "py-2 px-1 rounded-xl border text-[10px] font-black flex flex-col items-center gap-1.5 transition-all duration-300",
                      isActive 
                        ? btn.id === 'after'
                          ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
                          : "border-cyan-500/50 bg-cyan-950/20 text-cyan-300"
                        : "border-slate-900 bg-slate-950/40 text-slate-400"
                    )}
                  >
                    <BtnIcon className="w-3.5 h-3.5" />
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Accordion Content Box */}
            <AnimatePresence mode="wait">
              {activeMobileSection && (
                <motion.div
                  key={activeMobileSection}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className={cn(
                    "p-4 rounded-xl border mt-2 text-right",
                    activeMobileSection === 'after' 
                      ? "border-emerald-500/20 bg-[#030d09]/60" 
                      : "border-cyan-500/20 bg-[#060b12]/60"
                  )}>
                    {activeMobileSection === 'before' && (
                      <>
                        <h4 className="text-xs font-black text-cyan-400 mb-1">قبل الفرص</h4>
                        <p className="text-[10.5px] font-black text-white mb-2 leading-relaxed">تجهيز السوق والبيانات والاستهداف</p>
                        <div className="h-[1px] bg-slate-900/60 my-2" />
                        <ul className="space-y-1.5 text-[9.5px] text-slate-400 font-bold leading-relaxed">
                          <li>• تجهيز البيانات والملفات الخاصة بالحسابات المستهدفة</li>
                          <li>• تحديد الحسابات وصناع القرار وصناع التأثير</li>
                          <li>• تجهيز الرسائل المخصصة وقنوات التواصل الفعالة</li>
                        </ul>
                      </>
                    )}
                    {activeMobileSection === 'during' && (
                      <>
                        <h4 className="text-xs font-black text-cyan-400 mb-1">أثناء الفرص</h4>
                        <p className="text-[10.5px] font-black text-white mb-2 leading-relaxed">دعم التحريك والمتابعة والتحويل</p>
                        <div className="h-[1px] bg-slate-900/60 my-2" />
                        <ul className="space-y-1.5 text-[9.5px] text-slate-400 font-bold leading-relaxed">
                          <li>• فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام</li>
                          <li>• دعم الردود والمحادثات لضمان أعلى نسبة استجابة</li>
                          <li>• تأهيل وتوجيه الخطوة التالية لبناء الزخم البيعي</li>
                        </ul>
                      </>
                    )}
                    {activeMobileSection === 'after' && (
                      <>
                        <h4 className="text-xs font-black text-emerald-400 mb-1">بعد الفرص</h4>
                        <p className="text-[10.5px] font-black text-white mb-2 leading-relaxed">تحليل الأداء والتحسين المستمر</p>
                        <div className="h-[1px] bg-slate-900/60 my-2" />
                        <ul className="space-y-1.5 text-[9.5px] text-slate-400 font-bold leading-relaxed">
                          <li>• تحليل الأداء والوقوف على أسباب تعثر الصفقات</li>
                          <li>• تطوير الرسائل والتعامل مع الاعتراضات الشائعة</li>
                          <li>• تدريب وتحسين مستمر لأداء الفريق بشكل أسبوعي</li>
                        </ul>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ==================== FOOTER GRID ======================= */}
        {/* ======================================================== */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right border-t border-slate-900 pt-8" dir="rtl">
          
          {/* Item 1 */}
          <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">تقنية ذكية</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">ذكاء اصطناعي وبيانات موثوقة</p>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
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
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">نتائج حقيقية</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">تنعكس على الإيرادات</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 hover:border-cyan-500/20 transition-all duration-300 select-none">
            <div className="p-2.5 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">تنمية أعمالك B2B</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">بفرص ذات جودة أعلى</p>
            </div>
          </div>

        </div>

        {/* Bottom original role banner card */}
        <div className="mt-10 bg-gradient-to-br from-slate-950/80 to-slate-900/20 border border-slate-900 rounded-3xl p-6 md:p-8 text-right relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500/40 via-emerald-500/40 to-transparent" />
          
          <div className="flex items-center gap-2.5 mb-4 select-none">
            <Award className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <h3 className="text-lg font-black text-white">دورنا: قيادة نمو كاملة حول فريقك</h3>
          </div>
          
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6 font-bold max-w-4xl">
            لسنا شركة تدريب فقط، ولا بيع عملاء محتملين فقط، ولا حجز اجتماعات فقط. نحن نبني ونقود منظومة تشغيل تجمع بين الاستشارات، التدريب، القيادة، المتابعة، التطوير، الأتمتة، الذكاء الاصطناعي، وفرص منافسات المباشرة.
          </p>
        </div>

      </div>
    </section>
  );
};
