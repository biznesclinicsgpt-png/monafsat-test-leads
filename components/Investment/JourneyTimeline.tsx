import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Filter, UserCheck, MessageSquare, Radar, PhoneCall, CalendarCheck, FileText, CheckCircle2 } from 'lucide-react';

const STEPS = [
    { icon: Database, title: "1. جمع البيانات الخام", desc: "Sourcing" },
    { icon: Cpu, title: "2. تحليل ذكي بالـ AI", desc: "Enrichment" },
    { icon: Filter, title: "3. تصنيف وفلترة", desc: "Scoring" },
    { icon: UserCheck, title: "4. إثراء بيانات التواصل", desc: "Data Verification" },
    { icon: MessageSquare, title: "5. مراسلات مخصصة", desc: "Omni-channel Outreach" },
    { icon: Radar, title: "6. رصد الاهتمام المبكر", desc: "Intent Signals" },
    { icon: PhoneCall, title: "7. مكالمة فرز وتأهيل", desc: "10-min Discovery" },
    { icon: CalendarCheck, title: "8. إدارة وحجز الاجتماع", desc: "Booking" },
    { icon: FileText, title: "9. متابعة العرض", desc: "Follow-up" },
    { icon: CheckCircle2, title: "10. إغلاق / تحسين", desc: "Closing Loop" },
];

export const JourneyTimeline = () => {
    return (
        <section className="py-20 bg-slate-950 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        رحلة العميل داخل المحرك
                    </h2>
                    <p className="text-slate-400 text-lg">
                        10 مراحل تحول البيانات إلى صفقات مغلقة بدون تدخلك
                    </p>
                </div>

                <div className="relative">
                    {/* Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-cyan-500 to-slate-800 hidden md:block"></div>

                    <div className="space-y-12 relative z-10">
                        {STEPS.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                            >
                                <div className="flex-1 text-center md:text-right">
                                    {idx % 2 === 0 && (
                                        <div className="md:pr-12 md:text-left md:pl-0 pl-0">
                                            <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                                            <p className="text-emerald-500 font-mono text-sm">{step.desc}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shrink-0 shadow-xl relative group">
                                    <div className="absolute inset-0 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                                    <step.icon className="text-slate-300 group-hover:text-emerald-400 transition-colors" size={28} />
                                    <div className="absolute -inset-2 rounded-full border border-emerald-500/20 opacity-0 group-hover:opacity-100 animate-ping"></div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    {idx % 2 !== 0 && (
                                        <div className="md:pl-12 md:text-right md:pr-0 pr-0">
                                            <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                                            <p className="text-cyan-500 font-mono text-sm">{step.desc}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
