export interface NinjaFormData {
    companyName: string;
    employees: number;
    industry: string;
    country: string;
    competitor: string;

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

    // Readiness
    readinessLevel: number; // 1-5
    whyNow: string;

    // Pipeline
    leadsPerMonth: number;
    meetingsPerMonth: number;
    proposalsPerMonth: number;
    closedWonPerMonth: number;
    pipelineValue: number;
    biggestLeak: string;

    // Outbound - Email
    emailVolume: number;
    emailOpenRate: number;
    emailTools: number; // 1-5
    emailOpportunities: number;

    // Outbound - LinkedIn
    linkedinConnects: number;
    linkedinContent: number; // 1-5
    linkedinNav: boolean;
    linkedinOpportunities: number;

    // Outbound - Phone
    callsVolume: number;
    callsConnectRate: number;
    callsScript: number; // 1-5
    callsOpportunities: number;

    // Outbound - WhatsApp
    whatsappVolume: number;
    whatsappType: number; // 1-5
    whatsappOpportunities: number;

    // Team
    sdrs: number;
    aes: number;
    teamExperience: number; // 1-5
    followUp: number; // 1-5

    // Systems
    crm: number; // 1-5
    crmUsage: number; // 1-5
    dataQuality: number; // 1-5

    // Discovery
    icpClarity: number; // 1-5
    usePitchDeck: boolean;
    useProposalDeck: boolean;
    clarificationMeetings: number;
}
