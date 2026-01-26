import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { InvestmentThemeProvider, useInvestmentTheme } from '../context/InvestmentThemeContext';
import { EngineHero } from '../components/Investment/EngineHero';
import { FuelGauge } from '../components/Investment/FuelGauge';
import { PerformanceCore } from '../components/Investment/PerformanceCore';
import { JourneyTimeline } from '../components/Investment/JourneyTimeline';
import { WalletModel } from '../components/Investment/WalletModel';
import { GuaranteeSection } from '../components/Investment/GuaranteeSection';

// Theme Toggle Button Component
const ThemeToggle = () => {
    const { isDark, toggleTheme } = useInvestmentTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`fixed top-6 left-6 z-50 p-3 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-300 ${isDark
                    ? 'bg-slate-800/80 border-slate-700 text-yellow-400 hover:bg-slate-700'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <AnimatePresence mode="wait">
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun size={20} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon size={20} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

// Main Page Content
const InvestmentPageContent = () => {
    const { isDark } = useInvestmentTheme();

    return (
        <div
            className={`min-h-screen font-sans selection:bg-emerald-500/30 transition-colors duration-500 ${isDark
                    ? 'bg-slate-900 text-slate-50'
                    : 'bg-gray-50 text-slate-900'
                }`}
            dir="rtl"
        >
            <ThemeToggle />
            <EngineHero />
            <FuelGauge />
            <PerformanceCore />
            <JourneyTimeline />
            <WalletModel />
            <GuaranteeSection />
        </div>
    );
};

const InvestmentPage = () => {
    return (
        <InvestmentThemeProvider>
            <InvestmentPageContent />
        </InvestmentThemeProvider>
    );
};

export default InvestmentPage;
