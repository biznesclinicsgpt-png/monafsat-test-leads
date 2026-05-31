import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PricingSection = () => {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tiers = [
    {
      name: "باقة الانطلاق",
      price: "4,000",
      period: "ريال / شهريًا",
      icon: Zap,
      features: [
        "بناء قاعدة بيانات مستهدفة أساسية",
        "إطلاق وتفعيل قنوات التواصل",
        "متابعة دورية للفرص النشطة",
        "تقرير أداء شهري واضح"
      ],
      color: "blue",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]"
    },
    {
      name: "باقة النمو",
      price: "9,000",
      period: "ريال / شهريًا (أو 27,000 ربع سنوي)",
      icon: Shield,
      isPopular: true,
      features: [
        "كل مميزات باقة الانطلاق",
        "منظومة متابعة آلية كاملة (Automated Follow-ups)",
        "تحسين مستمر لسيناريوهات ورسائل التواصل",
        "بناء سجل علاقات متكامل (CRM)",
        "جلسة مراجعة استراتيجية وتقرير أداء نصف شهري"
      ],
      color: "emerald",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]"
    },
    {
      name: "باقة الشراكة",
      price: "18,000",
      period: "ريال / شهريًا (أو تسعير خاص)",
      icon: Crown,
      isPremium: true,
      features: [
        "كل مميزات باقة النمو",
        "مدير حساب مخصص وتشغيل يومي متكامل",
        "وصول مباشر لأعلى صناع القرار بالجهات المستهدفة",
        "استحواذ كامل على الأصول الرقمية وقواعد البيانات",
        "لوحة تحكم حية وتقارير لحظية مخصصة",
        "أولوية دعم مبيعات وتفاوض حتى إتمام الإغلاق"
      ],
      color: "purple",
      glow: "shadow-[0_0_50px_rgba(168,85,247,0.4)]"
    }
  ];

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="pricing">
      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right">
        
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              خطط واستثمار منظومة المبيعات والنمو
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              اختر مستوى التمكين والوصول المناسب لأهداف شركتك بالسوق السعودي وابدأ البناء فوراً.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch justify-center">
          {tiers.map((tier, i) => {
            const isHovered = hoveredTier === i;
            const isHighlighted = tier.isPopular && hoveredTier === null;
            const isActive = isHovered || isHighlighted;

            return (
              <motion.div
                key={i}
                onHoverStart={() => setHoveredTier(i)}
                onHoverEnd={() => setHoveredTier(null)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col w-full max-w-sm rounded-3xl transition-all duration-500 overflow-hidden",
                  tier.isPremium ? "border border-purple-500/50 bg-gradient-to-b from-purple-950/20 to-slate-950" :
                  tier.isPopular ? "border border-emerald-500 bg-gradient-to-b from-emerald-950/20 to-slate-950" :
                  "border border-slate-900/80 bg-slate-950/40",
                  isActive ? "scale-105 z-20" : "scale-100 z-10 opacity-80",
                  isActive ? tier.glow : ""
                )}
              >
                {/* Popular / Premium Badges */}
                {tier.isPopular && (
                  <div className="absolute top-0 inset-x-0 bg-emerald-500 text-slate-950 text-center text-xs font-black py-1">
                    الخيار الأفضل للنمو والتوسع المستقر
                  </div>
                )}
                {tier.isPremium && (
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center text-xs font-black py-1">
                    تجربة النخبة - للشراكات طويلة الأجل
                  </div>
                )}

                <div className={cn("p-8 flex-grow flex flex-col justify-between", (tier.isPopular || tier.isPremium) ? "pt-12" : "")}>
                  
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border",
                        tier.color === 'emerald' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        tier.color === 'purple' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      )}>
                        <tier.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-5xl font-black text-white font-sans">
                          {tier.price}
                        </span>
                        <span className="text-slate-400 text-xs font-bold">ريال سعودي</span>
                      </div>
                      <div className="text-slate-400 text-xs font-bold mt-2">{tier.period}</div>
                    </div>

                    <div className="space-y-4">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-slate-300">
                          <Check className={cn(
                            "w-4 h-4 shrink-0 mt-0.5",
                            tier.color === 'emerald' ? "text-emerald-400" :
                            tier.color === 'purple' ? "text-purple-400" :
                            "text-blue-400"
                          )} />
                          <span className="text-xs text-slate-300 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => scrollToSection('growth-calculator')}
                    className={cn(
                      "mt-10 w-full py-3.5 rounded-xl font-black text-xs transition-all duration-300",
                      tier.isPremium ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]" :
                      tier.isPopular ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]" :
                      "bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-850"
                    )}
                  >
                    ابدأ البناء الآن
                  </button>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
