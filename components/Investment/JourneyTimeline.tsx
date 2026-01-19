import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Database, Cpu, Filter, UserCheck, MessageSquare, Radar, PhoneCall, CalendarCheck, FileText, CheckCircle2 } from 'lucide-react';

const STEPS = [
    { icon: Database, title: "1. جمع البيانات الخام", desc: "المصادر", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { icon: Cpu, title: "2. تحليل ذكي بالـ AI", desc: "الإثراء", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { icon: Filter, title: "3. تصنيف وفلترة", desc: "التصنيف", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { icon: UserCheck, title: "4. إثراء بيانات التواصل", desc: "التحقق", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: MessageSquare, title: "5. مراسلات مخصصة", desc: "الوصول الشامل", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { icon: Radar, title: "6. رصد الاهتمام المبكر", desc: "إشارات الاهتمام", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { icon: PhoneCall, title: "7. مكالمة فرز وتأهيل", desc: "مكالمة كشفية", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    { icon: CalendarCheck, title: "8. إدارة وحجز الاجتماع", desc: "الحجز", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { icon: FileText, title: "9. متابعة العرض", desc: "المتابعة", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { icon: CheckCircle2, title: "10. إغلاق / تحسين", desc: "الإغلاق", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
];

export const JourneyTimeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    return (
        <section className="py-32 bg-[#0a0a0f] relative overflow-hidden" ref={containerRef}>
            {/* Connecting Circuit Line Background */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 button-0 w-[2px] h-full bg-slate-800">
                <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500 via-cyan-500 to-purple-500 origin-top"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 text-xs font-bold mb-4"
                    >
                        هيكلة خط الإنتاج
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6"
                    >
                        رحلة العميل <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">الآلية</span>
                    </motion.h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        من البيانات الخام إلى الإغلاق، بدون تدخل بشري في المراحل الأولية.
                    </p>
                </div>

                <div className="relative space-y-12">
                    {STEPS.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`flex items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col relative group`}
                        >
                            {/* Circuit Node Point */}
                            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0a0f] border-2 border-slate-700 z-20 group-hover:border-emerald-500 transition-colors">
                                <div className="absolute inset-0 bg-emerald-500/50 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                            </div>

                            {/* Text Content */}
                            <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                                <p className={`font-bold text-sm ${step.color} opacity-80 uppercase tracking-wider`}>{step.desc}</p>
                            </div>

                            {/* Icon Card */}
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                                <div className={`absolute inset-0 rounded-2xl ${step.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className={`absolute -inset-[1px] rounded-2xl ${step.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                                <step.icon className={`w-10 h-10 ${step.color}`} />
                            </div>

                            {/* Empty space for grid balance */}
                            <div className="flex-1 hidden md:block" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
