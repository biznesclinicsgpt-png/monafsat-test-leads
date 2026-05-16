import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Network, LineChart, Users, Building, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] bg-[#050505] overflow-hidden flex flex-col justify-center items-center py-20">
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

      <div className="container relative z-10 mx-auto px-4 max-w-5xl">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <img src="/images/logo.png" alt="Monafasat B2B" className="h-20 object-contain invert grayscale brightness-200 contrast-200" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 mb-4"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">ليس مجرد جلب بيانات، بل سيطرة على السوق</span>
          </motion.div>

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
            في "منافسات"، نبني لك منظومة تشغيل هجينة تتفوق على الجميع. نحن لا نزودك بالبيانات وحسب، بل ندير دفة السوق لتكون المنافسة في صالحك دائماً.
          </motion.p>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
            <Building className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">
              +<CountUp end={230} duration={3} />
            </div>
            <div className="text-sm text-slate-400">شركة بالسوق السعودي</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
            <Users className="w-8 h-8 text-violet-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">
              <CountUp end={1000} duration={3} formattingFn={(val) => "آلاف"} />
            </div>
            <div className="text-sm text-slate-400">الاجتماعات والمحادثات</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
            <Network className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">متعددة</div>
            <div className="text-sm text-slate-400">قطاعات حيوية</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
            <LineChart className="w-8 h-8 text-orange-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">يوميًا</div>
            <div className="text-sm text-slate-400">فرص ومشاريع تتم متابعتها</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
    </div>
  );
};
