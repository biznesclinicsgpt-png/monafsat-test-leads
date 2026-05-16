import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Activity, Network, LineChart, Globe, Target, Zap, ShieldCheck, Bot, Users, Handshake, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MonafsatNetworkSection = () => {
    const radarStages = [
        "مراقبة السوق",
        "رصد الاحتياج",
        "إشارة مشروع جديد",
        "تحديد المزود الأنسب",
        "الوصول والتقديم السريع",
        "ميزة تنافسية"
    ];

    const methods = [
        { text: "وكلاء الذكاء الاصطناعي", icon: Bot },
        { text: "فرق بشرية متخصصة", icon: Users },
        { text: "العلاقات المباشرة", icon: Handshake },
        { text: "التواجد المستمر داخل السوق", icon: MapPin }
    ];

    return (
        <div className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Radar Background Animation */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
                <div className="absolute inset-10 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-20 rounded-full border border-cyan-500/10" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(6, 182, 212, 0.4) 100%)' }}
                />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
                            <Radar className="w-5 h-5" />
                            <span className="font-semibold text-sm">كيف نخلق منافسات لصالحك</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            ليست فقط للوصول...<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                                بل للسيطرة على السوق والفوز
                            </span>
                        </h2>
                        
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            نحن ندير دفة السوق ليكون في صالحك باستمرار، ونضعك في قلب المنافسة قبل أن تبدأ رسمياً للجميع.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { text: "وكلاء الذكاء الاصطناعي", icon: Activity },
                                { text: "فرق بشرية متخصصة", icon: Target },
                                { text: "العلاقات المباشرة", icon: Network },
                                { text: "التواجد المستمر", icon: Globe }
                            ].map((method, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                                    <method.icon className="w-5 h-5 text-cyan-400" />
                                    <span className="text-slate-300 font-medium text-sm">{method.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px]" />
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                                الهدف النهائي للمنظومة
                            </h3>
                            <p className="text-slate-300 relative z-10 font-medium">
                                أن تجرد منافسيك من الفرص وتكون حاضراً بقوة عندما تتكون الصفقة... وليس بعد أن يزدحم السوق بالمنافسين.
                            </p>
                        </div>
                    </motion.div>

                    {/* Animation Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="bg-black/50 border border-white/10 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden">
                            {/* Animated Map visualization */}
                            <div className="h-[400px] relative flex flex-col justify-center">
                                {radarStages.map((stage, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.4, duration: 0.5 }}
                                        className="relative pl-8 mb-6 last:mb-0"
                                        dir="rtl"
                                    >
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-cyan-500 z-10 flex items-center justify-center">
                                            <motion.div 
                                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                                                className="w-full h-full bg-cyan-400 rounded-full"
                                            />
                                        </div>
                                        {idx < radarStages.length - 1 && (
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                whileInView={{ height: '100%' }}
                                                transition={{ duration: 0.4, delay: idx * 0.4 }}
                                                className="absolute left-[7px] top-[14px] w-[2px] bg-gradient-to-b from-cyan-500 to-transparent z-0" 
                                            />
                                        )}
                                        
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "text-lg font-bold tracking-wide",
                                                idx === radarStages.length - 1 ? "text-violet-400" : "text-white"
                                            )}>
                                                {stage}
                                            </div>
                                            {idx === 2 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: (idx * 0.4) + 0.2 }}
                                                >
                                                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Overlay Scanning Line */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-cyan-500/50 z-20 pointer-events-none"
                                style={{ boxShadow: '0 0 20px 5px rgba(6, 182, 212, 0.2)' }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
