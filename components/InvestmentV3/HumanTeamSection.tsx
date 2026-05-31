import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, FileText, Handshake, TrendingUp, ShieldAlert, Users } from 'lucide-react';

export const HumanTeamSection = () => {
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
        <div className="text-center mb-20">
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

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-slate-950/40 border border-slate-900/60 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300"
            >
              {/* Radial gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex gap-4 items-start relative z-10">
                {/* Content text */}
                <div className="flex-1 text-right order-2">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>

                {/* Icon wrapper */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${point.color} order-1`}>
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
