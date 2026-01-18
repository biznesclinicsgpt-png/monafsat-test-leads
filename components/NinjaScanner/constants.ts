import { NinjaFormData } from './types';

export const INDUSTRIES = [
    'SaaS / Software',
    'Real Estate',
    'Fintech',
    'Consulting',
    'Agency / Marketing',
    'Healthcare',
    'Manufacturing',
    'Logistics',
    'Retail / E-commerce',
    'Education'
];

export const COUNTRIES = [
    'Saudi Arabia',
    'UAE',
    'Egypt',
    'Kuwait',
    'Qatar',
    'Oman',
    'Bahrain',
    'Jordan',
    'Other'
];

export const WHY_NOW_OPTIONS = [
    'New Product Launch',
    'Missed Quarterly Targets',
    'Expansion / New Market',
    'Investment Pressure',
    'Competitor Pressure',
    'Internal Restructuring'
];

export const LEAK_OPTIONS = [
    'Low Lead Quality',
    'No Response (Ghosting)',
    'Stalled Negotiations',
    'Price Objection',
    'Competitor Win'
];

export const TITLES_OPTIONS = [
    'CEO / Founder',
    'CTO / CIO',
    'Marketing Director',
    'Sales Director',
    'HR Manager',
    'Operations Manager'
];

export const COMPANY_SIZE_OPTIONS = [
    '1-10 Employees',
    '11-50 Employees',
    '51-200 Employees',
    '201-500 Employees',
    '500+ Employees'
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
