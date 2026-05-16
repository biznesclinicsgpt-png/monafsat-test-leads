import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Target, Users, Presentation, Coins } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RevenueShareSection = () => {
  const steps = [
    { title: "بيانات", icon: Target },
    { title: "اجتماع", icon: Users },
    { title: "عرض", icon: Presentation },
    { title: "إغلاق", icon: Handshake },
    { title: "نجاح مشترك", icon: Coins, highlight: true },
  ];

  return (
    <div className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
            <Coins className="w-5 h-5" />
            <span className="font-semibold text-sm">شراكة حقيقية</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            نموذج مشاركة النجاح
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            في الباقات المتقدمة، نتحول من مزود خدمة إلى شريك نجاح. نحن نربح فقط عندما تنجح الفرصة وتتحول إلى إيرادات حقيقية.
          </p>
        </motion.div>

        {/* Revenue Flow Animation */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Base Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 rounded-full z-0" />
          
          {/* Animated Line */}
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-slate-600 via-emerald-500 to-yellow-500 -translate-y-1/2 rounded-full z-0"
          />

          {/* Animated Opportunity Node */}
          <motion.div
            initial={{ left: "0%" }}
            whileInView={{ left: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"
          />

          <div className="relative z-10 flex justify-between">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i * 0.4), duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all",
                    step.highlight 
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.4)] border-2 border-yellow-300"
                      : "bg-[#0A0A0A] border-2 border-slate-700 hover:border-emerald-500"
                  )}
                >
                  <step.icon className={cn(
                    "w-8 h-8",
                    step.highlight ? "text-white" : "text-slate-400"
                  )} />
                </motion.div>
                <span className={cn(
                  "font-bold text-lg",
                  step.highlight ? "text-yellow-400" : "text-slate-300"
                )}>
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
