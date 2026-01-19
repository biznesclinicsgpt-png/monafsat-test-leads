import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, Layers, CheckCircle } from 'lucide-react';

export const PerformanceCore = () => {
    return (
        <section className="py-32 bg-[#0a0a0f] relative overflow-hidden">
            {/* Holographic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-bold mb-4"
                    >
                        المرحلة الثانية: محرك الأداء
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        شراكة في <span className="text-cyan-400">النمو والعوائد</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        نحن لا نقدم مجرد أدوات، بل نضع فريقاً كاملاً وتقنيات متقدمة لخدمة أهدافك البيعية.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Element 1: The Team */}
                    <motion.div
                        whileHover={{ y: -5, rotateX: 2, rotateY: 2 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 p-8 rounded-[32px] border border-slate-800 backdrop-blur-sm relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
                        <div className="w-16 h-16 bg-cyan-900/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">فريق تنفيذ كامل</h3>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-cyan-500 shrink-0" />
                                <span>6-8 متخصصين في النمو</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-cyan-500 shrink-0" />
                                <span>مدير نجاح عملاء مخصص</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-cyan-500 shrink-0" />
                                <span>باحثي بيانات ومدققي جودة</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Element 2: AI Core */}
                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/80 p-10 rounded-[32px] border border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] backdrop-blur-md relative group z-10"
                    >
                        <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-black text-xs font-bold rounded-bl-2xl rounded-tr-[30px]">موصى به</div>
                        <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 relative">
                            <Bot size={40} />
                            <div className="absolute inset-0 bg-emerald-500/30 blur-xl animate-pulse rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-6">الذكاء الاصطناعي (AI)</h3>
                        <ul className="space-y-5 text-slate-300">
                            <li className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                <span className="font-bold">وكلاء AI بلهجة سعودية 🇸🇦</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                <span>سرعة وصول 10x أضعاف البشر</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                <span>تعلم وتطور مستمر يومياً</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Element 3: Playbooks */}
                    <motion.div
                        whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 p-8 rounded-[32px] border border-slate-800 backdrop-blur-sm relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
                        <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">منهجيات التشغيل</h3>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-purple-500 shrink-0" />
                                <span>كتب تشغيل (Playbooks) جاهزة</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-purple-500 shrink-0" />
                                <span>سيناريوهات تفاوض مثبتة</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-purple-500 shrink-0" />
                                <span>قوالب رسائل عالية التحويل</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
