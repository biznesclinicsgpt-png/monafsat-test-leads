import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Target, ShieldCheck } from 'lucide-react';

export const MoatSection = () => {
  const cards = [
    { title: "قنوات تواصل مفتوحة", icon: Zap, desc: "نمتلك بالفعل قنوات تواصل دافئة ومفتوحة مع صناع القرار في قطاعات حيوية وجهات كبرى، مما يختصر عليك أشهراً طويلة من المحاولات والاتصالات الباردة." },
    { title: "فهم متطلبات صناع القرار", icon: Brain, desc: "نفهم بدقة تفضيلات وديناميكية صناع القرار في السوق السعودي، ونصيغ رسالتك وعرضك بما يلامس نقاط ألمهم الأساسية مباشرة." },
    { title: "فرص مخفية وحية", icon: Target, desc: "بناءً على احتكاكنا اليومي وحركة البيانات المستمرة، نقتنص الفرص والاحتياجات غير المعلنة ونوجه جهودك نحو الصفقات ذات الاحتمالية الأعلى للنجاح." },
  ];

  return (
    <div className="py-32 bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center border-t border-slate-900/60" id="moat">
      
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
            <span className="font-semibold text-sm">سر التفوق والميزة التنافسية</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
            لماذا نصل أسرع من الطرق التقليدية؟
          </h2>
          <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            بدلاً من البدء من الصفر مع كل عميل محتمل وتضييع شهور في محاولة اختراق الحسابات الكبرى، نحن نصل مباشرة إلى الهدف بفضل رصيد علاقاتنا الحية وفهمنا العميق لمتطلبات صناع القرار في السوق السعودي.
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
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.4 
              }}
              className="bg-slate-950/40 backdrop-blur-xl border border-slate-900/60 p-8 rounded-3xl relative group overflow-hidden hover:border-slate-800 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30 mx-auto md:mx-0">
                <card.icon className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-right">{card.title}</h3>
              <p className="text-xs text-slate-400 text-center md:text-right leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-wrap justify-center gap-4 text-slate-400 font-medium"
        >
          <span className="px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-sm">✓ اختصار زمن دورة المبيعات بـ 3 أضعاف</span>
          <span className="px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400 text-sm">✓ تجاوز حواجز السكرتارية والوصول المباشر</span>
          <span className="px-4 py-2 bg-violet-500/10 rounded-full border border-violet-500/20 text-violet-400 text-sm">✓ صياغة عروض وحلول مطابقة لتطلعات صناع القرار</span>
          <span className="px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-sm">✓ تجنب البرود البيعي ومتابعة لحظية ومستمرة</span>
        </motion.div>

      </div>
    </div>
  );
};
