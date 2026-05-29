import React from 'react';
import { motion } from 'framer-motion';
import { StatsRow } from './dashboard/StatsRow';

export const HeroSection = () => {
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


          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block"
            >
              نحن نخلق لك
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block text-cyan-500"
            >
              الميزة التنافسية
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block"
            >
              للفوز بكل الصفقات
            </motion.span>
          </h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-2xl md:text-3xl font-light text-slate-300"
          >
            جرّد منافسيك من الفرص قبل أن يسمعوا بها.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            في \"منافسات\"، نبني لك منظومة تشغيل هجينة تتفوق على الجميع. نحن لا نزودك بالبيانات وحسب، بل ندير دفة السوق لتكون المنافسة في صالحك دائماً.
          </motion.p>
        </div>
      </div>

      {/* Trust Stats Row Component - Positioned at bottom of Hero for maximum visual impact */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="w-full z-10"
      >
        <StatsRow />
      </motion.div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
    </div>
  );
};
