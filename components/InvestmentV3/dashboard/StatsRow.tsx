import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StatItemProps {
    value: number;
    suffix: string;
    label: string;
    prefix?: string;
    subtext?: string;
    delay?: number;
}

const toArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

const AnimatedNumber: React.FC<StatItemProps> = ({ value, suffix, label, prefix = '', subtext, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const shouldReduceMotion = useReducedMotion();
    const countRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (shouldReduceMotion) {
            setCount(value);
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
        <div ref={countRef} className="flex flex-col items-center text-center p-6 bg-slate-950/40 border border-slate-900/60 rounded-2xl backdrop-blur-sm hover:border-slate-800 transition-colors duration-300">
            <div className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-baseline gap-0.5">
                {prefix && <span className="text-emerald-400 text-2xl md:text-3xl font-extrabold">{toArabicNumerals(prefix)}</span>}
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {toArabicNumerals(count)}
                </span>
                <span className="text-emerald-400 text-xl md:text-2xl font-bold">{formatSuffix(suffix)}</span>
            </div>
            <div className="text-xs font-bold text-slate-300 mt-2">{label}</div>
            {subtext && <div className="text-[10px] text-slate-500 mt-1 font-medium">{subtext}</div>}
        </div>
    );
};

export const StatsRow = () => {
    const stats: StatItemProps[] = [
        { value: 210, suffix: "+", label: "شركة عملنا معها", subtext: "في السوق السعودي والخليجي", delay: 0 },
        { value: 8, suffix: "M+", label: "بيان وصانع قرار", subtext: "بيانات دقيقة ومحدثة باستمرار", delay: 0.1 },
        { value: 20, suffix: "+", label: "فرصة تعاقد شهرياً", subtext: "لكل عميل كمتوسط مبيعات", delay: 0.2 },
        { value: 100, suffix: "%+", label: "نمو تدفق الفرص", subtext: "مقارنة بالطرق التقليدية", delay: 0.3 },
        { value: 34, suffix: "%", label: "نمو محتمل في المبيعات", prefix: "18-", subtext: "خلال أول 90 يوم من التشغيل", delay: 0.4 }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <AnimatedNumber key={idx} {...stat} />
                ))}
            </div>
        </div>
    );
};
