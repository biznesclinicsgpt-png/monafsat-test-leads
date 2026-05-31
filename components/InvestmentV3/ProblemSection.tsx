import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { XCircle, Clock, Users, TrendingDown, Layers, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const problems = [
    { title: "بطء الوصول لصناع القرار", icon: Clock, desc: "تأخر في التواصل وفقدان الأسبقية أمام المنافسين.", delay: 0 },
    { title: "ضعف المتابعة", icon: TrendingDown, desc: "فرص تبرد وتموت تدريجياً لعدم وجود نظام تذكير ومتابعة دوري.", delay: 0.3 },
    { title: "غياب العلاقات", icon: Users, desc: "صعوبة اختراق السوق والبدء من الصفر دائماً بدون جهات اتصال دافئة.", delay: 0.15 },
    { title: "تسريب الفرص من القمع", icon: XCircle, desc: "فقدان العملاء المهتمين في منتصف الرحلة لعدم تسجيل وتوثيق الإجراءات.", delay: 0.45 },
    { title: "غياب منظومة تشغيل واضحة", icon: Layers, desc: "الاعتماد على الاجتهاد الفردي بدلاً من الاعتماد على نظام ذكي متكرر وقابل للتوسع.", delay: 0.2 },
  ];

  const pipelineOpacity = useTransform(scrollYProgress, [0.25, 0.5], [1, 0]);
  const newPipelineOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);

  const unifiedStages = [
    { name: "فرصة", color: "text-cyan-400 border-cyan-500/20" },
    { name: "اهتمام", color: "text-blue-400 border-blue-500/20" },
    { name: "اجتماع", color: "text-violet-400 border-violet-500/20" },
    { name: "عرض", color: "text-indigo-400 border-indigo-500/20" },
    { name: "تفاوض", color: "text-amber-400 border-amber-500/20" },
    { name: "إغلاق", color: "text-emerald-400 border-emerald-500/20" },
  ];

  return (
    <div ref={containerRef} className="py-32 bg-[#050505] relative overflow-hidden border-t border-slate-900/60">
      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto"
          >
            أغلب الشركات لا تخسر بسبب جودة الخدمة… بل بسبب بطء الوصول وتحرك الفرص
          </motion.h2>
        </div>

        {/* Scattered/Broken Nodes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-32">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: prob.delay, duration: 0.6 }}
              className="bg-slate-950/20 border border-dashed border-red-500/20 hover:border-red-500/60 rounded-2xl p-6 relative group transition-all duration-300 animate-pulse"
              style={{ animationDuration: `${3 + i}s` }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <prob.icon className="w-24 h-24 text-red-500" />
              </div>
              <prob.icon className="w-9 h-9 text-red-500/70 mb-4 relative z-10" />
              <h4 className="text-base font-bold text-white mb-2 relative z-10">{prob.title}</h4>
              <p className="text-[11px] text-slate-400 relative z-10 leading-relaxed">{prob.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Animation Area */}
        <div className="relative h-72 w-full max-w-4xl mx-auto rounded-3xl bg-slate-950/40 border border-slate-900/60 p-8 flex items-center justify-center overflow-hidden">
          
          {/* Broken Pipeline (Scattered) */}
          <motion.div style={{ opacity: pipelineOpacity }} className="absolute inset-0 flex items-center justify-center gap-4 flex-wrap md:flex-nowrap px-6">
            <div className="h-3 w-24 bg-red-500/20 rounded-full relative overflow-hidden border border-red-500/30">
              <div className="absolute top-0 right-0 w-8 h-full bg-red-500/40 animate-ping" />
              <div className="absolute -bottom-8 right-0 left-0 text-center text-[9px] text-red-400 font-bold">توقف الوصول</div>
            </div>
            <div className="w-6 h-6 rounded-full border border-red-500/30 border-dashed animate-spin shrink-0" />
            <div className="h-3 w-28 bg-red-500/10 rounded-full relative overflow-hidden border border-red-500/20">
              <div className="absolute -bottom-8 right-0 left-0 text-center text-[9px] text-red-400 font-bold">تسريب متابعة</div>
            </div>
            <div className="w-6 h-6 rounded-full border border-red-500/30 border-dashed animate-spin shrink-0" style={{ animationDirection: 'reverse' }} />
            <div className="h-3 w-24 bg-red-500/5 rounded-full relative border border-red-500/10">
              <div className="absolute -bottom-8 right-0 left-0 text-center text-[9px] text-red-400 font-bold">ضياع الصفقات</div>
            </div>
          </motion.div>

          {/* Organized Revenue Flow (Connected Stepper) */}
          <motion.div style={{ opacity: newPipelineOpacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 w-full">
            <div className="text-[10px] text-slate-500 font-bold mb-6 tracking-widest uppercase">
              قناة الإيرادات المنظمة (تدفق خالي من التسريب)
            </div>
            
            <div className="flex items-center justify-between w-full max-w-3xl bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative">
              {/* Animated laser line through the unified path */}
              <div className="absolute left-6 right-6 h-[1.5px] bg-gradient-to-r from-cyan-500/10 via-emerald-400 to-emerald-500/10 z-0" />

              {unifiedStages.map((stage, idx) => (
                <div key={idx} className="flex items-center relative z-10" dir="ltr">
                  <div className={cn(
                    "px-3.5 py-2 rounded-xl border text-[11px] font-black bg-slate-950/80 shadow-md transition-all duration-300 flex items-center justify-center gap-1.5",
                    stage.color
                  )}>
                    <span className="w-1 h-1 rounded-full bg-current animate-ping" />
                    <span className="font-bold">{stage.name}</span>
                  </div>
                  {idx < unifiedStages.length - 1 && (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3], x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      className="mx-1 text-slate-700 hidden md:block"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-emerald-400 font-extrabold">نحن لا نزيد عدد المحاولات فقط… نحن نبني مسارًا يمنع تسريب الفرص.</p>
        </motion.div>

      </div>
    </div>
  );
};
