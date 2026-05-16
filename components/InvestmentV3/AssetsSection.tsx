import React from 'react';
import { motion } from 'framer-motion';
import { Database, MessageSquare, BookOpen, BarChart3, Activity, History, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AssetsSection = () => {
  const assets = [
    { title: "قاعدة بيانات", icon: Database },
    { title: "مراحل التواصل", icon: MessageSquare },
    { title: "سجل العلاقات", icon: BookOpen },
    { title: "التقارير", icon: BarChart3 },
    { title: "حركة الفرص", icon: Activity },
    { title: "تاريخ التفاوض", icon: History },
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
    <div className="py-32 bg-[#050505] relative overflow-hidden">
      
      {/* Background vault glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">

        {/* Tech Stack / Partners */}
        <div className="mb-32 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    بنية تحتية جبارة مدعومة بأقوى شراكات التقنية
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
                    لا حاجة لتشتيت ميزانيتك على أدوات منفصلة. نظامنا يدمج قوة أكثر من 15 أداة عالمية لتعمل معاً لصالحك، مجتمعة في محرك واحد.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    {partners.map((p, i) => (
                        <div key={i} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
                            <span className="font-bold text-white text-lg">{p.name}</span>
                            <span className="text-xs text-cyan-400 font-medium px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">{p.type}</span>
                        </div>
                    ))}
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                        + أدوات أخرى
                    </div>
                </div>
            </motion.div>
        </div>
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            ما الذي يبقى معكم؟
          </motion.h2>
          <p className="text-xl text-slate-400">
            أنت لا تدفع مقابل خدمة مؤقتة، أنت تبني أصولاً حقيقية داخل شركتك.
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
                animate={{ y: [0, -10, 0] }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '4s',
                  animationIterationCount: 'infinite',
                  animationName: 'float'
                }}
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/50 transition-all">
                  <asset.icon className="w-8 h-8 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white text-center">{asset.title}</h3>
              </motion.div>
            ))}
          </div>

          {/* The Vault */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-black border-t-2 border-l border-r border-violet-500/30 rounded-t-[3rem] p-12 relative overflow-hidden"
          >
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-violet-500/20 blur-[50px] rounded-full" />
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-violet-500/10 border-2 border-violet-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <Lock className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-3xl font-black text-white tracking-widest mb-2">مخزن بيانات الشركة</h3>
              <p className="text-violet-400/80 font-medium">أصولك الرقمية ومعرفتك المؤسسية في أمان تام</p>
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
