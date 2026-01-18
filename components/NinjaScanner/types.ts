export interface NinjaFormData {
    companyName: string;
    employees: number;
    industry: string;
    country: string;
    website: string; // New
    companyAge: number; // New: Years in market
    specializationFocus: number; // New: 1-10

    // ICP Details
    icpIndustries: string[];
    icpTitles: string[];
    icpCompanySize: string[];

    // Commercial
    avgDealSize: number;
    monthlyTarget: number;
    salesCycle: number;
    decisionMakerAccess: number; // 1-5
    budgetStatus: number; // 1-5

    // Readiness (Assets Checklist) - New
    hasCompanyProfile: boolean;
    hasPitchDeck: boolean; // Storytelling
    hasPricingFile: boolean; // ROI-based
    hasProfessionalWebsite: boolean;
    hasSocialPresence: boolean; // LinkedIn/Twitter

    // Tech Stack & Process - New
    hasSalesNavigator: boolean;
    recordsCalls: boolean; // Saudi Standard
    analyzesConversations: boolean; // WA/LI/Email
    usesAIAgents: boolean; // Automation
    hyperPersonalized: boolean; // Segmented Messaging

    // Pipeline (Monthly)
    leadsPerMonth: number; // Benchmark: 1000
    meetingsPerMonth: number; // Benchmark: 20-30
    proposalsPerMonth: number; // Benchmark: 10-15
    closedWonPerMonth: number; // Benchmark: 1+
    pipelineValue: number;
    biggestLeak: string;
    whyNow: string;

    // Daily Activity Benchmarks (The 100 Club) - New
    dailyCalls: number; // Target 100
    dailyWhatsapp: number; // Target 100
    dailyLinkedin: number; // Target 100 (Connect + Msg)
    dailyEmails: number; // Target 100

    // Team
    sdrs: number;
    aes: number;
}

