import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Target, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MoatSection = () => {
  const cards = [
    { title: "وصول أسرع", icon: Zap, desc: "نمتلك بالفعل قنوات تواصل مفتوحة مع صناع القرار في قطاعات حيوية، مما يختصر أشهرًا من المحاولات." },
    { title: "معرفة أعمق", icon: Brain, desc: "نفهم ديناميكية السوق السعودي، وما يفضله صناع القرار، وكيفية صياغة الرسالة التي تلقى قبولاً." },
    { title: "فرص أقوى", icon: Target, desc: "بناءً على احتكاكنا اليومي، نقتنص الفرص المخفية ونوجه جهودك نحو الصفقات الأكثر احتمالية للنجاح." },
  ];

  return (
    <div className="py-32 bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center">
      
      {/* Market Pulse Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[800px] h-[800px] rounded-full bg-emerald-500/20 blur-[120px]"
        />
      </div>

      {/* Network Lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path 
          d="M 100 200 Q 400 50 700 300 T 1300 100" 
          fill="transparent" 
          stroke="url(#line-grad)" 
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path 
          d="M 200 600 Q 500 400 800 600 T 1400 400" 
          fill="transparent" 
          stroke="url(#line-grad)" 
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold text-sm">سر التفوق (The MOAT)</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">نحن لا نبدأ من الصفر كل مرة</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            نعمل بشكل يومي داخل السوق السعودي مع شركات وصناع قرار وقطاعات متعددة...
          </p>
        </motion.div>

        {/* Floating Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mt-16">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -15, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.4 
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
                <card.icon className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 text-right">{card.title}</h3>
              <p className="text-slate-400 text-right leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-4 text-slate-400 font-medium"
        >
          <span className="px-4 py-2 bg-white/5 rounded-full border border-white/5">✓ وصول أسرع</span>
          <span className="px-4 py-2 bg-white/5 rounded-full border border-white/5">✓ فهم أفضل لطريقة التواصل</span>
          <span className="px-4 py-2 bg-white/5 rounded-full border border-white/5">✓ تحريك الفرص بطريقة أذكى</span>
          <span className="px-4 py-2 bg-white/5 rounded-full border border-white/5">✓ متابعة المشاريع باحترافية أعلى</span>
        </motion.div>

      </div>
    </div>
  );
};
