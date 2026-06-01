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

export const partnersLogos: PartnerLogo[] = [
  { name: "Logix", logoSrc: "/logos/partners/logix.png", alt: "Logix logo", category: "technology", sizeHint: "wide" },
  { name: "أرامكو السعودية", logoSrc: "/logos/partners/aramco.svg", alt: "Aramco logo", category: "energy", sizeHint: "wide" },
  { name: "Flex", logoSrc: "/logos/partners/flex.png", alt: "Flex logo", category: "technology", sizeHint: "wide" },
  { name: "سابك", logoSrc: "/logos/partners/sabic.svg", alt: "Sabic logo", category: "industrial", sizeHint: "wide" },
  { name: "Dimensions Solutions", logoSrc: "/logos/partners/dimensions.png", alt: "Dimensions Solutions logo", category: "corporate", sizeHint: "square" },
  { name: "الاتصالات السعودية STC", logoSrc: "/logos/partners/stc.svg", alt: "STC logo", category: "telecom", sizeHint: "compact" },
  { name: "Nixpend", logoSrc: "/logos/partners/nixpend.png", alt: "Nixpend logo", category: "technology", sizeHint: "wide" },
  { name: "البنك الأهلي السعودي SNB", logoSrc: "/logos/partners/snb.svg", alt: "SNB logo", category: "finance", sizeHint: "wide" },
  { name: "Tamara", logoSrc: "/logos/partners/tamara.png", alt: "Tamara logo", category: "finance", sizeHint: "square" },
  { name: "مصرف الراجحي", logoSrc: "/logos/partners/rajhi.svg", alt: "Al Rajhi logo", category: "finance", sizeHint: "wide" },
  { name: "Qtech", logoSrc: "/logos/partners/qtech.png", alt: "Qtech logo", category: "technology", sizeHint: "square" },
  { name: "شركة المراعي", logoSrc: "/logos/partners/almarai.svg", alt: "Almarai logo", category: "food", sizeHint: "wide" },
  { name: "Rqmii", logoSrc: "/logos/partners/rqmii.png", alt: "Rqmii logo", category: "technology", sizeHint: "square" },
  { name: "الشركة السعودية للكهرباء", logoSrc: "/logos/partners/se.svg", alt: "Saudi Electricity logo", category: "utilities", sizeHint: "wide" },
  { name: "Almentor", logoSrc: "/logos/partners/almentor.png", alt: "Almentor logo", category: "education", sizeHint: "wide" },
  { name: "نادك", logoSrc: "/logos/partners/nadec.svg", alt: "Nadec logo", category: "food", sizeHint: "wide" },
  { name: "OSolutions", logoSrc: "/logos/partners/osolutions.png", alt: "OSolutions logo", category: "technology", sizeHint: "wide" },
  { name: "مجموعة العبيكان", logoSrc: "/logos/partners/obeikan.svg", alt: "Obeikan logo", category: "industrial", sizeHint: "wide" },
  { name: "شركة جرير", logoSrc: "/logos/partners/jarir.svg", alt: "Jarir logo", category: "retail", sizeHint: "wide" },
  { name: "الخزف السعودي", logoSrc: "/logos/partners/ceramics.svg", alt: "Saudi Ceramics logo", category: "manufacturing", sizeHint: "wide" },
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
