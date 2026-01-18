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

    // --- Deep Consultant Logic (Brain of the Ninja) ---

    // 1. Strategic Focus Analysis (Focus vs Experience)
    const industryCount = data.icpIndustries.length;
    if (data.companyAge < 1 && industryCount > 3) {
        recommendations.push({
            type: 'critical',
            category: 'Strategy',
            title: 'خطر التشتت القاتل (Lack of Focus)',
            icon: '🛑',
            problem: `شركتك عمرها أقل من سنة وتستهدف ${industryCount} قطاعات مختلفة في آن واحد.`,
            impact: 'لن تتمكن من بناء "سلطة معرفية" (Domain Authority) في أي قطاع، مما يجعل إغلاق الصفقات صعباً ومكلفاً.',
            solution: 'يجب اختيار "قطاع واحد فقط" (Niche Market) والتركيز عليه لمدة 6 أشهر حتى تثبت نموذج العمل وتجمع دراسات حالة قوية.',
            tools: 'Positioning Canvas'
        });
    }

    // 2. Asset Readiness (The Trust Foundation)
    if (!data.hasCompanyProfile || !data.hasProfessionalWebsite) {
        recommendations.push({
            type: 'critical',
            category: 'Assets',
            title: 'بناء الهوية الرقمية (Digital Trust)',
            icon: '🏗️',
            problem: 'غياب الموقع الاحترافي أو ملف الشركة المحدث يفقدك المصداقية قبل بدء الاجتماع.',
            impact: 'العميل السعودي يبحث عنك أونلاين فوراً. عدم وجودك يعني "شركة وهمية" أو "غير محترفة" في نظره.',
            solution: 'بناء Landing Page تركز على النتائج (Case Studies) وليس الخدمات، وتحديث ملف الشركة ليشرح "كيف نساعدك" وليس "من نحن".',
            tools: 'Framer / Canva'
        });
    }

    if (!data.hasPitchDeck) {
        recommendations.push({
            type: 'critical',
            category: 'Assets',
            title: 'هندسة القصة البيعية (Sales Narrative)',
            icon: '📂',
            problem: 'تعتمد على الكلام الشفهي أو ملفات عامة، ولا تملك "قصة بيعية" (Pitch Deck) تحكي معاناة العميل.',
            impact: 'صعوبة إقناع صناع القرار بالعائد على الاستثمار، مما يطيل دورة البيع ويخفض معدل الإغلاق.',
            solution: 'صناعة Pitch Deck مكون من 10 شرائح يركز على: المشكلة، الحل، العائد المالي (ROI)، وقصص النجاح.',
            tools: 'Storybrand Framework'
        });
    }

    if (!data.hasPricingFile) {
        recommendations.push({
            type: 'warning',
            category: 'Assets',
            title: 'وضوح هيكل التسعير (Pricing Clarity)',
            icon: '💰',
            problem: 'لا يوجد ملف تسعير واضح يشرح الباقات والقيمة مقابل المال.',
            impact: 'تذبذب الأسعار، وارتباك العميل، وضياع وقت في المفاوضات غير المجدية.',
            solution: 'تصميم ملف "باقات استثمارية" (Investment Packages) يربط السعر بالمخرجات والنتائج المتوقعة.',
            tools: 'Pricing Psychology'
        });
    }

    // 3. The 100 Club (Daily Activity Benchmarks)
    const totalActivity = data.dailyCalls + data.dailyWhatsapp + data.dailyLinkedin + data.dailyEmails;
    if (totalActivity < 300) {
        recommendations.push({
            type: 'warning',
            category: 'Volume',
            title: 'رفع وتيرة الوصول (Volume Game)',
            icon: '🔥',
            problem: `معدل نشاطك اليومي (${totalActivity} محاولة) أقل من المعدل الطبيعي للنمو السريع (400+).`,
            impact: 'جفاف خط الأنابيب (Pipeline Starvation) وعدم وجود فرص كافية للإغلاق نهاية الشهر.',
            solution: 'تطبيق نظام "نادي الـ 100": 100 مكالمة، 100 واتساب، 100 تواصل لينكدان، 100 إيميل يومياً.',
            tools: 'Auto-Dialer / Automation'
        });
    }

    if (!data.hasSalesNavigator && data.icpIndustries.length > 0) {
        recommendations.push({
            type: 'info',
            category: 'Tech',
            title: 'تفعيل رادار العملاء (Sales Nav)',
            icon: '💎',
            problem: 'تحاول الوصول لعملاء B2B بدون أداة التنقيب الأساسية LinkedIn Sales Navigator.',
            impact: 'العمل بشكل عشوائي واستهلاك وقت الفريق في البحث عن "الإيميل الصحيح" بدلاً من البيع.',
            solution: 'الاستثمار فوراً في رخصة Sales Navigator واستخدام فلاتر "Headcount Growth" لمعرفة الشركات التي تملك ميزانية.',
            tools: 'LinkedIn Sales Navigator'
        });
    }

    if (!data.usesAIAgents) {
        recommendations.push({
            type: 'info',
            category: 'Tech',
            title: 'تبني الذكاء الاصطناعي (AI Force)',
            icon: '🤖',
            problem: 'تعتمد على الجهد اليدوي البحت في عصر الأتمتة.',
            impact: 'منافسوك يستخدمون AI Agents للوصول لـ 10 أضعاف عملائك بنفس الجهد.',
            solution: 'أتمتة الرسائل الأولية (First Touch) باستخدام AI Agents للتركيز بشرياً فقط على العملاء المهتمين.',
            tools: 'Bifrost / Instantly'
        });
    }

    // 4. Pipeline Health (Monthly Benchmarks)
    if (data.leadsPerMonth < 800) {
        recommendations.push({
            type: 'warning',
            category: 'Pipeline',
            title: 'محرك توليد الفرص (Lead Engine)',
            icon: '🛢️',
            problem: `عدد العملاء المحتملين الجدد شهرياً (${data.leadsPerMonth}) لا يكفي لتحقيق هدفك المالي. الحد الآمن هو 1000+.`,
            impact: 'ستضطر لقبول صفقات ضعيفة أو بأسعار منخفضة فقط "لتمشية العمل".',
            solution: 'بناء نظام Lead Gen يضمن دخول 1000 عميل محتمل لـ CRM شهرياً بحد أدنى.',
            tools: 'Apollo / Lead Sourcing'
        });
    }

    if (data.meetingsPerMonth < 20) {
        recommendations.push({
            type: 'critical',
            category: 'Pipeline',
            title: 'تأهيل الاجتماعات (Meeting Flow)',
            icon: '🤝',
            problem: `عدد الاجتماعات المؤهلة (${data.meetingsPerMonth}) منخفض جداً. المعدل الصحي هو 20-30 اجتماع شهرياً.`,
            impact: 'احتمالية عدم إغلاق أي صفقة تزيد عن 60% هذا الشهر.',
            solution: 'مراجعة "رسالة الدعوة" (Offer Script) لأنها السبب الرئيسي لرفض الاجتماع.',
            tools: 'Irresistible Offer'
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
