import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, HelpCircle, ArrowLeft } from 'lucide-react';
import { opportunitySources } from './data/investmentProof';
import { cn } from '../../lib/utils';

const SourceLogo = ({ src, alt, isHovered }: { src: string; alt: string; isHovered: boolean }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cyan-500/5 text-cyan-400">
        <Target className="w-4 h-4 shrink-0" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "w-full h-full object-contain transition-all duration-300",
        isHovered ? "scale-105 opacity-100" : "opacity-90"
      )}
      onError={() => setError(true)}
    />
  );
};

export const OpportunitySourcesSection = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Group sources by category
  const categories = [
    { id: 'govt', name: 'القطاع الحكومي', note: 'تعميدات ومشتريات كبرى' },
    { id: 'semigov', name: 'الجهات شبه الحكومية', note: 'هيئات ومشاريع كبرى' },
    { id: 'corporate', name: 'الشركات الكبرى', note: 'عقود خدمات وتوريد سنوية' },
    { id: 'private', name: 'القطاعات التشغيلية الخاصة', note: 'فرص تجارية وتوزيع للموردين' }
  ];

  return (
    <div className="py-24 bg-[#0A0A0A] relative overflow-hidden border-t border-slate-900/60" id="opportunity-sources">

      {/* Background SVG Flow Rails (Desktop only) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block select-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="source-rail-grad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Central Horizontal Flow Line (RTL Flow: Right to Left) */}
          <path
            d="M 900 300 L 100 300"
            stroke="url(#source-rail-grad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Flow Particles moving along the main pipeline */}
          <circle cx="0" cy="0" r="2" fill="#22d3ee" style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }}>
            <animateMotion dur="4s" repeatCount="indefinite" path="M 900 300 L 100 300" />
          </circle>

          <circle cx="0" cy="0" r="2" fill="#10b981" style={{ filter: "drop-shadow(0 0 4px #10b981)" }}>
            <animateMotion dur="4s" repeatCount="indefinite" begin="2s" path="M 900 300 L 100 300" />
          </circle>

          {/* Vertical branches to columns */}
          <line x1="800" y1="200" x2="800" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="600" y1="200" x2="600" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="400" y1="200" x2="400" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="200" y1="200" x2="200" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </svg>
      </div>

      {/* Inline styles for structured network grid animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-pulse-y {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes grid-pulse-x {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-grid-y {
          animation: grid-pulse-y 6s linear infinite;
        }
        .animate-grid-x {
          animation: grid-pulse-x 8s linear infinite;
        }
      `}} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-4">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">مصادر الفرص بالسوق</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              مصادر فرص تم رصدها وتحريكها من قطاعات السوق
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              منظومتنا ترصد وتستقطب الفرص من مختلف الجهات لتوجيهها لشركتك. <span className="text-cyan-400 font-bold">وفرنا فرصًا من جهات وقطاعات مثل:</span>
            </p>
          </motion.div>
        </div>

        {/* Structured Network Grid container */}
        <div className="relative">

          {/* Vertical & Horizontal Network Circuit Lines */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block z-0">
            {/* Column Dividers */}
            <div className="absolute left-1/4 top-4 bottom-4 w-[1px] bg-slate-900/60" />
            <div className="absolute left-2/4 top-4 bottom-4 w-[1px] bg-slate-900/60" />
            <div className="absolute left-3/4 top-4 bottom-4 w-[1px] bg-slate-900/60" />

            {/* Horizontal flow line crossing the grid */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-900 to-transparent" />

            {/* Glowing flow dots traveling along vertical lines */}
            <div className="absolute left-1/4 w-[5px] h-[5px] -translate-x-[2px] rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-grid-y" style={{ animationDelay: '0s' }} />
            <div className="absolute left-2/4 w-[5px] h-[5px] -translate-x-[2px] rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-grid-y" style={{ animationDelay: '2s' }} />
            <div className="absolute left-3/4 w-[5px] h-[5px] -translate-x-[2px] rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa] animate-grid-y" style={{ animationDelay: '4s' }} />
          </div>

          {/* 4-Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {categories.map((cat, colIdx) => {
              const catSources = opportunitySources.filter(s => s.type === cat.id);

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: colIdx * 0.1 }}
                  className="bg-[#090D16]/40 border border-slate-900/80 rounded-2xl p-5 backdrop-blur-md relative flex flex-col justify-between"
                >
                  <div>
                    {/* Category Header */}
                    <div className="mb-6 border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        {cat.name}
                      </h3>
                      <span className="text-[9px] text-slate-500 font-bold">{cat.note}</span>
                    </div>

                    {/* Nodes list inside category */}
                    <div className="space-y-3.5">
                      {catSources.map((source, idx) => {
                        const isHovered = hoveredNode === `${cat.id}-${idx}`;
                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredNode(`${cat.id}-${idx}`)}
                            onMouseLeave={() => setHoveredNode(null)}
                            className={cn(
                              "relative p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between text-right gap-3",
                              isHovered
                                ? "border-cyan-500/50 bg-[#0B0F19] shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                : "border-slate-900/60 bg-black/40 hover:border-slate-800"
                            )}
                          >
                            {/* Logo image container and text (RTL Flow: Right to Left) */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden transition-colors duration-300" style={{ backdropFilter: 'blur(4px)' }}>
                                <SourceLogo src={source.logoSrc} alt={source.name} isHovered={isHovered} />
                              </div>

                              {/* Label representing source name and sub-type */}
                              <div className="flex flex-col min-w-0 text-right">
                                <span className="text-[10px] md:text-xs font-black text-white whitespace-normal transition-colors leading-tight">
                                  {source.name}
                                </span>
                                <span className="text-[8px] text-slate-500 font-bold mt-1">
                                  {source.typeName}
                                </span>
                              </div>
                            </div>

                            {/* Inner glowing dot */}
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0 ml-1 transition-all duration-300",
                              isHovered ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee] scale-125" : "bg-slate-700"
                            )} />

                            {/* Hover detail popup overlay */}
                            <AnimatePresence>
                              {isHovered && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-[115%] inset-x-0 mx-auto w-[240px] p-4 rounded-xl bg-[#090d16] border border-cyan-500/40 shadow-2xl z-50 text-right pointer-events-none select-none"
                                >
                                  <div className="absolute top-0 right-0 left-0 h-0.5 bg-cyan-500 rounded-t-xl" />
                                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-900">
                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold shrink-0">
                                      {source.note}
                                    </span>
                                    <h4 className="text-[9px] text-slate-400 font-extrabold">{source.typeName}</h4>
                                  </div>
                                  <p className="text-[10.5px] text-white font-bold leading-normal">{source.name}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action / Bridge Notification */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center gap-3 max-w-2xl mx-auto text-center"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-xs md:text-sm text-cyan-400 font-bold leading-relaxed">
            ملاحظة: تُصنف هذه الجهات كمصادر للفرص التي قمنا برصد إشارات احتياجها وتحريكها مسبقاً لصالح الشركات المنضمّة إلينا في المنظومة.
          </p>
        </motion.div>

      </div>
    </div>
  );
};
