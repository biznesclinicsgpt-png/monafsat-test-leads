import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  BriefcaseBusiness, 
  Sparkles, 
  Layers, 
  ArrowDown, 
  Award, 
  Activity,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';

const PIPELINE_CONFIG = {
  targetAmount: "1,000,000 ريال",
  targetPeriod: "خلال 90 يوم",
  subText: "كل فرصة تتحرك داخل القمع تقرب فريقك من هذا الرقم."
};

export const DualStreamPipelineSection = () => {
  return (
    <section 
      className="py-20 bg-[#060606] border-t border-slate-900/60 relative overflow-hidden" 
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
            نزيد حصيلة الفرص التي تصل لمسؤول المبيعات
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            كادر فريق النمو الذكي يدعم مسؤول المبيعات قبل الفرص وأثناءها وبعدها، وكادر منافسات يضخ فرصاً مباشرة من السوق. ثم تلتقي هذه المدخلات في حصيلة فرص واحدة تتحول إلى اجتماعات وعروض وصفقات.
          </p>
        </div>

        {/* Desktop Layout (Full-width 3-Column Diagram) */}
        <div className="hidden lg:grid grid-cols-12 gap-y-2 gap-x-8 items-stretch relative">
          
          {/* ================= ROW 1 ================= */}
          {/* Absolute SVG for horizontal connectors inside Row 1 */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              <defs>
                <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
                </marker>
              </defs>
              {/* Arrow from Right Column (Growth Team) [x = 69] to Center Column (Sales Rep) [x = 63.5] */}
              <path d="M 69 40 L 63.5 40" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-cyan)" />
              
              {/* Animated particle flowing from Right to Center */}
              <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 69 40 L 63.5 40" />
              </circle>
            </svg>
          </div>

          {/* Row 1 - Right Column: Growth Team Stream */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            {/* Growth Team Header Label */}
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-4 select-none">
              <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">كادر فريق النمو الذكي</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Main Growth Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-white mb-2">دور الكادر: دعم وتمكين</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                    يدعم مسؤول المبيعات قبل الفرص وأثناءها وبعدها حتى لا يبدأ من الصفر، ولا يتحرك بدون بيانات أو رسائل أو متابعة واضحة.
                  </p>
                </div>
              </motion.div>

              {/* 3 Small Sub-cards stacked vertically */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: "1. قبل الفرص",
                    points: ["تجهيز البيانات", "تحديد الحسابات وصناع القرار", "إعداد الرسائل والقنوات"]
                  },
                  {
                    title: "2. أثناء الفرص",
                    points: ["دعم الردود", "تأهيل الفرص النشطة", "توجيه الخطوة التالية"]
                  },
                  {
                    title: "3. بعد الفرص",
                    points: ["تحليل الأداء", "تطوير الرسائل والاعتراضات", "تدريب وتحسين أسبوعي"]
                  }
                ].map((sub, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    className="p-3.5 rounded-xl border border-cyan-500/10 bg-slate-950/25 text-right hover:border-cyan-500/30 transition-all duration-300 shadow-sm"
                  >
                    <h5 className="text-[11px] font-black text-cyan-400 mb-1.5">{sub.title}</h5>
                    <ul className="text-[10px] text-slate-400 space-y-1 font-bold">
                      {sub.points.map((pt, pIdx) => (
                        <li key={pIdx}>
                          • {pt}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 1 - Center Column: Client's Sales Representative */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            {/* Sales Rep Header Label */}
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-4 select-none">
              <div className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">مسؤول المبيعات</h3>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/40 text-right hover:border-emerald-500/40 transition-all duration-300 shadow-lg relative flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-xs font-black text-white">مسؤول المبيعات</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold mb-3">
                  لا يبدأ من الصفر. يستلم فرصاً أجهز، مدعومة بالبيانات والسياق والمتابعة، ثم يحولها إلى اجتماعات وعروض وصفقات.
                </p>
                <div className="text-[10px] text-emerald-400 font-extrabold mb-3 bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                  يبدأ من فرص أجهز… لا من بحث بارد.
                </div>
                <ul className="text-[10px] text-slate-400 space-y-1.5 font-bold">
                  <li>• يستلم سياق الفرصة</li>
                  <li>• يعرف الخطوة التالية</li>
                  <li>• يركز على التحويل والإغلاق</li>
                </ul>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-emerald-400 font-black">
                المستفيد الأساسي: يقود المحادثات نحو صفقات
              </div>
            </motion.div>
          </div>

          {/* Row 1 - Left Column: Monafsat Card */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            {/* Monafsat Header Label */}
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-4 select-none">
              <div className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shrink-0">
                <BriefcaseBusiness className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">كادر فرص منافسات المباشرة</h3>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/40 text-right hover:border-emerald-500/40 transition-all duration-300 shadow-lg relative flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-xs font-black text-white">رصد الفرص المباشرة</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold mb-3">
                  يرصد فرصاً من السوق السعودي لدى شركات وجهات لديها احتياج قائم أو طلب شراء، ثم يمرر الفرص المناسبة إلى حصيلة الفرص.
                </p>
                <div className="text-[10px] text-emerald-400 font-extrabold mb-3 bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                  فرص مباشرة من السوق
                </div>
                <ul className="text-[10px] text-slate-400 space-y-1.5 font-bold">
                  <li>• رصد احتياج قائم</li>
                  <li>• طلبات شراء وجهات تبحث عن موردين</li>
                  <li>• تأهيل أولي قبل التمرير</li>
                </ul>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-emerald-400 font-black">
                الناتج: فرص مباشرة جاهزة للتحريك
              </div>
            </motion.div>
          </div>

          {/* ================= CONNECTOR 1 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Center Branch (Sales Rep [x = 50] -> Opportunity Pool [x = 50]) */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Left Branch (Monafsat [x = 16.6] -> Opportunity Pool [x = 50]) */}
              <path d="M 16.6 0 C 16.6 20, 50 20, 50 40" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Flow particles */}
              <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
              <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 16.6 0 C 16.6 20, 50 20, 50 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 2 ================= */}
          {/* Row 2 - Left: Empty */}
          <div className="col-span-4"></div>

          {/* Row 2 - Center: Opportunity Pool Card (Hero Card) */}
          <div className="col-span-4 flex flex-col items-center z-10">
            <span className="text-[10px] text-cyan-400 font-black mb-1.5 select-none tracking-wider px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/15 rounded-md">
              نقطة التلاقي
            </span>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="px-10 py-6 rounded-3xl border-2 border-cyan-400/50 bg-[#081822] shadow-[0_0_30px_rgba(6,182,212,0.35)] flex flex-col items-center text-center w-full justify-center max-w-sm transition-all duration-300"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 mb-3">
                <Layers className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-white mb-1">حصيلة الفرص</h3>
              <p className="text-xs text-cyan-300 font-bold mb-2">محادثات مؤهلة + فرص مباشرة</p>
              <p className="text-[10px] text-slate-400 leading-normal font-bold">
                كل الفرص تتجمع هنا قبل أن تصل لمسؤول المبيعات.
              </p>
            </motion.div>
          </div>

          {/* Row 2 - Right: Empty */}
          <div className="col-span-4"></div>

          {/* ================= CONNECTOR 2 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle r="2.5" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 3 ================= */}
          {/* Row 3 - Left: Empty */}
          <div className="col-span-4"></div>

          {/* Row 3 - Center: Vertical Conversion Timeline */}
          <div className="col-span-4 flex flex-col items-center gap-3 z-10">
            <span className="text-[10px] text-cyan-400 font-black mb-1 select-none tracking-wider px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/15 rounded-md">
              مسار التحويل
            </span>
            {[
              { label: "فرص جاهزة للتحريك", color: "border-cyan-500/20 text-cyan-300 bg-cyan-950/20" },
              { label: "اجتماعات مؤهلة", color: "border-cyan-500/20 text-cyan-300 bg-cyan-950/20" },
              { label: "عروض سعر", color: "border-cyan-500/20 text-cyan-300 bg-cyan-950/20" },
              { label: "تفاوض", color: "border-emerald-500/20 text-emerald-300 bg-emerald-950/20" },
              { label: "صفقات", color: "border-emerald-500/20 text-emerald-300 bg-emerald-950/20" },
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className={cn(
                  "w-full text-center py-3 px-4 rounded-xl border text-xs font-black tracking-wide leading-tight shadow-md max-w-xs",
                  step.color
                )}>
                  {step.label}
                </div>
                {idx < 4 && (
                  <ArrowDown className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            ))}
            
            <ArrowDown className="w-4 h-4 text-slate-700 shrink-0 mt-1" />
            
            {/* Target Card at the end of the vertical pipeline */}
            <div className="w-full max-w-xs px-6 py-4 rounded-2xl border border-slate-800 bg-[#0d0d0d] text-center shadow-[0_0_15px_rgba(245,158,11,0.08)] mt-1">
              <div className="flex justify-center mb-1.5">
                <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Target className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-black text-amber-400 tracking-tight">
                {PIPELINE_CONFIG.targetAmount}
              </div>
              <div className="text-[10px] text-slate-300 font-extrabold mt-0.5">
                {PIPELINE_CONFIG.targetPeriod}
              </div>
              <p className="text-[9px] text-slate-500 font-bold mt-2 leading-normal select-none">
                كل فرصة تتحرك داخل القمع تقرب فريقك من هذا الرقم.
              </p>
            </div>
          </div>

          {/* Row 3 - Right: Empty */}
          <div className="col-span-4"></div>

        </div>

        {/* Mobile / Tablet Layout (Vertical Stepper accordion flow) */}
        <div className="lg:hidden flex flex-col gap-5 max-w-lg mx-auto">
          
          <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5 mb-3 text-right">
            <h3 className="text-base font-black text-white mb-2">نزيد حصيلة الفرص التي تصل لمسؤول المبيعات</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              كادر فريق النمو الذكي يدعم مسؤول المبيعات قبل الفرص وأثناءها وبعدها، وكادر منافسات يضخ فرصاً مباشرة من السوق. ثم تلتقي هذه المدخلات في حصيلة فرص واحدة تتحول إلى اجتماعات وعروض وصفقات.
            </p>
          </div>

          {/* Mobile vertical flow cards */}
          <div className="space-y-4">
            
            {/* 1. Smart Growth Team Staff */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1.5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                كادر فريق النمو الذكي
              </h3>
              <p className="text-[10.5px] text-slate-400 leading-normal mb-2">
                يدعم مسؤول المبيعات قبل الفرص وأثناءها وبعدها حتى لا يبدأ من الصفر، ولا يتحرك بدون بيانات أو رسائل أو متابعة واضحة.
              </p>
              <div className="space-y-2 border-t border-slate-900 pt-2 text-[10px]">
                <div>
                  <strong className="text-cyan-300">• قبل الفرص:</strong> تجهيز البيانات، تحديد الحسابات، إعداد الرسائل.
                </div>
                <div>
                  <strong className="text-cyan-300">• أثناء الفرص:</strong> دعم الردود، تأهيل الفرص، توجيه الخطوة التالية.
                </div>
                <div>
                  <strong className="text-cyan-300">• بعد الفرص:</strong> تحليل الأداء، تطوير الرسائل، تدريب أسبوعي.
                </div>
              </div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 2. Monafsat Card */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-emerald-400 mb-1 flex items-center gap-2">
                <BriefcaseBusiness className="w-3.5 h-3.5" />
                كادر فرص منافسات المباشرة
              </h3>
              <p className="text-[10.5px] text-slate-400 leading-normal mb-2">
                يرصد فرصاً من السوق السعودي لدى شركات وجهات لديها احتياج قائم أو طلب شراء، ثم يمرر الفرص المناسبة إلى حصيلة الفرص.
              </p>
              <div className="mt-2 text-[9px] text-emerald-300 font-black">الناتج: فرص مباشرة جاهزة للتحريك</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 3. Client's Sales Rep */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-emerald-400 mb-1 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                مسؤول المبيعات
              </h3>
              <p className="text-[10.5px] text-slate-400 leading-normal mb-2">
                لا يبدأ من الصفر. يستلم فرصاً أجهز، مدعومة بالبيانات والسياق والمتابعة، ثم يحولها إلى اجتماعات وعروض وصفقات.
              </p>
              <div className="mt-2 text-[9px] text-emerald-300 font-black">يبدأ من فرص أجهز… لا من بحث بارد.</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 4. Opportunity Pool */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#081822] text-right text-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="text-[8px] text-cyan-400 font-black mb-1 select-none tracking-wider px-1.5 py-0.2 bg-cyan-500/5 border border-cyan-500/15 rounded-md inline-block">
                نقطة التلاقي
              </span>
              <h3 className="text-xs font-black text-white mb-1 flex items-center justify-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                حصيلة الفرص
              </h3>
              <p className="text-[10.5px] text-cyan-300 leading-normal font-bold">
                محادثات مؤهلة + فرص مباشرة
              </p>
              <p className="text-[9px] text-slate-500 mt-1">كل الفرص تتجمع هنا قبل أن تصل لمسؤول المبيعات.</p>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 5. Conversion Steps */}
            <div className="space-y-2 py-2">
              <div className="text-center text-[9px] text-slate-500 font-extrabold mb-2">مسار التحويل</div>
              {[
                "فرص جاهزة للتحريك",
                "اجتماعات مؤهلة",
                "عروض سعر",
                "تفاوض",
                "صفقات"
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0c0c0c] text-center text-[10px] text-slate-300 font-bold max-w-xs mx-auto">
                    {step}
                  </div>
                  {idx < 4 && (
                    <div className="flex justify-center my-1"><ArrowDown className="w-3.5 h-3.5 text-slate-800" /></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 6. Target */}
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0d0d0d] text-center">
              <div className="text-lg font-black text-amber-400">{PIPELINE_CONFIG.targetAmount}</div>
              <div className="text-[10px] text-slate-300 font-bold mt-0.5">{PIPELINE_CONFIG.targetPeriod}</div>
              <p className="text-[9px] text-slate-500 font-bold mt-2">كل فرصة تتحرك داخل القمع تقرب فريقك من هذا الرقم.</p>
            </div>

          </div>

        </div>

        {/* Our Role Simplified Footer */}
        <div className="mt-16 bg-gradient-to-br from-slate-950/80 to-slate-900/20 border border-slate-900 rounded-3xl p-6 md:p-8 text-right relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500/40 via-emerald-500/40 to-transparent" />
          
          <div className="flex items-center gap-2.5 mb-4 select-none">
            <Award className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <h3 className="text-lg font-black text-white">دورنا حول فريقك:</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3.5 text-xs text-slate-300 font-bold">
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>استشارات لتحديد القطاع وصناع القرار</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>تدريب مسؤول المبيعات على الرد والتحويل</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>متابعة أسبوعية لحركة الفرص</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>تطوير الرسائل والقنوات</span>
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
