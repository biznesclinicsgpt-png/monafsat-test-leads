import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Zap, Link2 } from 'lucide-react';

const MagneticButton = ({ children, className, href, variant = 'primary' }: { children: React.ReactNode, className?: string, href: string, variant?: 'primary' | 'outline' }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { mass: 0.1, stiffness: 150, damping: 10 });
    const ySpring = useSpring(y, { mass: 0.1, stiffness: 150, damping: 10 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={`relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${className} ${variant === 'primary'
                ? 'bg-slate-900 text-white shadow-xl hover:shadow-emerald-500/20'
                : 'bg-white text-slate-900 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 shadow-sm'
                }`}
        >
            <span className="relative z-10 flex items-center gap-2 font-tajawal">{children}</span>
            {variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400"
                    initial={{ x: '100%' }}
                    whileHover={{ x: '-100%' }}
                    transition={{ duration: 0.5 }}
                    style={{ opacity: 0.2 }}
                />
            )}
        </motion.a>
    );
};

export const InvestmentHeroV2 = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center text-center px-6 py-20 overflow-hidden bg-white"
            dir="rtl"
        >
            {/* Light Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
                }}
            />

            {/* Subtle Glow Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-[900px]">
                {/* Green Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-sm font-tajawal tracking-wide"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    OUTBOUND REVENUE ENGINE V2.0
                </motion.div>

                {/* Heavy Typography - "Future of Deal Flow" Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} // Apple ease
                    className="mb-8 font-tajawal"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-slate-900 leading-[1.1] tracking-tighter">
                        مستقبل <br className="md:hidden" />
                        <span className="text-slate-900">تدفق الصفقات</span>
                    </h1>
                    <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 leading-[1.1] tracking-tighter pb-4">
                        الذكية
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-slate-500 max-w-[700px] mx-auto mb-12 leading-relaxed font-tajawal font-medium"
                >
                    استثمر في <strong className="text-slate-900 font-bold">نظام متكامل</strong> يحول البيانات الخام إلى فرص حقيقية باستخدام وكلاء الذكاء الاصطناعي.
                </motion.p>

                {/* Magnetic CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex gap-4 justify-center flex-wrap"
                >
                    <MagneticButton href="#tiers" variant="primary">
                        <Zap size={20} className="fill-current ml-2" /> الفرص المؤهلة
                    </MagneticButton>
                    <MagneticButton href="#comparison" variant="outline">
                        <Link2 size={20} className="ml-2" /> الشراكة الاستراتيجية
                    </MagneticButton>
                </motion.div>
            </div>

            {/* Floating Elements (Subtle) */}
            <motion.div style={{ y: y1 }} className="absolute md:top-20 top-10 right-4 md:right-20 opacity-10 pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="0.5">
                    <circle cx="50" cy="50" r="40" />
                    <path d="M50 10 V90 M10 50 H90" />
                </svg>
            </motion.div>
        </section>
    );
};
