import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  LineChart,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Target,
  TrendingDown,
  UserRoundCheck,
  Users,
  Globe,
  Sparkles,
  MessagesSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StatsRow } from '../components/InvestmentV3/dashboard/StatsRow';
import { PartnersMarqueeSection } from '../components/InvestmentV3/PartnersMarqueeSection';
import { OpportunitySourcesSection } from '../components/InvestmentV3/OpportunitySourcesSection';
import { GrowthCalculatorSection } from '../components/InvestmentV3/GrowthCalculatorSection';
import { MonafsatNetworkSection } from '../components/InvestmentV3/MonafsatNetworkSection';
import { GrowthTriangleSection } from '../components/InvestmentV3/GrowthTriangleSection';

import { FutureSection } from '../components/InvestmentV3/FutureSection';
import { SmartPortfolioSection } from '../components/InvestmentV3/SmartPortfolioSection';
import { DualStreamPipelineSection } from '../components/InvestmentV3/DualStreamPipelineSection';
import { OperationalFormulaSection } from '../components/InvestmentV3/OperationalFormulaSection';
import { cn } from '../lib/utils';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

export const useSharedMotion = () => {
  const shouldReduce = useReducedMotion();

  // Standardized reveal animation variant
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
        ease: [0.16, 1, 0.3, 1] // Custom easeOutExpo
      }
    }
  };

  // Standardized stagger container variant
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0.02 : 0.06,
        delayChildren: shouldReduce ? 0.01 : 0.1
      }
    }
  };

  // Standardized stagger item variant
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

const ArabicOnlyTextSanitizer = () => {
  useEffect(() => {
    const replacements: Array<[RegExp, string]> = [
      [/\bInvestment\s*2\b/gi, 'نسخة الاستثمار الثانية'],
      [/\bA\/B\b/gi, 'مقارنة'],
      [/\bInputs\b/g, 'المدخلات'],
      [/\bInput\b/g, 'المدخل'],
      [/\bProcess\b/g, 'التنفيذ'],
      [/\bOutputs\b/g, 'المخرجات'],
      [/\bOutput\b/g, 'المخرج'],
      [/\bOutcomes\b/g, 'النتائج'],
      [/\bOutcome\b/g, 'النتيجة'],
      [/\bActivity\b/g, 'النشاط'],
      [/\bConversion\b/g, 'التحويل'],
      [/\bQuality\b/g, 'الجودة'],
      [/\bAction Plan\b/g, 'خطة العمل'],
      [/\bWhatsApp Script\b/g, 'نص واتساب'],
      [/\bCall Script\b/g, 'نص المكالمة'],
      [/\bFollow-up Step\b/g, 'خطوة المتابعة'],
      [/\bFollow[- ]?up\b/gi, 'المتابعة'],
      [/\bDashboard\b/g, 'لوحة المتابعة'],
      [/\bPlaybook\b/g, 'دليل التشغيل'],
      [/\bCRM\b/g, 'نظام المتابعة'],
      [/\bICP\b/g, 'ملف العميل المثالي'],
      [/\bLinkedIn\b/g, 'لينكدإن'],
      [/\bEmail\b/g, 'البريد الإلكتروني'],
      [/\bAI\b/g, 'الذكاء الاصطناعي'],
      [/\bAPI\b/g, 'واجهة الربط'],
      [/\bLive\b/g, 'مباشر'],
      [/\bData\b/g, 'البيانات'],
      [/\bConversion Funnel\b/g, 'قمع التحويل'],
      [/\bAutomated\b/g, 'آلية'],
      [/\bAutomation\b/g, 'الأتمتة'],
      [/\bApollo\b/g, 'مصدر بيانات خارجي'],
      [/\bLusha\b/g, 'مصدر بيانات خارجي'],
      [/\bClay\b/g, 'أداة إثراء بيانات'],
      [/\bHubSpot\b/g, 'نظام علاقات العملاء'],
      [/\bSalesforce\b/g, 'نظام علاقات العملاء'],
      [/\bWhatsApp\b/g, 'واتساب'],
      [/\bLinkedin\b/g, 'لينكدإن'],
      [/\bCSV\b/g, 'ملف بيانات'],
      [/\bPDF\b/g, 'ملف تقرير'],
    ];

    const sanitizeText = (text: string) =>
      replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);

    const sanitizeNode = (root: ParentNode) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode as Text);
      }

      nodes.forEach((node) => {
        const next = sanitizeText(node.nodeValue || '');
        if (next !== node.nodeValue) {
          node.nodeValue = next;
        }
      });
    };

    sanitizeNode(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const next = sanitizeText(textNode.nodeValue || '');
            if (next !== textNode.nodeValue) {
              textNode.nodeValue = next;
            }
            return;
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            sanitizeNode(node as Element);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-14"
  >
    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto">
      {title}
    </h2>
    {description && (
      <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mt-5">
        {description}
      </p>
    )}
  </motion.div>
);


const SaudiUnderline = () => {
  const shouldReduce = useReducedMotion();

  return (
    <span className="relative inline-block">
      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-cyan-300 to-emerald-250">
        السوق السعودي
      </span>
      {/* Right-to-left sweep underline */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          delay: shouldReduce ? 0 : 0.8,
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{ originX: 1 }}
        className="absolute bottom-1.5 right-0 left-0 h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 rounded-full z-0 overflow-hidden"
      >
        {!shouldReduce && (
          <motion.span
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              repeat: Infinity,
              repeatDelay: 5,
              duration: 1.8,
              ease: 'easeInOut',
              delay: 2
            }}
            className="absolute inset-y-0 right-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2"
          />
        )}
      </motion.span>
    </span>
  );
};

