import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Users, 
  BriefcaseBusiness, 
  Bot, 
  Sparkles, 
  Activity, 
  ChevronDown, 
  FileText, 
  Layers, 
  ArrowDown, 
  HelpCircle, 
  Award, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepDetail {
  id: string;
  title: string;
  badge: string;
  short: string;
  description: string;
  points: string[];
  output: string;
  icon: React.ElementType;
  accentColor: string;
  glowColor: string;
}

const PIPELINE_CONFIG = {
  targetAmount: "1,000,000 ريال",
  targetPeriod: "خلال 90 يوم",
  subText: "كل مسار يضيف فرصاً، وكل فرصة تقرّب فريقك من هذا الرقم."
};

const STEPS_DATA: StepDetail[] = [
  {
    id: 'ninja-stream',
    title: "مسار النينجا والاستشارات",
    badge: "النينجا والفريق الاستشاري",
    short: "بيانات ورسائل وقنوات ← محادثات نشطة ← فرص مؤهلة",
    description: "نساعد موظف المبيعات على فتح محادثات نشطة من خلال التحليل، البيانات، الرسائل، القنوات، المتابعة، والتطوير المستمر.",
    points: [
      "الاستشارات: نحدد القطاع، صناع القرار، عرض القيمة، والقنوات المناسبة للوصول.",
      "التدريب: نجهز موظف المبيعات بالسكريبتات، طريقة الرد، الاعتراضات، وكيفية التحويل.",
      "القيادة والمتابعة: نقود خطة 90 يوم بأولويات واضحة، وأهداف أسبوعية ومراجعة مستمرة للحركة.",
      "التطوير المستمر: نحسن الرسائل والقنوات بناءً على نتائج السوق الحقيقية.",
      "الأتمتة والذكاء الاصطناعي: أتمتة الخطوات المكررة، تخصيص الرسائل وإثراء البيانات للوصول الذكي."
    ],
    output: "محادثات نشطة + فرص مؤهلة",
    icon: Sparkles,
    accentColor: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
    glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.25)]"
  },
  {
    id: 'monafsat-stream',
    title: "مسار فرص منافسات المباشرة",
    badge: "كادر منافسات البيعي",
    short: "رصد احتياج / RFP ← فرص مباشرة ← فرص جاهزة للتحريك",
    description: "كادر منافسات البيعي يعمل كمسار موازٍ يرصد احتياجات السوق وطلبات الشراء وRFPs، ثم يوفر فرصاً مباشرة يمكن تمريرها لموظف مبيعاتك.",
    points: [
      "رصد الاحتياج: متابعة إشارات السوق والجهات المهتمة والفرص المناسبة داخل القطاع.",
      "فرص RFP وطلبات الشراء: تصفية الفرص للجهات التي لديها ميزانية وطلب شراء قائم.",
      "مدخل مختلف للسوق: فتح قنوات تواصل موازية باسم منافسات لتجاوز حواجز التواصل التقليدية.",
      "تأهيل أولي: تصفية وفرز مبدئي لضمان ملاءمة الفرصة قبل تمريرها.",
      "تمرير الفرص: تسليم الفرصة بسياق واضح يساعد موظف مبيعاتك على التحرك الفوري."
    ],
    output: "فرص مباشرة من السوق + RFP / احتياج قائم",
    icon: BriefcaseBusiness,
    accentColor: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
    glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.25)]"
  },
  {
    id: 'opportunity-pool',
    title: "حصيلة الفرص",
    badge: "نقطة التلاقي المركزية",
    short: "فرص المحادثات + فرص السوق = Pipeline أقوى",
    description: "كل الفرص الناتجة من المسارين تتجمع وتلتقي في هذا المصب المركزي المشترك لتغذية وتوحيد قمع المبيعات قبل الانتقال للموظف.",
    points: [
      "من مسار النينجا: محادثات نشطة، ردود إيجابية، وفرص مؤهلة من Outreach.",
      "من مسار منافسات: فرص مباشرة من السوق، RFP، وجهات لديها طلب توريد نشط.",
      "تكامل القنوات: توحيد مصادر الفرص لمنع تشتت موظف المبيعات وضمان الاستمرارية."
    ],
    output: "فرص نشطة ومباشرة جاهزة للتحويل في مكان واحد",
    icon: Layers,
    accentColor: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
    glowColor: "shadow-[0_0_25px_rgba(6,182,212,0.3)]"
  },
  {
    id: 'sales-rep',
    title: "موظف مبيعات العميل",
    badge: "مستلم الفرص والتحويل",
    short: "يبدأ من فرص أجهز... لا من الصفر",
    description: "يتوقف موظفك عن هدر الوقت في البحث البارد أو القوائم العشوائية. يستلم فرصاً جاهزة للتحريك فوراً مدعومة بالتوجيهات والرسائل المناسبة.",
    points: [
      "ما يستلمه: تفاصيل الفرصة، سياق الملاءمة، أفضل قناة تواصل، والرد المقترح.",
      "ما يفعله: يؤكد الاحتياج، يحجز الاجتماع، يرسل العرض، ويقود المفاوضات للإغلاق.",
      "الدعم والتمكين: نتابعه ونساعده في صياغة الردود وتجاوز الاعتراضات خطوة بخطوة."
    ],
    output: "تركيز 100% على الاجتماعات والإغلاق",
    icon: Users,
    accentColor: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
    glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.25)]"
  },
  {
    id: 'sales-target',
    title: "المستهدف البيعي",
    badge: "الهدف النهائي للتشغيل",
    short: "تحقيق العقود والصفقات خلال 90 يوم",
    description: "الهدف الاستراتيجي الواضح الذي نقود العمل بأكمله نحوه، لترجمة الفرص والمحادثات إلى عقود وعوائد فعلية للشركة.",
    points: [
      `تحقيق المستهدف البيعي البالغ ${PIPELINE_CONFIG.targetAmount} خلال فترة 90 يوماً.`,
      "تحريك الفرص عبر قمع واضح: اجتماعات مؤهلة ← عروض سعر ← تفاوض ← صفقات.",
      "تحقيق عائد مستدام يثبت جدوى التشغيل الذكي للمبيعات."
    ],
    output: "1,000,000 ريال عوائد مستهدفة",
    icon: Target,
    accentColor: "text-amber-400 border-amber-500/30 bg-amber-950/20",
    glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.25)]"
  }
];

