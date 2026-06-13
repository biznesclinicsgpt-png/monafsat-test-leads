import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Bot, 
  UserRoundCheck, 
  Target, 
  PhoneCall, 
  Globe, 
  Sparkles, 
  FileText, 
  MessagesSquare, 
  LineChart, 
  CheckCircle2, 
  ArrowLeft,
  ChevronDown, 
  ChevronUp,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const OperationalFormulaSection = () => {
  const shouldReduce = useReducedMotion();
  const [activeMobileIdx, setActiveMobileIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const toggleMobileSection = (idx: number) => {
    if (activeMobileIdx === idx) {
      setActiveMobileIdx(null);
    } else {
      setActiveMobileIdx(idx);
    }
  };

  // Shared reveal variants local to this component to avoid circular dependencies
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

  const cards = [
    {
      title: 'الأتمتة والذكاء الذكي',
      short: 'تشغيل أسرع للمهام اليومية وتقليل العمل اليدوي.',
      details: [
        'أتمتة خطوات المتابعة.',
        'تحليل الردود والبيانات بسرعة أعلى.',
        'تخصيص الرسائل حسب القطاع ونوع العميل.',
        'مساعدة مسؤول المبيعات في معرفة الخطوة التالية.',
        'تشغيل مساعدين أذكياء لدعم القمع يوميًا.'
      ],
      icon: Bot
    },
    {
      title: 'بيانات صانع القرار',
      short: 'نجهز بيانات دقيقة عن الشخص الأقرب للقرار.',
      details: [
        'تحديد صانع القرار المناسب.',
        'تجهيز بيانات التواصل المتاحة.',
        'كتابة نبذة مختصرة عن الشخص والشركة.',
        'فهم دوره وتأثيره في القرار.',
        'تحديد أفضل مدخل للمحادثة.'
      ],
      icon: UserRoundCheck
    },
    {
      title: 'تحليل الملاءمة والاستهداف',
      short: 'نركز على العملاء الأعلى احتمالًا للتحول.',
      details: [
        'فلترة السوق حسب القطاع والاحتياج.',
        'تصنيف الحسابات حسب درجة الملاءمة.',
        'تحديد الأولويات داخل السوق المستهدف.',
        'تقليل الهدر في الوصول العشوائي.',
        'تجهيز سبب واضح لاستهداف كل عميل.'
      ],
      icon: Target
    },
    {
      title: 'أفضل قناة وأفضل افتتاحية',
      short: 'نحدد كيف يبدأ مسؤول المبيعات المحادثة بأفضل شكل.',
      details: [
        'تحديد أفضل قناة لكل عميل محتمل.',
        'تجهيز افتتاحية مناسبة حسب العميل.',
        'ترتيب تسلسل التواصل بين القنوات.',
        'تحسين توقيت الرسائل والمتابعة.',
        'تقليل الرسائل العامة غير المؤثرة.'
      ],
      icon: PhoneCall
    },
    {
      title: 'صفحات هبوط مخصصة',
      short: 'صفحات تتحدث عن مشكلة كل قطاع وسياقه.',
      details: [
        'بناء صفحات هبوط مخصصة لكل قطاع.',
        'توضيح المشكلة والوعد والمخرجات.',
        'ربط الصفحة برسالة التواصل.',
        'جعل الصفحة تخدم قرار الاجتماع أو طلب العرض.',
        'تقليل الاعتماد على صفحة عامة لا تقنع كل الصناعات.'
      ],
      icon: Globe
    },
    {
      title: 'تحويل الخدمة إلى منتج خدمي',
      short: 'نحول الخدمة من وصف عام إلى عرض واضح قابل للبيع.',
      details: [
        'صياغة الخدمة كمنتج خدمي واضح.',
        'تحديد وعد واضح للعميل.',
        'توضيح المخرجات والنتائج.',
        'تحديد نطاق العمل ونوع التعاقد.',
        'تخصيص العرض وربطه بمشكلة العميل.'
      ],
      icon: Sparkles
    },
    {
      title: 'ملفات البيع والعروض',
      short: 'نجهز ما يحتاجه مسؤول المبيعات داخل الاجتماع وبعده.',
      details: [
        'تطوير الملف التعريفي ليخدم البيع.',
        'تجهيز عرض بيعي واضح وعرض السعر.',
        'تجهيز توضيحات للأسئلة المتكررة والاعتراضات.',
        'تجهيز مواد تساعد على الانتقال من الاهتمام إلى القرار.',
        'تحسين طريقة عرض القيمة أمام العميل.'
      ],
      icon: FileText
    },
    {
      title: 'سيناريوهات الاجتماعات والعرض',
      short: 'نجهز مسؤول المبيعات ليقود الاجتماع بثقة ووضوح.',
      details: [
        'سيناريو اكتشاف احتياج العميل وعرض الحل.',
        'طرق وأسئلة التأهيل وشرح القيمة.',
        'سيناريو الاعتراضات والردود الجاهزة.',
        'نقل العميل من الاجتماع إلى مرحلة العرض.',
        'سكريبت المتابعة الفعالة لما بعد الاجتماع.'
      ],
      icon: MessagesSquare
    },
    {
      title: 'متابعة النظام وقياس الأداء',
      short: 'كل فرصة لها مرحلة وخطوة تالية ومؤشر أداء واضح.',
      details: [
        'تحديد مراحل الفرصة ومتابعة الاحتياج والحل والأسعار.',
        'متابعة التوضيحات والأسئلة والتفاوض.',
        'تحديد الصفقات المغلقة أو المفقودة.',
        'قياس أداء مسؤول المبيعات والتقارير الأسبوعية.',
        'معرفة ونقاط التسرب والتحسين داخل القمع.'
      ],
      icon: LineChart
    }
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-slate-900/60 relative overflow-hidden" id="operational-formula">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-[480px] h-[480px] bg-cyan-500/[0.015] blur-[130px] rounded-full" />
        <div className="absolute bottom-[20%] left-[15%] w-[480px] h-[480px] bg-emerald-500/[0.015] blur-[130px] rounded-full" />
      </div>

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
            <span className="text-[10px] font-bold">منهجية التشغيل المسبق</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-4xl mx-auto">
            المعادلة التي نستخدمها لرفع حصيلة الفرص
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            لا نعتمد على الإرسال العشوائي أو اجتهاد مسؤول المبيعات وحده. نجهز البيانات، القنوات، صفحات الهبوط، ملفات البيع، سيناريوهات الاجتماعات، والمتابعة داخل النظام، حتى يبدأ مسؤول المبيعات من فرصة أوضح وأقرب للتحويل.
          </p>
        </motion.div>

        {/* 3x3 Grid Parent Container with absolute SVG line network */}
        <div className="relative w-full">
          
          {/* SVG Connecting Lines (Desktop only) */}
          <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
            <svg className="w-full h-full overflow-visible" fill="none">
              {/* Row 1 Horizontal connector */}
              <line 
                x1="10%" y1="16.6%" x2="90%" y2="16.6%" 
                stroke={hoveredIdx !== null && Math.floor(hoveredIdx / 3) === 0 ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.04)"} 
                strokeWidth={hoveredIdx !== null && Math.floor(hoveredIdx / 3) === 0 ? "1.5" : "1"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
              {/* Row 2 Horizontal connector */}
              <line 
                x1="10%" y1="50%" x2="90%" y2="50%" 
                stroke={hoveredIdx !== null && Math.floor(hoveredIdx / 3) === 1 ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.04)"} 
                strokeWidth={hoveredIdx !== null && Math.floor(hoveredIdx / 3) === 1 ? "1.5" : "1"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
              {/* Row 3 Horizontal connector */}
              <line 
                x1="10%" y1="83.3%" x2="90%" y2="83.3%" 
                stroke={hoveredIdx !== null && Math.floor(hoveredIdx / 3) === 2 ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.04)"} 
                strokeWidth={hoveredIdx !== null && Math.floor(hoveredIdx / 3) === 2 ? "1.5" : "1"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
              
              {/* Column 1 (Right in RTL, index 2) Vertical connector */}
              <line 
                x1="83.3%" y1="10%" x2="83.3%" y2="90%" 
                stroke={hoveredIdx !== null && (hoveredIdx % 3) === 2 ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.04)"} 
                strokeWidth={hoveredIdx !== null && (hoveredIdx % 3) === 2 ? "1.5" : "1"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
              {/* Column 2 (Center, index 1) Vertical connector */}
              <line 
                x1="50%" y1="10%" x2="50%" y2="90%" 
                stroke={hoveredIdx !== null && (hoveredIdx % 3) === 1 ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.04)"} 
                strokeWidth={hoveredIdx !== null && (hoveredIdx % 3) === 1 ? "1.5" : "1"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
              {/* Column 3 (Left in RTL, index 0) Vertical connector */}
              <line 
                x1="16.6%" y1="10%" x2="16.6%" y2="90%" 
                stroke={hoveredIdx !== null && (hoveredIdx % 3) === 0 ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.04)"} 
                strokeWidth={hoveredIdx !== null && (hoveredIdx % 3) === 0 ? "1.5" : "1"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
            </svg>
          </div>

          {/* Desktop Grid Layout */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="hidden lg:grid grid-cols-3 gap-6 relative z-10"
          >
            {cards.map((card, idx) => {
              const Icon = card.icon;
              const isHovered = hoveredIdx === idx;

              return (
                <motion.div
                  key={card.title}
                  variants={item}
                  onHoverStart={() => setHoveredIdx(idx)}
                  onHoverEnd={() => setHoveredIdx(null)}
                  style={{
                    scale: shouldReduce ? 1 : isHovered ? 1.02 : 1
                  }}
                  className={cn(
                    "relative rounded-3xl border p-7 backdrop-blur-md h-[240px] flex flex-col justify-start select-none cursor-pointer overflow-hidden transition-all duration-300",
                    isHovered 
                      ? "border-cyan-500/40 bg-slate-950/85 shadow-[0_0_35px_rgba(6,182,212,0.15)] z-20"
                      : hoveredIdx !== null 
                      ? "border-slate-800/40 bg-slate-950/40 opacity-50 z-10" 
                      : "border-slate-800 bg-slate-950/60 z-10"
                  )}
                >
                  {/* Default Content view */}
                  <div className={cn("flex flex-col h-full transition-opacity duration-300", isHovered ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center mb-4 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">{card.title}</h3>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">{card.short}</p>
                    
                    <div className="mt-auto flex items-center gap-1.5 text-[9px] font-black text-cyan-500/60">
                      <span>ضع المؤشر للتفاصيل</span>
                      <ArrowLeft className="w-2.5 h-2.5 -rotate-90" />
                    </div>
                  </div>

                  {/* Hover Details view */}
                  <div className={cn("absolute inset-0 p-7 flex flex-col justify-start bg-slate-950/95 transition-opacity duration-300 z-10", isHovered ? "opacity-100" : "opacity-0 pointer-events-none")}>
                    <h4 className="text-sm font-black text-cyan-300 mb-4 pb-2 border-b border-slate-900/80">{card.title}</h4>
                    <ul className="space-y-2 text-right">
                      {card.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile Accordion Stagger List */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="lg:hidden flex flex-col gap-4 relative z-10"
          >
            {cards.map((card, idx) => {
              const Icon = card.icon;
              const isOpen = activeMobileIdx === idx;

              return (
                <motion.div
                  key={card.title}
                  variants={item}
                  onClick={() => toggleMobileSection(idx)}
                  className={cn(
                    "rounded-2xl border p-5 bg-slate-950/65 backdrop-blur-md transition-all duration-300 overflow-hidden cursor-pointer",
                    isOpen ? "border-cyan-500/40 bg-slate-950/95" : "border-slate-800"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <h3 className="text-sm font-black text-white">{card.title}</h3>
                        {!isOpen && <p className="text-[10.5px] text-slate-400 font-bold mt-1 max-w-[220px] sm:max-w-md truncate">{card.short}</p>}
                      </div>
                    </div>
                    <div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={shouldReduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="mt-5 pt-4 border-t border-slate-900 overflow-hidden"
                      >
                        <ul className="space-y-2.5 text-right">
                          {card.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

        {/* Section Footer Closing Strip & Path connector to the funnel */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto text-center"
        >
          {/* Subtle Glowing Strip */}
          <div className="rounded-3xl bg-slate-950/40 border border-slate-900 p-6 md:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <p className="text-sm md:text-base text-slate-300 font-bold leading-relaxed">
              هذه المعادلة لا تجهز الفرصة فقط، بل تجهز مسؤول المبيعات بكل ما يحتاجه لتحويلها: بيانات أدق، قنوات أوضح، صفحات هبوط، منتجات خدمية، ملفات بيع، سيناريوهات اجتماعات، متابعة داخل النظام، وقياس أسبوعي مستمر.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-xs sm:text-sm text-emerald-400 font-black">
              ومن خلال هذه المنظومة، نصل إلى حصيلة فرص أوضح، ثم نغذي بها القمع البيعي خطوة بخطوة.
            </p>
            <div className="flex flex-col items-center mt-2">
              <span className="text-[10px] text-slate-500 font-extrabold mb-1">بعد تجهيز هذه المعادلة، تبدأ حصيلة الفرص في الظهور داخل القمع.</span>
              <motion.div
                animate={shouldReduce ? {} : { y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-300"
              >
                ↓
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
