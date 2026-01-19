import { Contact, ProviderProfile, ProviderICP, PipelineStage } from '../types';

export const DEMO_PROVIDER: Partial<ProviderProfile> = {
    company_name: "شركة العمران للمقاولات المتقدمة",
    company_name_en: "Al-Omran Advanced Contracting",
    description: "شركة رائدة في مجال المقاولات العامة والبنية التحتية، متخصصون في المشاريع الحكومية والتجارية الكبرى في المملكة.",
    company_size: "51-200",
    headquarters_country: "Saudi Arabia",
    headquarters_city: "Riyadh",
    website: "www.al-omran-demo.com",
    contact_name: "م. أحمد الغامدي",
    contact_role: "الرئيس التنفيذي",
    contact_email: "ceo@al-omran-demo.com",
    industries: [
        { id: '1', name: 'Construction', allocation: 100 }
    ],
    service_lines: [
        { id: '1', name: 'General Contracting', allocation: 60 },
        { id: '2', name: 'Infrastructure', allocation: 40 }
    ],
    is_saudi_verified: true,
    founded_year: 2005
};

export const DEMO_ICP: ProviderICP = {
    isSet: true,
    industries: ["Real Estate Development", "Government", "Civil Engineering"],
    titles: ["Project Manager", "Construction Manager", "Procurement Director", "Operations Manager"],
    budgetRange: { min: 500000, max: 10000000 }
};

export const DEMO_CONTACTS: Contact[] = [
    {
        id: "demo_1",
        name: "عبدالرحمن الزهراني",
        first_name: "عبدالرحمن",
        last_name: "الزهراني",
        title: "مدير مشاريع (Project Director)",
        company_name: "شركة البحر الأحمر الدولية (Red Sea Global)",
        email: "a.alzahrani@redseaglobal.com",
        phone: "+966551234567",
        country: "Saudi Arabia",
        city: "Riyadh",
        linkedin_url: "https://linkedin.com/in/demo1",
        stage: PipelineStage.MEETING_BOOKED,
        fitScore: 95,
        icpStatus: 'verified',
        source: 'Apollo + Enrichment',
        tags: ['Giga Project', 'High Value', 'Meeting Jan 25']
    },
    {
        id: "demo_2",
        name: "Eng. Faisal Al-Saud",
        first_name: "Faisal",
        last_name: "Al-Saud",
        title: "VP of Construction",
        company_name: "ROSHN | روشن",
        email: "f.alsaud@roshn.sa",
        phone: "+966547654321",
        country: "Saudi Arabia",
        city: "Riyadh",
        linkedin_url: "https://linkedin.com/in/demo2",
        stage: PipelineStage.IN_CONVERSATION,
        fitScore: 92,
        icpStatus: 'verified',
        source: 'Manual Scouting',
        tags: ['Residential', 'Riyadh North']
    },
    {
        id: "demo_3",
        name: "Sarah Al-Amri",
        first_name: "Sarah",
        last_name: "Al-Amri",
        title: "Head of Procurement",
        company_name: "Neom",
        email: "s.alamri@neom.com",
        phone: "+966561112222",
        country: "Saudi Arabia",
        city: "Tabuk",
        linkedin_url: "https://linkedin.com/in/demo3",
        stage: PipelineStage.READY_TO_OUTREACH,
        fitScore: 88,
        icpStatus: 'verified',
        source: 'Apollo Export',
        tags: ['The Line', 'Procurement']
    },
    {
        id: "demo_4",
        name: "Mohammed Al-Qahtani",
        first_name: "Mohammed",
        last_name: "Al-Qahtani",
        title: "Operations Manager",
        company_name: "El Seif Engineering",
        email: "m.qahtani@el-seif.com.sa",
        country: "Saudi Arabia",
        city: "Riyadh",
        stage: PipelineStage.ICP_VERIFIED,
        fitScore: 85,
        icpStatus: 'verified',
        source: 'Website Inbound'
    },
    {
        id: "demo_5",
        name: "Khaled Al-Harbi",
        first_name: "Khaled",
        title: "Senior Project Manager",
        company_name: "Saudi Aramco",
        email: "khaled.harbi@aramco.com",
        country: "Saudi Arabia",
        city: "Dhahran",
        stage: PipelineStage.HIGH_FIT,
        fitScore: 89,
        icpStatus: 'verified',
        source: 'PhantomBuster LinkedIn'
    },
    {
        id: "demo_6",
        name: "Yasser Al-Dossari",
        title: "Civil Engineer",
        company_name: "Al-Bawani",
        email: "yasser.d@albawani.net",
        country: "Saudi Arabia",
        city: "Jeddah",
        stage: PipelineStage.NEW,
        fitScore: 75,
        icpStatus: 'pending',
        source: 'Apollo'
    },
    {
        id: "demo_7",
        name: "Omar Al-Khuraiji",
        title: "Procurement Officer",
        company_name: "Diriyah Gate Development Authority",
        email: "o.khuraiji@dgda.gov.sa",
        country: "Saudi Arabia",
        city: "Riyadh",
        stage: PipelineStage.MEETING_BOOKED,
        fitScore: 94,
        icpStatus: 'verified',
        source: 'Referral'
    },
    {
        id: "demo_8",
        name: "Noura Al-Shehri",
        title: "Facilities Manager",
        company_name: "King Salman Park",
        email: "n.shehri@ksp.sa",
        country: "Saudi Arabia",
        city: "Riyadh",
        stage: PipelineStage.IN_CONVERSATION,
        fitScore: 91,
        icpStatus: 'verified',
        source: 'LinkedIn'
    }
];

export const DEMO_STATS = {
    totalLeads: 1420,
    qualifiedLeads: 315,
    meetingsBooked: 18,
    pipelineValue: 45000000
};
