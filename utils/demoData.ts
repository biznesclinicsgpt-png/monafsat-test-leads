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
        tags: ['Giga Project', 'High Value', 'Meeting Jan 25'],

        // Deep Intelligence
        annual_revenue: "$1B+",
        employee_count: "1001-5000",
        industry_ar: "التطوير العقاري / المشاريع الكبرى",
        industry_2: "Real Estate Development",
        industry_22: "Hospitality Projects",
        subcategory: "Giga Projects",
        sub_subcategory: "Regenerative Tourism",
        manufacture: "No",
        company_official_name: "Red Sea Global (RSG)",
        company_description: "Red Sea Global is a closed joint-stock company wholly owned by the Public Investment Fund (PIF) of Saudi Arabia. It is a vertical developer, spearheading the development of The Red Sea and Amaala, two world-leading regenerative tourism destinations.",
        company_linkedin_url: "https://linkedin.com/company/red-sea-global",
        company_location: "Riyadh, Saudi Arabia",
        industry_tier: "Tier 1 (Strategic)",
        final_icp_tier: "Tier A+",

        // Extended Personal Info
        title_tier: "C-Level / Director",
        function_2: "Project Management",
        phone_2: "+966112223333",
        address1: "King Fahd Road, Olaya",
        date_of_birth: "1980-05-15",
        timezone: "Asia/Riyadh",
        website: "www.redseaglobal.com",

        // AI Strategy
        arabic_summary: "عبدالرحمن هو مدير مشاريع مخضرم في البحر الأحمر الدولية، يقود تطوير البنية التحتية للمرحلة 2. يركز حالياً على حلول الاستدامة وتقنيات البناء الحديثة. نشط جداً على لينكد إن ويتفاعل مع محتوى الطاقة المتجددة.",
        initial_icebreaker: "استاذ عبدالرحمن، تابعت باهتمام تحديثاتكم الأخيرة حول مشروع 'أمالا' والتقدم في البنية التحتية المستدامة. جهد جبار فعلاً!",
        prospect_about: "Experienced Project Director with a demonstrated history of working in the real estate industry. Strong program and project management professional skilled in Negotiation, Construction, and Engineering.",
        about: "Passionate about building sustainable futures. Leading teams to deliver world-class destinations.",
        title_description: "Responsible for overseeing major infrastructure projects and ensuring sustainability compliance.",
        linkedin_sales_navigator: "Active (Posted 2 days ago)",
        premium: "yes",
        open_profile: "yes",
        b2b_status: "High Potential",
        b2b_summary: "Strong match for our enterprise construction tech solutions due to their sustainability focus.",

        // Campaigns
        welcome_message: "Hi Abdulrahman, impressive work at Red Sea Global.",
        follow_up_1: "checking in on my previous note regarding sustainability tech.",
        follow_up_2: "Thoughts on this case study?",
        follow_up_3: "One last ping before I close this file.",
        subject_f1: "Sustainability at RSG",
        subject_f2: "RSG x Tech",
        subject_f3: "Quick question",
        "3rd_scene": "Sent case study video on Jan 20th",

        // System Data
        record_id: "REC-882190",
        profile_unique_id: "PID-992211",
        li_messages: "Thread started Jan 15. Replied Jan 16.",
        call_recordings: "https://calls.manafeth.com/rec_123.mp3",
        created_at: "2024-01-01T10:00:00Z"
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
        tags: ['Residential', 'Riyadh North'],

        // Deep Intelligence
        annual_revenue: "$500M - $1B",
        employee_count: "501-1000",
        industry_ar: "التطوير العقاري / الإسكان",
        industry_2: "Real Estate",
        industry_22: "Residential",
        subcategory: "Residential Communities",
        sub_subcategory: "Integrated Living",
        manufacture: "No",
        company_official_name: "ROSHN Real Estate Company",
        company_description: "ROSHN is a national real estate developer, powered by the Public Investment Fund (PIF). We are committed to delivering high-quality communities to the Saudi people.",
        company_linkedin_url: "https://linkedin.com/company/roshn",
        company_location: "Riyadh, Saudi Arabia",
        industry_tier: "Tier 1",
        final_icp_tier: "Tier A",

        // Extended Personal Info
        title_tier: "VP / Head",
        function_2: "Construction Management",
        phone_2: "+966500000000",
        address1: "Riyadh Front",
        date_of_birth: "1985-11-20",
        grade: "A",

        // AI Strategy
        arabic_summary: "المهندس فيصل يشغل منصب نائب الرئيس للإنشاءات، وهو المسؤول عن استراتيجية التوسع في شمال الرياض. يبحث عن مقاولين ذوي كفاءة عالية في التشطيبات السريعة وتقنيات البناء مسبق الصنع.",
        initial_icebreaker: "م. فيصل، مبروك الاعلان عن حي 'سدرة' الجديد! التصاميم المعمارية السلمانية تعكس هوية رائعة.",
        prospect_about: "VP of Construction at ROSHN. Leading the technical delivery of integrated communities across the Kingdom.",
        about: "Dedicated to transforming the urban landscape of Saudi Arabia.",
        title_description: "Oversees construction methodology and contractor selection for Sedra project.",
        linkedin_sales_navigator: "Active (Posted 5 days ago)",
        premium: "yes",
        open_profile: "yes",
        b2b_status: "Qualified",

        // Campaigns
        welcome_message: "Hello Eng. Faisal, regarding Sedra phase 3.",
        follow_up_1: "Following up on the pre-cast concrete proposal.",
        subject_f1: "Sedra Construction Tech",

        // System Data
        record_id: "REC-112233",
        profile_unique_id: "PID-445566",
        created_at: "2024-01-05T09:00:00Z"
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
        tags: ['The Line', 'Procurement'],

        // Deep Intelligence
        annual_revenue: "$10B+",
        employee_count: "10,000+",
        industry_ar: "التطوير الحضري / المدن الذكية",
        industry_2: "Urban Development",
        subcategory: "Smart Cities",
        company_description: "NEOM is a vision of what a new future might look like. It is an attempt to do something that has never been done before and it is coming at a time when the world needs fresh thinking and new solutions.",
        company_linkedin_url: "https://linkedin.com/company/neom",
        company_location: "Tabuk, Saudi Arabia",

        // AI Strategy
        arabic_summary: "سارة تقود فريق المشتريات لمشروع 'ذا لاين'. تركيزها الحالي على سلاسل الإمداد اللوجستية وتأهيل الموردين المحليين. تفضل التواصل الرسمي عبر الإيميل.",
        initial_icebreaker: "أستاذة سارة، قرأت تقريركم الأخير عن 'توطين الصناعات في نيوم'. رؤية ملهمة لقطاع المشتريات.",
        prospect_about: "Strategic Procurement Leader with focus on mega-projects supply chain optimization.",
        linkedin_sales_navigator: "Ideally Active",
        premium: "no"
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
        source: 'Website Inbound',

        // Deep Intelligence
        annual_revenue: "$1B - $10B",
        employee_count: "10,000+",
        industry_ar: "المقولات العامة / الهندسة",
        industry_2: "Construction",
        subcategory: "Engineering Services",
        company_description: "El Seif Engineering Contracting is one of the leading construction companies in Saudi Arabia and the Middle East.",
        company_location: "Riyadh, Saudi Arabia",

        // AI Strategy
        arabic_summary: "محمد القحطاني، مدير العمليات في السيف. يركز على الكفاءة التشغيلية وتقليل الهدر في المواقع. شخص عملي جداً ويهتم بالأرقام والنتائج.",
        initial_icebreaker: "أخ محمد، سمعت عن فوزكم بعقد البرج الجديد. تجربة السيف في الأبراج الشاهقة مرجع للسوق.",
        prospect_about: "Operations Manager ensuring project delivery excellence and safety compliance.",
        linkedin_sales_navigator: "Inactive",
        premium: "no"
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
        source: 'PhantomBuster LinkedIn',

        // Deep Intelligence
        annual_revenue: "$100B+",
        employee_count: "50,000+",
        industry_ar: "الطاقة / النفط والغاز",
        industry_2: "Oil & Gas",
        subcategory: "Industrial Construction",
        company_description: "Saudi Aramco is a world leader in integrated energy and chemicals.",
        company_location: "Dhahran, Saudi Arabia",

        // AI Strategy
        arabic_summary: "خالد مدير مشاريع أول في أرامكو، قسم المشاريع السكنية. يبحث عن مقاولين معتمدين (IKTVA) لتنفيذ مجمعات سكنية في المنطقة الشرقية.",
        initial_icebreaker: "م. خالد، برنامج 'اكتفاء' أصبح معياراً للجودة. هل هناك مشاريع جديدة للمقاولين المؤهلين قريباً؟",
        prospect_about: "PMP Certified Senior Project Manager with 15 years experience in Aramco.",
        linkedin_sales_navigator: "Active",
        premium: "yes"
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
        source: 'Apollo',

        // Deep Intelligence
        annual_revenue: "$1B+",
        employee_count: "5000+",
        industry_ar: "المقاولات",
        industry_2: "Construction",
        subcategory: "Civil Works",
        company_description: "Al Bawani is a diversified group of Saudi companies. The group has established itself as a prime contractor.",
        company_location: "Riyadh, Saudi Arabia",

        // AI Strategy
        arabic_summary: "ياسر مهندس مدني ميداني. ليس صانع قرار نهائي ولكنه مؤثر في التوصية الفنية. يمكن التواصل معه لفهم الاحتياجات الفنية للمشروع.",
        initial_icebreaker: "بشمهندس ياسر، الله يعطيك العافية. كيف تشوف تحديات الصبة الخرسانية في مشاريع جدة الحالية؟",
        prospect_about: "Civil Engineer at Al Bawani. King Saud University Graduate.",
        linkedin_sales_navigator: "Active",
        premium: "no"
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
        source: 'Referral',

        // Deep Intelligence
        annual_revenue: "$5B+",
        employee_count: "1000+",
        industry_ar: "التطوير التراثي / السياحة",
        industry_2: "Government",
        subcategory: "Heritage Development",
        company_description: "DGDA is responsible for the preservation of the historic At-Turaif UNESCO World Heritage Site and the development of Diriyah.",
        company_location: "Diriyah, Saudi Arabia",

        // AI Strategy
        arabic_summary: "عمر مسؤول مشتريات في بوابة الدرعية. يركز جداً على 'الطابع النجدي' في المواد والموردين. الدقة في المواصفات التراثية هو مفتاح التعامل معه.",
        initial_icebreaker: "أخ عمر، هوية الدرعية المعمارية فخر لنا جميعاً. اختياركم للمواد يعكس ذوق رفيع.",
        prospect_about: "Procurement Specialist passionate about Saudi Heritage and Culture.",
        linkedin_sales_navigator: "Active",
        premium: "no"
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
        source: 'LinkedIn',

        // Deep Intelligence
        annual_revenue: "$N/A",
        employee_count: "500+",
        industry_ar: "التطوير الحضري / الحدائق",
        industry_2: "Government",
        subcategory: "Public Spaces",
        company_description: "King Salman Park is being developed as the largest urban park in the world.",
        company_location: "Riyadh, Saudi Arabia",

        // AI Strategy
        arabic_summary: "نورة مديرة مرافق في حديقة الملك سلمان. تبحث عن حلول الصيانة الذكية والتشغيل المستدام للمرافق العامة الضخمة.",
        initial_icebreaker: "أستاذة نورة، مشروع الحديقة هو رئة الرياض القادمة! مهتم جداً بمعرفة خططكم للصيانة الذكية.",
        prospect_about: "Facilities Management expert specialized in large-scale public venues.",
        linkedin_sales_navigator: "Active",
        premium: "yes"
    }
];

export const DEMO_STATS = {
    totalLeads: 1420,
    qualifiedLeads: 315,
    meetingsBooked: 18,
    pipelineValue: 45000000
};
