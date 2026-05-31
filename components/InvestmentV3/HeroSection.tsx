import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[95vh] bg-[#050505] overflow-hidden flex flex-col justify-center items-center py-20">
      {/* Background Network Effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Animated Nodes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-500/50 blur-sm"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, Math.random() * 40 - 20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        {/* Animated Grid/Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Hero Container */}
      <div className="container relative z-10 mx-auto px-4 max-w-5xl mb-12">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block"
            >
              نخلق لك
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400"
            >
              ميزة تنافسية
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block"
            >
              للفوز بالفرص قبل أن يسمع بها المنافسون
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            منظومة هجينة تجمع بين البيانات، العلاقات، الذكاء الاصطناعي، وفريق تشغيل بشري لتحويل السوق السعودي إلى محادثات، اجتماعات، عروض، وصفقات.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <button
              onClick={() => scrollToSection('calculator')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-extrabold rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 text-base w-full sm:w-auto"
            >
              احسب فرص نموك الآن
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-8 py-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-extrabold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-base w-full sm:w-auto backdrop-blur-sm"
            >
              استعرض باقات التشغيل
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
    </div>
  );
};
