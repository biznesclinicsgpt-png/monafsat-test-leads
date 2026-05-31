import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ComparisonSection = () => {
  const comparisons = [
    { old: "محاولات متفرقة غير مترابطة", new: "منظومة تشغيل مستمرة ومترابطة" },
    { old: "الوصول يبدأ من الصفر مع كل عميل", new: "علاقات وفرص يتم تحريكها يوميًا" },
    { old: "الاعتماد على المجهود البشري فقط", new: "تشغيل مدعوم بالذكاء الاصطناعي" },
    { old: "فرص تضيع وتبرد بسبب التأخير", new: "متابعة لا تتوقف بآليات ذكية" },
    { old: "أدوات مشتتة وفوضى إدارية", new: "رؤية موحدة لحركة الفرص والمبيعات" },
  ];

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            الفرق بين الفوضى.. ومنظومة الإيرادات
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Right Side - Chaos */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/5 z-0" />
            <div className="relative z-10 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="text-red-500 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-300">الطرق التقليدية</h3>
            </div>
            
            <ul className="space-y-6 relative z-10">
              {comparisons.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-400">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <span className="text-lg">{item.old}</span>
                </li>
              ))}
            </ul>

            {/* Chaos visual element */}
            <div className="mt-8 p-6 rounded-xl border border-red-500/20 bg-black/50 relative overflow-hidden h-28 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center opacity-70">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "absolute h-2 rounded-full",
                      i % 3 === 0 ? "bg-red-500/60 w-8" : "bg-slate-700/60 w-12"
                    )}
                    animate={{
                      rotate: [i * 30, i * 30 + 360],
                      x: [Math.sin(i) * 40, Math.cos(i) * 40, Math.sin(i) * 40],
                      y: [Math.cos(i) * 20, Math.sin(i) * 20, Math.cos(i) * 20],
                    }}
                    transition={{
                      duration: 8 + (i % 3) * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Left Side - Organized System */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full z-0" />
            
            <div className="relative z-10 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                <TrendingUp className="text-emerald-400 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">المنظومة الجديدة</h3>
            </div>
            
            <ul className="space-y-6 relative z-10">
              {comparisons.map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-start gap-4 text-emerald-100"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-lg font-medium">{item.new}</span>
                </motion.li>
              ))}
            </ul>

            {/* Organized visual element */}
            <div className="mt-8 p-6 rounded-xl border border-emerald-500/30 bg-black/40 h-28 flex flex-col justify-center gap-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-2 w-full bg-emerald-950/50 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: idx === 0 ? "100%" : idx === 1 ? "85%" : "65%" }}
                    transition={{ duration: 1.5, delay: 0.6 + idx * 0.2 }}
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r",
                      idx === 0 ? "from-emerald-500 to-cyan-400" : idx === 1 ? "from-emerald-400 to-teal-400" : "from-emerald-300 to-emerald-400"
                    )}
                  />
                  {/* Glowing data pulse flowing along the organized tracks */}
                  <motion.div 
                    animate={{ left: ["-20%", "120%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: idx * 0.5 }}
                    className="absolute top-0 w-12 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
