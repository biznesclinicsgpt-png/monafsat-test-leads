import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Activity, Network, LineChart, Globe, Target, Zap, ShieldCheck, Bot, Users, Handshake, MapPin } from 'lucide-react';

export const MonafsatNetworkSection = () => {
    const radarStages = [
        "مراقبة حركة السوق والمنافسات",
        "رصد الاحتياجات والمشاريع المبكرة",
        "تأهيل الفرصة وتحديد صانع القرار",
        "بناء سيناريو التواصل وصياغة الرسائل",
        "الوصول السريع عبر قنواتنا المتعددة",
        "ترتيب الاجتماع المؤهل وإتمام الإغلاق"
    ];

    return (
        <div className="py-32 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="radar-system">
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

            <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
                            <Radar className="w-5 h-5" />
                            <span className="font-semibold text-sm">كيف ندير دفة الفرص</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            لسنا فقط جهة توليد عملاء…<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                                نحن ندير دفة الفرص لصالحك
                            </span>
                        </h2>
                        
                        <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed">
                            نحن لا نكتفي بجمع قوائم باردة، بل ننشئ منظومة تشغيل حية تراقب السوق السعودي، ترصد الاحتياجات بدقة، وتدير دفة الفرص البيعية لشركتك لتفوز بها بأعلى كفاءة.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { text: "وكلاء الذكاء الاصطناعي", icon: Bot },
                                { text: "فرق بشرية متخصصة", icon: Users },
                                { text: "العلاقات المباشرة", icon: Handshake },
                                { text: "التواجد المستمر داخل السوق", icon: MapPin }
                            ].map((method, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-slate-950/40 border border-slate-900/60 rounded-xl p-4">
                                    <method.icon className="w-5 h-5 text-cyan-400" />
                                    <span className="text-slate-300 font-medium text-xs">{method.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px]" />
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                                الهدف النهائي للمنظومة
                            </h3>
                            <p className="text-xs text-slate-300 relative z-10 font-bold leading-relaxed">
                                أن تجرد منافسيك من الفرص وتكون حاضراً بقوة عندما تتكون الصفقة... وليس بعد أن يزدحم السوق بالمنافسين وتشتد الحرب السعرية.
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
                        <div className="bg-slate-950/40 border border-slate-900/60 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden">
                            {/* Animated Map visualization */}
                            <div className="h-[400px] relative flex flex-col justify-center">
                                {radarStages.map((stage, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2, duration: 0.5 }}
                                        className="relative pr-8 mb-6 last:mb-0"
                                        dir="rtl"
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-cyan-500 z-10 flex items-center justify-center">
                                            <motion.div 
                                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                                                className="w-full h-full bg-cyan-400 rounded-full"
                                            />
                                        </div>
                                        {idx < radarStages.length - 1 && (
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                whileInView={{ height: '120%' }}
                                                transition={{ duration: 0.4, delay: idx * 0.2 }}
                                                className="absolute right-[7px] top-[14px] w-[2px] bg-gradient-to-b from-cyan-500 to-transparent z-0" 
                                            />
                                        )}
                                        
                                        <div className="flex items-center gap-4">
                                            <div className={`text-base font-extrabold tracking-wide ${
                                                idx === radarStages.length - 1 ? "text-emerald-400" : "text-white"
                                            }`}>
                                                {stage}
                                            </div>
                                            {idx === 1 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: (idx * 0.2) + 0.2 }}
                                                >
                                                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
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
