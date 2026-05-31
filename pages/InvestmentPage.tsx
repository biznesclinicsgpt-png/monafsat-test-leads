import React from 'react';
import { HeroSection } from '../components/InvestmentV3/HeroSection';
import { StatsRow } from '../components/InvestmentV3/dashboard/StatsRow';
import { ProblemSection } from '../components/InvestmentV3/ProblemSection';
import { MoatSection } from '../components/InvestmentV3/MoatSection';
import { MonafsatNetworkSection } from '../components/InvestmentV3/MonafsatNetworkSection';
import { GrowthTriangleSection } from '../components/InvestmentV3/GrowthTriangleSection';
import { WorkStagesSection } from '../components/InvestmentV3/WorkStagesSection';
import { SmartDashboardSection } from '../components/InvestmentV3/SmartDashboardSection';
import { HumanTeamSection } from '../components/InvestmentV3/HumanTeamSection';
import { DeliverablesSection } from '../components/InvestmentV3/DeliverablesSection';
import { GrowthCalculatorSection } from '../components/InvestmentV3/GrowthCalculatorSection';
import { ComparisonSection } from '../components/InvestmentV3/ComparisonSection';
import { AssetsSection } from '../components/InvestmentV3/AssetsSection';
import { FutureSection } from '../components/InvestmentV3/FutureSection';
import { PricingSection } from '../components/InvestmentV3/PricingSection';
import { RevenueShareSection } from '../components/InvestmentV3/RevenueShareSection';
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
            <StatsRow />
            <ProblemSection />
            <MoatSection />
            <MonafsatNetworkSection />
            <GrowthTriangleSection />
            <WorkStagesSection />
            <SmartDashboardSection />
            <HumanTeamSection />
            <DeliverablesSection />
            <GrowthCalculatorSection />
            <ComparisonSection />
            <AssetsSection />
            <FutureSection />
            <PricingSection />
            <RevenueShareSection />
            <SmartPortfolioSection />
            <FinalCtaSection />
        </div>
    );
};

export default InvestmentPage;
