import React from 'react';
import { HeroSection } from '../components/InvestmentV3/HeroSection';
import { ProblemSection } from '../components/InvestmentV3/ProblemSection';
import { MoatSection } from '../components/InvestmentV3/MoatSection';
import { NinjaAgentsSection } from '../components/InvestmentV3/NinjaAgentsSection';
import { SmartDashboardSection } from '../components/InvestmentV3/SmartDashboardSection';
import { MonafsatNetworkSection } from '../components/InvestmentV3/MonafsatNetworkSection';
import { ComparisonSection } from '../components/InvestmentV3/ComparisonSection';
import { WorkStagesSection } from '../components/InvestmentV3/WorkStagesSection';
import { AssetsSection } from '../components/InvestmentV3/AssetsSection';
import { PricingSection } from '../components/InvestmentV3/PricingSection';
import { RevenueShareSection } from '../components/InvestmentV3/RevenueShareSection';
import { FutureSection } from '../components/InvestmentV3/FutureSection';
import { SmartPortfolioSection } from '../components/InvestmentV3/SmartPortfolioSection';
import { FinalCtaSection } from '../components/InvestmentV3/FinalCtaSection';

const InvestmentPage = () => {
    return (
        <div
            className="min-h-screen selection:bg-emerald-500/30 font-sans"
            dir="rtl"
            style={{
                fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
                background: '#050505',
                color: '#e2e8f0', // slate-200
                lineHeight: 1.7,
            }}
        >
            <HeroSection />
            <ProblemSection />
            <MoatSection />
            <NinjaAgentsSection />
            <SmartDashboardSection />
            <MonafsatNetworkSection />
            <ComparisonSection />
            <WorkStagesSection />
            <AssetsSection />
            <PricingSection />
            <RevenueShareSection />
            <FutureSection />
            <SmartPortfolioSection />
            <FinalCtaSection />
        </div>
    );
};

export default InvestmentPage;
