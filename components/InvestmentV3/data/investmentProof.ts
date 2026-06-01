export interface PartnerLogo {
  name: string;
  logoSrc: string;
  alt: string;
  category?: string;
  sizeHint?: string;
}

export interface OpportunitySource {
  name: string;
  logoSrc: string;
  type: 'govt' | 'semigov' | 'corporate' | 'private';
  typeName: string;
  note: string;
}

export interface UseCase {
  id: string;
  title: string;
  sector: string;
  outreach: number | null;
  positiveConversations: number | null;
  bookedMeetings: number | null;
  qualifiedMeetings: number | null;
  channels: string[];
  timeframe: string;
  result: string;
  approved: boolean;
}

// 1. Partners Logos Data (Demo values)
export const partnersLogos: PartnerLogo[] = [
  { name: "InduBridge", logoSrc: "/logos/partners/indubridge.png", alt: "InduBridge logo", category: "industrial", sizeHint: "max-w-[115px]" },
  { name: "Vorvix", logoSrc: "/logos/partners/vorvix.png", alt: "Vorvix logo", category: "technology", sizeHint: "max-w-[100px]" },
  { name: "AMASI Tech", logoSrc: "/logos/partners/amasi.png", alt: "AMASI Tech logo", category: "technology", sizeHint: "max-w-[115px]" },
  { name: "Stehr Corp", logoSrc: "/logos/partners/stehr.png", alt: "Stehr Corp logo", category: "corporate", sizeHint: "max-w-[90px]" },
  { name: "CIS Co.", logoSrc: "/logos/partners/cis.png", alt: "CIS Co. logo", category: "technology", sizeHint: "max-w-[110px]" },
  { name: "أرامكو السعودية", logoSrc: "/logos/partners/aramco.svg", alt: "Aramco logo", category: "energy", sizeHint: "max-w-[110px]" },
  { name: "سابك", logoSrc: "/logos/partners/sabic.svg", alt: "Sabic logo", category: "industrial", sizeHint: "max-w-[100px]" },
  { name: "الاتصالات السعودية STC", logoSrc: "/logos/partners/stc.svg", alt: "STC logo", category: "telecom", sizeHint: "max-w-[90px]" },
  { name: "البنك الأهلي السعودي SNB", logoSrc: "/logos/partners/snb.svg", alt: "SNB logo", category: "finance", sizeHint: "max-w-[115px]" },
  { name: "مصرف الراجحي", logoSrc: "/logos/partners/rajhi.svg", alt: "Al Rajhi logo", category: "finance", sizeHint: "max-w-[105px]" },
  { name: "شركة المراعي", logoSrc: "/logos/partners/almarai.svg", alt: "Almarai logo", category: "food", sizeHint: "max-w-[100px]" },
  { name: "الشركة السعودية للكهرباء", logoSrc: "/logos/partners/se.svg", alt: "Saudi Electricity logo", category: "utilities", sizeHint: "max-w-[110px]" },
  { name: "نادك", logoSrc: "/logos/partners/nadec.svg", alt: "Nadec logo", category: "food", sizeHint: "max-w-[95px]" },
  { name: "مجموعة العبيكان", logoSrc: "/logos/partners/obeikan.svg", alt: "Obeikan logo", category: "industrial", sizeHint: "max-w-[120px]" },
  { name: "شركة معادن", logoSrc: "/logos/partners/maaden.svg", alt: "Maaden logo", category: "mining", sizeHint: "max-w-[110px]" },
  { name: "مجموعة التميمي", logoSrc: "/logos/partners/tamimi.svg", alt: "Tamimi logo", category: "retail", sizeHint: "max-w-[105px]" },
  { name: "شركة الطيار", logoSrc: "/logos/partners/altayyar.svg", alt: "Altayyar logo", category: "travel", sizeHint: "max-w-[115px]" },
  { name: "شركة جرير", logoSrc: "/logos/partners/jarir.svg", alt: "Jarir logo", category: "retail", sizeHint: "max-w-[90px]" },
  { name: "مجموعة الشايع", logoSrc: "/logos/partners/shaya.svg", alt: "Shaya logo", category: "retail", sizeHint: "max-w-[100px]" },
  { name: "الخزف السعودي", logoSrc: "/logos/partners/ceramics.svg", alt: "Saudi Ceramics logo", category: "manufacturing", sizeHint: "max-w-[110px]" },
];

