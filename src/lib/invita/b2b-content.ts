export const B2B_PARTNER_TYPES = [
  { en: "Clinics", ar: "العيادات" },
  { en: "Medical Centers", ar: "المراكز الطبية" },
  { en: "Hospitals", ar: "المستشفيات" },
  { en: "Wellness Centers", ar: "مراكز العافية" },
  { en: "Dermatology Clinics", ar: "عيادات الجلدية" },
  { en: "Plastic Surgery Clinics", ar: "عيادات التجميل" },
  { en: "Luxury Concierge Medicine", ar: "الطب الخاص الفاخر" },
] as const;

export const B2B_WHY_INVITA = [
  {
    en: "Officially registered products",
    ar: "منتجات مسجّلة رسمياً",
  },
  {
    en: "International quality standards",
    ar: "معايير جودة دولية",
  },
  {
    en: "Medical training & staff onboarding",
    ar: "تدريب طبي وتأهيل الكوادر",
  },
  {
    en: "Clinical protocols & documentation",
    ar: "بروتوكولات سريرية ووثائق",
  },
  {
    en: "Marketing & premium branding support",
    ar: "دعم تسويقي وعلامة تجارية فاخرة",
  },
  {
    en: "Reliable nationwide supply chain",
    ar: "سلسلة توريد موثوقة على مستوى العراق",
  },
  {
    en: "Clinical education & medical updates",
    ar: "تعليم سريري وتحديثات طبية",
  },
  {
    en: "Ongoing partner support",
    ar: "دعم مستمر للشركاء",
  },
  {
    en: "Regulatory compliance guidance",
    ar: "إرشاد الامتثال التنظيمي",
  },
  {
    en: "Scientific & educational materials",
    ar: "مواد علمية وتعليمية",
  },
] as const;

export const PROFESSIONAL_TRAINING_ITEMS = [
  {
    titleEn: "Clinical education",
    titleAr: "التعليم السريري",
    bodyEn: "Evidence-based IV therapy curriculum for physicians and nursing staff.",
    bodyAr: "منهج علاج وريدي قائم على الأدلة للأطباء والتمريض.",
  },
  {
    titleEn: "Administration protocols",
    titleAr: "بروتوكولات الإعطاء",
    bodyEn: "Standardised Liquivida® administration procedures for partner facilities.",
    bodyAr: "إجراءات إعطاء Liquivida® موحّدة لمرافق الشركاء.",
  },
  {
    titleEn: "Safety guidelines",
    titleAr: "إرشادات السلامة",
    bodyEn: "Sterile preparation, contraindication screening, and adverse event protocols.",
    bodyAr: "التحضير المعقم، فحص موانع الاستعمال، وبروتوكولات الأحداث الجانبية.",
  },
  {
    titleEn: "Medical updates",
    titleAr: "التحديثات الطبية",
    bodyEn: "Ongoing briefings on new formulations, research, and regulatory changes.",
    bodyAr: "إحاطات مستمرة حول الصيغ الجديدة والأبحاث والتغييرات التنظيمية.",
  },
  {
    titleEn: "Professional workshops",
    titleAr: "ورش عمل مهنية",
    bodyEn: "Hands-on training sessions for clinical teams across Iraq.",
    bodyAr: "جلسات تدريب عملية للفرق السريرية في العراق.",
  },
  {
    titleEn: "Staff onboarding",
    titleAr: "تأهيل الكوادر",
    bodyEn: "Structured onboarding for new partner clinics and medical centres.",
    bodyAr: "تأهيل منظّم للعيادات والمراكز الطبية الشركاء الجدد.",
  },
] as const;

export const PARTNER_APPLICATION_INTENTS = [
  {
    id: "partnership",
    source: "b2b-partnership",
    labelEn: "Request partnership",
    labelAr: "طلب شراكة",
    hintEn: "New clinic or medical centre joining the Invita network.",
    hintAr: "عيادة أو مركز طبي جديد ينضم لشبكة Invita.",
  },
  {
    id: "meeting",
    source: "b2b-meeting",
    labelEn: "Schedule a business meeting",
    labelAr: "جدولة اجتماع عمل",
    hintEn: "Meet our partnerships team in person or online.",
    hintAr: "لقاء فريق الشراكات حضورياً أو عبر الإنترنت.",
  },
  {
    id: "provider",
    source: "b2b-provider",
    labelEn: "Become a provider",
    labelAr: "كن مزوداً",
    hintEn: "List your facility on our healthcare network.",
    hintAr: "إدراج منشأتك في شبكة الرعاية الصحية.",
  },
  {
    id: "wholesale",
    source: "b2b-wholesale",
    labelEn: "Wholesale enquiry",
    labelAr: "استفسار جملة",
    hintEn: "Nationwide supply and account management.",
    hintAr: "توريد على مستوى العراق وإدارة حسابات.",
  },
  {
    id: "support",
    source: "b2b-support",
    labelEn: "Medical / clinical support",
    labelAr: "دعم طبي / سريري",
    hintEn: "Protocols, orders, or training for existing partners.",
    hintAr: "بروتوكولات، طلبات، أو تدريب للشركاء الحاليين.",
  },
] as const;

export type PartnerApplicationIntentId = (typeof PARTNER_APPLICATION_INTENTS)[number]["id"];
