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
        "Company Profile",
        "AI Analysis",
        "Best Industries",
        "Best Decision Makers",
        "WhatsApp / LinkedIn / Email",
        "Interest Detected"
    ];

    const humanStages = [
        "Human Takeover",
        "Meeting Confirmed",
        "Proposal Follow-up",
        "Negotiation",
        "Deal Progression"
    ];

    return (
        <div className="py-32 bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full" />
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
                            <Activity className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold text-sm">محرك الإيرادات الهجين (Hybrid Revenue Engine)</span>
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
                        <div className="bg-[#050505] border border-blue-500/20 rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <Bot className="w-8 h-8 text-blue-400" />
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-2">نظام النينجا الذكي</h3>
                            <p className="text-blue-400 font-semibold mb-8">AI Agents - محرك الوصول وتحريك الفرص</p>

                            <div className="space-y-4 mb-12">
                                {aiFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Animation Flow */}
                            <div className="relative p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                <div className="absolute top-0 bottom-0 right-[27px] w-px bg-gradient-to-b from-blue-500/50 to-transparent" />
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
                                            i === aiStages.length - 1 ? "bg-emerald-400 ring-emerald-500/20 animate-pulse" : "bg-blue-400 ring-blue-500/20"
                                        )} />
                                        <div className={cn(
                                            "text-sm font-bold tracking-wide",
                                            i === aiStages.length - 1 ? "text-emerald-400" : "text-blue-200"
                                        )} dir="ltr">
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
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent my-2" />
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 }}
                            className="bg-emerald-500 text-black font-black text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            HANDOFF
                        </motion.div>
                        <div className="h-16 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent my-2" />
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
                        <div className="bg-[#050505] border border-emerald-500/20 rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:border-emerald-500/40 transition-colors h-full flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                <UserCog className="w-8 h-8 text-emerald-400" />
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-2">فريق النينجا البشري</h3>
                            <p className="text-emerald-400 font-semibold mb-8">Human Agents - الذكاء لا يغلق الصفقات وحده</p>

                            <div className="space-y-4 mb-12 flex-1">
                                {humanFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Human Animation Flow */}
                            <div className="relative p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mt-auto">
                                <div className="absolute top-0 bottom-0 right-[27px] w-px bg-gradient-to-b from-emerald-500/50 to-emerald-500" />
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
                                            i === humanStages.length - 1 ? "bg-yellow-400 ring-yellow-500/20 shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "bg-emerald-400 ring-emerald-500/20"
                                        )} />
                                        <div className={cn(
                                            "text-sm font-bold tracking-wide",
                                            i === humanStages.length - 1 ? "text-yellow-400" : "text-emerald-200"
                                        )} dir="ltr">
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
