import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

interface StatItemProps {
    value: number;
    suffix: string;
    label: string;
    prefix?: string;
    subtext?: string;
    delay?: number;
    tooltipText: string;
}

const toArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

const AnimatedNumber: React.FC<StatItemProps> = ({ value, suffix, label, prefix = '', subtext, delay = 0, tooltipText }) => {
    const [count, setCount] = useState(0);
    const shouldReduceMotion = useReducedMotion();
    const countRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (shouldReduceMotion) {
            setCount(value);
            setIsCompleted(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const end = value;
                    const duration = 1500; // ms
                    const startTime = performance.now();

                    const animate = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out quad
                        const easeProgress = progress * (2 - progress);
                        const current = Math.floor(easeProgress * (end - start) + start);
                        
                        setCount(current);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                            setIsCompleted(true);
                        }
                    };

                    setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, delay * 1000);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [value, shouldReduceMotion, delay, hasAnimated]);

    // Map suffixes to Arabic
    const formatSuffix = (suf: string) => {
        if (suf === '+') return '+';
        if (suf === 'M+') return ' مليون+';
        if (suf === '%+') return '٪+';
        if (suf === '%') return '٪';
        return suf;
    };

    return (
        <motion.div 
            ref={countRef} 
            onHoverStart={() => setShowTooltip(true)}
            onHoverEnd={() => setShowTooltip(false)}
            animate={isCompleted ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative flex flex-col items-center text-center p-6 bg-slate-950/40 border border-slate-900/60 rounded-2xl backdrop-blur-sm hover:border-emerald-500/30 hover:bg-slate-950/80 transition-all duration-300 cursor-help"
        >
            {/* Hover Tooltip Box */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-[105%] left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] md:text-xs font-bold text-emerald-400 text-center shadow-2xl z-30 pointer-events-none"
                    >
                        {tooltipText}
                        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-baseline gap-0.5">
                {prefix && <span className="text-emerald-400 text-2xl md:text-3xl font-extrabold">{toArabicNumerals(prefix)}</span>}
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {toArabicNumerals(count)}
                </span>
                <span className="text-emerald-400 text-xl md:text-2xl font-bold">{formatSuffix(suffix)}</span>
            </div>
            <div className="text-xs font-bold text-slate-300 mt-2">{label}</div>
            {subtext && <div className="text-[10px] text-slate-500 mt-1 font-medium">{subtext}</div>}
        </motion.div>
    );
};

export const StatsRow = () => {
    const stats: StatItemProps[] = [
        { value: 210, suffix: "+", label: "شركة عملنا معها", subtext: "في السوق السعودي والخليجي", tooltipText: "خبرة تشغيلية داخل السوق السعودي والخليجي", delay: 0 },
        { value: 8, suffix: "M+", label: "بيان وصانع قرار", subtext: "بيانات دقيقة ومحدثة باستمرار", tooltipText: "قاعدة بيانات وتحليل لصناع القرار", delay: 0.1 },
        { value: 20, suffix: "+", label: "فرصة تعاقد شهرياً", subtext: "لكل عميل كمتوسط مبيعات", tooltipText: "فرص تعاقدية مؤهلة شهرياً", delay: 0.2 },
        { value: 100, suffix: "%+", label: "نمو تدفق الفرص", subtext: "مقارنة بالطرق التقليدية", tooltipText: "نمو مضاعف مقارنة بالطرق التقليدية", delay: 0.3 },
        { value: 34, suffix: "%", label: "نمو محتمل في المبيعات", prefix: "18-", subtext: "خلال أول 90 يوم من التشغيل", tooltipText: "زيادة مثبتة في معدل إغلاق صفقاتك", delay: 0.4 }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-20 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <AnimatedNumber key={idx} {...stat} />
                ))}
            </div>
        </div>
    );
};