export const DualStreamPipelineSection = () => {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [expandedMobileStep, setExpandedMobileStep] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to reset selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsLocked(false);
        setActiveStepId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStepHover = (id: string | null) => {
    if (!isLocked) {
      setActiveStepId(id);
    }
  };

  const handleStepClick = (id: string) => {
    if (activeStepId === id && isLocked) {
      // Toggle off if clicking the already locked step
      setIsLocked(false);
      setActiveStepId(null);
    } else {
      setActiveStepId(id);
      setIsLocked(true);
    }
  };

  const currentStep = STEPS_DATA.find(s => s.id === activeStepId);

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-[#060606] border-t border-slate-900/60 relative overflow-hidden" 
      id="dual-stream-pipeline"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-950/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-4 select-none">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">تكامل منظومة المبيعات</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            كيف نقرّب موظف مبيعاتك من المستهدف البيعي؟
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            لا نعتمد على مصدر واحد للفرص. نحن نغذي موظف مبيعاتك من مسارين متوازيين، تلتقي فيهما الفرص في نقطة واحدة تسمى <span className="text-cyan-400 font-bold">“حصيلة الفرص”</span> لإنشاء قمع مبيعات قوي.
          </p>
        </div>

        {/* Desktop Layout (Split 60% Diagram / 40% Panel) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch">
          
          {/* Right Column (60%): Interactive Y-Shape Diagram */}
          <div className="col-span-7 flex flex-col justify-between bg-slate-950/30 border border-slate-900/80 rounded-3xl p-8 relative interactive-diagram-container">
            
            {/* Upper Row: Two Streams */}
            <div className="grid grid-cols-2 gap-8 relative z-10">
              
              {/* Right: Ninja Stream */}
              <div 
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-right",
                  activeStepId === 'ninja-stream'
                    ? "border-cyan-500/50 bg-[#0b131a] shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
                )}
                onMouseEnter={() => handleStepHover('ninja-stream')}
                onMouseLeave={() => handleStepHover(null)}
                onClick={() => handleStepClick('ninja-stream')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  {isLocked && activeStepId === 'ninja-stream' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <h3 className="text-base font-black text-white mb-2">مسار النينجا والاستشارات</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">يفتح محادثات نشطة مع صناع القرار عبر Outreach مدروس ومخصص.</p>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-cyan-400 font-bold">
                  <span>فرص مؤهلة</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">نشط</span>
                </div>
              </div>

              {/* Left: Monafsat Stream */}
              <div 
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-right",
                  activeStepId === 'monafsat-stream'
                    ? "border-emerald-500/50 bg-[#091512] shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
                )}
                onMouseEnter={() => handleStepHover('monafsat-stream')}
                onMouseLeave={() => handleStepHover(null)}
                onClick={() => handleStepClick('monafsat-stream')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                    <BriefcaseBusiness className="w-5 h-5" />
                  </div>
                  {isLocked && activeStepId === 'monafsat-stream' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <h3 className="text-base font-black text-white mb-2">مسار فرص منافسات</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">يرصد RFPs وطلبات الشراء والجهات الحكومية والخاصة ذات الاحتياج المباشر.</p>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-emerald-400 font-bold">
                  <span>فرص مباشرة من السوق</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">مباشر</span>
                </div>
              </div>

            </div>

            {/* Connecting SVG 1: Y-Shape Merging Path */}
            <div className="w-full my-4 relative z-0">
              <svg className="w-full h-16 overflow-visible" viewBox="0 0 100 80" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cyan-glow-grad" x1="1" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="emerald-glow-grad" x1="0" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* Right Branch (Ninja -> Pool) */}
                <path 
                  d="M 75 0 C 75 40, 50 40, 50 80" 
                  stroke="url(#cyan-glow-grad)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                
                {/* Left Branch (Monafsat -> Pool) */}
                <path 
                  d="M 25 0 C 25 40, 50 40, 50 80" 
                  stroke="url(#emerald-glow-grad)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />

                {/* Animated Particles flowing down */}
                <circle r="3" fill="#06b6d4" filter="drop-shadow(0 0 4px #06b6d4)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 75 0 C 75 40, 50 40, 50 80" />
                </circle>
                <circle r="3" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 25 0 C 25 40, 50 40, 50 80" />
                </circle>
              </svg>
            </div>

            {/* Middle Row: Opportunity Pool (نقطة التلاقي) */}
            <div className="flex justify-center relative z-10">
              <div 
                className={cn(
                  "px-8 py-4 rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-3 text-right max-w-sm",
                  activeStepId === 'opportunity-pool'
                    ? "border-cyan-500 bg-[#081822] shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-105"
                    : "border-slate-800 bg-[#0d0d0d] hover:border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                )}
                onMouseEnter={() => handleStepHover('opportunity-pool')}
                onMouseLeave={() => handleStepHover(null)}
                onClick={() => handleStepClick('opportunity-pool')}
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">حصيلة الفرص (Opportunity Pool)</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">تجمع فرص المحادثات النشطة + طلبات الشراء المباشرة</p>
                </div>
                {activeStepId === 'opportunity-pool' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
            </div>

            {/* Connecting SVG 2: Pool -> Sales Rep */}
            <div className="w-full my-3 relative z-0">
              <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 60" fill="none" preserveAspectRatio="none">
                <line 
                  x1="50" y1="0" x2="50" y2="60" 
                  stroke="rgba(6, 182, 212, 0.4)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <circle r="3" fill="#06b6d4" filter="drop-shadow(0 0 4px #06b6d4)">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 50 0 L 50 60" />
                </circle>
              </svg>
            </div>

            {/* Next Row: Sales Rep (موظف مبيعات العميل) */}
            <div className="flex justify-center relative z-10">
              <div 
                className={cn(
                  "px-8 py-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3 text-right max-w-sm",
                  activeStepId === 'sales-rep'
                    ? "border-emerald-500 bg-[#091814] shadow-[0_0_20px_rgba(16,185,129,0.25)] scale-105"
                    : "border-slate-800 bg-[#0c0c0c] hover:border-slate-700"
                )}
                onMouseEnter={() => handleStepHover('sales-rep')}
                onMouseLeave={() => handleStepHover(null)}
                onClick={() => handleStepClick('sales-rep')}
              >
                <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">موظف مبيعات العميل</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">يستلم فرصاً أجهز، مدعومة بالتوجيه والسياق الكامل</p>
                </div>
                {activeStepId === 'sales-rep' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
            </div>

            {/* Connecting SVG 3: Sales Rep -> Pipeline */}
            <div className="w-full my-3 relative z-0">
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 50" fill="none" preserveAspectRatio="none">
                <line 
                  x1="50" y1="0" x2="50" y2="50" 
                  stroke="rgba(16, 185, 129, 0.4)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <circle r="2.5" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 0 L 50 50" />
                </circle>
              </svg>
            </div>

            {/* Pipeline Steps Row */}
            <div className="flex justify-center items-center gap-3 relative z-10 w-full max-w-md mx-auto">
              {[
                { label: "اجتماعات مؤهلة", color: "from-cyan-500/10 to-cyan-500/5 text-cyan-300 border-cyan-500/20" },
                { label: "عروض سعر", color: "from-cyan-500/10 to-cyan-500/5 text-cyan-300 border-cyan-500/20" },
                { label: "تفاوض", color: "from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-emerald-500/20" },
                { label: "صفقات", color: "from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-emerald-500/20" },
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className={cn(
                    "flex-1 text-center py-2 px-1 rounded-xl border bg-gradient-to-b text-[10px] font-black tracking-wide",
                    step.color
                  )}>
                    {step.label}
                  </div>
                  {idx < 3 && (
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700 shrink-0 rotate-[270deg]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Connecting SVG 4: Pipeline -> Target */}
            <div className="w-full my-3 relative z-0">
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 50" fill="none" preserveAspectRatio="none">
                <line 
                  x1="50" y1="0" x2="50" y2="50" 
                  stroke="rgba(245, 158, 11, 0.4)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <circle r="2.5" fill="#f59e0b" filter="drop-shadow(0 0 3px #f59e0b)">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 0 L 50 50" />
                </circle>
              </svg>
            </div>

            {/* Bottom Row: Target (المستهدف البيعي) */}
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={cn(
                  "px-10 py-5 rounded-2xl border transition-all duration-300 cursor-pointer text-center",
                  activeStepId === 'sales-target'
                    ? "border-amber-500/60 bg-[#16120b] shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-105"
                    : "border-slate-800 bg-[#0d0d0d] hover:border-slate-700 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
                )}
                onMouseEnter={() => handleStepHover('sales-target')}
                onMouseLeave={() => handleStepHover(null)}
                onClick={() => handleStepClick('sales-target')}
              >
                <div className="flex justify-center mb-1">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight select-none">
                  {PIPELINE_CONFIG.targetAmount}
                </div>
                <div className="text-xs text-slate-300 font-extrabold mt-1 select-none">
                  {PIPELINE_CONFIG.targetPeriod}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-3 text-center max-w-xs leading-normal select-none">
                {PIPELINE_CONFIG.subText}
              </p>
            </div>

          </div>

          {/* Left Column (40%): Info Panel & Growth partner details */}
          <div className="col-span-5 flex flex-col gap-6">
            
            {/* Dynamic Step Detail Box */}
            <div className="flex-1 bg-slate-950/45 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col justify-between relative overflow-hidden min-h-[360px]">
              
              {/* Reset Lock instruction when active */}
              {isLocked && (
                <button 
                  onClick={() => { setIsLocked(false); setActiveStepId(null); }}
                  className="absolute top-4 left-4 text-[9px] px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 hover:text-white transition-colors"
                >
                  إلغاء التثبيت ✕
                </button>
              )}

              <AnimatePresence mode="wait">
                {currentStep ? (
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="text-right flex flex-col h-full justify-between"
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn("p-2 rounded-xl border shrink-0", currentStep.accentColor)}>
                          <currentStep.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 font-extrabold">{currentStep.badge}</span>
                          <h3 className="text-xl font-black text-white leading-tight">{currentStep.title}</h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed mb-6 font-bold">{currentStep.description}</p>

                      {/* Detail points */}
                      <div className="space-y-2 mb-6">
                        {currentStep.points.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-right">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span className="text-[11px] text-slate-400 font-bold leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Result Box */}
                    <div className="border-t border-slate-900 pt-4 mt-auto">
                      <div className="text-[10px] text-slate-500 font-extrabold mb-1">النتيجة والمخرجات:</div>
                      <div className="text-xs font-black text-white">{currentStep.output}</div>
                    </div>

                  </motion.div>
                ) : (
                  // Default panel content
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-right flex flex-col h-full justify-center py-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center mx-auto text-cyan-400 mb-4">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-white mb-2">مصدران للفرص… ومسار واحد نحو المستهدف</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed text-center font-bold mb-4">
                      نحن لا نبيع تدريبًا فقط، ولا داتا فقط، ولا اجتماعات فقط. نحن نبني حول موظف المبيعات منظومة تشغيل متكاملة تجمع بين الاستشارات، التدريب، القيادة، المتابعة، التطوير، الأتمتة، والذكاء الاصطناعي...
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed text-center font-bold">
                      (مرر الفأرة فوق أي خطوة في الرسم البياني لعرض تفاصيلها، واضغط عليها لتثبيتها)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Growth Leadership Partner Card */}
            <div className="bg-gradient-to-br from-slate-950/60 to-slate-900/20 border border-slate-900 rounded-3xl p-6 text-right relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500/40 via-emerald-500/40 to-transparent" />
              
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="text-sm font-black text-white">دورنا لا يتوقف عند التشغيل</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                نعمل كشريك قيادي للنمو (<span className="text-cyan-400 font-bold">Growth Leadership Partner</span>) لبناء وتوجيه المنظومة كاملة:
              </p>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-slate-400 font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                  <span>استشارات تحديد قطاع وصناع قرار</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                  <span>تدريب الموظف على الرد والتحويل</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                  <span>قيادة خطة 90 يوم ومؤشرات أداء</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                  <span>متابعة أسبوعية للفانل والأنشطة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span>تطوير مستمر للرسائل والعروض</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span>أتمتة للمتابعة وتنظيم الفانل</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                  <span>ذكاء اصطناعي للتحليل والتخصيص</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span>فرص مباشرة من كادر منافسات</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile / Tablet Layout (Simple Interactive Stepper, no heavy SVG lines) */}
        <div className="lg:hidden flex flex-col gap-5 max-w-lg mx-auto">
          
          <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-5 mb-3 text-right">
            <h3 className="text-base font-black text-white mb-2">مصدران للفرص… ومسار واحد نحو المستهدف</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نغذي فريق مبيعات العميل من مسارين متوازيين، ثم تلتقي هذه الفرص في نقطة واحدة تسمى “حصيلة الفرص”، ليتحرك موظف المبيعات نحو الاجتماعات والصفقات.
            </p>
          </div>

          <div className="space-y-4">
            {STEPS_DATA.map((step, idx) => {
              const isExpanded = expandedMobileStep === step.id;
              const StepIcon = step.icon;

              return (
                <div 
                  key={step.id}
                  className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-300 text-right bg-slate-950/20",
                    isExpanded ? "border-slate-700 bg-slate-950/50" : "border-slate-900 hover:border-slate-800"
                  )}
                >
                  {/* Step Header Row */}
                  <button
                    onClick={() => setExpandedMobileStep(isExpanded ? null : step.id)}
                    className="w-full p-4 flex items-center justify-between text-right gap-4 outline-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("p-2 rounded-xl border shrink-0", step.accentColor)}>
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] text-slate-500 font-extrabold">{step.badge}</span>
                        <h3 className="text-sm font-black text-white leading-tight">{step.title}</h3>
                      </div>
                    </div>
                    
                    <ChevronDown className={cn(
                      "w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0",
                      isExpanded && "rotate-180"
                    )} />
                  </button>

                  {/* Step Body (Expanded) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-5 pt-1 border-t border-slate-900/60 space-y-4">
                          <p className="text-xs text-slate-300 leading-relaxed font-bold">
                            {step.description}
                          </p>

                          <div className="space-y-2 pl-1">
                            {step.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-right">
                                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                <span className="text-[10px] text-slate-400 font-bold leading-relaxed">{pt}</span>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 flex justify-between items-center text-[10px]">
                            <span className="text-slate-500 font-bold">المخرج / النتيجة:</span>
                            <span className="font-black text-white">{step.output}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Mobile Target Card */}
          <div className="bg-[#16120b] border border-amber-500/20 rounded-2xl p-5 text-center mt-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <div className="inline-flex p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {PIPELINE_CONFIG.targetAmount}
            </div>
            <div className="text-xs text-slate-300 font-bold mt-1">
              {PIPELINE_CONFIG.targetPeriod}
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-2 max-w-xs mx-auto leading-normal">
              {PIPELINE_CONFIG.subText}
            </p>
          </div>

          {/* Mobile Growth Leadership Card */}
          <div className="bg-gradient-to-br from-slate-950/60 to-slate-900/20 border border-slate-900 rounded-2xl p-5 text-right mt-3">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-cyan-400 shrink-0" />
              <h3 className="text-xs font-black text-white">دورنا لا يتوقف عند التشغيل</h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
              نعمل كشريك قيادي للنمو لبناء وتوجيه كامل المنظومة:
            </p>
            <div className="grid grid-cols-1 gap-y-2 text-[9px] text-slate-400 font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                <span>استشارات تحديد قطاع وصناع قرار</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                <span>تدريب الموظف وتجهيز السكريبتات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                <span>قيادة خطة 90 يوم ومراجعة القمع أسبوعياً</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                <span>تطوير مستمر للرسائل وأتمتة للمتابعة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                <span>فرص مباشرة من كادر منافسات البيعي</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
