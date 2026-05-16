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
            <div className="mt-8 p-4 rounded-xl border border-red-500/20 bg-black/50 opacity-60">
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-8 h-2 bg-slate-700 rounded-full" />
                ))}
                <div className="w-4 h-2 bg-red-500 rounded-full animate-pulse" />
                <div className="w-12 h-2 bg-slate-700 rounded-full" />
                <div className="w-2 h-2 bg-red-500 rounded-full" />
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
            <div className="mt-8 p-4 rounded-xl border border-emerald-500/30 bg-black/40">
              <div className="flex flex-col gap-3">
                <div className="h-2 w-full bg-emerald-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                <div className="h-2 w-3/4 bg-emerald-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
                <div className="h-2 w-1/2 bg-emerald-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                    className="h-full bg-emerald-300 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
