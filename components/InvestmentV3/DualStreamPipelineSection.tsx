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
            مسار قيادة النمو الذكي يفتح محادثات مؤهلة، وكادر منافسات يرصد فرصاً مباشرة من السوق. ثم تلتقي الفرص في حصيلة واحدة، ليبدأ فريقك من فرص أجهز وأقرب للتحويل.
          </p>
        </div>

        {/* Title above funnel */}
        <div className="text-center mb-12 hidden lg:block select-none">
          <h3 className="text-lg font-black text-slate-300">هذا القمع يعمل لصالح مسؤول المبيعات</h3>
        </div>

        {/* ======================================================== */}
        {/* ================= DESKTOP LAYOUT (RTL) ================= */}
        {/* ======================================================== */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch relative text-right" dir="rtl">
          
          {/* SVG Connector Overlay Behind Columns */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              {/* Funnel Outline Shape in the Background */}
              <path 
                d="M 40 18 Q 50 18 50 18 Q 50 18 60 18 L 56 75 Q 50 75 50 75 Q 50 75 44 75 Z" 
                fill="rgba(6, 182, 212, 0.01)" 
                stroke="rgba(6, 182, 212, 0.08)" 
                strokeWidth="1.5"
              />
              
              {/* Connector lines from Right (Support Cards) to Center (Funnel stages) */}
              {/* 1. Before Opportunities -> Outcome of Opportunities (x=68 to x=58) */}
              <path 
                d="M 68 22 L 58 22" 
                stroke={hoveredSection === 'before' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                strokeWidth={hoveredSection === 'before' ? 2 : 1}
                strokeDasharray="4 4" 
                className="transition-all duration-300"
              />
              {/* 2. During Opportunities -> Middle stages/Meetings (x=68 to x=56) */}
              <path 
                d="M 68 50 L 56 50" 
                stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                strokeWidth={hoveredSection === 'during' ? 2 : 1}
                strokeDasharray="4 4" 
                className="transition-all duration-300"
              />
              {/* 3. After Opportunities -> Deals (x=68 to x=54) */}
              <path 
                d="M 68 76 L 54 76" 
                stroke={hoveredSection === 'after' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                strokeWidth={hoveredSection === 'after' ? 2 : 1}
                strokeDasharray="4 4" 
                className="transition-all duration-300"
              />

              {/* Connecting line from Businessman on the left (x=32) to Funnel (x=42) */}
              <path 
                d="M 32 48 L 42 48" 
                stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.25)"} 
                strokeWidth={hoveredSection === 'during' ? 1.8 : 1.2} 
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />

              {/* Flow particles from Support Cards into Funnel */}
              <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 68 22 L 58 22" />
              </circle>
              <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 68 50 L 56 50" />
              </circle>
              <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 68 76 L 54 76" />
              </circle>
              <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 32 48 L 42 48" />
              </circle>
              
              {/* Connector from Monafsat node (top left) into funnel top (x=43 to x=49) */}
              <path 
                d="M 43 14 C 47 14, 47 18, 49 18" 
                stroke="rgba(16, 185, 129, 0.25)" 
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle r="1.8" fill="#10b981">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 43 14 C 47 14, 47 18, 49 18" />
              </circle>
            </svg>
          </div>

          {/* ================= COLUMN 1: SUPPORT CARDS (RIGHT) ================= */}
          <div className="col-span-4 flex flex-col gap-6 justify-start z-10 border-l border-slate-900/40 pl-6">
            
            <div className="flex items-center gap-2 mb-2 select-none">
              <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">كادر فريق النمو الذكي</h3>
            </div>

            {/* 1. Before Opportunities */}
            <div 
              className={cn(
                "p-5 rounded-2xl border transition-all duration-300 flex-1 flex flex-col justify-center cursor-default",
                hoveredSection === 'before'
                  ? "border-cyan-500/50 bg-[#07131a]/80 shadow-lg"
                  : "border-slate-900 bg-slate-950/40"
              )}
              onMouseEnter={() => setHoveredSection('before')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center justify-between mb-2 select-none">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-cyan-400">
                    قبل الفرص
                  </span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-600 transition-transform duration-300", hoveredSection === 'before' && "rotate-180")} />
              </div>
              <h3 className="text-xs font-black text-white mb-2">تجهيز السوق والبيانات والاستهداف</h3>
              
              {/* Expandable Bullet details */}
              <AnimatePresence initial={false}>
                {(hoveredSection === 'before') ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold border-t border-slate-900/60 pt-2.5 mt-2">
                      تجهيز البيانات، تحديد الحسابات وصناع القرار، إعداد الرسائل والقنوات.
                    </p>
                    <ul className="space-y-1 mt-2 text-[9px] text-slate-500 font-bold">
                      <li>• تجهيز البيانات والملفات الخاصة بالحسابات المستهدفة</li>
                      <li>• تحديد الحسابات وصناع القرار وصناع التأثير</li>
                      <li>• تجهيز الرسائل المخصصة وقنوات التواصل الفعالة</li>
                    </ul>
                  </motion.div>
                ) : (
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    تجهيز البيانات، تحديد الحسابات وصناع القرار، إعداد الرسائل والقنوات...
                  </p>
                )}
              </AnimatePresence>
            </div>

            {/* 2. During Opportunities */}
            <div 
              className={cn(
                "p-5 rounded-2xl border transition-all duration-300 flex-1 flex flex-col justify-center cursor-default",
                hoveredSection === 'during'
                  ? "border-cyan-500/50 bg-[#07131a]/80 shadow-lg"
                  : "border-slate-900 bg-slate-950/40"
              )}
              onMouseEnter={() => setHoveredSection('during')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center justify-between mb-2 select-none">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-cyan-400">
                    أثناء الفرص
                  </span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-600 transition-transform duration-300", hoveredSection === 'during' && "rotate-180")} />
              </div>
              <h3 className="text-xs font-black text-white mb-2">دعم التحريك والمتابعة والتحويل</h3>

              {/* Expandable Bullet details */}
              <AnimatePresence initial={false}>
                {(hoveredSection === 'during') ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold border-t border-slate-900/60 pt-2.5 mt-2">
                      دعم الردود، تأهيل الفرص النشطة، توجيه الخطوة التالية.
                    </p>
                    <ul className="space-y-1 mt-2 text-[9px] text-slate-500 font-bold">
                      <li>• فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام</li>
                      <li>• دعم الردود والمحادثات لضمان أعلى نسبة استجابة</li>
                      <li>• تأهيل وتوجيه الخطوة التالية لبناء الزخم البيعي</li>
                    </ul>
                  </motion.div>
                ) : (
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    دعم الردود، تأهيل الفرص النشطة، توجيه الخطوة التالية...
                  </p>
                )}
              </AnimatePresence>
            </div>

            {/* 3. After Opportunities */}
            <div 
              className={cn(
                "p-5 rounded-2xl border transition-all duration-300 flex-1 flex flex-col justify-center cursor-default",
                hoveredSection === 'after'
                  ? "border-cyan-500/50 bg-[#07131a]/80 shadow-lg"
                  : "border-slate-900 bg-slate-950/40"
              )}
              onMouseEnter={() => setHoveredSection('after')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center justify-between mb-2 select-none">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-cyan-400">
                    بعد الفرص
                  </span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-600 transition-transform duration-300", hoveredSection === 'after' && "rotate-180")} />
              </div>
              <h3 className="text-xs font-black text-white mb-2">تحليل الأداء والتحسين المستمر</h3>

              {/* Expandable Bullet details */}
              <AnimatePresence initial={false}>
                {(hoveredSection === 'after') ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold border-t border-slate-900/60 pt-2.5 mt-2">
                      تحليل الأداء، تطوير الرسائل والاعتراضات، تدريب وتحسين أسبوعي.
                    </p>
                    <ul className="space-y-1 mt-2 text-[9px] text-slate-500 font-bold">
                      <li>• تحليل الأداء والوقوف على أسباب تعثر الصفقات</li>
                      <li>• تطوير الرسائل والتعامل مع الاعتراضات الشائعة</li>
                      <li>• تدريب وتحسين مستمر لأداء الفريق بشكل أسبوعي</li>
                    </ul>
                  </motion.div>
                ) : (
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    تحليل الأداء، تطوير الرسائل والاعتراضات، تدريب وتحسين أسبوعي...
                  </p>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* ================= COLUMN 2: THE 3D FUNNEL (CENTER) ================= */}
          <div className="col-span-4 flex flex-col items-center justify-start z-10 px-2">
            
            {/* Top Left Monafsat node */}
            <div className="w-full flex justify-start pl-8 mb-4">
              <div 
                className={cn(
                  "px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all duration-300",
                  hoveredSection === 'before' 
                    ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)] scale-[1.02]" 
                    : "border-slate-900 bg-slate-950/40"
                )}
                onMouseEnter={() => setHoveredSection('before')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-white leading-tight">كادر فرص</h4>
                  <span className="text-[9px] text-slate-400 font-extrabold leading-none">المنافسات المباشرة</span>
                </div>
              </div>
            </div>

            {/* Funnel Container Box */}
            <div className="relative w-full h-[450px] select-none">
              
              {/* 3D Funnel SVG Drawing (Curved perspective cone) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 400 460" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Glowing vertical gradient for the glass funnel faces */}
                  <linearGradient id="funnel-grad-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient id="funnel-grad-inactive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="funnel-emerald-active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                  </linearGradient>

                  <radialGradient id="rim-glow-cyan" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* --- SEGMENT 1: حصيلة الفرص --- */}
                {/* Inside top rim ellipse */}
                <ellipse cx="200" cy="40" rx="160" ry="28" fill="url(#rim-glow-cyan)" fillOpacity="0.1" stroke={hoveredSection === 'before' ? "#06b6d4" : "rgba(6, 182, 212, 0.25)"} strokeWidth={hoveredSection === 'before' ? 2 : 1.2} />
                {/* Front face frustum */}
                <path 
                  d="M 40 40 A 160 28 0 0 0 360 40 L 335 100 A 135 24 0 0 1 65 100 Z" 
                  fill={hoveredSection === 'before' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'before' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                  strokeWidth="1"
                />

                {/* --- SEGMENT 2: فرص جاهزة للتحريك --- */}
                <ellipse cx="200" cy="100" rx="135" ry="24" fill="none" stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.2)"} strokeWidth={hoveredSection === 'during' ? 1.5 : 1} />
                <path 
                  d="M 65 100 A 135 24 0 0 0 335 100 L 312 160 A 112 20 0 0 1 88 160 Z" 
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                  strokeWidth="1"
                />

                {/* --- SEGMENT 3: اجتماعات مؤهلة --- */}
                <ellipse cx="200" cy="160" rx="112" ry="20" fill="none" stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.2)"} strokeWidth={hoveredSection === 'during' ? 1.5 : 1} />
                <path 
                  d="M 88 160 A 112 20 0 0 0 312 160 L 292 220 A 92 16 0 0 1 108 220 Z" 
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                  strokeWidth="1"
                />

                {/* --- SEGMENT 4: عروض سعر --- */}
                <ellipse cx="200" cy="220" rx="92" ry="16" fill="none" stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.2)"} strokeWidth={hoveredSection === 'during' ? 1.5 : 1} />
                <path 
                  d="M 108 220 A 92 16 0 0 0 292 220 L 275 280 A 75 13 0 0 1 125 280 Z" 
                  fill={hoveredSection === 'during' ? "url(#funnel-grad-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'during' ? "#06b6d4" : "rgba(6, 182, 212, 0.15)"} 
                  strokeWidth="1"
                />

                {/* --- SEGMENT 5: تفاوض --- */}
                <ellipse cx="200" cy="280" rx="75" ry="13" fill="none" stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.2)"} strokeWidth={hoveredSection === 'after' ? 1.5 : 1} />
                <path 
                  d="M 125 280 A 75 13 0 0 0 275 280 L 260 340 A 60 10 0 0 1 140 340 Z" 
                  fill={hoveredSection === 'after' ? "url(#funnel-emerald-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.15)"} 
                  strokeWidth="1"
                />

                {/* --- SEGMENT 6: صفقات --- */}
                <ellipse cx="200" cy="340" rx="60" ry="10" fill="none" stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.2)"} strokeWidth={hoveredSection === 'after' ? 1.5 : 1} />
                <path 
                  d="M 140 340 A 60 10 0 0 0 260 340 L 248 400 A 48 8 0 0 1 152 400 Z" 
                  fill={hoveredSection === 'after' ? "url(#funnel-emerald-active)" : "url(#funnel-grad-inactive)"} 
                  stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.15)"} 
                  strokeWidth="1"
                />
                
                {/* Bottom opening ellipse */}
                <ellipse cx="200" cy="400" rx="48" ry="8" fill="none" stroke={hoveredSection === 'after' ? "#10b981" : "rgba(16, 185, 129, 0.25)"} strokeWidth={1} />
              </svg>

              {/* Absolute HTML Overlays for Text & Icons inside Funnel segments */}
              {/* 1. حصيلة الفرص */}
              <div 
                className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[220px] h-[36px] flex items-center justify-between pointer-events-none text-right px-3 cursor-default"
                onMouseEnter={() => setHoveredSection('before')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-black text-white select-none">حصيلة الفرص</span>
              </div>

              {/* 2. فرص جاهزة للتحريك */}
              <div 
                className="absolute top-[112px] left-1/2 -translate-x-1/2 w-[180px] h-[36px] flex items-center justify-between pointer-events-none text-right px-3 cursor-default"
                onMouseEnter={() => setHoveredSection('during')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Target className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-black text-cyan-200 select-none">فرص جاهزة للتحريك</span>
              </div>

              {/* 3. اجتماعات مؤهلة */}
              <div 
                className="absolute top-[172px] left-1/2 -translate-x-1/2 w-[150px] h-[36px] flex items-center justify-between pointer-events-none text-right px-2 cursor-default"
                onMouseEnter={() => setHoveredSection('during')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-black text-cyan-200 select-none">اجتماعات مؤهلة</span>
              </div>

              {/* 4. عروض سعر */}
              <div 
                className="absolute top-[232px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] flex items-center justify-between pointer-events-none text-right px-2 cursor-default"
                onMouseEnter={() => setHoveredSection('during')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-black text-cyan-200 select-none">عروض سعر</span>
              </div>

              {/* 5. تفاوض */}
              <div 
                className="absolute top-[292px] left-1/2 -translate-x-1/2 w-[100px] h-[36px] flex items-center justify-between pointer-events-none text-right px-2 cursor-default"
                onMouseEnter={() => setHoveredSection('after')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Handshake className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-black text-emerald-200 select-none">تفاوض</span>
              </div>

              {/* 6. صفقات */}
              <div 
                className="absolute top-[352px] left-1/2 -translate-x-1/2 w-[85px] h-[36px] flex items-center justify-between pointer-events-none text-right px-1 cursor-default"
                onMouseEnter={() => setHoveredSection('after')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-black text-emerald-200 select-none">صفقات</span>
              </div>

            </div>

            {/* Bottom Target Card */}
            <div className="w-full flex flex-col items-center mt-3 z-10">
              <div 
                className={cn(
                  "px-8 py-3.5 rounded-2xl border text-center transition-all duration-300 w-full max-w-[280px] bg-[#0d0d0d] flex items-center justify-center gap-3.5",
                  hoveredSection === 'after'
                    ? "border-amber-400 bg-[#141008] shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.02]"
                    : "border-slate-800"
                )}
                onMouseEnter={() => setHoveredSection('after')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-extrabold leading-none">
                    {PIPELINE_CONFIG.targetAmount}
                  </div>
                  <div className="text-sm md:text-base font-black text-amber-400 tracking-tight leading-normal mt-0.5">
                    خلال 90 يوم
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= COLUMN 3: CLIENT'S SALES REPRESENTATIVE (LEFT) ================= */}
          <div className="col-span-4 flex flex-col justify-start z-10 pr-6">
            <div className="sticky top-10 flex flex-col h-[580px] justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">مسؤول مبيعات العميل</h3>
                </div>

                <p className="text-xs md:text-sm text-slate-400 font-bold leading-relaxed mb-6">
                  يبدأ من فرص أجهز، مدعومة بالبيانات والسياق، ويتحرك بها نحو الاجتماعات والعروض والصفقات.
                </p>
              </div>

              {/* Saudi Business Professional - Transparent Illustration standing tall next to funnel */}
              <div className="relative w-full max-w-[340px] mx-auto h-[460px] flex items-end justify-center overflow-visible select-none">
                {/* Circular neon backdrop halo glow (moved up to chest level) */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-gradient-to-br from-cyan-500/15 via-cyan-950/30 to-transparent border border-cyan-500/5 blur-sm z-0" />
                
                {/* Standing illustration - transparent background, direct integration into site */}
                <img 
                  src="/saudi_sales_rep.png" 
                  alt="مسؤول مبيعات العميل" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.25)] select-none pointer-events-none"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ================= MOBILE LAYOUT (RTL) ================== */}
        {/* ======================================================== */}
        <div className="lg:hidden flex flex-col gap-6 max-w-md mx-auto text-right" dir="rtl">
          
          {/* 1. Client's Sales Representative (Top mobile) */}
          <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center gap-4">
            {/* Small Saudi avatar */}
            <div className="w-14 h-14 bg-slate-950 rounded-xl border border-slate-800 shrink-0 overflow-hidden">
              <img 
                src="/saudi_sales_rep.png" 
                alt="مسؤول مبيعات العميل" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-black text-white">مسؤول مبيعات العميل</h3>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-0.5">
                يبدأ من فرص أجهز، مدعومة بالبيانات والسياق، ويتحرك بها نحو الصفقات.
              </p>
            </div>
          </div>

          {/* 2. Sources Node (Mobile stacked layout) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-900 bg-slate-950/40 text-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
              <h4 className="text-[10px] font-black text-white">كادر فريق النمو الذكي</h4>
              <span className="text-[8.5px] text-slate-500 font-bold block mt-0.5">محادثات مؤهلة</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-900 bg-slate-950/40 text-center">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <h4 className="text-[10px] font-black text-white">كادر فرص منافسات</h4>
              <span className="text-[8.5px] text-slate-500 font-bold block mt-0.5">فرص مباشرة</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="w-4 h-4 text-slate-800" />
          </div>

          {/* 3. Central Meeting Point */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-[#07131a] text-center">
            <h3 className="text-xs font-black text-white mb-0.5 flex items-center justify-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              حصيلة الفرص
            </h3>
            <p className="text-[9.5px] text-slate-300 font-extrabold">محادثات مؤهلة + فرص مباشرة</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="w-4 h-4 text-slate-800" />
          </div>

          {/* 4. Vertical Stepper */}
          <div className="space-y-3 relative before:absolute before:right-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900/60 z-0">
            {[
              { id: "m-ready", label: "فرص جاهزة للتحريك", color: "border-cyan-500/10 text-cyan-200" },
              { id: "m-meetings", label: "اجتماعات مؤهلة", color: "border-cyan-500/10 text-cyan-200" },
              { id: "m-offers", label: "عروض سعر", color: "border-cyan-500/10 text-cyan-200" },
              { id: "m-negotiate", label: "تفاوض", color: "border-emerald-500/10 text-emerald-200" },
              { id: "m-deals", label: "صفقات", color: "border-emerald-500/10 text-emerald-200" }
            ].map((stage, idx) => (
              <div key={stage.id} className="flex items-center gap-4 relative z-10 pr-2">
                {/* Bullet node */}
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                  {idx + 1}
                </div>
                <div className={cn("flex-1 py-2.5 px-4 rounded-xl border bg-gradient-to-b from-slate-950/60 to-slate-950/20 text-xs font-black", stage.color)}>
                  {stage.label}
                </div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-2">
            <ArrowDown className="w-4 h-4 text-slate-800" />
          </div>

          {/* 5. Target Card (Mobile) */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d0d0d] text-center">
            <div className="text-sm font-black text-amber-400">خلال 90 يوم</div>
          </div>

          {/* 6. Support Accordions (Mobile Bottom) */}
          <div className="space-y-2.5 border-t border-slate-900 pt-5 mt-2">
            <h4 className="text-xs font-black text-slate-300 mb-2">بطاقات الدعم والتطوير:</h4>
            
            {/* Accordion 1: Before */}
            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/40">
              <button 
                onClick={() => toggleMobileSection('before')}
                className="w-full p-4 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[8.5px] font-black tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    قبل الفرص
                  </span>
                  <span className="text-xs font-black text-white">كادر فريق النمو الذكي</span>
                </div>
                {activeMobileSection === 'before' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence initial={false}>
                {activeMobileSection === 'before' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-1 text-[10.5px] text-slate-400 font-bold border-t border-slate-900/60 leading-relaxed">
                      <p className="mb-2 text-slate-300">تجهيز البيانات، تحديد الحسابات وصناع القرار، إعداد الرسائل والقنوات.</p>
                      <ul className="space-y-1 mt-2 text-[9.5px]">
                        <li>• تجهيز البيانات والملفات الخاصة بالحسابات المستهدفة</li>
                        <li>• تحديد الحسابات وصناع القرار وصناع التأثير</li>
                        <li>• تجهيز الرسائل المخصصة وقنوات التواصل الفعالة</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: During */}
            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/40">
              <button 
                onClick={() => toggleMobileSection('during')}
                className="w-full p-4 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[8.5px] font-black tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    أثناء الفرص
                  </span>
                  <span className="text-xs font-black text-white">أثناء الفرص</span>
                </div>
                {activeMobileSection === 'during' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {activeMobileSection === 'during' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-1 text-[10.5px] text-slate-400 font-bold border-t border-slate-900/60 leading-relaxed">
                      <p className="mb-2 text-slate-300">دعم الردود، تأهيل الفرص النشطة، توجيه الخطوة التالية.</p>
                      <ul className="space-y-1 mt-2 text-[9.5px]">
                        <li>• فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام</li>
                        <li>• دعم الردود والمحادثات لضمان أعلى نسبة استجابة</li>
                        <li>• تأهيل وتوجيه الخطوة التالية لبناء الزخم البيعي</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: After */}
            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/40">
              <button 
                onClick={() => toggleMobileSection('after')}
                className="w-full p-4 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[8.5px] font-black tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    بعد الفرص
                  </span>
                  <span className="text-xs font-black text-white">بعد الفرص</span>
                </div>
                {activeMobileSection === 'after' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {activeMobileSection === 'after' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-1 text-[10.5px] text-slate-400 font-bold border-t border-slate-900/60 leading-relaxed">
                      <p className="mb-2 text-slate-300">تحليل الأداء، تطوير الرسائل والاعتراضات، تدريب وتحسين أسبوعي.</p>
                      <ul className="space-y-1 mt-2 text-[9.5px]">
                        <li>• تحليل الأداء والوقوف على أسباب تعثر الصفقات</li>
                        <li>• تطوير الرسائل والتعامل مع الاعتراضات الشائعة</li>
                        <li>• تدريب وتحسين مستمر لأداء الفريق بشكل أسبوعي</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
