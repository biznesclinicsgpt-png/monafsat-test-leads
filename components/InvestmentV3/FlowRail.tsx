import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

export const FlowRail = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const sections = [
    { id: 'hero', name: 'الوعد الكبير' },
    { id: 'stats-row', name: 'أرقام الثقة' },
    { id: 'problem', name: 'المشكلة الأساسية' },
    { id: 'moat', name: 'الميزة التنافسية' },
    { id: 'radar-system', name: 'دفة الفرص' },
    { id: 'growth-triangle', name: 'مثلث النمو' },
    { id: 'work-stages', name: 'رحلة الإيرادات' },
    { id: 'dashboard-cmd', name: '٢٥ وكيل ذكي' },
    { id: 'human-team', name: 'الفريق البشري' },
    { id: 'deliverables', name: 'ما تستلمه فعلياً' },
    { id: 'growth-calculator', name: 'حاسبة النمو' },
    { id: 'comparison', name: 'المقارنة الفنية' },
    { id: 'tech-assets', name: 'أصول مبيعاتك' },
    { id: 'future', name: 'النمو بعد ٦ شهور' },
    { id: 'pricing', name: 'باقات المبيعات' },
    { id: 'revenue-share', name: 'مشاركة النجاح' },
    { id: 'smart-portfolio', name: 'المسار البديل' },
    { id: 'final-cta', name: 'الخاتمة والقرار' },
  ];

  // Monitor scroll for section highlighting
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      // Calculate overall scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }

      // Check active section
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile Sticky Header Indicator
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 border-b border-slate-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between text-right">
        {/* Progress Fill Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-100" style={{ width: `${scrollProgress * 100}%` }} />
        
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold">رحلة الإيرادات التفاعلية</span>
          <span className="text-xs font-black text-white mt-0.5">
            {activeSection + 1}. {sections[activeSection]?.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-extrabold px-2.5 py-1 rounded-full animate-pulse">
            المرحلة
          </span>
        </div>
      </div>
    );
  }

  // Desktop Floating Left Navigation Rail
  return (
    <>
      {/* Background Vertical Cinematic Glow Rail */}
      <div className="absolute top-0 bottom-0 right-[8%] w-[1px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-0 pointer-events-none opacity-30">
        {/* Flowing Light pulses inside the rail */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-[-1.5px] w-[4px] h-32 bg-gradient-to-b from-cyan-400 to-transparent animate-[flow_12s_linear_infinite]"
            style={{
              animationDelay: `${i * 2.5}s`,
              top: `${(i / 6) * 100}%`
            }}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flow {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
      `}} />

      {/* Floating Side Nav Journey widget */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3.5 bg-slate-950/80 border border-slate-900 p-5 rounded-3xl backdrop-blur-md shadow-2xl max-w-[200px]" dir="rtl">
        <div className="text-[10px] text-slate-500 font-extrabold pb-2 border-b border-slate-900 text-center tracking-wider uppercase">
          رحلة النمو (١٨ مرحلة)
        </div>
        
        <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 text-right">
          {sections.map((sec, idx) => {
            const isActive = activeSection === idx;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={cn(
                  "group flex items-center gap-2.5 text-right transition-all duration-300 py-0.5",
                  isActive ? "text-cyan-400 scale-[1.03] font-bold" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {/* Visual indicator dot */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300 border",
                      isActive ? "bg-cyan-400 border-cyan-400 scale-125" : "bg-slate-900 border-slate-700 group-hover:border-slate-500"
                    )}
                  />
                  {isActive && (
                    <span className="absolute w-4 h-4 rounded-full bg-cyan-400/20 border border-cyan-400/30 animate-ping" />
                  )}
                </div>

                <span className="text-[10px] font-extrabold tracking-tight truncate max-w-[140px]">
                  {sec.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
