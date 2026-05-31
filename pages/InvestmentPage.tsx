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
import { FlowRail } from '../components/InvestmentV3/FlowRail';
import { SectionBridge } from '../components/InvestmentV3/SectionBridge';

const InvestmentPage = () => {
    return (
        <div
            className="min-h-screen selection:bg-emerald-500/30 font-sans relative overflow-x-hidden pt-[60px] md:pt-0"
            dir="rtl"
            style={{
                fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
                background: '#050505',
                color: '#e2e8f0', // slate-200
                lineHeight: 1.7,
            }}
        >
            {/* Interactive Progress and Side Nav */}
            <FlowRail />

            <div id="hero">
                <HeroSection />
            </div>

            <div id="stats-row">
                <StatsRow />
            </div>
            
            <SectionBridge label="رصد أين تتسرب فرص المبيعات" color="aqua" />
            <div id="problem">
                <ProblemSection />
            </div>
            
            <SectionBridge label="التحول من الفوضى لميزة تنافسية" color="aqua" />
            <div id="moat">
                <MoatSection />
            </div>
            
            <SectionBridge label="الميزة التنافسية ← السيطرة وإدارة دفة الفرص" color="aqua" />
            <div id="radar-system">
                <MonafsatNetworkSection />
            </div>
            
            <SectionBridge label="رصد الرادار ← تفعيل قنوات النمو والمبيعات" color="aqua" />
            <div id="growth-triangle">
                <GrowthTriangleSection />
            </div>
            
            <SectionBridge label="تشغيل منظومة الإيرادات الذكية" color="purple" />
            <div id="work-stages">
                <WorkStagesSection />
            </div>
            
            <SectionBridge label="إسناد الفرص للـ ٢٥ وكيل ذكي" color="purple" />
            <div id="dashboard-cmd">
                <SmartDashboardSection />
            </div>
            
            <SectionBridge label="الذكاء الاصطناعي ← تدخل الفريق البشري" color="purple" />
            <div id="human-team">
                <HumanTeamSection />
            </div>
            
            <SectionBridge label="مخرجات وأصول مبيعات حقيقية" color="emerald" />
            <div id="deliverables">
                <DeliverablesSection />
            </div>
            
            <SectionBridge label="المخرجات ← محاكاة النمو المالي المتوقع" color="emerald" />
            <div id="growth-calculator">
                <GrowthCalculatorSection />
            </div>
            
            <SectionBridge label="أثر المنظومة مقارنة بالجهود التقليدية" color="emerald" />
            <div id="comparison">
                <ComparisonSection />
            </div>
            
            <SectionBridge label="بنية الأدوات والأصول التي تبقى للشركة" color="emerald" />
            <div id="tech-assets">
                <AssetsSection />
            </div>
            
            <SectionBridge label="تراكم الأصول ← حالة النمو بعد ٦ شهور" color="emerald" />
            <div id="future">
                <FutureSection />
            </div>
            
            <SectionBridge label="اختيار مستوى التشغيل والاستثمار المناسب" color="aqua" />
            <div id="pricing">
                <PricingSection />
            </div>
            
            <SectionBridge label="باقات التشغيل ← امتداد الشراكة بمشاركة النجاح" color="aqua" />
            <div id="revenue-share">
                <RevenueShareSection />
            </div>
            
            <SectionBridge label="نموذج الشراكة ← نموذج شراء الفرص البديل" color="aqua" />
            <div id="smart-portfolio">
                <SmartPortfolioSection />
            </div>
            
            <SectionBridge label="ابدأ بناء منظومة مبيعاتك الآن" color="emerald" />
            <div id="final-cta">
                <FinalCtaSection />
            </div>
        </div>
    );
};

export default InvestmentPage;
