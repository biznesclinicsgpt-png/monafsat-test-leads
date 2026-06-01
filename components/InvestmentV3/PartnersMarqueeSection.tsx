import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { partnersLogos } from './data/investmentProof';
import { cn } from '../../lib/utils';

export const PartnersMarqueeSection = () => {
  const shouldReduceMotion = useReducedMotion();

  // Create three different shuffled or offset arrays to make rows look unique
  const row1 = [...partnersLogos];
  const row2 = [...partnersLogos].reverse();
  const row3 = [...partnersLogos].slice(5).concat([...partnersLogos].slice(0, 5));

  const renderLogoCard = (logo: typeof partnersLogos[0], idx: number, isStatic = false) => {
    return (
      <div 
        key={`${logo.name}-${idx}`}
        className={cn(
          "px-6 py-4 rounded-2xl bg-[#090D16]/60 border border-slate-900 flex items-center justify-center backdrop-blur-sm transition-all duration-300 min-w-[160px] h-[75px]",
          isStatic 
            ? "hover:border-slate-800" 
            : "mx-3 hover:border-cyan-500/40 hover:bg-[#0B0F19] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group shrink-0 cursor-help"
        )}
      >
        <img 
          src={logo.logoSrc} 
          alt={logo.alt} 
          className={cn(
            "h-7 object-contain filter grayscale brightness-75 opacity-40 transition-all duration-300",
            !isStatic && "group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100",
            logo.sizeHint || "max-w-[130px]"
          )}
          onError={(e) => {
            // Graceful fallback for missing SVG/PNG assets
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const fallback = parent.querySelector('.logo-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }
          }}
        />
        <span className={cn(
          "logo-fallback hidden text-xs font-black text-slate-500 text-center transition-colors duration-300",
          !isStatic && "group-hover:text-cyan-400"
        )}>
          {logo.name}
        </span>
      </div>
    );
  };

  return (
    <div className="py-24 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="partners">
      
      {/* Inline Styles for CSS Animation (Infinite loop marquee) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          animation: marquee-left 35s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 35s linear infinite;
        }
        .pause-on-hover:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}} />

      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-950/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">ثقة السوق</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            شركاء خاضوا التجربة معنا
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            أكثر من 210 شركة في السوق السعودي والخليجي اعتمدت على منظومتنا لتحريك الفرص، الوصول لصناع القرار، وبناء مسار مبيعات أكثر انتظامًا.
          </p>
        </motion.div>
      </div>

      {shouldReduceMotion ? (
        /* Reduced Motion Fallback: Clean, Static Grid of Monochrome Logos */
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {partnersLogos.slice(0, 10).map((logo, idx) => renderLogoCard(logo, idx, true))}
          </div>
        </div>
      ) : (
        /* Active Cinematic Marquee Loop (3 alternating rows, Row 3 hidden on Mobile) */
        <div className="space-y-6 select-none relative w-full overflow-hidden">
          
          {/* Fade Vignette Mask Left & Right */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

          {/* Row 1: Right to Left */}
          <div className="w-full overflow-hidden pause-on-hover">
            <div className="flex w-[200%] marquee-inner animate-marquee-left">
              <div className="flex w-1/2 justify-around">
                {row1.map((logo, idx) => renderLogoCard(logo, idx))}
              </div>
              <div className="flex w-1/2 justify-around">
                {row1.map((logo, idx) => renderLogoCard(logo, idx + 100))}
              </div>
            </div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="w-full overflow-hidden pause-on-hover">
            <div className="flex w-[200%] marquee-inner animate-marquee-right">
              <div className="flex w-1/2 justify-around">
                {row2.map((logo, idx) => renderLogoCard(logo, idx))}
              </div>
              <div className="flex w-1/2 justify-around">
                {row2.map((logo, idx) => renderLogoCard(logo, idx + 100))}
              </div>
            </div>
          </div>

          {/* Row 3: Right to Left (Hidden on Mobile) */}
          <div className="w-full overflow-hidden pause-on-hover hidden md:block">
            <div className="flex w-[200%] marquee-inner animate-marquee-left">
              <div className="flex w-1/2 justify-around">
                {row3.map((logo, idx) => renderLogoCard(logo, idx))}
              </div>
              <div className="flex w-1/2 justify-around">
                {row3.map((logo, idx) => renderLogoCard(logo, idx + 100))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
