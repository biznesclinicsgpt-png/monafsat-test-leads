import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Lightbulb, Activity, Users, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export const WorkStagesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const stages = [
    { title: "فهم السوق والفرص", icon: Search, type: "Lead", color: "from-slate-600 to-slate-500" },
    { title: "الوصول لصناع القرار", icon: MapPin, type: "Contact", color: "from-blue-600 to-blue-500" },
    { title: "بناء الاهتمام", icon: Lightbulb, type: "Interest", color: "from-indigo-600 to-indigo-500" },
    { title: "تحريك الفرص والمتابعة", icon: Activity, type: "Opportunity", color: "from-violet-600 to-violet-500" },
    { title: "الاجتماعات والعروض", icon: Users, type: "Meeting", color: "from-fuchsia-600 to-fuchsia-500" },
    { title: "رفع احتمالية الإغلاق", icon: Trophy, type: "Deal", color: "from-emerald-600 to-emerald-500" },
  ];

  // Map scroll progress to active index (0 to 5)
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="py-40 bg-[#0A0A0A] relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            رحلة نمو كاملة
          </motion.h2>
          <p className="text-xl text-slate-400">
            هكذا تتحرك الفرص من مجرد بيانات إلى إيرادات محققة.
          </p>
        </div>

        <div className="relative pl-8 md:pl-0 md:mx-auto md:w-full">
          
          {/* Central Line (Mobile: Left, Desktop: Center) */}
          <div className="absolute top-0 bottom-0 right-8 md:left-1/2 md:-translate-x-1/2 w-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              style={{ height: progressHeight }} 
              className="w-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 rounded-full"
            />
          </div>

          <div className="space-y-24">
            {stages.map((stage, i) => {
              // Calculate specific scroll trigger points for each item
              const start = i * (1 / stages.length);
              const end = (i + 1) * (1 / stages.length);
              
              const itemOpacity = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start], [0.3, 1]);
              const itemScale = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start], [0.9, 1]);
              const itemBorderColor = useTransform(scrollYProgress, [start, end], ["rgba(255,255,255,0.05)", "rgba(16,185,129,0.5)"]);

              const isEven = i % 2 === 0;

              return (
                <div key={i} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} justify-end md:justify-between`}>
                  
                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block md:w-[45%]" />

                  {/* Icon Node */}
                  <motion.div 
                    style={{ opacity: itemOpacity, scale: itemScale }}
                    className="absolute right-0 translate-x-1/2 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-[#0A0A0A] border-4 border-emerald-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <stage.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    style={{ opacity: itemOpacity, scale: itemScale, borderColor: itemBorderColor }}
                    className="w-[85%] md:w-[45%] bg-white/5 border rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stage.color} opacity-10 blur-2xl rounded-full`} />
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-5xl font-black text-white/5">0{i + 1}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-emerald-400">
                        {stage.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{stage.title}</h3>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
