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
    // 1. KPI Calculations & Pipeline Health
    // Benchmarks: Leads (1000), Meetings (20), Proposals (10), Deals (1)
    const pipelineScoreRaw = (
        (Math.min(data.leadsPerMonth, 1000) / 1000 * 30) +
        (Math.min(data.meetingsPerMonth, 20) / 20 * 30) +
        (Math.min(data.proposalsPerMonth, 10) / 10 * 20) +
        (Math.min(data.closedWonPerMonth, 2) / 2 * 20)
    );

    const winRate = data.proposalsPerMonth > 0 ? (data.closedWonPerMonth / data.proposalsPerMonth) * 100 : 0;
    const projectedRevenue = data.closedWonPerMonth * data.avgDealSize;
    const revenueGap = Math.max(0, data.monthlyTarget - projectedRevenue);

    // Sales Velocity with new simple formula: (Meetings * WinRate * DealSize) / Cycle
    const salesVelocity = data.salesCycle > 0
        ? (data.meetingsPerMonth * (winRate / 100) * data.avgDealSize) / data.salesCycle
        : 0;

    const kpis: KpiResult = {
        winRate,
        leadToMeeting: data.leadsPerMonth > 0 ? (data.meetingsPerMonth / data.leadsPerMonth) * 100 : 0,
        meetingToProposal: data.meetingsPerMonth > 0 ? (data.proposalsPerMonth / data.meetingsPerMonth) * 100 : 0,
        proposalToClose: winRate,
        pipelineCoverage: data.monthlyTarget > 0 ? (data.pipelineValue / data.monthlyTarget) : 0,
        salesVelocity,
        projectedRevenue,
        revenueGap
    };

    // 2. Deep Scoring (0-100)

    // A. Foundation & Assets (20%)
    // Checklist: Profile, Deck, Pricing, Website, Social
    const assetsScoreRaw = (
        (data.hasCompanyProfile ? 20 : 0) +
        (data.hasPitchDeck ? 20 : 0) +
        (data.hasPricingFile ? 20 : 0) +
        (data.hasProfessionalWebsite ? 20 : 0) +
        (data.hasSocialPresence ? 20 : 0)
    );

    // B. Outbound Volume (The 100 Club) (30%)
    // Targets: Call(100), WA(100), LI(100), Email(100)
    // We cap at 100 to avoid skewing
    const volumeScoreRaw = (
        (Math.min(data.dailyCalls, 100) / 100 * 25) +
        (Math.min(data.dailyWhatsapp, 100) / 100 * 25) +
        (Math.min(data.dailyLinkedin, 100) / 100 * 25) +
        (Math.min(data.dailyEmails, 100) / 100 * 25)
    );

    // C. Tech & Process (20%)
    const techScoreRaw = (
        (data.hasSalesNavigator ? 20 : 0) +
        (data.recordsCalls ? 20 : 0) +
        (data.analyzesConversations ? 20 : 0) +
        (data.usesAIAgents ? 20 : 0) +
        (data.hyperPersonalized ? 20 : 0)
    );

    // D. Strategy & Fit (30%)
    // Age vs Focus, ICP Clarity (implied by inputs)
    // If Age < 1 and Industry Count > 3, penalty
    let strategyPenalty = 0;
    if (data.companyAge < 2 && data.icpIndustries.length > 3) strategyPenalty = -30;

    const strategyScoreRaw = Math.max(0, (data.specializationFocus * 10) + strategyPenalty);

    // Weighted Overall Score
    const overallScore = Math.round(
        (assetsScoreRaw * 0.20) +
        (volumeScoreRaw * 0.30) +
        (techScoreRaw * 0.20) +
        (strategyScoreRaw * 0.15) +
        (pipelineScoreRaw * 0.15)
    );

    let tier = 'مبتدئ';
    if (overallScore >= 85) tier = 'نينجا محترف 🥷';
    else if (overallScore >= 60) tier = 'متقدم 📈';
    else if (overallScore >= 40) tier = 'متوسط 😐';

    const scores: ScoreResult = {
        overallScore,
        tier,
        tierLabel: tier,
        icpScore: Math.round(strategyScoreRaw),
        crmScore: Math.round(techScoreRaw),
        outboundScore: Math.round(volumeScoreRaw),
        teamScore: Math.round(assetsScoreRaw), // Mapping Assets to Team/Readiness visual
        mindsetScore: Math.round(pipelineScoreRaw),
        segment: data.employees > 50 ? 'Enterprise' : 'SMB',
        acv: data.avgDealSize,
        credits: overallScore * 10
    };

    // 3. Deep Recommendations Generation
    const recommendations: Recommendation[] = [];

    // Strategy & Focus Gap
    if (data.companyAge < 2 && data.icpIndustries.length > 2) {
        recommendations.push({
            type: 'critical',
            category: 'Strategy',
            title: 'خطر التشتت (Lack of Focus)',
            icon: '🎯',
            problem: `عمر الشركة صغير (${data.companyAge} سنوات) وتستهدف ${data.icpIndustries.length} قطاعات.`,
            impact: 'عدم بناء خبرة تراكمية (Domain Authority) وصعوبة الإقناع.',
            solution: 'التزم بقطاع واحد فقط (Niche) لمدة 6 أشهر حتى تثبت النموذج.',
            tools: 'Positioning'
        });
    }

    // Asset Gaps
    if (!data.hasPitchDeck) {
        recommendations.push({
            type: 'critical',
            category: 'Assets',
            title: 'غياب العرض الاستثماري (Pitch Deck)',
            icon: '📂',
            problem: 'لا يوجد ملف Sales Pitch Deck يحكي قصة الشركة.',
            impact: 'العميل لا يفهم القيمة المضافة، والاعتماد كلياً على مهارة البائع الشفهية.',
            solution: 'بناء عرض تقديمي يركز على المشكلة، الحل، والعائد على الاستثمار (ROI Story).',
            tools: 'Canva / PPT'
        });
    }

    if (!data.hasSalesNavigator && data.monthlyTarget > 50000) {
        recommendations.push({
            type: 'critical',
            category: 'Tech',
            title: 'تفعيل Sales Navigator فوراً',
            icon: '💎',
            problem: 'تستهدف صفقات كبيرة بدون أداة الوصول لصناع القرار.',
            impact: 'العمل "بالعمياني" وضياع وقت في البحث اليدوي.',
            solution: 'تفعيل رخصة Sales Navigator واستخدام فلاتر متقدمة (Headcount, Growth).',
            tools: 'LinkedIn Sales Nav'
        });
    }

    // Volume Gaps (The 100 Club)
    if (data.dailyCalls < 50 && data.dailyWhatsapp < 50 && data.dailyLinkedin < 50) {
        recommendations.push({
            type: 'warning',
            category: 'Volume',
            title: 'رفع نشاط الـ Outbound (نادي الـ 100)',
            icon: '🔥',
            problem: 'معدلات النشاط اليومي ضعيفة جداً لا تكفي لبناء Pipeline.',
            impact: 'جفاف في الاجتماعات المؤهلة.',
            solution: 'رفع المعدل اليومي ليكون: 100 مكالمة، 100 واتساب، 100 لينكدان.',
            tools: 'Auto-Dialer / Automation'
        });
    }

    if (!data.recordsCalls) {
        recommendations.push({
            type: 'info',
            category: 'Quality',
            title: 'تسجيل وتحليل المكالمات',
            icon: '🎙️',
            problem: 'لا يوجد آلية لمراجعة جودة المكالمات.',
            impact: 'تكرار نفس الأخطاء البيعية وعدم تطوير الفريق.',
            solution: 'تفعيل تسجيل المكالمات وتحليلها أسبوعياً (Coaching Sessions).',
            tools: 'Fireflies / Gong'
        });
    }

    if (data.leadsPerMonth < 500) {
        recommendations.push({
            type: 'warning',
            category: 'Pipeline',
            title: 'تغذية الـ Database',
            icon: '🛢️',
            problem: `عدد العملاء المحتملين (${data.leadsPerMonth}) أقل من الحد الأدنى الصحي (1000).`,
            impact: 'نقص حاد في الفرص المستقبلية.',
            solution: 'بناء List Building System يضخ 1000 عميل محتمل شهرياً.',
            tools: 'Apollo / Lusha'
        });
    }

    return {
        kpis,
        scores,
        recommendations,
        pkg: {
            wallet: 'High',
            priority: 'Immediate',
            mode: 'Aggressive'
        }
    };
};
