import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Users, CheckCircle2, ArrowDown, Bot, UserCog, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export const NinjaAgentsSection = () => {
    const aiFeatures = [
        "دراسة نشاطكم وخدماتكم",
        "تحليل السوق والقطاعات الأنسب",
        "الوصول لأكثر من ٨ ملايين جهة داخل السوق السعودي",
        "تحليل أفضل قنوات التواصل",
        "معرفة احتمالية الاستجابة",
        "متابعة أحدث المعلومات عن كل جهة",
        "تشغيل المحادثات والمتابعة بشكل ذكي ومستمر"
    ];

    const humanFeatures = [
        "تأكيد الاهتمام الحقيقي",
        "إدارة الاجتماعات",
        "متابعة العروض",
        "دعم التفاوض",
        "تحفيز العميل المحتمل",
        "تحسين احتمالية الإغلاق",
        "مشاركة سيناريوهات ذكية للوصول للقرار"
    ];

    const aiStages = [
        "ملف الشركة",
        "التحليل الذكي",
        "القطاعات المستهدفة",
        "صناع القرار",
        "قنوات التواصل المتعددة",
        "رصد الاهتمام"
    ];

    const humanStages = [
        "تدخل الفريق البشري",
        "تأكيد الاجتماعات",
        "متابعة العروض",
        "دعم التفاوض",
        "تحريك الصفقة للإغلاق"
    ];

    return (
        <div className="py-32 bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-violet-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
                            <Activity className="w-5 h-5 text-cyan-400" />
                            <span className="font-semibold text-sm">محرك الإيرادات الهجين</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            منظومتان تعملان بالتوازي لصالح نموكم
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            نحن لا نعتمد على البوتات فقط، ولا على البشر فقط. دمجنا أفضل ما في العالمين لضمان أقصى فعالية.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* AI Agents Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="bg-[#050505] border border-cyan-500/20 rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="mb-8 w-full h-48 rounded-2xl overflow-hidden relative border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                                <img src="/images/ninja-ai.png" alt="AI Ninja Agent" className="w-full h-full object-cover object-top" />
                                <div className="absolute top-4 right-4 z-20 w-12 h-12 bg-cyan-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-cyan-500/30">
                                    <Bot className="w-6 h-6 text-cyan-400" />
                                </div>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-2">نظام النينجا الذكي</h3>
                            <p className="text-cyan-400 font-semibold mb-8">وكلاء الذكاء الاصطناعي - محرك الوصول وتحريك الفرص</p>

                            <div className="space-y-4 mb-12">
                                {aiFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Animation Flow */}
                            <div className="relative p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                                <div className="absolute top-0 bottom-0 right-[27px] w-px bg-gradient-to-b from-cyan-500/50 to-transparent" />
                                {aiStages.map((stage, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex items-center gap-4 mb-4 last:mb-0 relative z-10"
                                    >
                                        <div className={cn(
                                            "w-2 h-2 rounded-full ring-4 shrink-0",
                                            i === aiStages.length - 1 ? "bg-violet-400 ring-violet-500/20 animate-pulse" : "bg-cyan-400 ring-cyan-500/20"
                                        )} />
                                        <div className={cn(
                                            "text-sm font-bold tracking-wide",
                                            i === aiStages.length - 1 ? "text-violet-400" : "text-cyan-200"
                                        )} dir="rtl">
                                            {stage}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Handoff Animation Center (Visible on Desktop) */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center justify-center">
                        <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-10"
                        >
                            <BrainCircuit className="w-8 h-8 text-white/50" />
                        </motion.div>
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-violet-500 to-transparent my-2" />
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 }}
                            className="bg-violet-500 text-white font-black text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                        >
                            انتقال سلس
                        </motion.div>
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-violet-500 to-transparent my-2" />
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
                            className="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-10"
                        >
                            <Users className="w-8 h-8 text-white/50" />
                        </motion.div>
                    </div>

                    {/* Human Agents Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-[#050505] border border-violet-500/20 rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:border-violet-500/40 transition-colors h-full flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="mb-8 w-full h-48 rounded-2xl overflow-hidden relative border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                                <img src="/images/ninja-human.png" alt="Human Ninja Agent" className="w-full h-full object-cover object-top" />
                                <div className="absolute top-4 right-4 z-20 w-12 h-12 bg-violet-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-violet-500/30">
                                    <UserCog className="w-6 h-6 text-violet-400" />
                                </div>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-2">فريق النينجا البشري</h3>
                            <p className="text-violet-400 font-semibold mb-8">الوكلاء البشريون - الذكاء لا يغلق الصفقات وحده</p>

                            <div className="space-y-4 mb-12 flex-1">
                                {humanFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Human Animation Flow */}
                            <div className="relative p-6 bg-violet-500/5 rounded-2xl border border-violet-500/10 mt-auto">
                                <div className="absolute top-0 bottom-0 right-[27px] w-px bg-gradient-to-b from-violet-500/50 to-violet-500" />
                                {humanStages.map((stage, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (i * 0.2) + 1.2 }}
                                        className="flex items-center gap-4 mb-4 last:mb-0 relative z-10"
                                    >
                                        <div className={cn(
                                            "w-2 h-2 rounded-full ring-4 shrink-0",
                                            i === humanStages.length - 1 ? "bg-cyan-400 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-violet-400 ring-violet-500/20"
                                        )} />
                                        <div className={cn(
                                            "text-sm font-bold tracking-wide",
                                            i === humanStages.length - 1 ? "text-cyan-400" : "text-violet-200"
                                        )} dir="rtl">
                                            {stage}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
