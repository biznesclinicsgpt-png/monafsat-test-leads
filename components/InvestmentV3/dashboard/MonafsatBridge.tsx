import React from 'react';
import { Target, Zap, ShieldAlert, Layers } from 'lucide-react';

export const MonafsatBridge = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-20 select-none">
            <div className="bg-slate-950/30 border border-slate-900/80 p-6 md:p-8 rounded-3xl relative overflow-hidden text-right">
                {/* Visual decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.01] via-transparent to-cyan-500/[0.01] pointer-events-none" />
                <div className="absolute -top-[50%] -left-[10%] w-[300px] h-[300px] bg-cyan-500/[0.01] blur-[100px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    
                    {/* Left Column: Visual link graphic */}
                    <div className="flex items-center gap-3 shrink-0 bg-slate-950/60 border border-slate-900 px-5 py-3 rounded-2xl">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-emerald-400">النينجا</span>
                            <span className="text-[7.5px] text-slate-500 font-bold mt-0.5">محرك النمو والمبيعات</span>
                        </div>
                        
                        <div className="flex items-center justify-center text-slate-600 px-2">
                            <Layers className="w-4 h-4 text-slate-700 animate-pulse" />
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-cyan-400">منافسات</span>
                            <span className="text-[7.5px] text-slate-500 font-bold mt-0.5">محرك الفرص والمشاريع</span>
                        </div>
                    </div>

                    {/* Right Column: Descriptions */}
                    <div className="flex-1 md:pr-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-2">
                            <span className="text-[9px] font-black">شريك استراتيجي</span>
                        </div>
                        <h4 className="text-sm md:text-base font-extrabold text-white mb-2 leading-relaxed">
                            مدعوم ومربوط تلقائياً بمحرك منافسات السعودي
                        </h4>
                        <p className="text-[10.5px] md:text-xs text-slate-400 leading-relaxed font-medium max-w-3xl">
                            بينما يعمل **محرك النينجا** كقلب نابض للمبيعات والوصول المباشر والتواصل مع صناع القرار، يقوم **محرك منافسات** بمسح وتوفير الصفقات والمشاريع الحكومية والخاصة لحظة طرحها بالسعودية، لتتكامل المنظومة بالكامل في توليد وتفعيل الفرص البيعية الكبرى لنشاطكم.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
