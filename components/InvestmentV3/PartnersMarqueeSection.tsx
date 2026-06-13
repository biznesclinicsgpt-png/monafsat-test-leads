import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { partnersLogos } from './data/investmentProof';
import { cn } from '../../lib/utils';

export const PartnersMarqueeSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 25, 
      filter: shouldReduceMotion ? 'none' : 'blur(4px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'none',
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Create three different shuffled or offset arrays to make rows look unique
  const row1 = [...partnersLogos];
  const row2 = [...partnersLogos].reverse();
  const row3 = [...partnersLogos].slice(5).concat([...partnersLogos].slice(0, 5));

  const renderLogoCard = (logo: typeof partnersLogos[0], idx: number, isStatic = false) => {
    // Determine custom dimensions based on sizeHint
    let maxW = '68%';
    let maxH = '54px';
    if (logo.sizeHint === 'compact') {
      maxW = '75%';
      maxH = '60px';
    } else if (logo.sizeHint === 'wide') {
      maxW = '72%';
      maxH = '48px';
    } else if (logo.sizeHint === 'tall') {
      maxW = '52%';
      maxH = '64px';
    } else if (logo.sizeHint === 'square') {
      maxW = '58%';
      maxH = '58px';
    }

    return (
      <div 
        key={`${logo.name}-${idx}`}
        className={cn(
          "partner-logo-card px-4 py-2 rounded-2xl flex items-center justify-center backdrop-blur-sm min-w-[165px] md:min-w-[210px] h-[88px] md:h-[118px] shrink-0 cursor-help",
          isStatic ? "static-card" : "mx-3 group"
        )}
      >
        <img 
          src={logo.logoSrc} 
          alt={logo.alt} 
          className="partner-logo-image object-contain"
          style={{ maxWidth: maxW, maxHeight: maxH }}
          onError={(e) => {
            // Graceful fallback for missing SVG/PNG assets
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const fallback = parent.querySelector('.partner-logo-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }
          }}
        />
        <span className="partner-logo-fallback logo-fallback hidden text-center select-none">
          {logo.name}
        </span>
      </div>
    );
  };

  return (
    <div className="py-24 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="partners">
      
      {/* Inline Styles for CSS Animation & Logo Aesthetics */}
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
        
        /* Premium Card styling with customizable contrast */
        .partner-logo-card {
          background: rgba(8, 15, 20, 0.72);
          border: 1px solid rgba(102, 202, 218, 0.16);
          box-shadow: inset 0 0 24px rgba(102, 202, 218, 0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .partner-logo-card:not(.static-card):hover {
          background: rgba(10, 22, 28, 0.86);
          border-color: rgba(102, 202, 218, 0.42);
          box-shadow: 0 0 28px rgba(102, 202, 218, 0.12);
          transform: translateY(-3px) scale(1.02);
        }
        
        /* Visible monochrome default state & hover glow */
        .partner-logo-image {
          filter: brightness(0) invert(0.78);
          opacity: 0.72;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .partner-logo-card:not(.static-card):hover .partner-logo-image {
          filter: brightness(0) invert(1);
          opacity: 1;
          transform: scale(1.05);
        }
        .partner-logo-card.static-card .partner-logo-image {
          filter: brightness(0) invert(0.85);
          opacity: 0.8;
        }
        
        /* Bold typographic fallback text */
        .partner-logo-fallback {
          font-size: 14px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.72);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (min-width: 768px) {
          .partner-logo-fallback {
            font-size: 16px;
          }
        }
        .partner-logo-card:not(.static-card):hover .partner-logo-fallback {
          color: #66cada;
          transform: scale(1.05);
        }
        .partner-logo-card.static-card .partner-logo-fallback {
          color: rgba(255, 255, 255, 0.85);
        }
      `}} />

      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-950/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-right mb-16">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
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