const HeroSection2 = () => {
  const { shouldReduce, container, item } = useSharedMotion();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[86vh] bg-[#050505] overflow-hidden flex items-center py-20 border-b border-slate-900/70">
      {/* Background Grid & Glowing circles */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415533_1px,transparent_1px),linear-gradient(to_bottom,#33415533_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000_60%,transparent_100%)] pointer-events-none" />

        <motion.div
          animate={shouldReduce ? {} : {
            scale: [1, 1.03, 1],
            opacity: [0.18, 0.25, 0.18]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"
        />

        <motion.div
          animate={shouldReduce ? {} : {
            scale: [1, 1.02, 1],
            opacity: [0.18, 0.23, 0.18]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 right-10 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight max-w-5xl"
          >
            <motion.span
              initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="block"
            >
              نساعد فريق مبيعاتك يبيع أكثر
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
              className="block text-white mt-3"
            >
              في <SaudiUnderline /> خلال 90 يوم
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.9 }}
            className="text-base md:text-xl text-slate-300 leading-relaxed mt-7 max-w-4xl mx-auto"
          >
            نحدد القطاع، نصل لصناع القرار، نفتح المحادثات، ثم نساعد فريقك على تحويلها إلى اجتماعات، عروض، وصفقات.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduce ? 0.02 : 0.1,
                  delayChildren: shouldReduce ? 0.05 : 1.3
                }
              }
            }}
            className="flex flex-col sm:flex-row gap-4 mt-9 justify-center"
          >
            <motion.button
              variants={{
                hidden: { opacity: 0, y: shouldReduce ? 0 : 10 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={shouldReduce ? {} : {
                y: -3,
                boxShadow: "0 10px 25px rgba(52,211,153,0.35)",
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => scrollToSection('growth-calculator')}
              className="relative px-7 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition-colors"
            >
              {!shouldReduce && (
                <motion.span
                  animate={{ opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-emerald-400/25 blur-md pointer-events-none -z-10"
                />
              )}
              احسب مستهدفك خلال 90 يوم
            </motion.button>
            <motion.button
              variants={{
                hidden: { opacity: 0, y: shouldReduce ? 0 : 10 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={shouldReduce ? {} : {
                y: -3,
                borderColor: "rgba(6,182,212,0.6)",
                color: "#cffafe",
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => scrollToSection('execution-timeline')}
              className="px-7 py-4 rounded-2xl bg-transparent border border-slate-700 text-slate-300 font-black hover:border-cyan-500/50 transition-all"
            >
              كيف نعمل؟
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const ChallengesSection = () => {
  const [activeMobileTab, setActiveMobileTab] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { shouldReduce, reveal, container, item } = useSharedMotion();

  const springTransition = { type: 'spring', stiffness: 220, damping: 26 };

  const stages = [
    {
      title: 'قبل الفرص',
      shortSummary: 'تجهيز الداتا روم البيعي والاستهداف',
      challenge: 'الفريق يبدأ من بيانات ناقصة، ورسائل عامة، وعرض غير مخصص.',
      points: [
        'العميل المحتمل غير محدد بدقة',
        'الخدمة غير مصاغة كمنتج خدمي واضح',
        'صفحات الهبوط والرسائل غير مخصصة لكل صناعة',
        'ملف الشركة وعرض السعر لا يساعدان على الإغلاق',
        'لا توجد أفضل قناة أو افتتاحية واضحة'
      ],
      result: 'تجهيز أقوى قبل بدء الحركة',
      icon: ClipboardList,
      color: 'teal',
      glowColor: 'rgba(20, 184, 166, 0.15)',
      activeColor: 'text-teal-400',
      borderColor: 'border-teal-500/20 hover:border-teal-500/40',
      activeBorder: 'border-teal-500/40 bg-teal-500/5 shadow-[0_0_15px_rgba(20,184,166,0.15)]',
      dotColor: 'bg-teal-400'
    },
    {
      title: 'أثناء الفرص',
      shortSummary: 'تحريك المحادثات وتحويل الاهتمام',
      challenge: 'الاهتمام موجود، لكن التحويل ضعيف والمتابعة غير كافية.',
      points: [
        'بطء في الرد والمتابعة',
        'اعتراضات متكررة بدون تطوير',
        'غياب سكريبت واضح للمحادثة أو المكالمة',
        'اجتماعات غير مؤهلة',
        'ضعف في توجيه الخطوة التالية'
      ],
      result: 'تحريك أفضل للفرص ورفع جودة التحويل',
      icon: MessageSquare,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.15)',
      activeColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/40',
      activeBorder: 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      dotColor: 'bg-cyan-400'
    },
    {
      title: 'بعد الفرص',
      shortSummary: 'تحليل القمع وتحسين الأداء',
      challenge: 'لا يتم تحليل ما حدث، فتتكرر نفس الأخطاء ولا يتحسن القمع.',
      points: [
        'لا يوجد تحليل لنقاط التعطل',
        'أسباب الرفض غير موثقة',
        'الرسائل والعروض لا تتطور',
        'الاجتماعات غير المؤهلة تستهلك الوقت',
        'لا توجد دورة تحسين أسبوعية واضحة'
      ],
      result: 'تحسين مستمر للأداء وجودة الفرص',
      icon: RefreshCw,
      color: 'emerald',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      activeColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
      activeBorder: 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      dotColor: 'bg-emerald-400'
    }
  ];

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="pt-20 pb-36 bg-[#050505] border-t border-slate-900/60 relative overflow-visible"
    >
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <SectionHeader
          eyebrow="رحلة التحديات والحلول"
          title="التحدي ليس في الفرص فقط… بل في تحويلها"
          description="فرق المبيعات لا تتعطل في مرحلة واحدة فقط، بل تواجه تحديات قبل الفرصة، أثناء تحريكها، وبعدها. لذلك نعمل على 3 مراحل مترابطة تحسن القمع البيعي بالكامل."
        />

        {/* Desktop Layout (md and up) */}
        <div className="hidden md:block relative min-h-[280px] mb-28">
          {/* SVG Connecting Line */}
          <svg className="absolute inset-x-0 top-[60px] w-full h-[60px] pointer-events-none z-0" fill="none" viewBox="0 0 1000 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="connecting-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            {/* Glowing background path blur */}
            {!shouldReduce && (
              <motion.path
                d="M 180 30 C 340 5, 660 55, 820 30"
                stroke="url(#connecting-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.2"
                animate={{ opacity: [0.1, 0.35, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: "blur(2.5px)" }}
              />
            )}
            {/* Foreground drawing path with linear flow dash animation */}
            <motion.path
              d="M 180 30 C 340 5, 660 55, 820 30"
              stroke="url(#connecting-grad)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              initial={{ pathLength: shouldReduce ? 1 : 0, strokeDashoffset: 0 }}
              whileInView={{ pathLength: 1 }}
              animate={shouldReduce ? {} : { strokeDashoffset: [0, -24] }}
              viewport={{ once: true }}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : {
                      pathLength: { duration: 1.2, ease: "easeInOut", delay: 0.6 },
                      strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" }
                    }
              }
            />
          </svg>

          <motion.div
            variants={container}
            className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start relative z-10"
          >
            {stages.map((stage, idx) => {
              const IconComponent = stage.icon;
              const isHovered = hoveredCard === idx;

              return (
                <motion.div
                  key={stage.title}
                  variants={item}
                  className="relative group flex flex-col"
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card wrapper */}
                  <motion.div
                    animate={shouldReduce ? {} : { y: isHovered ? -4 : 0 }}
                    transition={springTransition}
                    className={cn(
                      "border rounded-3xl p-7 text-right relative z-20 cursor-pointer min-h-[170px] transition-all duration-300 flex flex-col justify-between overflow-hidden",
                      isHovered
                        ? "border-transparent bg-slate-950/20"
                        : "border-slate-800/80 bg-slate-950/40"
                    )}
                  >
                    {/* Rotating border glow on hover */}
                    {isHovered && !shouldReduce && (
                      <>
                        <div className="absolute -inset-[1px] rounded-3xl overflow-hidden pointer-events-none z-0">
                          <div 
                            className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite]"
                            style={{
                              background: `conic-gradient(from 0deg, transparent 0deg, ${
                                stage.color === 'teal' ? '#14b8a6' : stage.color === 'cyan' ? '#06b6d4' : '#10b981'
                              } 180deg, transparent 360deg)`
                            }}
                          />
                        </div>
                        {/* Inner solid background overlay */}
                        <div className="absolute inset-[1.5px] rounded-[23px] bg-slate-950/95 z-10 pointer-events-none" />
                      </>
                    )}

                    {/* Shared Layout Active Highlight Pill */}
                    {isHovered && (
                      <motion.div
                        layoutId="challenges-shared-highlight"
                        className="absolute inset-0 rounded-3xl bg-transparent shadow-2xl -z-10"
                        style={{
                          boxShadow: `0 10px 30px -10px ${stage.glowColor}`
                        }}
                        transition={springTransition}
                      />
                    )}

                    {/* Content container wrapped in relative z-20 to display above glow layers */}
                    <div className="relative z-20 flex flex-col justify-between h-full w-full">
                      {/* Header Row (Icon + Indicator) */}
                      <div className="flex items-center justify-between mb-6">
                        <motion.div
                          animate={{ scale: isHovered ? 1.08 : 1 }}
                          transition={springTransition}
                          className={cn(
                            'w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300',
                            isHovered
                              ? 'bg-slate-900/90 border-slate-750 text-cyan-300 shadow-lg'
                              : 'bg-slate-950 border-slate-900 text-slate-400'
                          )}
                        >
                          <IconComponent className="w-5 h-5" />
                        </motion.div>

                        {/* Pulse Indicator */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-bold group-hover:text-cyan-300 transition-colors">عرض التفاصيل</span>
                          <div className="relative flex h-2 w-2">
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", stage.dotColor)}></span>
                            <span className={cn("relative inline-flex rounded-full h-2 w-2", stage.dotColor)}></span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className={cn("text-xl font-black mb-3 transition-colors", isHovered ? stage.activeColor : "text-white")}>
                          {stage.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                          {stage.shortSummary}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Popover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: shouldReduce ? 0 : 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: shouldReduce ? 0 : 12, scale: 0.98 }}
                        transition={springTransition}
                        className={cn(
                          "relative w-full mt-3 bg-slate-950/95 border rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md z-30 text-right pointer-events-auto",
                          idx === 0 ? "origin-top-right" : idx === 2 ? "origin-top-left" : "origin-top"
                        )}
                        style={{ borderColor: stage.color === 'teal' ? '#14b8a650' : stage.color === 'cyan' ? '#06b6d450' : '#10b98150' }}
                      >
                        {/* Glow effect at popover top */}
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                        <div className="mb-4">
                          <span className={cn("text-xs font-black px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800/80 mb-2 inline-block", stage.activeColor)}>
                            {stage.title}
                          </span>
                          <h4 className="text-xs font-bold text-slate-400 mb-1">التحدي:</h4>
                          <p className="text-sm text-white font-bold leading-relaxed">{stage.challenge}</p>
                        </div>

                        <div className="h-[1px] bg-slate-900 my-4" />

                        <ul className="space-y-3 mb-5">
                          {stage.points.map((point) => (
                            <li key={point} className="flex items-start gap-2.5 text-right justify-start">
                              <CheckCircle2 className={cn("w-4 h-4 mt-0.5 shrink-0", stage.activeColor)} />
                              <span className="text-xs text-slate-300 font-bold leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 text-center">
                          <span className="text-[10px] text-slate-500 font-black block mb-0.5">الناتج المستهدف</span>
                          <span className="text-xs text-white font-black">{stage.result}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Layout (less than md) */}
        <div className="md:hidden mb-12">
          {/* Tab selector pills */}
          <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
            {stages.map((stage, idx) => {
              const IconComponent = stage.icon;
              const isActive = activeMobileTab === idx;

              return (
                <button
                  key={stage.title}
                  onClick={() => setActiveMobileTab(idx)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "border-transparent bg-transparent"
                      : "bg-slate-950/40 border-slate-900 text-slate-400"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-challenges-active-highlight"
                      className="absolute inset-0 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.1)] -z-10"
                      transition={springTransition}
                    />
                  )}
                  <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center mb-1.5 transition-colors duration-300", isActive ? "bg-slate-950 text-cyan-300 border-slate-800/60" : "bg-slate-950 text-slate-500 border-slate-900")}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className={cn("text-xs font-black transition-colors duration-300", isActive ? "text-white" : "text-slate-400")}>
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details Area */}
          <div className="bg-slate-950/75 border border-slate-900 rounded-3xl p-5 text-right relative overflow-hidden shadow-xl">
            {/* Glow inside details */}
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 100% 0%, ${stages[activeMobileTab].glowColor}, transparent 70%)`
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMobileTab}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduce ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  <div className="text-xs text-slate-500 font-bold mb-1">
                    {stages[activeMobileTab].shortSummary}
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 mb-1">التحدي:</h4>
                  <p className="text-sm text-white font-bold leading-relaxed">
                    {stages[activeMobileTab].challenge}
                  </p>
                </div>

                <div className="h-[1px] bg-slate-900 my-4" />

                <ul className="space-y-3 mb-5">
                  {stages[activeMobileTab].points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-right justify-start">
                      <CheckCircle2 className={cn("w-4 h-4 mt-0.5 shrink-0", stages[activeMobileTab].activeColor)} />
                      <span className="text-xs text-slate-300 font-bold leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-500 font-black block mb-0.5">الناتج المستهدف</span>
                  <span className="text-xs text-white font-black">{stages[activeMobileTab].result}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Closing Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-slate-950/40 border border-slate-900/80 rounded-3xl p-6 md:p-8 text-center max-w-4xl mx-auto shadow-lg relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/5 blur-sm opacity-50 pointer-events-none" />

          <p className="text-sm md:text-base text-slate-300 font-bold leading-relaxed mb-6 max-w-2xl mx-auto">
            لا نكتفي بجلب الفرص فقط؛ نجهز ما قبلها، ندعم فريقك أثناء تحريكها، ونحلل ما بعدها حتى يتحسن القمع أسبوعيًا.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs font-black relative z-10">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 flex items-center gap-1.5 shadow-sm">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>قبل الفرص</span>
            </div>
            <span className="text-slate-600">←</span>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>أثناء الفرص</span>
            </div>
            <span className="text-slate-600">←</span>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 flex items-center gap-1.5 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>بعد الفرص</span>
            </div>
            <span className="text-slate-600">←</span>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Target className="w-3.5 h-3.5" />
              <span>قمع أفضل</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

type TimelineBucket = 'inputs' | 'process' | 'outputs' | 'outcomes';

const ExecutionTimelineSection = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [activeBucket, setActiveBucket] = useState<TimelineBucket>('inputs');
  const { shouldReduce, reveal, container, item } = useSharedMotion();
  const contentTransition = shouldReduce
    ? { duration: 0.18 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

  const bucketMeta: Record<TimelineBucket, { label: string; question: string; icon: React.ElementType }> = {
    inputs: { label: 'المدخلات', question: 'ما الذي نحتاجه منك؟', icon: ClipboardList },
    process: { label: 'التنفيذ', question: 'ما الذي سنفعله؟', icon: Settings2 },
    outputs: { label: 'المخرجات', question: 'ما الذي ستستلمه؟', icon: FileText },
    outcomes: { label: 'النتائج', question: 'ما النتيجة المتوقعة؟', icon: Target },
  };

  const stages = [
    {
      period: 'اليوم 1 إلى 7',
      shortPeriod: 'الأسبوع 1',
      title: 'التشخيص وتجهيز المدخلات',
      summary: 'نحدد المنتج، القطاع، صناع القرار، متوسط الصفقة، والمستهدف البيعي.',
      inputs: ['المنتج أو الخدمة', 'القطاع المستهدف', 'متوسط قيمة الصفقة', 'المستهدف البيعي خلال 90 يوم', 'بيانات العملاء الحالية إن وجدت', 'فريق المبيعات المسؤول', 'العروض والخدمات الحالية', 'الموقع وملف الشركة'],
      process: ['تحليل المنتج والسوق', 'تحديد القطاعات الأنسب', 'تحديد صناع القرار', 'بناء ملف العميل المثالي بوضوح', 'حساب القمع المطلوب', 'تحديد القنوات المناسبة', 'مراجعة جاهزية فريق المبيعات'],
      outputs: ['خريطة استهداف أولية', 'تعريف العميل المثالي', 'قائمة القطاعات ذات الأولوية', 'نموذج القمع المطلوب', 'مؤشرات قياس أولية', 'خطة تشغيل أول أسبوعين'],
      outcomes: ['وضوح كامل للمستهدف، القطاع، الجمهور، والقنوات قبل بدء التشغيل.'],
    },
    {
      period: 'الأسبوع 2',
      shortPeriod: 'الأسبوع 2',
      title: 'بناء قاعدة التشغيل',
      summary: 'نجهز البيانات، الرسائل، القنوات، السكريبتات، ولوحة المتابعة.',
      inputs: ['ملف العميل المثالي المعتمد', 'القطاعات المختارة', 'صناع القرار المطلوبين', 'القنوات المناسبة', 'رسائل العميل الحالية', 'نظام المتابعة أو طريقة المتابعة الحالية'],
      process: ['استخراج الحسابات المناسبة من قاعدة البيانات', 'إثراء بيانات صناع القرار', 'التحقق من الأرقام والإيميلات', 'تجهيز الرسائل والسكريبتات', 'تجهيز قنوات التواصل', 'تدريب موظف المبيعات أو الفريق', 'ضبط مراحل المتابعة داخل النظام'],
      outputs: ['قائمة حسابات مستهدفة جاهزة', 'بيانات صناع قرار', 'رسائل واتساب / لينكدإن / بريد إلكتروني', 'نص مكالمات', 'قنوات تواصل مفعلة', 'لوحة متابعة', 'دليل تشغيل لفريق المبيعات'],
      outcomes: ['فريق العميل يصبح جاهزًا للعمل على قائمة واضحة، برسائل واضحة، وقنوات واضحة.'],
    },
    {
      period: 'الأسبوع 3 إلى 4',
      shortPeriod: 'الأسبوع 3-4',
      title: 'التشغيل وتحريك الفرص',
      summary: 'نفتح المحادثات، نتابع الردود، نحجز الاجتماعات، ونحسن الأداء أسبوعيًا.',
      inputs: ['القوائم الجاهزة', 'الرسائل المعتمدة', 'فريق المبيعات', 'وكلاء النينجا', 'كادر منافسات الموازي', 'القنوات المفعلة'],
      process: ['تشغيل حملات التواصل', 'فتح المحادثات', 'متابعة الردود', 'تصنيف المهتمين', 'نقل الفرص لفريق المبيعات', 'تحليل المكالمات', 'تحسين الرسائل أسبوعيًا', 'تشغيل كادر منافسات الموازي لفتح فرص مباشرة'],
      outputs: ['محادثات نشطة', 'ردود إيجابية', 'اجتماعات محجوزة', 'اجتماعات مؤهلة', 'فرص داخل القمع', 'تقارير أسبوعية', 'توصيات تحسين للفريق', 'قائمة اعتراضات وأسئلة متكررة'],
      outcomes: ['تحول الاستهداف إلى محادثات واجتماعات وفرص حقيقية قابلة للقياس.'],
    },
    {
      period: 'الأسبوع 5 إلى 12',
      shortPeriod: 'الأسبوع 5-12',
      title: 'التحسين والإغلاق',
      summary: 'نحلل القمع، نتابع العروض، ندعم التفاوض، ونبني خطة التوسع التالية.',
      inputs: ['نتائج الأسابيع السابقة', 'بيانات القمع', 'المكالمات المسجلة', 'الاعتراضات', 'العروض المرسلة', 'الفرص المفتوحة', 'حالة كل فرصة'],
      process: ['تحليل القنوات الأفضل', 'تحسين السكريبتات', 'تدريب الفريق على الاعتراضات', 'متابعة العروض', 'دعم التفاوض', 'تحديد أسباب التعطل', 'تعديل الاستهداف حسب النتائج', 'بناء خطة الشهر التالي'],
      outputs: ['فرص أقرب للإغلاق', 'عروض سعر أكثر دقة', 'قائمة فرص ساخنة', 'تحليل أداء الفريق', 'تقرير 90 يوم', 'خطة استمرار أو توسع', 'توصيات للقطاعات التالية'],
      outcomes: ['وضوح ما تحقق، ما تعطل، ما يجب تحسينه، وكيف يتم توسيع التشغيل بعد أول 90 يوم.'],
    },
  ];

  const currentStage = stages[activeStage];
  const CurrentIcon = bucketMeta[activeBucket].icon;

  return (
	    <motion.section
	      variants={container}
	      initial="hidden"
	      whileInView="visible"
	      viewport={{ once: true, amount: 0.15 }}
	      className="py-16 bg-[#080808] border-t border-slate-900/60"
	    >
	      <div className="container mx-auto px-4 max-w-7xl">
	        <div className="text-center mb-14">
	          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-4 select-none">
	            <Activity className="w-3.5 h-3.5" />
	            <span className="text-[10px] font-bold">المدخلات ← التنفيذ ← المخرجات ← النتائج</span>
	          </motion.div>
	          <motion.h2 variants={item} className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
	            كيف ننفذ خطة 90 يوم عمليًا؟
	          </motion.h2>
	          <motion.p variants={item} className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
	            لا نبدأ بإرسال رسائل عشوائية. نبدأ من هدفك البيعي، ثم نبني خطة تشغيل أسبوعية تجمع بين البيانات، الذكاء الاصطناعي، فريقك، وكادر منافسات الموازي.
	          </motion.p>
	        </div>

	        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <motion.div
            variants={container}
            className="lg:col-span-5 grid gap-4"
          >
            {stages.map((stage, idx) => (
	              <motion.button
	                key={stage.title}
	                variants={item}
	                whileHover={shouldReduce ? {} : { y: -2, transition: { duration: 0.18 } }}
	                onClick={() => {
	                  setActiveStage(idx);
	                  setActiveBucket('inputs');
	                }}
	                className={cn(
	                  'relative overflow-hidden text-right rounded-3xl border p-5 transition-colors duration-300',
	                  activeStage === idx
	                    ? 'bg-emerald-500/10 border-emerald-400/50 shadow-[0_0_28px_rgba(16,185,129,0.12)]'
	                    : 'bg-slate-950/55 border-slate-800 hover:border-slate-700'
	                )}
	              >
	                {activeStage === idx && (
	                  <motion.div
	                    layoutId="execution-stage-active"
	                    className="absolute inset-0 rounded-3xl border border-emerald-300/35 bg-emerald-500/[0.045] shadow-[inset_0_1px_0_rgba(110,231,183,0.18),0_0_32px_rgba(16,185,129,0.10)]"
	                    transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 }}
	                  />
	                )}
	                <div className="flex items-start gap-4">
	                  <div
	                    className={cn(
	                      'relative z-10 w-11 h-11 rounded-2xl border flex items-center justify-center font-black shrink-0 transition-colors duration-300',
	                      activeStage === idx ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.18)]' : 'bg-slate-900 text-slate-400 border-slate-800'
	                    )}
	                  >
	                    {idx + 1}
	                  </div>
	                  <div className="relative z-10">
	                    <div className="text-xs font-black text-cyan-300 mb-1">{stage.shortPeriod}</div>
                    <h3 className="text-lg md:text-xl font-black text-white mb-2">{stage.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{stage.summary}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

	          <motion.div
	            variants={item}
	            className="lg:col-span-7 bg-slate-950/75 border border-slate-800 rounded-3xl p-6 md:p-8"
	          >
	            <AnimatePresence mode="wait">
	              <motion.div
	                key={activeStage}
	                initial={{ opacity: 0, x: shouldReduce ? 0 : -8 }}
	                animate={{ opacity: 1, x: 0 }}
	                exit={{ opacity: 0, x: shouldReduce ? 0 : 8 }}
	                transition={contentTransition}
	              >
	                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7 pb-5 border-b border-slate-800">
	                  <div>
	                    <div className="text-xs font-black text-emerald-300 mb-2">{currentStage.period}</div>
	                    <h3 className="text-2xl md:text-3xl font-black text-white">{currentStage.title}</h3>
	                  </div>
	                  <div className="grid grid-cols-2 sm:flex gap-2">
	                {(Object.keys(bucketMeta) as TimelineBucket[]).map((bucket) => (
	                  <motion.button
	                    key={bucket}
	                    onClick={() => setActiveBucket(bucket)}
	                    className={cn(
	                      'relative overflow-hidden px-3 py-2 rounded-xl text-xs font-black border transition-colors',
	                      activeBucket === bucket
	                        ? 'text-slate-950 border-cyan-300'
	                        : 'bg-black/35 text-slate-400 border-slate-800 hover:text-white'
	                    )}
	                    whileHover={shouldReduce ? {} : { y: -2 }}
	                  >
	                    {activeBucket === bucket && (
	                      <motion.span
	                        layoutId="execution-bucket-pill"
	                        className="absolute inset-0 rounded-xl bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.16)]"
	                        transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 34 }}
	                      />
	                    )}
	                    <span className="relative z-10">{bucketMeta[bucket].label}</span>
	                  </motion.button>
	                ))}
	                  </div>
	                </div>
	              </motion.div>
	            </AnimatePresence>

	            <div className="rounded-2xl bg-black/30 border border-slate-900 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-black">{bucketMeta[activeBucket].label}</div>
                  <div className="text-white font-black">{bucketMeta[activeBucket].question}</div>
                </div>
              </div>
	              <AnimatePresence mode="wait">
	                <motion.div
	                  key={`${activeStage}-${activeBucket}`}
	                  initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                  animate={{ opacity: 1, y: 0 }}
	                  exit={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
	                  transition={contentTransition}
	                  className="grid sm:grid-cols-2 gap-3"
	                >
	                  {currentStage[activeBucket].map((entry, idx) => (
	                    <motion.div
	                      key={entry}
	                      initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
	                      animate={{ opacity: 1, y: 0 }}
	                      transition={{ duration: 0.22, delay: shouldReduce ? 0 : idx * 0.035 }}
	                      className="group rounded-xl bg-slate-950/80 border border-slate-800 px-4 py-3 flex items-start gap-3 transition-colors duration-200 hover:border-cyan-500/25"
	                    >
	                      <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-1 shrink-0 transition-transform duration-200 group-hover:scale-110" />
	                      <span className="text-sm text-slate-300 font-bold leading-relaxed">{entry}</span>
	                    </motion.div>
	                  ))}
	                </motion.div>
	              </AnimatePresence>
	            </div>

	            <motion.div variants={item} className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.06)]">
	              <p className="text-emerald-100 font-black leading-relaxed">
	                بنهاية 90 يوم، لا تحصل فقط على تقرير... بل تحصل على قناة مبيعات قابلة للتكرار والتحسين.
	              </p>
	            </motion.div>
	          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};



const DailySalesSystemSection = () => {
  const { shouldReduce, reveal, container, item } = useSharedMotion();

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-[#050505] border-t border-slate-900/60"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="مخرجات ملموسة"
          title="ماذا يرى موظفك داخل النظام؟"
          description="بدل كلمة منظومة بشكل عام، يرى موظفك قائمة تشغيل واضحة: من يتواصل معه، لماذا هو مناسب، ما الرسالة المقترحة، وما الخطوة التالية."
        />
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: shouldReduce ? 0 : 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={shouldReduce ? {} : { scale: 1.01, boxShadow: '0 8px 30px rgba(6,182,212,0.06)' }}
            className="lg:col-span-7 bg-slate-950/75 border border-slate-800 rounded-3xl p-6 md:p-8 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
              <div>
                <div className="text-xs font-black text-cyan-300 mb-2">بطاقة عميل محتمل</div>
                <h3 className="text-2xl md:text-3xl font-black text-white">شركة مقاولات متوسطة</h3>
                <p className="text-sm text-slate-500 font-bold mt-1">الرياض | قطاع المقاولات والتشغيل</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-center">
                <div className="text-[10px] text-emerald-300 font-black mb-1">درجة الملاءمة</div>
                <div className="text-xl font-black text-white">عالية</div>
              </div>
            </div>

            <motion.div
              variants={container}
              className="grid sm:grid-cols-2 gap-4"
            >
              {[
                ['صانع القرار', 'مدير المشتريات', UserRoundCheck],
                ['القناة الأنسب', 'واتساب + اتصال', PhoneCall],
                ['سبب الملاءمة', 'نشاط الشركة وحجمها مناسب للخدمة', Target],
                ['الخطوة التالية', 'إرسال الرسالة ثم متابعة بعد 48 ساعة', CalendarCheck],
              ].map(([label, value, Icon]) => (
                <motion.div
                  key={label as string}
                  variants={item}
                  whileHover={shouldReduce ? {} : { scale: 1.02 }}
                  className="rounded-2xl bg-black/30 border border-slate-900 p-4 transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-cyan-300 mb-3" />
                  <div className="text-[10px] text-slate-500 font-black mb-1">{label as string}</div>
                  <div className="text-sm text-white font-black leading-relaxed">{value as string}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
              <div className="text-[10px] text-emerald-300 font-black mb-2">الرسالة المقترحة</div>
              <p className="text-sm text-emerald-50 font-bold leading-relaxed">
                لاحظنا أن شركتكم تعمل في مشاريع تشغيلية متوسطة داخل الرياض. لدينا تجربة تساعد فرق المبيعات على الوصول لصناع القرار وتحويل الفرص إلى اجتماعات مؤهلة خلال 90 يوم. هل يناسبك اتصال قصير هذا الأسبوع؟
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 grid gap-4"
          >
            {[
              ['نص واتساب', 'رسالة قصيرة قابلة للإرسال مباشرة مع تخصيص اسم الشركة والقطاع.', MessageSquare],
              ['نص المكالمة', 'افتتاحية المكالمة، سؤال التأهيل، وطريقة طلب الاجتماع بدون إطالة.', PhoneCall],
              ['خطوة المتابعة', 'تذكير تلقائي بعد 48 ساعة، ثم نقل الحالة حسب الرد أو عدم الرد.', RefreshCw],
            ].map(([title, text, Icon]) => (
              <motion.div
                key={title as string}
                variants={item}
                whileHover={shouldReduce ? {} : { y: -4, boxShadow: '0 8px 25px rgba(16,185,129,0.06)' }}
                className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-emerald-300 mb-4" />
                <h3 className="text-xl font-black text-white mb-2">{title as string}</h3>
                <p className="text-sm text-slate-400 font-bold leading-relaxed">{text as string}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const WeeklyReviewSection = () => {
  const { shouldReduce, reveal, container, item } = useSharedMotion();

  const controlRoom = [
    {
      title: 'النشاط',
      label: 'ماذا حدث؟',
      icon: Activity,
      items: ['الرسائل', 'المكالمات', 'المحاولات', 'المتابعة'],
    },
    {
      title: 'التحويل',
      label: 'أين تحول؟',
      icon: LineChart,
      items: ['الردود', 'المهتمون', 'الاجتماعات', 'العروض'],
    },
    {
      title: 'الجودة',
      label: 'لماذا توقف؟',
      icon: ShieldCheck,
      items: ['جودة الاجتماعات', 'ملاءمة العملاء', 'أسباب الرفض', 'نقاط التعطل'],
    },
    {
      title: 'خطة العمل',
      label: 'ماذا سنغير؟',
      icon: Settings2,
      items: ['مهام الأسبوع القادم', 'تحسين الرسائل', 'تعديل الاستهداف', 'تدريب الفريق'],
    },
  ];

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-[#080808] border-t border-slate-900/60"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="تشغيل منضبط"
          title="كل أسبوع نفتح غرفة تحكم المبيعات"
          description="لا نكتفي بسؤال: كم اجتماعًا تم حجزه؟ نراجع ماذا حدث، أين توقف القمع، لماذا توقف، وما الذي سنغيره في الأسبوع القادم."
        />
        <motion.div
          variants={container}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {controlRoom.map((block) => (
            <motion.div
              key={block.title}
              variants={item}
              whileHover={shouldReduce ? {} : { y: -5, scale: 1.02, boxShadow: '0 8px 25px rgba(16,185,129,0.08)' }}
              className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center mb-5">
                <block.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-cyan-300 mb-1">{block.title}</div>
              <h3 className="text-xl font-black text-white mb-5">{block.label}</h3>
              <div className="space-y-3">
                {block.items.map((itemVal) => (
                  <div key={itemVal} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="text-sm text-slate-300 font-bold">{itemVal}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 bg-slate-950/70 border border-slate-800 rounded-3xl p-6 md:p-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {['الاجتباطات المحجوزة', 'الاجتماعات المؤهلة', 'عروض السعر', 'الصفقات ونقاط التعطل'].map((metric) => (
              <motion.div
                key={metric}
                variants={item}
                whileHover={shouldReduce ? {} : { scale: 1.03 }}
                className="rounded-xl bg-black/35 border border-slate-900 px-4 py-3 text-center transition-all duration-200"
              >
                <span className="text-xs font-black text-slate-300">{metric}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const TrustStatsIntro = () => {
  const { reveal } = useSharedMotion();

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-[#050505] border-t border-slate-900/60"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="أرقام الثقة"
          title="منظومة مجربة داخل السوق السعودي"
          description="هذه الأرقام ليست للتباهي، بل لأنها تساعدنا على اختصار الطريق وتحسين دقة الاستهداف."
        />
        <StatsRow />
      </div>
    </motion.section>
  );
};

const SubscriptionValueSection = () => {
  const { shouldReduce, reveal, container, item } = useSharedMotion();
  const points = [
    {
      title: 'أدوات بيانات وإثراء',
      description: 'أكثر من 20 أداة لتجهيز البيانات، تحليل الحسابات، إثراء معلومات صناع القرار، وتحسين جودة الاستهداف.',
      icon: Database,
    },
    {
      title: 'أتمتة ووكلاء ذكيون',
      description: 'ما يقارب 25 وكيلًا ذكيًا يساعدون في التحليل، التخصيص، المتابعة، التصنيف، وتوجيه الخطوة التالية.',
      icon: Bot,
    },
    {
      title: 'قنوات وفواتير تشغيل',
      description: 'تكاليف تشغيل واتساب، ميتا، لينكدإن، البريد، مركز الاتصال، ودقائق المكالمات.',
      icon: PhoneCall,
    },
    {
      title: 'فريق نمو يومي',
      description: 'استشارات، تدريب، دعم، تقييم، متابعة، وتطوير مستمر لرفع جودة التحويل داخل فريقك.',
      icon: Users,
    },
  ];

  return (
    <section className="py-20 bg-[#050505] border-t border-slate-900/60" id="subscription-value">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto mb-6">
            كيف نتعاون معك للوصول إلى المستهدف البيعي؟
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            لا نبدأ معك من اشتراك أداة، بل من مستهدف بيعي واضح.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-bold max-w-3xl mx-auto mt-3">
            نفعّل حول فريقك منظومة تجمع بين البيانات، القنوات، الأتمتة، الوكلاء الذكيين، وكادر النمو اليومي… ثم نربط جزءًا كبيرًا من قيمتها بمشاركة النجاح من المبيعات المحققة.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                variants={item}
                whileHover={shouldReduce ? {} : { y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
                className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.08)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{point.title}</h3>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed">{point.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Comparison section */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-3xl mx-auto rounded-3xl bg-slate-950/40 border border-slate-900 p-6 md:p-8 mb-10"
        >
          <div className="grid md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800">
            <div className="pb-6 md:pb-0 md:pl-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-black mb-3">
                <span>الاشتراك الشهري</span>
              </div>
              <p className="text-sm text-slate-300 font-bold leading-relaxed">
                يغطي جزءًا من أدوات التشغيل، القنوات، الأتمتة، والوكلاء الذكيين.
              </p>
            </div>
            <div className="pt-6 md:pt-0 md:pr-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-black mb-3">
                <span>مشاركة النجاح</span>
              </div>
              <p className="text-sm text-slate-300 font-bold leading-relaxed">
                تغطي القيمة الأكبر من قيادة النمو، التطوير، المتابعة، ودعم التحويل عند تحقق المبيعات.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-base md:text-lg font-black text-emerald-300">
            الاشتراك يفعّل المنظومة… والقيمة الأكبر نربطها بنتائج المبيعات.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const PricingSection2 = () => {
  const { shouldReduce, container, item } = useSharedMotion();
  const tiers = [
    {
      name: 'تجربة شهرية',
      monthlyPrice: '4,000 ريال',
      billing: 'تدفع شهرياً',
      totalPriceText: 'التزام مرن شهري',
      icon: Target,
      features: ['تجربة قطاع واحد', 'قائمة فرص أولية', 'تشغيل قنوات أساسية', 'تقرير أداء شهري'],
    },
    {
      name: 'شراكة سنوية',
      monthlyPrice: '1,500 ريال',
      originalPrice: '4,000 ريال',
      discountBadge: 'وفر 62% شهرياً',
      billing: 'تدفع سنوياً',
      totalPriceText: 'إجمالي 18,000 ريال / سنة',
      icon: BriefcaseBusiness,
      recommended: true,
      features: ['تشغيل مستمر متعدد القطاعات', 'مدير حساب ومراجعات استراتيجية', 'أصول بيانات ولوحات أوسع', 'نموذج مشاركة نجاح مخصص'],
    },
    {
      name: 'تشغيل 90 يوم',
      monthlyPrice: '3,000 ريال',
      originalPrice: '4,000 ريال',
      discountBadge: 'وفر 25% شهرياً',
      billing: 'تدفع ربع سنوي',
      totalPriceText: 'إجمالي 9,000 ريال / 3 شهور',
      icon: ShieldCheck,
      features: ['بناء قناة مبيعات كاملة', 'بيانات ورسائل ومتابعة', 'تطوير أداء الفريق أسبوعيًا', 'قياس القمع حتى العروض والتفاوض'],
    },
  ];

  return (
    <section className="py-20 bg-[#050505] border-t border-slate-900/60" id="pricing">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="خطط الشراكة"
          title="اختر خطة الشراكة لتحقيق مستهدفك البيعي"
          description={
            <>
              <span className="block mb-2">
                نحدد معك هدف 90 يوم، ثم نشغّل حول فريقك البيانات, القنوات، الأتمتة، كادر النمو، وفرص منافسات المباشرة… حتى تتحول الفرص إلى اجتماعات، عروض، تفاوض، وصفقات.
              </span>
              <span className="block text-emerald-400 font-extrabold mt-2">
                ليست باقات أدوات… بل خطط تشغيل ونمو مرتبطة بنتيجة بيعية واضحة.
              </span>
            </>
          }
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              variants={item}
              whileHover={
                shouldReduce
                  ? {}
                  : {
                      y: -5,
                      boxShadow: tier.recommended
                        ? "0 0 35px rgba(16,185,129,0.25)"
                        : "0 0 25px rgba(16,185,129,0.08)",
                      transition: { duration: 0.2, ease: "easeOut" }
                    }
              }
              className={cn(
                'relative rounded-3xl p-7 border bg-slate-950/60 transition-all duration-300',
                tier.recommended ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.16)]' : 'border-slate-800'
              )}
            >
              {tier.recommended && (
                <div className="absolute top-0 inset-x-0 bg-emerald-400 text-slate-950 text-center text-xs font-black py-1 rounded-t-3xl">
                  الخيار الأنسب لشراكة نمو مستدامة
                </div>
              )}
              <div className={cn('pt-4', tier.recommended && 'pt-7')}>
                <tier.icon className="w-10 h-10 text-emerald-300 mb-5" />
                <h3 className="text-2xl font-black text-white mb-3">{tier.name}</h3>
                <div className="mb-6 text-right">
                  {tier.originalPrice ? (
                    <div className="flex items-center gap-2 justify-end mb-2 select-none">
                      {tier.discountBadge && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black">
                          {tier.discountBadge}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-bold">
                        بدلاً من <span className="line-through">{tier.originalPrice}</span>
                      </span>
                    </div>
                  ) : (
                    // Spacer to align card pricing columns vertically
                    <div className="h-[22px] mb-2 select-none opacity-0 pointer-events-none" />
                  )}

                  <div className="text-3xl md:text-4xl font-black text-emerald-300 tracking-tight">
                    {tier.monthlyPrice} <span className="text-xs text-slate-400 font-bold">/ شهر</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-extrabold mt-2">
                    {tier.billing} <span className="text-[10px] text-slate-500">({tier.totalPriceText})</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-1 shrink-0" />
                      <span className="font-bold leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollToSection('final-cta')}
                  className={cn(
                    'w-full mt-8 rounded-xl py-3 font-black transition-colors',
                    tier.recommended ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'bg-slate-900 text-white hover:bg-slate-800'
                  )}
                >
                  ابدأ بهذا المسار
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const RevenueShareSimpleSection = () => {
  const { shouldReduce, reveal, container, item } = useSharedMotion();
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [activeTier, setActiveTier] = useState(4);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const revenueTiers = [
    { percent: '15%', range: 'من ١,٠٠٠ إلى ٩,٩٩٩ ريال', note: 'قيمة أعلى', insight: 'تبدأ النسبة تنخفض مع ارتفاع قيمة التعاقد.', baseScale: 0.91, percentSize: 'text-3xl' },
    { percent: '10%', range: 'من ١٠,٠٠٠ إلى ٤٩,٩٩٩ ريال', note: 'عقد متوسط', insight: 'توازن أفضل بين حجم العقد ونسبة المشاركة.', baseScale: 0.96, percentSize: 'text-3xl' },
    { percent: '7%', range: 'من ٥٠,٠٠٠ إلى ٢٥٠,٠٠٠ ريال', note: 'عقد أكبر', insight: 'كلما كبر العقد، أصبح العائد عليك أفضل.', baseScale: 1.01, percentSize: 'text-4xl' },
    { percent: '5%', range: 'من ٢٥٠,٠٠٠ إلى ١,٠٠0,٠٠٠ ريال', note: 'عقد كبير', insight: 'فرصة أقوى: تعاقد أعلى ونسبة مشاركة أقل.', baseScale: 1.07, percentSize: 'text-4xl' },
    { percent: '2%', range: 'أكثر من ١,٠٠٠,٠٠0 ريال', note: 'أفضل فرصة', insight: 'أفضل نتيجة: أعلى قيمة عقد مع أقل نسبة مشاركة.', baseScale: 1.15, percentSize: 'text-5xl', featured: true },
  ];
  const activeTierData = revenueTiers[activeTier];
  const mobileRevenueTiers = [...revenueTiers].reverse();

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = window.setInterval(() => {
      setActiveTier((current) => (current >= revenueTiers.length - 1 ? 0 : current + 1));
    }, 2600);

    return () => window.clearInterval(interval);
  }, [isAutoPlay, revenueTiers.length]);

  const goToNextTier = () => {
    setIsAutoPlay(false);
    setActiveTier((current) => (current >= revenueTiers.length - 1 ? 0 : current + 1));
  };

  const goToPreviousTier = () => {
    setIsAutoPlay(false);
    setActiveTier((current) => (current <= 0 ? revenueTiers.length - 1 : current - 1));
  };

  const markerPositions = ['92.8%', '72.1%', '51.4%', '30.7%', '10%'];
  const progressWidths = ['0%', '20.7%', '41.4%', '62.1%', '82.8%'];
  const progressWidth = progressWidths[activeTier];
  const markerLeft = markerPositions[activeTier];

  return (
    <section className="py-20 bg-[#080808] border-t border-slate-900/60 overflow-hidden" id="revenue-share-simple">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-5 py-2 text-emerald-200 mb-5">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-black">من 2% فقط</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight max-w-full">
            <span className="block md:inline">نسبتنا تبدأ</span>{' '}
            <span className="block md:inline">من 2% فقط</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mt-5">
            كلما زادت قيمة الصفقة المغلقة، انخفضت نسبتنا. لأننا نربح معك بالحجم، لا برفع النسبة.
          </p>
          <p className="text-sm md:text-base text-slate-400 font-bold max-w-2xl mx-auto mt-3">
            مشاركة النجاح ليست نسبة ثابتة، بل نسبة تتناقص كلما كبرت قيمة العقد.
          </p>
          <p className="text-base md:text-xl text-emerald-400 font-black max-w-2xl mx-auto mt-5">
            هدفنا دائماً نصلك بالعروض الكبيرة اللي بتناسب قوة شغلك
          </p>
        </motion.div>

        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-7 md:px-7 md:py-10">
          <div className="mb-7 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/8 px-4 py-3 text-right">
              <div className="text-xs font-black text-emerald-200">القيمة الأعلى = نسبة أقل</div>
              <div className="mt-1 text-sm font-bold text-slate-300">
                {activeTierData.insight}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={goToPreviousTier}
                className="h-10 w-10 rounded-full border border-slate-700 bg-[#080808] text-white hover:border-emerald-300 hover:text-emerald-200 transition-colors"
                aria-label="الشريحة السابقة"
              >
                ‹
              </button>
              <div className="min-w-24 rounded-full border border-slate-800 bg-[#080808] px-4 py-2 text-center text-sm font-black text-white">
                {activeTierData.percent}
              </div>
              <button
                type="button"
                onClick={goToNextTier}
                className="h-10 w-10 rounded-full border border-slate-700 bg-[#080808] text-white hover:border-emerald-300 hover:text-emerald-200 transition-colors"
                aria-label="الشريحة التالية"
              >
                ›
              </button>
            </div>
          </div>

          <div className="absolute left-[10%] right-[7.2%] top-[8.75rem] hidden h-px bg-gradient-to-l from-emerald-300 via-emerald-300/45 to-red-400/45 md:block" />
          <motion.div
            aria-hidden="true"
            initial={{ width: '0%' }}
            animate={{ width: progressWidth }}
            transition={shouldReduce ? { duration: 0.1 } : { type: 'spring', stiffness: 150, damping: 20 }}
            className="absolute right-[7.2%] top-[8.75rem] z-10 hidden h-px max-w-[82.8%] bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.75)] md:block"
          />
          <motion.div
            aria-hidden="true"
            initial={{ left: '90%', opacity: 0, scale: 0.85 }}
            animate={{ left: markerLeft, opacity: 1, scale: activeTier >= 4 ? 1.15 : 1 }}
            transition={shouldReduce ? { duration: 0.1 } : { type: 'spring', stiffness: 150, damping: 20 }}
            className="absolute top-[8.47rem] z-20 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.95)] md:block"
          >
            {!shouldReduce && <span className="absolute inset-0 rounded-full bg-emerald-300/40 animate-ping" />}
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="hidden md:grid md:grid-cols-[0.9fr_1fr_1.1fr_1.2fr_1.3fr] md:gap-3"
            dir="rtl"
          >
            {revenueTiers.map((tier, idx) => (
              <motion.div
                key={tier.range}
                variants={item}
                onHoverStart={() => setHoveredTier(idx)}
                onHoverEnd={() => setHoveredTier(null)}
                onClick={() => {
                  setIsAutoPlay(false);
                  setActiveTier(idx);
                }}
                style={{
                  scale: shouldReduce ? 1 : (tier.baseScale || 1.0) * (activeTier === idx ? 1.08 : hoveredTier === idx ? 1.03 : 1)
                }}
                className={cn(
                  'relative pt-9 text-center transition-all duration-300 cursor-pointer',
                  activeTier === idx
                    ? cn(shouldReduce ? 'opacity-100 z-30' : '-translate-y-3 z-30 opacity-100')
                    : hoveredTier === idx
                    ? cn(shouldReduce ? 'opacity-95 z-20' : '-translate-y-1.5 z-20 opacity-95')
                    : tier.featured
                    ? 'z-10 opacity-90'
                    : 'z-10 opacity-70'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 bg-[#080808]',
                    activeTier === idx ? 'border-transparent bg-transparent' : 'border-slate-500'
                  )}
                />
                <div
                  className={cn(
                    'min-h-[170px] rounded-xl border p-4 transition-all duration-300',
                    activeTier === idx
                      ? 'border-emerald-400 bg-emerald-400/15 shadow-[0_0_35px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                      : tier.featured
                      ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                      : 'border-slate-800 bg-[#080808]/70 hover:border-slate-700'
                  )}
                >
                  <div className={cn('font-black leading-none transition-colors duration-300', activeTier === idx ? 'text-emerald-300' : tier.featured ? 'text-emerald-200' : 'text-white', tier.percentSize)}>
                    {tier.percent}
                  </div>
                  <div className="mt-4 text-xs font-black text-slate-300 leading-relaxed">{tier.range}</div>
                  <div className={cn('mt-3 text-[11px] font-bold leading-relaxed', tier.featured || activeTier === idx ? 'text-emerald-200' : 'text-slate-500')}>
                    {tier.note}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="md:hidden space-y-3"
          >
            {mobileRevenueTiers.map((tier, mobileIdx) => {
              const idx = revenueTiers.indexOf(tier);

              return (
              <motion.div
                key={tier.range}
                variants={item}
                onClick={() => {
                  setIsAutoPlay(false);
                  setActiveTier(idx);
                }}
                className={cn(
                  'relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-300 cursor-pointer',
                  activeTier === idx
                    ? cn(shouldReduce ? 'border-emerald-400 bg-emerald-400/15 z-10 opacity-100' : 'border-emerald-400 bg-emerald-400/15 shadow-[0_0_30px_rgba(16,185,129,0.20)] scale-[1.03] z-10 opacity-100')
                    : tier.featured
                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.06)] opacity-95'
                    : 'border-slate-800 bg-[#080808]/70 opacity-75'
                )}
                style={{
                  padding: tier.percent === '2%' ? '1.5rem 1rem' : tier.percent === '5%' ? '1.25rem 1rem' : '1rem'
                }}
              >
                {mobileIdx < mobileRevenueTiers.length - 1 && <div className="absolute right-6 top-full h-3 w-px bg-slate-700" />}
                <div className="text-right">
                  <div className="text-xs font-black text-slate-400">{tier.note}</div>
                  <div className="mt-1 text-sm font-bold text-slate-200">{tier.range}</div>
                </div>
                <div className={cn('shrink-0 font-black leading-none transition-colors duration-300', activeTier === idx ? 'text-emerald-300' : tier.featured ? 'text-emerald-200' : 'text-white', tier.percentSize)}>
                  {tier.percent}
                </div>
              </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-center text-lg md:text-xl font-black text-white"
          >
            العقود الأكبر هي أفضل فرصتك: تعاقد أعلى ونسبة أقل
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FinalCtaSection2 = () => {
  const { shouldReduce, reveal } = useSharedMotion();

  return (
    <section className="py-20 bg-[#050505] border-t border-slate-900/60" id="final-cta">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-slate-950 border border-emerald-500/30 p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
            ابدأ بخطة تشغيل 90 يوم على منتج واحد وقطاع واحد
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
            نحدد المستهدف، نختار القطاع، نجهز البيانات، نشغل القنوات، ندعم موظفك، ونراجع النتائج أسبوعيًا حتى تتحول الفرص إلى اجتماعات وعروض وصفقات.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={shouldReduce ? {} : { boxShadow: "0 0 25px rgba(16,185,129,0.3)" }}
              onClick={() => scrollToSection('growth-calculator')}
              className="px-8 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition-colors"
            >
              ابدأ بتحديد مستهدفك
            </motion.button>
            <motion.button
              whileHover={shouldReduce ? {} : { boxShadow: "0 0 25px rgba(6,182,212,0.15)" }}
              onClick={() => scrollToSection('pricing')}
              className="px-8 py-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-white font-black hover:border-cyan-500/50 transition-colors"
            >
              احجز جلسة تشخيص القطاع
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Investment2Page = () => {
  return (
    <div
      className="investment2-page min-h-screen selection:bg-emerald-500/30 font-sans relative overflow-x-hidden"
      dir="rtl"
      style={{
        fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
        background: '#050505',
        color: '#e2e8f0',
        lineHeight: 1.7,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .investment2-page #partners > div,
        .investment2-page #opportunity-sources > div,
        .investment2-page #use-cases > div,
        .investment2-page #growth-calculator > div,
        .investment2-page #radar-system > div,

        .investment2-page #future > div,
        .investment2-page #operational-formula > div,
        .investment2-page #smart-portfolio > div {
          padding-top: 4.5rem !important;
          padding-bottom: 4.5rem !important;
        }
        .investment2-page .partner-logo-card,
        .investment2-page .rounded-3xl {
          border-radius: 1.25rem;
        }
        .investment2-page button,
        .investment2-page a {
          transform: none !important;
        }
        .investment2-page * {
          scroll-margin-top: 1.5rem;
        }
      `}} />
      <ArabicOnlyTextSanitizer />

      <div id="hero">
        <HeroSection2 />
      </div>
      <div id="engines">
        <ChallengesSection />
      </div>
      <div id="target-triangle">
        <GrowthTriangleSection clientSalesCenter />
      </div>
      <div id="execution-plan">
        <ExecutionTimelineSection />
      </div>

      <div id="operational-formula">
        <OperationalFormulaSection />
      </div>
      <div id="pipeline-stream">
        <DualStreamPipelineSection />
      </div>
      <div id="daily-system">
        <DailySalesSystemSection />
      </div>
      <div id="weekly-review">
        <WeeklyReviewSection />
      </div>
      <div id="stats-row">
        <TrustStatsIntro />
      </div>

      <div id="partners">
        <PartnersMarqueeSection />
      </div>

      <div id="opportunity-sources">
        <OpportunitySourcesSection />
      </div>

      <div id="growth-calculator">
        <GrowthCalculatorSection />
      </div>

      <div id="radar-system">
        <MonafsatNetworkSection />
      </div>


      <div id="future">
        <FutureSection />
      </div>

      <div id="subscription-value">
        <SubscriptionValueSection />
      </div>

      <div id="pricing">
        <PricingSection2 />
      </div>
      <div id="revenue-share">
        <RevenueShareSimpleSection />
      </div>

      <div id="smart-portfolio">
        <SmartPortfolioSection />
      </div>

      <FinalCtaSection2 />
    </div>
  );
};

export default Investment2Page;
