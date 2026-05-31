import React from 'react';
import { motion } from 'framer-motion';
import { Database, MessageSquare, Send, RefreshCw, Calendar, BarChart3, BookOpen, LayoutDashboard, ShieldCheck, Check } from 'lucide-react';

export const DeliverablesSection = () => {
  const deliverables = [
    {
      title: "قاعدة بيانات مستهدفة",
      desc: "بيانات منقحة ومصنفة بعناية لأهم الشركات وصناع القرار بقطاعك المستهدف.",
      icon: Database
    },
    {
      title: "رسائل وقنوات تواصل",
      desc: "صياغة نصوص وخطابات مخصصة وقوية تناسب نبرة واهتمام كل عميل.",
      icon: MessageSquare
    },
    {
      title: "تشغيل قنوات متعددة",
      desc: "إدارة وبدء التواصل الفعلي عبر الواتساب، لينكدإن، البريد الإلكتروني، والاتصالات.",
      icon: Send
    },
    {
      title: "متابعة ممنهجة",
      desc: "حملات متابعة دورية وذكية مبنية على الذكاء الاصطناعي للحفاظ على حرارة الفرص.",
      icon: RefreshCw
    },
    {
      title: "اجتماعات مؤهلة",
      desc: "تنسيق وحجز اجتماعات مباشرة جاهزة ومؤكدة لفريق مبيعاتكم.",
      icon: Calendar
    },
    {
      title: "تقارير حركة الفرص",
      desc: "تقارير واضحة دورية توضح سير المبيعات، ومعدلات الاهتمام والتقدم بالسوق.",
      icon: BarChart3
    },
    {
      title: "سجل علاقات متكامل",
      desc: "توثيق شامل لكافة بيانات التواصل السابقة والتواريخ والاهتمامات لكل عميل.",
      icon: BookOpen
    },
    {
      title: "لوحة تحكم حية",
      desc: "لوحة قيادة لمراقبة نمو المحادثات والاجتماعات والفرص النشطة لحظياً.",
      icon: LayoutDashboard
    },
    {
      title: "دعم في التفاوض والإغلاق",
      desc: "مساندة كاملة من فريق النينجا البشري لمساعدتكم في صياغة العروض وإغلاق العقود.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="py-28 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="deliverables">
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/[0.01] blur-[150px] rounded-full" />
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
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-xs text-slate-300">مخرجات المنظومة والـ Deliverables</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              ما الذي تحصل عليه فعليًا؟
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              نوفر لك حزمة متكاملة من الأصول التشغيلية، والبيانات الفعالة، والتقنيات لتشغيل دفة مبيعاتك في السوق السعودي بشكل فوري.
            </p>
          </motion.div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-slate-950/40 border border-slate-900/60 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Internal subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div>
                {/* Icon row */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 group-hover:scale-105 transition-all duration-300 mb-6">
                  <item.icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
