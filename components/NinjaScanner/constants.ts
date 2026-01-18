import { NinjaFormData } from './types';

export const INDUSTRIES = [
    'البرمجيات / SaaS',
    'العقارات',
    'التقنية المالية (Fintech)',
    'الاستشارات',
    'التسويق / الوكالات',
    'الرعاية الصحية',
    'التصنيع',
    'الخدمات اللوجستية',
    'التجزئة / التجارة الإلكترونية',
    'التعليم والتدريب'
];

export const COUNTRIES = [
    'المملكة العربية السعودية',
    'الإمارات العربية المتحدة',
    'مصر',
    'الكويت',
    'قطر',
    'سلطنة عمان',
    'البحرين',
    'الأردن',
    'أخرى'
];

export const WHY_NOW_OPTIONS = [
    'إطلاق منتج جديد',
    'عدم تحقيق المستهدفات ربع السنوية',
    'توسع في سوق جديد',
    'ضغط من المستثمرين',
    'منافسة شرسة',
    'إعادة هيكلة داخلية'
];

export const LEAK_OPTIONS = [
    'جودة Leads منخفضة',
    'عدم الرد (Ghosting)',
    'مفاوضات طويلة ومتعثرة',
    'اعتراضات على السعر',
    'الخسارة أمام المنافسين'
];

export const TITLES_OPTIONS = [
    'CEO / المؤسس',
    'CTO / مدير التقنية',
    'مدير التسويق',
    'مدير المبيعات',
    'مدير الموارد البشرية',
    'مدير التشغيل'
];

export const COMPANY_SIZE_OPTIONS = [
    '1-10 موظفين',
    '11-50 موظف',
    '51-200 موظف',
    '201-500 موظف',
    '500+ موظف'
];

export const INITIAL_STATE: NinjaFormData = {
    companyName: '',
    employees: 0,
    industry: '',
    country: '',
    competitor: '',
    icpIndustries: [],
    icpTitles: [],
    icpCompanySize: [],
    avgDealSize: 0,
    monthlyTarget: 0,
    salesCycle: 0,
    decisionMakerAccess: 1,
    budgetStatus: 1,
    readinessLevel: 1,
    whyNow: '',
    leadsPerMonth: 0,
    meetingsPerMonth: 0,
    proposalsPerMonth: 0,
    closedWonPerMonth: 0,
    pipelineValue: 0,
    biggestLeak: '',
    emailVolume: 0,
    emailOpenRate: 0,
    emailTools: 1,
    emailOpportunities: 0,
    linkedinConnects: 0,
    linkedinContent: 1,
    linkedinNav: false,
    linkedinOpportunities: 0,
    callsVolume: 0,
    callsConnectRate: 0,
    callsScript: 1,
    callsOpportunities: 0,
    whatsappVolume: 0,
    whatsappType: 1,
    whatsappOpportunities: 0,
    sdrs: 0,
    aes: 0,
    teamExperience: 1,
    followUp: 1,
    crm: 1,
    crmUsage: 1,
    dataQuality: 1,
    icpClarity: 1,
    usePitchDeck: false,
    useProposalDeck: false,
    clarificationMeetings: 0
};
