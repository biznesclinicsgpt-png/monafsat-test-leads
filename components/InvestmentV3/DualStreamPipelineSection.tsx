import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Users, 
  BriefcaseBusiness, 
  Sparkles, 
  Layers, 
  ArrowDown, 
  Award, 
  Activity,
  MessageSquare,
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
  targetAmount: "المستهدف البيعي خلال 90 يوم",
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
        <div className="text-center mb-8 hidden lg:block select-none">
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
                stroke="rgba(6, 182, 212, 0.15)" 
                strokeWidth="1" 
                strokeDasharray="3 3"
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
              
              {/* Connector from Monafsat node (top left) into funnel top (x=44 to x=48) */}
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

          {/* ================= COLUMN 1: SUPPORT CARDS (RIGHT - Renders Right-most in RTL) ================= */}
          <div className="col-span-4 flex flex-col gap-6 justify-between z-10 border-l border-slate-900/40 pl-6">
            
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

          {/* ================= COLUMN 2: THE FUNNEL (CENTER - Renders Middle in RTL) ================= */}
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
            <div className="w-full flex flex-col gap-2 relative">
              
              {/* Funnel Stage 1: حصيلة الفرص */}
              <div className="w-full flex justify-center">
                <div 
                  className={cn(
                    "w-full max-w-[280px] py-3.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 bg-[#07131a] cursor-default",
                    hoveredSection === 'before'
                      ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-[1.03]"
                      : "border-cyan-500/20"
                  )}
                  onMouseEnter={() => setHoveredSection('before')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="text-xs font-black text-white">حصيلة الفرص</span>
                  <div className="p-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Filter className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Funnel Stage 2: فرص جاهزة للتحريك */}
              <div className="w-full flex justify-center">
                <div 
                  className={cn(
                    "w-[90%] max-w-[252px] py-3 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 bg-[#07131a] cursor-default",
                    hoveredSection === 'during'
                      ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.03]"
                      : "border-cyan-500/20"
                  )}
                  onMouseEnter={() => setHoveredSection('during')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="text-xs font-black text-cyan-200">فرص جاهزة للتحريك</span>
                  <div className="p-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Target className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Funnel Stage 3: اجتماعات مؤهلة */}
              <div className="w-full flex justify-center">
                <div 
                  className={cn(
                    "w-[80%] max-w-[224px] py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 bg-[#07131a] cursor-default",
                    hoveredSection === 'during'
                      ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.03]"
                      : "border-cyan-500/20"
                  )}
                  onMouseEnter={() => setHoveredSection('during')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="text-xs font-black text-cyan-200">اجتماعات مؤهلة</span>
                  <div className="p-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Funnel Stage 4: عروض سعر */}
              <div className="w-full flex justify-center">
                <div 
                  className={cn(
                    "w-[70%] max-w-[196px] py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 bg-[#07131a] cursor-default",
                    hoveredSection === 'during'
                      ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.03]"
                      : "border-cyan-500/20"
                  )}
                  onMouseEnter={() => setHoveredSection('during')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="text-xs font-black text-cyan-200">عروض سعر</span>
                  <div className="p-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Funnel Stage 5: تفاوض */}
              <div className="w-full flex justify-center">
                <div 
                  className={cn(
                    "w-[60%] max-w-[168px] py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 bg-[#051411] cursor-default",
                    hoveredSection === 'after'
                      ? "border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.03]"
                      : "border-emerald-500/20"
                  )}
                  onMouseEnter={() => setHoveredSection('after')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="text-xs font-black text-emerald-200">تفاوض</span>
                  <div className="p-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    <Handshake className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Funnel Stage 6: صفقات */}
              <div className="w-full flex justify-center">
                <div 
                  className={cn(
                    "w-[50%] max-w-[140px] py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 bg-[#051411] cursor-default",
                    hoveredSection === 'after'
                      ? "border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.03]"
                      : "border-emerald-500/20"
                  )}
                  onMouseEnter={() => setHoveredSection('after')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="text-xs font-black text-emerald-200">صفقات</span>
                  <div className="p-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Target Card */}
            <div className="w-full flex flex-col items-center mt-6 z-10">
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
                  <div className="text-[9.5px] text-slate-400 font-extrabold leading-none">
                    {PIPELINE_CONFIG.targetAmount}
                  </div>
                  <div className="text-sm md:text-base font-black text-amber-400 tracking-tight leading-normal mt-0.5">
                    خلال 90 يوم
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= COLUMN 3: CLIENT'S SALES REPRESENTATIVE (LEFT - Renders Left-most in RTL) ================= */}
          <div className="col-span-4 flex flex-col justify-start z-10 border-r border-slate-900/40 pr-6">
            <div className="sticky top-10">
              
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-white">مسؤول مبيعات العميل</h3>
              </div>

              {/* Saudi Business Professional Silhouette Vector Illustration */}
              <div className="w-full max-w-[200px] mx-auto mb-6 bg-gradient-to-b from-slate-950/80 to-slate-900/10 rounded-3xl p-3 border border-slate-900 relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* SVG Silhouette */}
                <svg viewBox="0 0 200 280" className="w-full h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background radial glow */}
                  <circle cx="100" cy="110" r="70" fill="url(#avatar-glow-new)" opacity="0.35" />
                  
                  {/* Agal */}
                  <ellipse cx="100" cy="38" rx="26" ry="5.5" fill="#1e293b" stroke="#06b6d4" strokeWidth="2.5" />
                  <ellipse cx="100" cy="35" rx="28" ry="6.5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                  
                  {/* Ghutra drape */}
                  <path d="M 100 25 C 72 25, 64 55, 62 105 C 60 150, 68 190, 70 220 L 85 230 C 95 230, 100 220, 100 220 C 100 220, 105 230, 115 230 L 130 220 C 132 190, 140 150, 138 105 C 136 55, 128 25, 100 25 Z" fill="url(#ghutra-grad-new)" stroke="#06b6d4" strokeWidth="1.2" />
                  
                  {/* Face outline */}
                  <path d="M 100 45 C 83 45, 83 80, 100 90 C 117 90, 117 80, 100 45 Z" fill="url(#face-grad-new)" />
                  
                  {/* Inner Ghutra opening fold */}
                  <path d="M 86 45 C 82 58, 82 85, 100 98 C 118 85, 118 58, 114 45" stroke="#334155" strokeWidth="1.2" fill="none" />
                  
                  {/* Thobe collar & shoulders */}
                  <path d="M 72 200 L 60 260 L 140 260 L 128 200 C 120 175, 115 170, 100 170 C 85 170, 80 175, 72 200 Z" fill="url(#thobe-grad-new)" stroke="#10b981" strokeWidth="1.2" />
                  
                  {/* Collar details */}
                  <path d="M 91 170 L 100 185 L 109 170" stroke="#06b6d4" strokeWidth="1.5" fill="none" />

                  {/* Tablet representation (holding a glowing device) */}
                  <path d="M 80 215 L 120 215 L 125 245 L 75 245 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                  <path d="M 83 218 L 117 218 L 121 242 L 79 242 Z" fill="#020617" />
                  <line x1="88" y1="222" x2="112" y2="222" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />
                  <line x1="88" y1="226" x2="104" y2="226" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                  
                  {/* Hands holding tablet */}
                  <path d="M 72 235 C 75 235, 77 240, 75 243" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
                  <path d="M 128 235 C 125 235, 123 240, 125 243" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />

                  <defs>
                    <linearGradient id="ghutra-grad-new" x1="100" y1="25" x2="100" y2="230" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="60%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <linearGradient id="face-grad-new" x1="100" y1="45" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="thobe-grad-new" x1="100" y1="170" x2="100" y2="260" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="50%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <radialGradient id="avatar-glow-new" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Descriptions & Labels */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 shadow-md">
                <p className="text-xs text-slate-300 leading-relaxed font-bold">
                  يبدأ من فرص أجهز، مدعومة بالبيانات والسياق، ويتحرك بها نحو الاجتماعات والعروض والصفقات.
                </p>
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
            <div className="w-14 h-14 bg-slate-950 rounded-xl border border-slate-800 shrink-0 p-1 flex items-center justify-center">
              <svg viewBox="0 0 200 280" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="110" r="70" fill="#06b6d4" opacity="0.1" />
                <ellipse cx="100" cy="38" rx="26" ry="5.5" fill="#1e293b" stroke="#06b6d4" strokeWidth="2.5" />
                <path d="M 100 25 C 72 25, 64 55, 62 105 C 60 150, 68 190, 70 220 L 85 230 C 95 230, 100 220, 100 220 C 100 220, 105 230, 115 230 L 130 220 C 132 190, 140 150, 138 105 C 136 55, 128 25, 100 25 Z" fill="#e2e8f0" stroke="#06b6d4" strokeWidth="1" />
                <path d="M 100 45 C 83 45, 83 80, 100 90 C 117 90, 117 80, 100 45 Z" fill="#0f172a" />
                <path d="M 72 200 L 60 260 L 140 260 L 128 200 C 120 175, 115 170, 100 170 C 85 170, 80 175, 72 200 Z" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
              </svg>
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
            <div className="text-sm font-black text-amber-400">{PIPELINE_CONFIG.targetAmount}</div>
            <div className="text-[9px] text-slate-300 font-bold mt-0.5">خلال 90 يوم</div>
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
        {/* ==================== FOOTER CARD ======================= */}
        {/* ======================================================== */}
        <div className="mt-16 bg-gradient-to-br from-slate-950/80 to-slate-900/20 border border-slate-900 rounded-3xl p-6 md:p-8 text-right relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500/40 via-emerald-500/40 to-transparent" />
          
          <div className="flex items-center gap-2.5 mb-4 select-none">
            <Award className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <h3 className="text-lg font-black text-white">دورنا: قيادة نمو كاملة حول فريقك</h3>
          </div>
          
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6 font-bold max-w-4xl">
            لسنا شركة تدريب فقط، ولا بيع عملاء محتملين فقط، ولا حجز اجتماعات فقط. نحن نبني ونقود منظومة تشغيل تجمع بين الاستشارات، التدريب، القيادة، المتابعة، التطوير، الأتمتة، الذكاء اصطناعي، وفرص منافسات المباشرة.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3.5 text-xs text-slate-300 font-bold">
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>استشارات لتحديد القطاع وصناع القرار</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>تدريب موظف المبيعات على الرد والتحويل</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>قيادة خطة 90 يوم ومؤشرات الأداء</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>متابعة أسبوعية لحركة الفرص والأنشطة</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>تطوير مستمر للرسائل والقنوات</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>أتمتة للمتابعة وتنظيم الخطوات</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>ذكاء اصطناعي للتحليل والتخصيص</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>فرص مباشرة من كادر منافسات</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
