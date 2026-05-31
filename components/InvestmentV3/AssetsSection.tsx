import React from 'react';
import { motion } from 'framer-motion';
import { Database, MessageSquare, BookOpen, BarChart3, Activity, History, Lock } from 'lucide-react';

export const AssetsSection = () => {
  const assets = [
    { title: "قاعدة بيانات مستهدفة", icon: Database },
    { title: "قوالب ومراحل تواصل", icon: MessageSquare },
    { title: "سجل العلاقات والشبكة", icon: BookOpen },
    { title: "تحليلات الأداء والتقارير", icon: BarChart3 },
    { title: "تدفق وحركة الفرص", icon: Activity },
    { title: "تاريخ التفاوض والعقود", icon: History },
  ];

  const partners = [
    { name: "LinkedIn", type: "الوصول" },
    { name: "Apollo", type: "بيانات B2B" },
    { name: "Clearbit", type: "إثراء البيانات" },
    { name: "Lemlist", type: "المتابعة الذكية" },
    { name: "Lusha", type: "أرقام مباشرة" },
    { name: "Dropcontact", type: "التحقق" }
  ];

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="tech-assets">
      
      {/* Background vault glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Background gear wheels (Engine Stack Orbit) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] overflow-hidden">
        {/* Large gear */}
        <motion.svg 
          className="absolute -top-10 -right-20 w-[400px] h-[400px] text-white"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 50 10 L 50 20 M 50 80 L 50 90 M 10 50 L 20 50 M 80 50 L 90 50 M 22 22 L 29 29 M 71 71 L 78 78 M 22 78 L 29 71 M 71 22 L 78 29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.svg>
        
        {/* Small interacting gear */}
        <motion.svg 
          className="absolute top-[200px] -right-[150px] w-[300px] h-[300px] text-white"
          viewBox="0 0 100 100"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 50 15 L 50 25 M 50 75 L 50 85 M 15 50 L 25 50 M 75 50 L 85 50 M 25 25 L 32 32 M 68 68 L 75 75 M 25 68 L 32 65 M 68 25 L 75 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.svg>

        {/* Another interacting gear on the left */}
        <motion.svg 
          className="absolute bottom-[100px] -left-20 w-[350px] h-[350px] text-white"
          viewBox="0 0 100 100"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 50 12 L 50 22 M 50 78 L 50 88 M 12 50 L 22 50 M 78 50 L 88 50 M 23 23 L 30 30 M 70 70 L 77 77 M 23 77 L 30 70 M 70 23 L 77 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.svg>
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-right">

         {/* Tech Stack / Partners */}
         <div className="mb-32 text-center">
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
             >
                 <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                     بنية تحتية جبارة بدون تشتيت ميزانيتك على أدوات منفصلة
                 </h2>
                 <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                     لا حاجة للدفع والاشتراك بـ 15 أداة عالمية منفصلة ومحاولة ربطها؛ نظامنا يدمج أقوى شراكات التقنية وقواعد البيانات في واجهة تشغيل واحدة تعمل لصالحك بالكامل.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4">
                     {partners.map((p, i) => (
                         <div key={i} className="px-6 py-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center gap-3 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
                             <span className="font-bold text-white text-base">{p.name}</span>
                             <span className="text-xs text-cyan-400 font-bold px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">{p.type}</span>
                         </div>
                     ))}
                     <div className="px-6 py-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-center text-slate-400 text-sm">
                         + أدوات ذكاء اصطناعي مخصصة
                     </div>
                 </div>
             </motion.div>
         </div>
         
         <div className="text-center mb-20">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-4xl mx-auto"
           >
             أنت لا تدفع مقابل خدمة مؤقتة… أنت تبني أصول مبيعات داخل شركتك
           </motion.h2>
           <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
             كافة البيانات والمحادثات والاتصالات التي ننشئها تظل ملكاً خالصاً لمؤسستك، ومسجلة في أصولك البيعية لتستفيد منها في أي وقت.
           </p>
         </div>

         <div className="relative max-w-4xl mx-auto flex flex-col items-center">
           
           {/* Floating Assets */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20 w-full">
             {assets.map((asset, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0.8, y: 50 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ delay: i * 0.1, duration: 0.6 }}
                 className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
               >
                 <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/50 transition-all">
                   <asset.icon className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                 </div>
                 <h3 className="text-base font-bold text-white text-center">{asset.title}</h3>
               </motion.div>
             ))}
           </div>

           {/* The Vault */}
           <motion.div 
             initial={{ opacity: 0, y: 80 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-black border-t border-l border-r border-violet-500/30 rounded-t-[3rem] p-12 relative overflow-hidden"
           >
             {/* Inner glow */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-violet-500/20 blur-[50px] rounded-full" />
             
             <div className="flex flex-col items-center relative z-10 text-center">
               <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                 <Lock className="w-8 h-8 text-violet-400" />
               </div>
               <h3 className="text-2xl md:text-3xl font-black text-white mb-2">مخزن بيانات الشركة المؤمّن</h3>
               <p className="text-violet-400/80 font-bold text-sm">أصولك الرقمية ومعرفتك البيعية في أمان وحفظ كامل</p>
             </div>
             
             {/* Vault door details */}
             <div className="absolute inset-0 border-[16px] border-black/40 rounded-t-[3rem] pointer-events-none" />
             <div className="absolute -left-4 top-20 bottom-0 w-8 bg-slate-800 rounded-r-lg border-r border-slate-700" />
             <div className="absolute -right-4 top-20 bottom-0 w-8 bg-slate-800 rounded-l-lg border-l border-slate-700" />
           </motion.div>

         </div>
      </div>
    </div>
  );
};
