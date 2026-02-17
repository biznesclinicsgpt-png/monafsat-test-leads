import React from 'react';
import { InvestmentHeroV2 } from '../components/Investment/InvestmentHeroV2';
import { TierSectionV2 } from '../components/Investment/TierSectionV2';
import { ComparisonTableV2 } from '../components/Investment/ComparisonTableV2';
import { InvestmentCTAV2 } from '../components/Investment/InvestmentCTAV2';

const InvestmentPage = () => {
    return (
        <div
            className="min-h-screen selection:bg-emerald-500/30"
            dir="rtl"
            style={{
                fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
                background: '#f6f8fa',
                color: '#334155',
                lineHeight: 1.7,
            }}
        >
            <InvestmentHeroV2 />
            <TierSectionV2 />
            <ComparisonTableV2 />
            <InvestmentCTAV2 />
        </div>
    );
};

export default InvestmentPage;
