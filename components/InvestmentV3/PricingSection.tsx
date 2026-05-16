import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import CountUp from 'react-countup';
import { cn } from '../../lib/utils';

export const PricingSection = () => {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  const tiers = [
    {
      name: "باقة الانطلاق",
      price: 4000,
      period: "شهريًا",
      icon: Zap,
      features: [
        "بناء قاعدة بيانات مبدئية",
        "تجهيز مسارات التواصل الأساسية",
        "متابعة الفرص النشطة",
        "تقرير شهري للحالة"
      ],
      color: "blue",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]"
    },
    {
      name: "باقة النمو",
      originalPrice: 12000,
      price: 9000,
      period: "لكل ٣ شهور",
      icon: Shield,
      isPopular: true,
      features: [
        "كل مميزات باقة الانطلاق",
        "منظومة متابعة آلية كاملة",
        "تحسين مستمر لرسائل التواصل",
        "بناء سجل علاقات متقدم",
        "جلسة مراجعة استراتيجية كل شهر"
      ],
      color: "emerald",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]"
    },
    {
      name: "باقة الشراكة",
      originalPrice: 48000,
      price: 18000,
      period: "سنويًا",
      icon: Crown,
      isPremium: true,
      features: [
        "كل مميزات باقة النمو",
        "فريق مخصص لإدارة حسابك",
        "الوصول لأعلى صناع القرار",
        "استحواذ كامل على الأصول والبيانات",
        "لوحة تحكم حية مخصصة",
        "أولوية في الدعم والاستجابة"
      ],
      color: "purple",
      glow: "shadow-[0_0_50px_rgba(168,85,247,0.4)]"
    }
  ];

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            استثمر في منظومة نموك
          </motion.h2>
          <p className="text-xl text-slate-400">
            كل ترقية تعني المزيد من الاستقرار، بناء الأصول، والنمو المستدام.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch justify-center">
          {tiers.map((tier, i) => {
            const isHovered = hoveredTier === i;
            const isHighlighted = tier.isPopular && hoveredTier === null; // Default highlight if none hovered
            const isActive = isHovered || isHighlighted;

            return (
              <motion.div
                key={i}
                onHoverStart={() => setHoveredTier(i)}
                onHoverEnd={() => setHoveredTier(null)}
                layout
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col w-full max-w-sm rounded-3xl transition-all duration-500 overflow-hidden",
                  tier.isPremium ? "border-2 border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-black" :
                  tier.isPopular ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-900/20 to-black" :
                  "border border-white/10 bg-white/5",
                  isActive ? "scale-105 z-20" : "scale-100 z-10 opacity-80",
                  isActive ? tier.glow : ""
                )}
              >
                {/* Popular / Premium Badges */}
                {tier.isPopular && (
                  <div className="absolute top-0 inset-x-0 bg-emerald-500 text-white text-center text-sm font-bold py-1">
                    الخيار الأفضل للنمو المستقر
                  </div>
                )}
                {tier.isPremium && (
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center text-sm font-bold py-1">
                    تجربة النخبة - للشراكات طويلة الأمد
                  </div>
                )}

                <div className={cn("p-8 flex-grow flex flex-col", (tier.isPopular || tier.isPremium) ? "pt-12" : "")}>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      tier.color === 'emerald' ? "bg-emerald-500/20 text-emerald-400" :
                      tier.color === 'purple' ? "bg-purple-500/20 text-purple-400" :
                      "bg-blue-500/20 text-blue-400"
                    )}>
                      <tier.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                  </div>

                  <div className="mb-8">
                    {tier.originalPrice && (
                      <div className="text-slate-500 line-through decoration-red-500/50 decoration-2 mb-1 text-lg">
                        {tier.originalPrice.toLocaleString('ar-SA')} ريال
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-black text-white">
                        {isActive ? (
                          <CountUp end={tier.price} duration={1} separator="," />
                        ) : (
                          tier.price.toLocaleString('en-US') // keeping english digits as standard in tech but wait, lets use react-countup which handles format
                        )}
                      </span>
                      <span className="text-slate-400">ريال</span>
                    </div>
                    <div className="text-emerald-400 font-medium mt-2">{tier.period}</div>
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-4">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                          <Check className={cn(
                            "w-5 h-5 shrink-0",
                            tier.color === 'emerald' ? "text-emerald-500" :
                            tier.color === 'purple' ? "text-purple-500" :
                            "text-blue-500"
                          )} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={cn(
                    "mt-8 w-full py-4 rounded-xl font-bold transition-all",
                    tier.isPremium ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]" :
                    tier.isPopular ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]" :
                    "bg-white/10 text-white hover:bg-white/20"
                  )}>
                    اختيار الباقة
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