// 2. Opportunity Sources (Organized in Strategic Layers)
export const opportunitySources: OpportunitySource[] = [
  // Govt Layer
  { name: "وزارة الصحة السعودية", logoSrc: "/logos/sources/cropped/gov_logo_6.png", type: "govt", typeName: "جهة حكومية", note: "فرص توريد وخدمات طبية مساندة" },
  { name: "وزارة الشؤون البلدية والقروية والإسكان", logoSrc: "/logos/sources/cropped/gov_logo_3.png", type: "govt", typeName: "جهة حكومية", note: "فرص مشاريع تطوير بلدي وإسكان" },
  { name: "وزارة الدفاع", logoSrc: "/logos/sources/cropped/gov_logo_13.png", type: "govt", typeName: "جهة حكومية", note: "فرص عقود توريد وتجهيزات هندسية" },
  
  // Semi-Gov / Municipal Layer
  { name: "أمانة منطقة الرياض", logoSrc: "/logos/sources/riyadh.png", type: "semigov", typeName: "أمانة منطقة", note: "فرص تشغيل وصيانة وتطوير بلدي" },
  { name: "أمانة منطقة المدينة المنورة", logoSrc: "/logos/sources/madinah.png", type: "semigov", typeName: "أمانة منطقة", note: "فرص تطوير وتنمية بلدي متكاملة" },
  { name: "أمانة الأحساء", logoSrc: "/logos/sources/alahsa.png", type: "semigov", typeName: "أمانة منطقة", note: "مشاريع بنية تحتية وعقود توريد" },

  // Corporate Layer
  { name: "أرامكو السعودية", logoSrc: "/logos/sources/cropped/gov_logo_24.png", type: "corporate", typeName: "شركة طاقة كبرى مدرجة", note: "فرص عقود خدمات وسلاسل إمداد B2B" },
  { name: "البريد السعودي (سبل)", logoSrc: "/logos/sources/cropped/gov_logo_17.png", type: "corporate", typeName: "مؤسسة بريدية لوجستية", note: "فرص عقود تشغيل وخدمات لوجستية" },
  { name: "المؤسسة العامة للتأمينات الاجتماعية", logoSrc: "/logos/sources/cropped/gov_logo_21.png", type: "corporate", typeName: "مؤسسة عامة استثمارية", note: "فرص عقود أنظمة وتجهيزات تقنية" },

  // Private Sector Layer
  { name: "مجموعات مقاولات إنشائية خاصة", logoSrc: "/logos/sources/const.svg", type: "private", typeName: "قطاع مقاولات خاص", note: "فرص مقاولات فرعية وتوريد مواد" },
  { name: "سلسلة مستشفيات ومراكز طبية خاصة", logoSrc: "/logos/sources/med.svg", type: "private", typeName: "قطاع رعاية صحية خاص", note: "فرص توريد أجهزة وأنظمة تشغيل" },
  { name: "شركات تجارة جملة وتجزئة أغذية", logoSrc: "/logos/sources/retail-p.svg", type: "private", typeName: "مجموعة أغذية وتجزئة", note: "فرص لوجستيات وسلاسل إمداد" },
];

// 3. Operational Use Cases (Demo templates with approved logic)
export const useCases: UseCase[] = [
  {
    id: "usecase-erp",
    title: "حملة نمو قطاع أنظمة ERP للمقاولات",
    sector: "أنظمة ERP وتطبيقات سحابية",
    outreach: 12000,
    positiveConversations: 430,
    bookedMeetings: 48,
    qualifiedMeetings: 34,
    channels: ["WhatsApp", "LinkedIn", "Email"],
    timeframe: "90 يوم",
    result: "تحويل الاستهداف عالي الجودة إلى اجتماعات مؤهلة مباشرة مع مدراء المشاريع والمدراء الماليين في شركات التشييد والمقاولات المصنفة.",
    approved: true, // Approved for public display in visual verification
  },
  {
    id: "usecase-healthcare",
    title: "توسيع مبيعات الأجهزة الطبية B2B",
    sector: "مستلزمات طبية ورعاية صحية",
    outreach: 4800,
    positiveConversations: 195,
    bookedMeetings: 26,
    qualifiedMeetings: 19,
    channels: ["WhatsApp", "Calls", "Email"],
    timeframe: "60 يوم",
    result: "اختراق وتجاوز البيروقراطية الإدارية والوصول المباشر للمدراء التنفيذيين ورؤساء الأقسام بالمستشفيات الخاصة الكبرى.",
    approved: false, // Internal/Preview Mode only
  },
  {
    id: "usecase-industrial",
    title: "توريد معدات ومواد مصانع التعبئة والتغليف",
    sector: "توريد صناعي وخدمات لوجستية",
    outreach: 8500,
    positiveConversations: 310,
    bookedMeetings: 32,
    qualifiedMeetings: 22,
    channels: ["LinkedIn", "Calls", "Email"],
    timeframe: "90 يوم",
    result: "ربط المصنع المحلي بمدراء المشتريات وسلاسل الإمداد في مصانع الأغذية والمشروبات الكبرى بالمملكة.",
    approved: false, // Internal/Preview Mode only
  }
];
