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
  Activity
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
            نزيد حصيلة الفرص التي تصل لفريق مبيعاتك
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            مسار قيادة النمو الذكي يفتح محادثات مؤهلة، وكادر منافسات يرصد فرصاً مباشرة من السوق. ثم تلتقي الفرص في حصيلة واحدة، ليبدأ فريقك من فرص أجهز وأقرب للتحويل.
          </p>
        </div>

        {/* Desktop Layout (Full-width 3-Column Diagram) */}
        <div className="hidden lg:grid grid-cols-12 gap-y-2 gap-x-8 items-center relative">
          
          {/* ================= ROW 1 ================= */}
          {/* Row 1 - Left: Monafsat Card */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/40 text-right hover:border-emerald-500/40 transition-all duration-300 shadow-lg relative h-full flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <BriefcaseBusiness className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">كادر فرص منافسات المباشرة</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  يرصد فرصاً من السوق السعودي لدى شركات وجهات لديها احتياج قائم، طلب شراء، أو تبحث عن موردين داخل القطاعات المستهدفة.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400 font-extrabold">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">فرص مباشرة من السوق</span>
                  <span>• رصد احتياج وطلبات شراء</span>
                  <span>• تأهيل وتمرير للفرص</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-emerald-400 font-black">
                الناتج: فرص مباشرة جاهزة للتحريك
              </div>
            </motion.div>
          </div>

          {/* Row 1 - Center: Empty */}
          <div className="col-span-4"></div>

          {/* Row 1 - Right: Before Opportunities Card */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative h-full flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">قبل الفرص</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  نجهز السوق قبل أن يصل لمسؤول المبيعات: بيانات، حسابات مستهدفة، صناع قرار، رسائل، قنوات، وملفات متابعة.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400 font-extrabold">
                  <span>• تجهيز البيانات والملفات</span>
                  <span>• تحديد الحسابات وصناع القرار</span>
                  <span>• تجهيز الرسائل والقنوات</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-cyan-400 font-black">
                المحرك: تجهيز ما قبل وصول الفرصة
              </div>
            </motion.div>
          </div>

          {/* ================= CONNECTOR 1 (Y-Shape) ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Monafsat center (x = 16.6) -> Pool top-center (x = 50) */}
              <path d="M 16.6 0 C 16.6 20, 50 20, 50 40" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Before Opportunities center (x = 83.3) -> Pool top-center (x = 50) */}
              <path d="M 83.3 0 C 83.3 20, 50 20, 50 40" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Flow particles */}
              <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 16.6 0 C 16.6 20, 50 20, 50 40" />
              </circle>
              <circle r="2.5" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 83.3 0 C 83.3 20, 50 20, 50 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 2 ================= */}
          {/* Row 2 - Left: Empty */}
          <div className="col-span-4"></div>

          {/* Row 2 - Center: Opportunity Pool Card */}
          <div className="col-span-4 flex flex-col items-center">
            <span className="text-[10px] text-cyan-400 font-black mb-1.5 select-none tracking-wider px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/15 rounded-md">
              نقطة التلاقي
            </span>
            <div 
              className="px-10 py-5 rounded-3xl border border-cyan-500/30 bg-[#081822] shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-3.5 text-right w-full justify-center max-w-sm"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/20">
                <Layers className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">حصيلة الفرص</h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5 font-bold">محادثات مؤهلة + فرص مباشرة</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-extrabold mt-2 text-center select-none">
              كل الفرص تتجمع هنا قبل أن تصل لمسؤول المبيعات.
            </p>
          </div>

          {/* Row 2 - Right: During Opportunities Card */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative h-full flex flex-col justify-between min-h-[150px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">أثناء الفرص</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  ندعم مسؤول المبيعات أثناء تحرك الفرصة: ردود مناسبة، تأهيل، متابعة، وتحويل الاهتمام إلى اجتماع.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400 font-extrabold">
                  <span>• دعم الردود والمحادثات</span>
                  <span>• تأهيل الفرص النشطة</span>
                  <span>• توجيه الخطوة التالية</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-cyan-400 font-black">
                الدعم: دعم وتحريك الفرصة وهي نشطة
              </div>
            </motion.div>
          </div>

          {/* ================= CONNECTOR 2 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Pool bottom-center (x = 50) -> Sales Rep top-center (x = 50) */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* During Opportunities center (x = 83.3) -> Pool bottom-center (x = 50) */}
              <path d="M 83.3 0 C 83.3 20, 50 20, 50 40" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Flow particles */}
              <circle r="2.5" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
              <circle r="2.5" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 83.3 0 C 83.3 20, 50 20, 50 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 3 ================= */}
          {/* Row 3 - Left: Empty */}
          <div className="col-span-4"></div>

          {/* Row 3 - Center: Sales Rep Card */}
          <div className="col-span-4 flex flex-col items-center">
            <div 
              className="px-8 py-4 rounded-2xl border border-emerald-500/20 bg-[#0c0c0c] flex items-center gap-3 text-right w-full justify-center max-w-sm"
            >
              <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">موظف مبيعات العميل</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">لا يبدأ من الصفر… يبدأ من فرص أجهز.</p>
              </div>
            </div>
          </div>

          {/* Row 3 - Right: After Opportunities Card */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative h-full flex flex-col justify-between min-h-[150px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">بعد الفرص</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  نحلل ما حدث بعد كل حركة: أين تعثرت الفرصة؟ كيف نطور الرسالة؟ وكيف نرفع التحويل في الأسبوع التالي؟
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400 font-extrabold">
                  <span>• تحليل الأداء والتعثر</span>
                  <span>• تطوير الرسائل والاعتراضات</span>
                  <span>• تدريب وتحسين أسبوعي</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-cyan-400 font-black">
                التطوير: تحليل وتحسين وتطوير بعد الحركة
              </div>
            </motion.div>
          </div>

          {/* ================= CONNECTOR 3 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Sales Rep (x = 50) -> Pipeline (x = 50) */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* After Opportunities (x = 83.3) -> Pipeline top-center (feedback loop) */}
              <path d="M 83.3 0 C 83.3 20, 50 20, 50 40" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Flow particles */}
              <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 4 ================= */}
          {/* Row 4 - Left: Empty */}
          <div className="col-span-4"></div>

          {/* Row 4 - Center: Pipeline Steps (Horizontal Row) */}
          <div className="col-span-4 flex justify-center items-center gap-2 w-full max-w-lg mx-auto z-10">
            {[
              { label: "فرص جاهزة للتحريك", color: "from-cyan-500/10 to-cyan-500/5 text-cyan-300 border-cyan-500/20" },
              { label: "اجتماعات مؤهلة", color: "from-cyan-500/10 to-cyan-500/5 text-cyan-300 border-cyan-500/20" },
              { label: "عروض سعر", color: "from-cyan-500/10 to-cyan-500/5 text-cyan-300 border-cyan-500/20" },
              { label: "تفاوض", color: "from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-emerald-500/20" },
              { label: "صفقات", color: "from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-emerald-500/20" },
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className={cn(
                  "flex-1 text-center py-2 px-1.5 rounded-xl border bg-gradient-to-b text-[9.5px] font-black tracking-wide leading-tight",
                  step.color
                )}>
                  {step.label}
                </div>
                {idx < 4 && (
                  <ArrowDown className="w-3.5 h-3.5 text-slate-700 shrink-0 rotate-90" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Row 4 - Right: Empty */}
          <div className="col-span-4"></div>

          {/* ================= CONNECTOR 4 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30" fill="none" preserveAspectRatio="none">
              <line x1="50" y1="0" x2="50" y2="30" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle r="2.5" fill="#f59e0b" filter="drop-shadow(0 0 3px #f59e0b)">
                <animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 0 L 50 30" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 5 ================= */}
          {/* Row 5 - Left: Empty */}
          <div className="col-span-4"></div>

          {/* Row 5 - Center: Target Card */}
          <div className="col-span-4 flex flex-col items-center z-10">
            <div 
              className="px-10 py-5 rounded-2xl border border-slate-800 bg-[#0d0d0d] text-center shadow-[0_0_15px_rgba(245,158,11,0.08)]"
            >
              <div className="flex justify-center mb-1">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                {PIPELINE_CONFIG.targetAmount}
              </div>
              <div className="text-xs text-slate-300 font-extrabold mt-1">
                {PIPELINE_CONFIG.targetPeriod}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-3 text-center max-w-xs leading-normal select-none">
              كل فرصة تتحرك داخل القمع تقرب فريقك من هذا الرقم.
            </p>
          </div>

          {/* Row 5 - Right: Empty */}
          <div className="col-span-4"></div>

        </div>

        {/* Mobile / Tablet Layout (Vertical Stepper accordion flow) */}
        <div className="lg:hidden flex flex-col gap-5 max-w-lg mx-auto">
          
          <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5 mb-3 text-right">
            <h3 className="text-base font-black text-white mb-2">مصدران للفرص… ومسار واحد نحو المستهدف</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              نغذي موظف مبيعاتك من مسارين متوازيين: كادر قيادة النمو الذكي يفتح محادثات مؤهلة من خلال النينجا، البيانات، الرسائل، التدريب، والمتابعة. وكادر فرص منافسات المباشرة يرصد فرصاً مباشرة من السوق واحتياجات قائمة. ثم تلتقي هذه الفرص في حصيلة واحدة، ليبدأ فريق مبيعاتك من فرص أجهز وأقرب للتحويل.
            </p>
            <p className="text-[11px] text-cyan-400 font-bold border-t border-slate-900 pt-3">
              نحن لا نزيد العبء على موظف المبيعات… نحن نزيد حصيلة الفرص التي تصل إليه، ثم نساعده على تحويلها إلى صفقات.
            </p>
          </div>

          {/* Mobile vertical flow cards */}
          <div className="space-y-4">
            
            {/* 1. Monafsat Card */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-emerald-400 mb-1 flex items-center gap-2">
                <BriefcaseBusiness className="w-3.5 h-3.5" />
                كادر فرص منافسات المباشرة
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                يرصد فرصاً من السوق السعودي لدى شركات وجهات لديها احتياج قائم، طلب شراء، أو تبحث عن موردين.
              </p>
              <div className="mt-2 text-[9px] text-emerald-300 font-black">الناتج: فرص مباشرة جاهزة للتحريك</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 2. Before Opportunities */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                قبل الفرص (تجهيز وتفعيل)
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                نجهز السوق قبل أن يصل لمسؤول المبيعات: بيانات، حسابات مستهدفة، صناع قرار، رسائل، وقنوات.
              </p>
              <div className="mt-2 text-[9px] text-cyan-300 font-black">الدور: تجهيز ما قبل وصول الفرصة</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 3. Opportunity Pool */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#081822] text-right text-center">
              <h3 className="text-xs font-black text-white mb-1 flex items-center justify-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                حصيلة الفرص
              </h3>
              <p className="text-[10px] text-slate-300 leading-normal font-bold">
                محادثات مؤهلة + فرص مباشرة
              </p>
              <p className="text-[9px] text-slate-500 mt-1">كل الفرص تتجمع هنا قبل أن تصل لمسؤول المبيعات.</p>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 4. During Opportunities */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                أثناء الفرص (دعم وتحريك)
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                ندعم مسؤول المبيعات أثناء تحرك الفرصة: ردود مناسبة، تأهيل، متابعة، وحجز اجتماعات.
              </p>
              <div className="mt-2 text-[9px] text-cyan-300 font-black">الدور: دعم وتحريك الفرصة وهي نشطة</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 5. Sales Rep */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-emerald-400 mb-1 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                موظف مبيعات العميل
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                لا يبدأ من الصفر، بل يستلم فرصاً أجهز مدعومة بالسياق والبيانات والمتابعة.
              </p>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 6. After Opportunities */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                بعد الفرص (تحليل وتطوير)
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                نحلل ما حدث بعد كل حركة: أين تعثرت الفرصة؟ كيف نطور الرسالة؟ وكيف نرفع التحويل؟
              </p>
              <div className="mt-2 text-[9px] text-cyan-300 font-black">الدور: تحليل وتحسين وتطوير بعد الحركة</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 7. Target */}
            <div className="p-5 rounded-xl border border-slate-800 bg-[#0d0d0d] text-center">
              <div className="text-lg font-black text-amber-400">{PIPELINE_CONFIG.targetAmount}</div>
              <div className="text-[10px] text-slate-300 font-bold mt-0.5">{PIPELINE_CONFIG.targetPeriod}</div>
              <p className="text-[9px] text-slate-500 font-bold mt-2">كل فرصة تتحرك داخل القمع تقرب فريقك من هذا الرقم.</p>
            </div>

          </div>

        </div>

        {/* Growth Leadership Partner Card (Relocated to full-width footer of this section) */}
        <div className="mt-16 bg-gradient-to-br from-slate-950/80 to-slate-900/20 border border-slate-900 rounded-3xl p-6 md:p-8 text-right relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500/40 via-emerald-500/40 to-transparent" />
          
          <div className="flex items-center gap-2.5 mb-4 select-none">
            <Award className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <h3 className="text-lg font-black text-white">دورنا: قيادة نمو كاملة حول فريقك</h3>
          </div>
          
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6 font-bold max-w-4xl">
            لسنا شركة تدريب فقط، ولا بيع عملاء محتملين فقط، ولا حجز اجتماعات فقط. نحن نبني ونقود منظومة تشغيل تجمع بين الاستشارات، التدريب، القيادة، المتابعة، التطوير، الأتمتة، الذكاء الاصطناعي، وفرص منافسات المباشرة.
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
