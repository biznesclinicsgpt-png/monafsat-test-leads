import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Clock } from 'lucide-react';
import CountUp from 'react-countup';
import { useCases } from './data/investmentProof';
import { cn } from '../../lib/utils';

export const UseCasesSection = () => {
  // Filter use cases to only display fully completed ones (no missing numbers/fields)
  const displayedCases = useCases.filter(uc => {
    return (
      uc.title &&
      uc.sector &&
      uc.outreach !== null && uc.outreach !== undefined &&
      uc.positiveConversations !== null && uc.positiveConversations !== undefined &&
      uc.bookedMeetings !== null && uc.bookedMeetings !== undefined &&
      uc.qualifiedMeetings !== null && uc.qualifiedMeetings !== undefined &&
      uc.result &&
      uc.timeframe &&
      uc.channels && uc.channels.length > 0
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="py-24 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="use-cases">
      
      {/* Background soft glow */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-emerald-950/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 mb-4">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">حالات تشغيل حقيقية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              نماذج من فرص تحولت إلى اجتماعات مؤهلة
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              نماذج توضح كيف تتحول البيانات والاتصال الذكي والمتابعة إلى حجز اجتماعات مؤهلة وقابلة للتحويل لصفقات.
            </p>
          </motion.div>
        </div>

        {/* Use Cases Cards Grid (Adaptive layout for 1 or multiple cases) */}
        <motion.div 
          className={cn(
            "grid gap-6",
            displayedCases.length === 1 
              ? "grid-cols-1 max-w-3xl mx-auto" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence>
            {displayedCases.map((uc) => {
              // Calculate dynamic percentage drops relative to outreach as 100%
              const outreachVal = uc.outreach || 1;
              const convPct = Math.round(((uc.positiveConversations || 0) / outreachVal) * 100);
              const bookedPct = Math.round(((uc.bookedMeetings || 0) / outreachVal) * 100);
              const qualPct = Math.round(((uc.qualifiedMeetings || 0) / outreachVal) * 100);

              return (
                <motion.div
                  key={uc.id}
                  variants={cardVariants}
                  className={cn(
                    "relative bg-[#090D16]/95 border border-slate-900/80 rounded-3xl p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between overflow-hidden shadow-2xl min-h-[500px] hover:border-emerald-500/30",
                    displayedCases.length === 1 && "md:p-10"
                  )}
                >
                  {/* Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    {/* Badges row */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900">
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 font-bold shrink-0">
                        {uc.sector}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-white mb-6 leading-snug">
                      {uc.title}
                    </h3>

                    {/* Operational Metrics Counter Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-black/30 border border-slate-900 p-3 rounded-xl text-right">
                        <span className="block text-[9px] text-slate-500 font-bold mb-1">الوصول المستهدف</span>
                        <span className="text-base md:text-lg font-black text-white font-sans">
                          {uc.outreach ? (
                            <CountUp end={uc.outreach} duration={2} separator="," />
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </span>
                      </div>

                      <div className="bg-black/30 border border-slate-900 p-3 rounded-xl text-right">
                        <span className="block text-[9px] text-slate-500 font-bold mb-1">محادثات تفاعلية</span>
                        <span className="text-base md:text-lg font-black text-white font-sans">
                          {uc.positiveConversations ? (
                            <CountUp end={uc.positiveConversations} duration={2} separator="," />
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </span>
                      </div>

                      <div className="bg-black/30 border border-slate-900 p-3 rounded-xl text-right">
                        <span className="block text-[9px] text-slate-500 font-bold mb-1">اجتماعات محجوزة</span>
                        <span className="text-base md:text-lg font-black text-white font-sans">
                          {uc.bookedMeetings ? (
                            <CountUp end={uc.bookedMeetings} duration={2} separator="," />
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </span>
                      </div>

                      <div className="bg-black/30 border border-slate-900 p-3 rounded-xl text-right">
                        <span className="block text-[9px] text-slate-500 font-bold mb-1">اجتماعات مؤهلة</span>
                        <span className="text-base md:text-lg font-black text-emerald-400 font-sans">
                          {uc.qualifiedMeetings ? (
                            <CountUp end={uc.qualifiedMeetings} duration={2} separator="," />
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Funnel Progress Bars representation */}
                    <div className="space-y-2.5 mb-6">
                      <span className="block text-[9px] text-slate-500 font-bold text-right mb-2.5">قمع تحويل الفرص (Conversion Funnel)</span>
                      
                      {/* Outreach Bar (100%) */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>100%</span>
                          <span>الوصول (Outreach)</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <motion.div className="bg-slate-700 h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1 }} />
                        </div>
                      </div>

                      {/* Conversations Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>{convPct}%</span>
                          <span>محادثات تفاعلية</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <motion.div className="bg-cyan-500 h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${convPct}%` }} transition={{ duration: 1, delay: 0.15 }} />
                        </div>
                      </div>

                      {/* Meetings Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>{bookedPct}%</span>
                          <span>اجتماعات محجوزة</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <motion.div className="bg-violet-500 h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${bookedPct}%` }} transition={{ duration: 1, delay: 0.3 }} />
                        </div>
                      </div>

                      {/* Qualified Meetings Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>{qualPct}%</span>
                          <span>اجتماعات مؤهلة</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <motion.div className="bg-emerald-500 h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${qualPct}%` }} transition={{ duration: 1, delay: 0.45 }} />
                        </div>
                      </div>
                    </div>

                    {/* Summary / Result Text */}
                    <div className="text-right mb-6">
                      <span className="block text-[9px] text-slate-500 font-bold mb-1">النتيجة والعمل المحقق:</span>
                      <p className="text-slate-300 text-xs leading-relaxed font-bold">
                        {uc.result}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Channels & Timeframe */}
                  <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-[9px] text-slate-500 font-bold">
                    <div className="flex items-center gap-1.5 bg-[#050505]/60 border border-slate-900 px-2.5 py-1 rounded-full text-slate-400 font-sans">
                      {uc.channels.join(' | ')}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{uc.timeframe}</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};
