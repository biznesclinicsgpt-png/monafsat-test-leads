import React from 'react';
import { EngineHero } from '../components/Investment/EngineHero';
import { FuelGauge } from '../components/Investment/FuelGauge';
import { PerformanceCore } from '../components/Investment/PerformanceCore';
import { JourneyTimeline } from '../components/Investment/JourneyTimeline';
import { WalletModel } from '../components/Investment/WalletModel';
import { GuaranteeSection } from '../components/Investment/GuaranteeSection';

const InvestmentPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30" dir="rtl">
            <div className="bg-red-600 text-white text-center text-sm py-1 font-bold fixed top-0 w-full z-50">
                ✅ إصدار 2.1: تم تحديث الأزرار والأسعار
            </div>
            <EngineHero />
            <FuelGauge />
            <PerformanceCore />
            <JourneyTimeline />
            <WalletModel />
            <GuaranteeSection />
        </div>
    );
};

export default InvestmentPage;
