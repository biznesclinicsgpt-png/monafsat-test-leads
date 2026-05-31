import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { XCircle, Clock, Users, TrendingDown, Layers } from 'lucide-react';

export const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const problems = [
    { title: "بطء الوصول لصناع القرار", icon: Clock, desc: "تأخر في التواصل وفقدان الأسبقية أمام المنافسين." },
    { title: "ضعف المتابعة", icon: TrendingDown, desc: "فرص تبرد وتموت تدريجياً لعدم وجود نظام تذكير ومتابعة دوري." },
    { title: "غياب العلاقات", icon: Users, desc: "صعوبة اختراق السوق والبدء من الصفر دائماً بدون جهات اتصال دافئة." },
    { title: "تسريب الفرص من القمع", icon: XCircle, desc: "فقدان العملاء المهتمين في منتصف الرحلة لعدم تسجيل وتوثيق الإجراءات." },
    { title: "غياب منظومة تشغيل واضحة", icon: Layers, desc: "الاعتماد على الاجتهاد الفردي بدلاً من الاعتماد على نظام ذكي متكرر وقابل للتوسع." },
  ];

  const pipelineOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);
  const newPipelineOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-32">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/5 border border-red-500/20 rounded-2xl p-6 relative group hover:border-red-500/50 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <prob.icon className="w-24 h-24 text-red-500" />
              </div>
              <prob.icon className="w-10 h-10 text-red-500 mb-4 relative z-10" />
              <h4 className="text-lg font-bold text-white mb-2 relative z-10">{prob.title}</h4>
              <p className="text-xs text-slate-400 relative z-10 leading-relaxed">{prob.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Animation Area */}
        <div className="relative h-64 w-full max-w-4xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 flex items-center justify-center overflow-hidden">
          
          {/* Broken Pipeline */}
          <motion.div style={{ opacity: pipelineOpacity }} className="absolute inset-0 flex items-center justify-center gap-4">
            <div className="h-4 w-32 bg-red-500/50 rounded-full relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-red-400">توقف</div>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-red-500 border-dashed animate-spin" />
            <div className="h-4 w-24 bg-red-500/30 rounded-full relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-red-400">تسريب</div>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-red-500 border-dashed animate-spin" />
            <div className="h-4 w-40 bg-red-500/10 rounded-full relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-red-400">ضياع الفرص</div>
            </div>
          </motion.div>

          {/* Organized Revenue Flow */}
          <motion.div style={{ opacity: newPipelineOpacity }} className="absolute inset-0 flex items-center justify-center gap-2">
            <div className="flex items-center w-full max-w-2xl bg-emerald-500/10 rounded-full p-2 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <motion.div 
                animate={{ x: [0, 500] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] flex items-center justify-center animate-pulse"
              >
                <span className="text-white text-xs font-bold">فرصة</span>
              </motion.div>
              <div className="flex-1 px-8 flex justify-between text-emerald-400 text-sm font-medium">
                <span>تدفق مستمر</span>
                <span>متابعة آلية</span>
                <span>إغلاق ناجح</span>
              </div>
            </div>
          </motion.div>

        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <p className="text-xl text-emerald-400 font-extrabold">نحن لا نزيد عدد المحاولات فقط… نحن نبني مسارًا يمنع تسريب الفرص.</p>
        </motion.div>

      </div>
    </div>
  );
};
