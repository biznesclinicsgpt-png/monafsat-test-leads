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
    website: '',
    companyAge: 0,
    specializationFocus: 5,

    // ICP
    icpIndustries: [],
    icpTitles: [],
    icpCompanySize: [],

    // Commercial
    avgDealSize: 0,
    monthlyTarget: 0,
    salesCycle: 0,
    decisionMakerAccess: 1,
    budgetStatus: 1,

    // Readiness
    hasCompanyProfile: false,
    hasPitchDeck: false,
    hasPricingFile: false,
    hasProfessionalWebsite: false,
    hasSocialPresence: false,

    // Tech
    hasSalesNavigator: false,
    recordsCalls: false,
    analyzesConversations: false,
    usesAIAgents: false,
    hyperPersonalized: false,

    // Pipeline
    leadsPerMonth: 0,
    meetingsPerMonth: 0,
    proposalsPerMonth: 0,
    closedWonPerMonth: 0,
    pipelineValue: 0,
    biggestLeak: '',
    whyNow: '',

    // Daily Activity
    dailyCalls: 0,
    dailyWhatsapp: 0,
    dailyLinkedin: 0,
    dailyEmails: 0,

    // Team
    sdrs: 0,
    aes: 0
};

