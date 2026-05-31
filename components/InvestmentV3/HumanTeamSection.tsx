import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, FileText, Handshake, TrendingUp, ShieldAlert, Users, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';

export const HumanTeamSection = () => {
  const [handoffStep, setHandoffStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHandoffStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const points = [
    {
      title: "تأكيد الاهتمام",
      desc: "التفاعل السريع مع ردود الفعل الأولية للتأكد من جدية رغبة العميل.",
      icon: UserCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "تأهيل الفرص",
      desc: "تصفية المهتمين وتأكيد ملاءمتهم للشروط والمتطلبات الفنية والمالية.",
      icon: Users,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      title: "ترتيب الاجتماعات",
      desc: "تنسيق وحجز مواعيد العروض التقديمية والاجتماعات المباشرة بسلاسة.",
      icon: Calendar,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20"
    },
    {
      title: "دعم العروض",
      desc: "مساعدتكم في تخصيص وصياغة عروض الأسعار لتجيب بدقة على احتياج العميل.",
      icon: FileText,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "متابعة التفاوض",
      desc: "التواجد المستمر لتذليل الصعاب والاعتراضات أثناء مراجعة العقود.",
      icon: Handshake,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "تحسين احتمالية الإغلاق",
      desc: "تطبيق أفضل استراتيجيات الحسم لضمان توقيع الصفقة بأعلى قيمة.",
      icon: TrendingUp,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    }
  ];

  return (
    <div className="py-28 bg-[#0a0a0a] relative overflow-hidden border-t border-slate-900/60" id="human-team">
      {/* Background soft glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] right-[15%] w-[500px] h-[500px] bg-violet-500/[0.01] blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/[0.01] blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
              <Users className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-xs text-slate-300">الجهد المشترك والتشغيل البشري الاحترافي</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
              الذكاء الاصطناعي يفتح الطريق… وفريق النينجا البشري يحرك الفرصة حتى الإغلاق
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              المبيعات الناجحة لا تكتمل بالتكنولوجيا وحدها. يتولى فريقنا التشغيلي التدخل المباشر في اللحظة المناسبة لتنظيم وحسم المعاملات وتوفير دعم بشري كامل.
            </p>
          </motion.div>
        </div>

        {/* Interactive Handoff Bridge Visual */}
        <div className="bg-slate-950/60 border border-slate-900/80 p-6 md:p-8 rounded-3xl mb-16 relative overflow-hidden flex flex-col items-center justify-center max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.01] via-transparent to-cyan-500/[0.01] pointer-events-none" />
          
          <h3 className="text-xs font-bold text-slate-300 mb-6" dir="rtl">
            محاكاة حيّة لجسر انتقال الفرص (Handoff Bridge)
          </h3>

          <div className="flex items-center justify-between w-full max-w-md gap-4 relative mb-6">
            
            {/* AI Side Node */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500",
                handoffStep === 0 
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-cyan-400' 
                  : 'border-slate-800 bg-slate-950 text-slate-500'
              )}>
                <motion.div animate={handoffStep === 0 ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Cpu className="w-5 h-5" />
                </motion.div>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400">منظومة الذكاء</span>
            </div>

            {/* Connecting Bridge Line */}
            <div className="flex-1 h-[2px] bg-slate-900 relative overflow-hidden">
              {/* Pulsing signal travelling */}
              {handoffStep === 1 && (
                <motion.div 
                  initial={{ right: "0%" }}
                  animate={{ right: "100%" }}
                  transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
                  className="absolute top-[-3px] w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
                />
              )}
              {handoffStep === 2 && (
                <div className="absolute inset-0 bg-emerald-500/50" />
              )}
            </div>

            {/* Human Team Node */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500",
                handoffStep === 2 
                  ? 'border-emerald-400 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-emerald-400' 
                  : 'border-slate-800 bg-slate-950 text-slate-500'
              )}>
                <motion.div animate={handoffStep === 2 ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <UserCheck className="w-5 h-5" />
                </motion.div>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400">فريق المبيعات البشري</span>
            </div>

          </div>

          <div className="text-[10px] md:text-xs font-bold text-slate-300 h-6 text-center">
            {handoffStep === 0 && "١. يقوم وكلاء الذكاء الاصطناعي برصد الاهتمام وتصنيف العميل..."}
            {handoffStep === 1 && "٢. جاري نقل الفرصة المؤهلة مع سجل المحادثات الكامل فوراً..."}
            {handoffStep === 2 && "٣. تم التوصيل! يتدخل فريق النينجا لحجز الموعد وإتمام الصفقة بيقين ✓"}
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "bg-slate-950/40 border p-6 rounded-2xl relative overflow-hidden group transition-all duration-300",
                handoffStep === 2 
                  ? "border-emerald-500/25 bg-emerald-500/[0.01] shadow-[0_0_15px_rgba(16,185,129,0.03)]" 
                  : "border-slate-900/60 hover:border-slate-800"
              )}
            >
              {/* Radial gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex gap-4 items-start relative z-10">
                {/* Content text */}
                <div className="flex-1 text-right order-2">
                  <h3 className={cn(
                    "text-lg font-bold transition-colors mb-2",
                    handoffStep === 2 ? "text-emerald-400" : "text-white group-hover:text-violet-400"
                  )}>
                    {point.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>

                {/* Icon wrapper */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 order-1",
                  handoffStep === 2 
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                    : point.color
                )}>
                  <point.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
