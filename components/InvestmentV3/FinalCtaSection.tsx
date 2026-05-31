import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, ChevronLeft } from 'lucide-react';

export const FinalCtaSection = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-40 bg-black relative overflow-hidden flex flex-col justify-center items-center border-t border-slate-900/60">
      
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
          <h2 className="text-3xl md:text-5xl font-black text-white mb-16 leading-tight max-w-4xl mx-auto">
            الشركات التي ستقود السوق ليست الأكثر إرسالًا للرسائل… <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-2 block">
              بل الأكثر حضورًا، وصولًا، متابعة، وفهمًا لحركة الفرص.
            </span>
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('pricing')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-slate-950" />
              ابدأ بناء منظومة النمو الخاصة بك
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
            
            {/* Sparkle effect on hover */}
            <Sparkles className="absolute top-2 left-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:animate-ping text-white z-10" />
          </motion.button>

        </motion.div>

      </div>
    </div>
  );
};
