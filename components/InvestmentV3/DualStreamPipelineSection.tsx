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
            نزيد حصيلة الفرص التي تصل لفريق مبيعاتك
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            مسار قيادة النمو الذكي يفتح محادثات مؤهلة، وكادر منافسات يرصد فرصاً مباشرة من السوق. ثم تلتقي الفرص في حصيلة واحدة، ليبدأ فريقك من فرص أجهز وأقرب للتحويل.
          </p>
        </div>

        {/* Desktop Layout (Full-width 3-Column Diagram) */}
        <div className="hidden lg:grid grid-cols-12 gap-y-2 gap-x-8 items-center relative">
          
          {/* ================= ROW 1 ================= */}
          {/* Absolute SVG for horizontal connectors inside Row 1 */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              <defs>
                <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
                </marker>
                <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                </marker>
              </defs>
              {/* Arrow from Right (Growth Before) [x = 69] to Center (Sales Rep) [x = 63.5] */}
              <path d="M 69 68 L 63.5 68" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-cyan)" />
              {/* Arrow from Left (Monafsat) [x = 31] to Center (Sales Rep) [x = 36.5] */}
              <path d="M 31 68 L 36.5 68" stroke="rgba(16, 185, 129, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-emerald)" />
              
              {/* Flow particles for Row 1 horizontal arrows */}
              <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 69 68 L 63.5 68" />
              </circle>
              <circle r="2" fill="#10b981" filter="drop-shadow(0 0 2px #10b981)">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 31 68 L 36.5 68" />
              </circle>
            </svg>
          </div>

          {/* Row 1 - Right Column: Before Opportunities (Growth Leadership Stream) */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            {/* Growth Leadership Header Label */}
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-4 select-none">
              <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">كادر فريق النمو الذكي</h3>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-black text-white">كادر فريق النمو الذكي</h3>
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

          {/* Row 1 - Center: Client's Sales Representative (Main Beneficiary) */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            {/* Visual alignment spacer matching the right column header */}
            <div className="h-[28px] mb-4 select-none opacity-0 pointer-events-none">محاذاة</div>
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/40 text-right hover:border-emerald-500/40 transition-all duration-300 shadow-lg relative flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">موظف مبيعات العميل</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  لا يبدأ من الصفر، بل يستلم فرصاً جاهزة ومؤهلة مدعومة بكافة البيانات وسياق المحادثات لبدء الإغلاق فوراً.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400 font-extrabold">
                  <span>• التركيز على الإغلاق والصفقات</span>
                  <span>• استلام بيانات وسياق الفرص</span>
                  <span>• توفير وقت البحث والتنقيب</span>
                </div>
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

          {/* ================= CONNECTOR 1 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Center Branch (Sales Rep [x = 50] -> Positive Conversations [x = 50]) */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Left Branch (Monafsat [x = 16.6] -> Monafsat bypass [x = 16.6]) */}
              <line x1="16.6" y1="0" x2="16.6" y2="40" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.2" strokeDasharray="4 4" />
              {/* Right Branch (Growth Staff [x = 83.3] -> During Opportunities [x = 83.3]) */}
              <line x1="83.3" y1="0" x2="83.3" y2="40" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.2" strokeDasharray="4 4" />
              
              {/* Flow particles */}
              <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
              <circle r="2" fill="#10b981" opacity="0.6" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 16.6 0 L 16.6 40" />
              </circle>
              <circle r="2" fill="#06b6d4" opacity="0.6" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 83.3 0 L 83.3 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 2 ================= */}
          <div className="col-span-12 grid grid-cols-12 gap-x-8 items-center relative">
            {/* Absolute SVG for horizontal connectors inside Row 2 */}
            <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                {/* Arrow from Right (Growth During) [x = 69] to Center (Positive Conversations) [x = 63.5] */}
                <path d="M 69 50 L 63.5 50" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-cyan)" />
                
                {/* Flow particles */}
                <circle r="2" fill="#06b6d4" filter="drop-shadow(0 0 2px #06b6d4)">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 69 50 L 63.5 50" />
                </circle>
              </svg>
            </div>

            {/* Row 2 - Right: During Opportunities Card */}
            <div className="col-span-4 h-full flex flex-col justify-between">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative h-full flex flex-col justify-between min-h-[150px]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
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

            {/* Row 2 - Center: Positive Conversations Card */}
            <div className="col-span-4 h-full flex flex-col justify-between">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative flex flex-col justify-between min-h-[150px] h-full"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-white">المحادثات الإيجابية مع عملاء محتملين</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                    فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام وتسهيل تحويل الحسابات المستهدفة إلى فرصة حقيقية.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400 font-extrabold">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 font-black">خاص بكادر النمو الذكي</span>
                    <span>• بناء الاهتمام والتفاعل</span>
                    <span>• تنظيم ومتابعة التواصل</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-cyan-400 font-black">
                  المرحلة: تنشيط الحسابات وصناعة الاهتمام البيعي
                </div>
              </motion.div>
            </div>

            {/* Row 2 - Left: Empty Spacer */}
            <div className="col-span-4 h-full"></div>
          </div>

          {/* ================= CONNECTOR 2 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Center Branch (Positive Conversations [x = 50] -> Opportunity Pool [x = 50]) */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Left Branch (Monafsat bypass [x = 16.6] -> Opportunity Pool [x = 50]) */}
              <path d="M 16.6 0 C 16.6 20, 50 20, 50 40" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Right Branch (During Opportunities [x = 83.3] -> After Opportunities [x = 83.3]) */}
              <line x1="83.3" y1="0" x2="83.3" y2="40" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.2" strokeDasharray="4 4" />
              
              {/* Flow particles */}
              <circle r="2.5" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
              <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 16.6 0 C 16.6 20, 50 20, 50 40" />
              </circle>
              <circle r="2" fill="#06b6d4" opacity="0.6" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 83.3 0 L 83.3 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 3 ================= */}
          {/* Row 3 - Right: After Opportunities Card */}
          <div className="col-span-4 h-full flex flex-col justify-between">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 text-right hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative h-full flex flex-col justify-between min-h-[150px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
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

          {/* Row 3 - Center: Opportunity Pool Card */}
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
              تتلاقى هنا محادثات النمو الذكي وفرص منافسات المباشرة.
            </p>
          </div>

          {/* Row 3 - Left: Empty Spacer */}
          <div className="col-span-4 h-full"></div>

          {/* ================= CONNECTOR 3 ================= */}
          <div className="col-span-12 my-1 relative z-0">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
              {/* Pool (x = 50) -> Pipeline (x = 50) */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* After Opportunities [x = 83.3] -> Pipeline top-center (feedback loop) */}
              <path d="M 83.3 0 C 83.3 20, 50 20, 50 40" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />

              {/* Flow particles */}
              <circle r="2.5" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 0 L 50 40" />
              </circle>
              <circle r="2" fill="#06b6d4" opacity="0.5" filter="drop-shadow(0 0 2px #06b6d4)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 83.3 0 C 83.3 20, 50 20, 50 40" />
              </circle>
            </svg>
          </div>

          {/* ================= ROW 4 ================= */}
          {/* Row 4 - Right: Empty */}
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

          {/* Row 4 - Left: Empty */}
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
              نغذي موظف مبيعاتك من مسارين متوازيين: كادر فريق النمو الذكي يفتح محادثات مؤهلة من خلال البيانات، الرسائل، والمتابعة. وكادر فرص منافسات المباشرة يرصد فرصاً مباشرة من السوق واحتياجات قائمة. ثم تلتقي هذه الفرص في حصيلة واحدة، ليبدأ فريق مبيعاتك من فرص أجهز وأقرب للتحويل.
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

            {/* 2. Smart Growth Team Staff */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                كادر فريق النمو الذكي
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                نجهز السوق قبل أن يصل لمسؤول المبيعات: بيانات، حسابات مستهدفة، صناع قرار، رسائل، وقنوات.
              </p>
              <div className="mt-2 text-[9px] text-cyan-300 font-black">الدور: تجهيز ما قبل وصول الفرصة</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 3. Client's Sales Rep */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-emerald-400 mb-1 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                موظف مبيعات العميل
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                لا يبدأ من الصفر، بل يستلم فرصاً جاهزة ومؤهلة مدعومة بكافة البيانات وسياق المحادثات لبدء الإغلاق فوراً.
              </p>
              <div className="mt-2 text-[9px] text-emerald-300 font-black">الدور: التركيز على الإغلاق والصفقات</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 4. Positive Conversations */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                المحادثات الإيجابية مع عملاء محتملين
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                فتح قنوات تواصل دافئة وتفاعل مستمر لبناء الاهتمام وتسهيل تحويل الحسابات المستهدفة إلى فرصة حقيقية. (خاص بكادر النمو الذكي).
              </p>
              <div className="mt-2 text-[9px] text-cyan-300 font-black">المرحلة: تنشيط الحسابات وصناعة الاهتمام</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 5. Opportunity Pool */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#081822] text-right text-center">
              <h3 className="text-xs font-black text-white mb-1 flex items-center justify-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                حصيلة الفرص
              </h3>
              <p className="text-[10px] text-slate-300 leading-normal font-bold">
                محادثات مؤهلة + فرص مباشرة
              </p>
              <p className="text-[9px] text-slate-500 mt-1">تتلاقى هنا محادثات النمو الذكي وفرص منافسات المباشرة.</p>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 6. During Opportunities */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-right">
              <h3 className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                أثناء الفرص (دعم وتحريك)
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                ندعم مسؤول المبيعات أثناء تحرك الفرصة: ردود مناسبة، تأهيل، متابعة، وتحويل الاهتمام إلى اجتماع.
              </p>
              <div className="mt-2 text-[9px] text-cyan-300 font-black">الدور: دعم وتحريك الفرصة وهي نشطة</div>
            </div>

            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>

            {/* 7. After Opportunities */}
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

            {/* 8. Target */}
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
