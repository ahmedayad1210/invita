/** Editorial articles — sourced from Invita science assets. */

export type JournalArticle = {
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  publishedAt: string;
  readMinutes: number;
  dripSlug?: string;
  pdfPath?: string;
  tags: string[];
  body: string[];
  bodyAr: string[];
};

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "nad-plus-cellular-energy",
    title: "NAD+ and cellular energy — what the science says",
    titleAr: "NAD+ والطاقة الخلوية — ماذا يقول العلم",
    excerpt: "Why NAD+ IV therapy is central to longevity protocols and how Invita delivers it safely.",
    excerptAr: "لماذا يُعد NAD+ الوريدي محور بروتوكولات إطالة العمر وكيف تقدمه Invita بأمان.",
    publishedAt: "2026-06-15",
    readMinutes: 6,
    dripSlug: "nad-plus",
    pdfPath: "/resources/nad-plus-scientific-review.pdf",
    tags: ["NAD+", "Longevity", "Science"],
    body: [
      "Nicotinamide adenine dinucleotide (NAD+) is essential for mitochondrial function and cellular repair.",
      "Oral NAD+ precursors face absorption limits — IV delivery bypasses the gut for immediate bioavailability.",
      "Invita's NAD+ protocol follows Liquivida® clinical guidelines with slow infusion over ~90 minutes.",
      "Multi-week programmes are titrated by licensed clinicians for comfort and efficacy.",
    ],
    bodyAr: [
      "NAD+ ضروري لعمل الميتochondria والإصلاح الخلوي.",
      "المكملات الفموية تواجه حدود امتصاص — التسليم الوريدي يتجاوز الأمعاء.",
      "بروتوكول Invita يتبع إرشادات Liquivida® السريرية.",
    ],
  },
  {
    slug: "iv-immunity-iraq",
    title: "Immune IV support during flu season in Iraq",
    titleAr: "دعم المناعة الوريدي في موسم الإنfluenza",
    excerpt: "High-dose vitamin C protocols and when clinicians recommend Immune Boost.",
    excerptAr: "بروتوكولات فيتامين C عالية الجرعة ومتى يُوصي الأطباء Immune Boost.",
    publishedAt: "2026-06-01",
    readMinutes: 5,
    dripSlug: "immune-boost",
    pdfPath: "/resources/invita-safety-101.pdf",
    tags: ["Immunity", "Vitamin C", "Wellness"],
    body: [
      "Immune Boost delivers concentrated vitamin C and supporting nutrients in a ~30-minute session.",
      "Ideal at the first sign of illness or prophylactically during winter months.",
      "Always administered under medical supervision at Invita partner clinics.",
    ],
    bodyAr: [
      "Immune Boost يقدّم فيتامين C مركزاً في جلسة ~30 دقيقة.",
      "مثالي عند أول signs مرض أو وقائياً في الشتاء.",
    ],
  },
  {
    slug: "skin-radiance-guide",
    title: "Skin radiance from within — IV beauty protocols",
    titleAr: "إشراق البشرة من الداخل — بروتوكولات الجمال الوريدي",
    excerpt: "How Skin Radiance and Hair, Skin & Nails support complexion before events.",
    excerptAr: "كيف يدعم Skin Radiance البشرة قبل المناسبات.",
    publishedAt: "2026-05-20",
    readMinutes: 4,
    dripSlug: "skin-radiance",
    tags: ["Beauty", "Events"],
    body: [
      "IV beauty protocols target biotin, glutathione precursors, and hydration at the cellular level.",
      "Popular before weddings, photoshoots, and red-carpet events across Baghdad partner clinics.",
    ],
    bodyAr: [
      "بروتوكولات الجمال الوريدي تستهدف البيوتين والترطيب على المستوى الخلوي.",
    ],
  },
  {
    slug: "nutrigenomics-and-iv",
    title: "Nutrigenomics meets IV therapy",
    titleAr: "التغذية الجينية والعلاج الوريدي",
    excerpt: "Why DNA testing and IV protocols work together for personalised wellness.",
    excerptAr: "لماذا يعمل فحص DNA والعلاج الوريدي معاً.",
    publishedAt: "2026-05-10",
    readMinutes: 7,
    dripSlug: "myers-cocktail",
    pdfPath: "/resources/invita-patient-education.pdf",
    tags: ["DNA", "Nutrigenomics"],
    body: [
      "Your genes influence how you metabolise vitamins, minerals, and medications.",
      "Invita DNA Lab panels complement IV therapy — reports guide which drips and oral supplements fit your biology.",
      "Book a consultation to combine nutrigenomics with a baseline Myers Cocktail.",
    ],
    bodyAr: [
      "جيناتك تؤثر على metabolize الفيتامينات والمعادن.",
      "لوحات Invita DNA Lab تكمل العلاج الوريدي.",
    ],
  },
  {
    slug: "liquivida-partner-iraq",
    title: "Why Liquivida® chose Invita for Iraq",
    titleAr: "لماذا اختارت Liquivida® Invita للعراق",
    excerpt: "GMP-certified formulas, clinical training, and nationwide clinic network.",
    excerptAr: "تركيبات GMP، تدريب سريري، وشبكة عيادات.",
    publishedAt: "2026-04-28",
    readMinutes: 5,
    pdfPath: "/resources/invita-catalogue.pdf",
    tags: ["Liquivida", "Partners"],
    body: [
      "Invita is the authorised Liquivida® distributor in Iraq with ISO-tested manufacturing partners.",
      "Every partner clinic completes Safety 101 training before offering Invita protocols.",
    ],
    bodyAr: [
      "Invita الموزّع المعتمد لـ Liquivida® في العراق.",
    ],
  },
  {
    slug: "sport-recovery-iv",
    title: "IV therapy for athletic recovery",
    titleAr: "العلاج الوريدي للتعافي الرياضي",
    excerpt: "Sport Endurance & Recovery — rehydration and nutrient replenishment after training.",
    excerptAr: "Sport Endurance & Recovery — إعادة الترطيب بعد التمرين.",
    publishedAt: "2026-04-15",
    readMinutes: 4,
    dripSlug: "sport-endurance-recovery",
    tags: ["Sport", "Recovery"],
    body: [
      "Athletes lose fluids and electrolytes rapidly — IV rehydration restores balance faster than oral intake alone.",
      "Sport Endurance & Recovery is used by partner clinics serving national teams and fitness communities.",
    ],
    bodyAr: [
      "الرياضيون يفقدون السوائل بسرعة — الترطيب الوريدي أسرع.",
    ],
  },
];

export function getArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}
