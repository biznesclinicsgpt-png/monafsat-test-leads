import { NinjaFormData } from './types';

// Helper to format currency
export const fmtCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(val);
};

// Helper for status colors
export const getStatusColor = (value: number, good: number, medium: number) => {
    if (value >= good) return 'text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10';
    if (value >= medium) return 'text-amber-500 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10';
    return 'text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10';
};

interface KpiResult {
    winRate: number;
    leadToMeeting: number;
    meetingToProposal: number;
    proposalToClose: number;
    pipelineCoverage: number;
    salesVelocity: number;
    projectedRevenue: number;
    revenueGap: number;
}

interface ScoreResult {
    overallScore: number;
    tier: string;
    tierLabel: string;
    icpScore: number;
    crmScore: number;
    outboundScore: number;
    teamScore: number;
    mindsetScore: number;
    segment: string;
    acv: number;
    credits: number; // Mock credit score
}

interface Recommendation {
    type: 'critical' | 'warning' | 'success' | 'info';
    category: string;
    title: string;
    icon: string;
    problem: string;
    impact: string;
    solution: string;
    tools?: string;
}

export const calculateResults = (data: NinjaFormData) => {
    // 1. KPI Calculations
    const winRate = data.proposalsPerMonth > 0 ? (data.closedWonPerMonth / data.proposalsPerMonth) * 100 : 0;
    const leadToMeeting = data.leadsPerMonth > 0 ? (data.meetingsPerMonth / data.leadsPerMonth) * 100 : 0;
    const meetingToProposal = data.meetingsPerMonth > 0 ? (data.proposalsPerMonth / data.meetingsPerMonth) * 100 : 0;
    const proposalToClose = data.proposalsPerMonth > 0 ? (data.closedWonPerMonth / data.proposalsPerMonth) * 100 : 0; // Same as win rate usually but contextually diff

    const projectedRevenue = data.closedWonPerMonth * data.avgDealSize;
    const revenueGap = Math.max(0, data.monthlyTarget - projectedRevenue);

    // Coverage: Pipeline Value / Target (Ideal 3x-4x)
    const pipelineCoverage = data.monthlyTarget > 0 ? (data.pipelineValue / data.monthlyTarget) : 0;

    // Velocity: (Leads * DealSize * WinRate%) / Cycle
    // Simplified: (Opportunities * Avg Deal * Win Rate%) / Sales Cycle
    // Here: (ClosedWon * DealSize) basically / Cycle -- Normalized to Daily
    const salesVelocity = data.salesCycle > 0 ? (projectedRevenue / data.salesCycle) : 0;

    const kpis: KpiResult = {
        winRate,
        leadToMeeting,
        meetingToProposal,
        proposalToClose,
        pipelineCoverage,
        salesVelocity,
        projectedRevenue,
        revenueGap
    };

    // 2. Scores Calculation (0-100)

    // ICP & Offer (20%)
    const icpScoreRaw = (
        (data.icpClarity / 5 * 40) +
        (data.decisionMakerAccess / 5 * 30) +
        (data.whyNow ? 30 : 0)
    );

    // Data & CRM (20%)
    const crmScoreRaw = (
        (data.crm / 5 * 30) +
        (data.crmUsage / 5 * 30) +
        (data.dataQuality / 5 * 40)
    );

    // Outbound Engine (30%)
    // Normalize volumes against targets? no just raw effort + quality
    const emailScore = (Math.min(data.emailVolume, 100) / 100 * 20) + (Math.min(data.emailOpenRate, 50) / 50 * 30) + (data.emailTools / 5 * 50);
    const liScore = (Math.min(data.linkedinConnects, 50) / 50 * 20) + (data.linkedinContent / 5 * 40) + (data.linkedinNav ? 40 : 0);
    const phoneScore = (Math.min(data.callsVolume, 50) / 50 * 20) + (Math.min(data.callsConnectRate, 30) / 30 * 40) + (data.callsScript / 5 * 40);

    const outboundScoreRaw = (emailScore + liScore + phoneScore) / 3;

    // Team (15%)
    const teamScoreRaw = (
        (data.teamExperience / 5 * 50) +
        (data.followUp / 5 * 50)
    );

    // Mindset (15%)
    const mindsetScoreRaw = (
        (data.readinessLevel / 5 * 50) +
        (data.budgetStatus / 5 * 50)
    );

    const overallScore = Math.round(
        (icpScoreRaw * 0.2) +
        (crmScoreRaw * 0.2) +
        (outboundScoreRaw * 0.3) +
        (teamScoreRaw * 0.15) +
        (mindsetScoreRaw * 0.15)
    );

    // Tier Logic
    let tier = 'Tier 3';
    let tierLabel = 'Needs Assessment';
    if (overallScore >= 80) { tier = 'Tier 1'; tierLabel = 'Market Leader'; }
    else if (overallScore >= 50) { tier = 'Tier 2'; tierLabel = 'Scalable Player'; }

    const scores: ScoreResult = {
        overallScore,
        tier,
        tierLabel,
        icpScore: Math.round(icpScoreRaw),
        crmScore: Math.round(crmScoreRaw),
        outboundScore: Math.round(outboundScoreRaw),
        teamScore: Math.round(teamScoreRaw),
        mindsetScore: Math.round(mindsetScoreRaw),
        segment: data.employees > 100 ? 'Enterprise' : 'SMB',
        acv: data.avgDealSize,
        credits: overallScore * 10 // Mock
    };


    // 3. Recommendations Logic
    const recommendations: Recommendation[] = [];

    // ICP Gap
    if (data.icpClarity < 3) {
        recommendations.push({
            type: 'critical',
            category: 'Strategy',
            title: 'Define Your ICP Clearly',
            icon: '🎯',
            problem: 'الجمهور المستهدف غير محدد بدقة، مما يؤدي لهدر الموارد على عملاء غير مناسبين.',
            impact: 'ارتفاع تكلفة الاستحواذ (CAC) وضياع وقت الفريق.',
            solution: 'عقد ورشة عمل لتحديد الـ ICP بدقة (Firmographics, Demographics, Psychographics).',
            tools: 'Clay / Apollo Filters'
        });
    }

    // CRM Usage
    if (data.crmUsage < 3) {
        recommendations.push({
            type: 'critical',
            category: 'Systems',
            title: 'Implement/Fix CRM Usage',
            icon: '🗄️',
            problem: 'غياب مصدر واحد للحقيقة (Source of Truth). البيانات مشتتة.',
            impact: 'فقدان متابعة العملاء وصعوبة التنبؤ بالمبيعات (Forecasting).',
            solution: 'فرض استخدام CRM كشرط لاحتساب العمولة. ربط CRM بجميع القنوات.',
            tools: 'HubSpot / Pipedrive'
        });
    }

    // Outbound Volume
    if (data.emailVolume < 20 && data.linkedinConnects < 10 && data.callsVolume < 10) {
        recommendations.push({
            type: 'warning',
            category: 'Outbound',
            title: 'Increase Activity Volume',
            icon: '📉',
            problem: 'مستوى النشاط منخفض جداً ولا يكفي لبناء Pipeline صحي.',
            impact: 'جفاف الـ Pipeline وعدم تحقيق المستهدف.',
            solution: 'تصميم Cadence يومي يتطلب 50 لمسة (Touchpoints) لكل SDR.',
            tools: 'Instantly / Lexprompt'
        });
    }

    // Follow Up
    if (data.followUp < 3) {
        recommendations.push({
            type: 'warning',
            category: 'Process',
            title: 'Optimize Follow-up Cadence',
            icon: '🔄',
            problem: 'المتابعة تتوقف مبكراً جداً (بعد محاولتين غالباً).',
            impact: 'خسارة 80% من الفرص التي تحتاج 5-12 متابعة.',
            solution: 'تطبيق 12-Step Cadence عبر قنوات متعددة (Omni-channel).',
            tools: 'Sequences'
        });
    }

    // Add success if score high
    if (overallScore > 80) {
        recommendations.push({
            type: 'success',
            category: 'Growth',
            title: 'Scale & Automate',
            icon: '🚀',
            problem: 'الأساسيات ممتازة. التحدي الآن هو التوسع (Scaling).',
            impact: 'فرصة لمضاعفة الإيرادات بتقليل التدخل البشري.',
            solution: 'استخدام AI Agents لأتمتة البحث والتواصل الأولي بالكامل.',
            tools: 'BiznesClinics Auto-Pilot'
        });
    }

    return {
        kpis,
        scores,
        recommendations,
        pkg: {
            wallet: 'High', // Mock
            priority: 'Immediate',
            mode: 'Aggressive'
        }
    };
};
