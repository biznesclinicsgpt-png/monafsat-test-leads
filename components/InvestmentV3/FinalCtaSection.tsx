import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, ChevronLeft } from 'lucide-react';

export const FinalCtaSection = () => {
  return (
    <div className="py-40 bg-black relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep Glow */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/40 blur-[150px] rounded-full"
        />
        
        {/* Moving Market Signals (Stars/Nodes) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full blur-[1px]"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            الشركات التي ستقود السوق مستقبلًا... <br/>
            <span className="text-slate-500 text-3xl md:text-5xl font-normal">ليست الأكثر إرسالًا للرسائل</span>
          </h2>
          
          <div className="text-2xl md:text-3xl text-emerald-400 font-bold mb-12">
            بل الأكثر:
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20">
            {["حضورًا", "وصولًا", "متابعة", "فهمًا للسوق", "قدرة على تحريك الفرص"].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.2) }}
                className="text-xl md:text-2xl font-bold text-white bg-white/5 border border-white/10 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 text-white rounded-full font-bold text-xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              احجز جلسة بناء منظومة النمو
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
            
            {/* Sparkle effect on hover */}
            <Sparkles className="absolute top-2 left-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:animate-ping text-white z-10" />
          </motion.button>

        </motion.div>

      </div>
    </div>
  );
};
