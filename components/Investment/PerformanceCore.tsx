import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, Layers, Share2, Target, CheckCircle } from 'lucide-react';

export const PerformanceCore = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Holographic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        ثانياً: <span className="text-cyan-400">محرك الأداء</span> (Revenue Share)
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        ده مقابل تشغيل المنظومة البشرية + التقنية اللي بتحوّل النشاط إلى فرص.
                        <br />
                        <span className="text-white font-bold">مصلحتنا هنا واحدة:</span> كل ما زادت الفرص المؤهلة، زادت شراكتنا.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Element 1: The Team */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 bg-cyan-900/30 rounded-2xl flex items-center justify-center text-cyan-400 mb-6">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">فريق تنفيذ كامل</h3>
                        <ul className="space-y-3 text-slate-400 text-right">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-cyan-500 shrink-0 mt-1" /> 6-8 متخصصين</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-cyan-500 shrink-0 mt-1" /> مديري حسابات</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-cyan-500 shrink-0 mt-1" /> باحثي بيانات</li>
                        </ul>
                    </motion.div>

                    {/* Element 2: AI Core */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-slate-800/50 p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] backdrop-blur-sm relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 relative">
                            <Bot size={32} />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">الذكاء الاصطناعي (AI Force)</h3>
                        <ul className="space-y-3 text-slate-400 text-right">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" /> AI Agents بلهجة سعودية</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" /> 10x سرعة الوصول</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" /> أتمتة كاملة للمتابعة</li>
                        </ul>
                    </motion.div>

                    {/* Element 3: Playbooks */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">منهجيات التشغيل</h3>
                        <ul className="space-y-3 text-slate-400 text-right">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-purple-500 shrink-0 mt-1" /> Playbooks مجربة</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-purple-500 shrink-0 mt-1" /> سيناريوهات تفاعل</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-purple-500 shrink-0 mt-1" /> تدريب وتحسين مستمر</li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
