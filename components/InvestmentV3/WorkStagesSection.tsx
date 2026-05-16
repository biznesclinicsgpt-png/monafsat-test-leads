import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Bot, MapPin, Activity, Users, Presentation, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export const WorkStagesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const stages = [
    { title: "فهم السوق وتحليل الفرص", icon: Search, type: "البيانات والذكاء", color: "from-slate-600 to-slate-500", desc: "نبني خريطة واضحة للسوق والقطاعات المستهدفة." },
    { title: "تشغيل وكلاء النينجا الذكيين", icon: Bot, type: "وكلاء ذكيون", color: "from-blue-600 to-blue-500", desc: "يقوم الوكلاء بمسح السوق وتحليل أفضل قنوات التواصل." },
    { title: "الوصول الذكي لصناع القرار", icon: MapPin, type: "الوصول", color: "from-indigo-600 to-indigo-500", desc: "التواصل عبر القنوات المناسبة لكل صانع قرار." },
    { title: "رصد الاهتمام وتحليل الفرصة", icon: Activity, type: "إشارات الاهتمام", color: "from-violet-600 to-violet-500", desc: "نظام ذكي يلتقط أي إشارة اهتمام من العميل." },
    { title: "تدخل فريق النينجا البشري", icon: Users, type: "تدخل بشري", color: "from-emerald-600 to-emerald-500", desc: "انتقال سلس للفريق البشري لتأكيد الاهتمام والترتيب." },
    { title: "الاجتماعات والعروض والتفاوض", icon: Presentation, type: "الاجتماعات", color: "from-yellow-600 to-yellow-500", desc: "دعم كامل في إدارة التفاوض والمناقشات." },
    { title: "تحريك المشروع نحو الإغلاق", icon: Trophy, type: "إغلاق الصفقة", color: "from-amber-600 to-amber-500", desc: "رفع احتمالية الإغلاق والفوز بالفرصة." },
  ];

  // Map scroll progress to active index (0 to 6)
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="py-40 bg-[#0A0A0A] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
              <Activity className="w-5 h-5" />
              <span className="font-semibold text-sm">رحلة الإيرادات الذكية</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              رحلة الإيرادات الذكية
            </h2>
            <p className="text-xl text-slate-400">
              هكذا تتحرك الفرص عبر منظومتنا من التحليل الذكي وحتى الإغلاق.
            </p>
          </motion.div>
        </div>

        <div className="relative pl-8 md:pl-0 md:mx-auto md:w-full">
          
          {/* Central Line (Mobile: Left, Desktop: Center) */}
          <div className="absolute top-0 bottom-0 right-8 md:left-1/2 md:-translate-x-1/2 w-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              style={{ height: progressHeight }} 
              className="w-full bg-gradient-to-b from-blue-500 via-emerald-500 to-yellow-500 rounded-full"
            />
          </div>

          {/* Animated Lead Node flowing down */}
          <motion.div 
            style={{ top: progressHeight }}
            className="absolute right-[28px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-white shadow-[0_0_20px_rgba(255,255,255,1)] rounded-full z-20 -translate-y-1/2 pointer-events-none"
          />

          <div className="space-y-24">
            {stages.map((stage, i) => {
              // Calculate specific scroll trigger points for each item
              const start = i * (1 / stages.length);
              const end = (i + 1) * (1 / stages.length);
              
              const itemOpacity = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start], [0.3, 1]);
              const itemScale = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start], [0.9, 1]);
              const itemBorderColor = useTransform(scrollYProgress, [start, end], ["rgba(255,255,255,0.05)", "rgba(16,185,129,0.5)"]);

              const isEven = i % 2 === 0;

              return (
                <div key={i} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} justify-end md:justify-between`}>
                  
                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block md:w-[45%]" />

                  {/* Icon Node */}
                  <motion.div 
                    style={{ opacity: itemOpacity, scale: itemScale }}
                    className="absolute right-0 translate-x-1/2 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-[#0A0A0A] border-4 border-[#1A1A1A] flex items-center justify-center z-10"
                  >
                    <motion.div style={{ borderColor: itemBorderColor }} className="absolute inset-0 rounded-full border-4" />
                    <stage.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    style={{ opacity: itemOpacity, scale: itemScale, borderColor: itemBorderColor }}
                    className="w-[85%] md:w-[45%] bg-white/5 border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stage.color} opacity-10 blur-2xl rounded-full`} />
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-5xl font-black text-white/5 font-sans" dir="rtl">0{i + 1}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/5" dir="rtl">
                        {stage.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 leading-snug">{stage.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{stage.desc}</p>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
