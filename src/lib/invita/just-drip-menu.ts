/** Invita JUST DRIP menu — sourced from Invita Drip Menu PDF (official catalogue). */

export type JustDripItem = {
  slug: string;
  bookSlug?: string;
  nameEn: string;
  nameAr: string;
  descriptionAr: string;
  descriptionEn: string;
  ingredients: string;
  tagsAr: string[];
  tagsEn: string[];
  accent: string;
  icon: string;
};

export const JUST_DRIP_TAGLINE_AR = "فيتامينات وريدية... طريقك الأقصر لصحة أفضل";
export const JUST_DRIP_TAGLINE_EN = "IV vitamins — your shortest path to better health";

export const JUST_DRIP_PRICE_AR = "تبدأ من 150,000 دينار للجلسة";
export const JUST_DRIP_PRICE_EN = "From 150,000 IQD per session";
export const JUST_DRIP_PRICE_NOTE_AR =
  "الأسعار تختلف حسب المركز والخدمات المضافة — بعض العيادات تقدم عروضاً خاصة";
export const JUST_DRIP_PRICE_NOTE_EN =
  "Prices vary by centre and add-on services — select clinics offer special packages";

export const JUST_DRIP_CELEBRITIES = [
  { name: "Mona Kattan", handle: "@monakattan" },
  { name: "Rita Kahawaty", handle: "@ritakahawaty" },
  { name: "Taim AlFalasi", handle: "@taimalfalasi" },
  { name: "Zoya Sakr", handle: "@zoyasakr" },
  { name: "Saoud Alkaabi", handle: "@saoudalkaabi" },
  { name: "Dalia El Ali", handle: "@deebydalia" },
  { name: "Aliyah Raey", handle: "@aliyahraey" },
] as const;

export const JUST_DRIP_MENU: JustDripItem[] = [
  {
    slug: "immune-boost",
    bookSlug: "immune-boost",
    nameEn: "Immune Boost",
    nameAr: "تعزيز المناعة",
    descriptionAr: "تقوية جهاز المناعة، تقليل مدة وتكرار الإصابة، تعزيز مقاومة الفيروسات وإطالة الشفاء",
    descriptionEn: "Strengthen immunity, shorten illness duration, and support viral resistance",
    ingredients: "Vitamin C 1000mg · Zinc 100mg · Calcium 2mmol · Potassium 5mmol · Bicarbonate 25mmol",
    tagsAr: ["مناعة", "تعافي سريع"],
    tagsEn: ["Immunity", "Fast recovery"],
    accent: "#4A9B6E",
    icon: "🛡",
  },
  {
    slug: "energy-boost",
    bookSlug: "energy-boost",
    nameEn: "Energy Boost",
    nameAr: "تعزيز الطاقة",
    descriptionAr: "جلسة تنشيط فورية لعلاج التعب المزمن والإجهاد — طاقة واسعة، مزاج أفضل، تركيز، ودعم للأعصاب والعضلات",
    descriptionEn: "Rapid activation for chronic fatigue and burnout — energy, mood, and focus",
    ingredients: "B1 100mg · B2 25mg · B3 200mg · B6 250mg · B12 1000mcg · Magnesium Sulphate 200mg · Amino Acids",
    tagsAr: ["طاقة", "مضاد للإرهاق"],
    tagsEn: ["Energy", "Anti-fatigue"],
    accent: "#8B93A7",
    icon: "⚡",
  },
  {
    slug: "panthenol-b5",
    nameEn: "Panthenol (B5)",
    nameAr: "بانثينول B5",
    descriptionAr: "ترطيب عميق للبشرة، إصلاح الخلايا، تهدئة الالتهيجات، واستعادة الإشراقة الطبيعية",
    descriptionEn: "Deep skin hydration, cellular repair, and soothing irritation",
    ingredients: "Dexpanthenol 250mg/ml",
    tagsAr: ["ترطيب عميق", "تجديد"],
    tagsEn: ["Deep hydration", "Renewal"],
    accent: "#7EB8D8",
    icon: "💧",
  },
  {
    slug: "hair-skin-nails",
    bookSlug: "hair-skin-nails",
    nameEn: "Hair, Nail & Skin",
    nameAr: "الشعر والأظافر والبشرة",
    descriptionAr: "تقوية الشعر وتحفيز نموه، تقليل التساقط والتقصف، تحسين نضارة البشرة وصحة الأظافر",
    descriptionEn: "Strengthen hair, reduce shedding, and improve skin radiance and nails",
    ingredients: "Biotin 10,000mcg · Zinc 10mg/ml",
    tagsAr: ["شعر", "أظافر", "بشرة"],
    tagsEn: ["Hair", "Nails", "Skin"],
    accent: "#E8945A",
    icon: "✦",
  },
  {
    slug: "myers-cocktail",
    bookSlug: "myers-cocktail",
    nameEn: "Myer's Cocktail",
    nameAr: "كوكتيل مايرز",
    descriptionAr: "جلسة شاملة لدعم الطاقة والمناعة والأعصاب — تقليل التوتر والإجهاد وتحسين الصحة العامة",
    descriptionEn: "Comprehensive blend for energy, immunity, nerves, and overall wellness",
    ingredients: "Vitamin C 1000mg · B1,B2,B3,B6,B12 · Magnesium 200mg · Calcium 100mg · Zinc 10mg · NAD+ 100mg",
    tagsAr: ["فيتامينات شاملة", "معادن"],
    tagsEn: ["Full vitamins", "Minerals"],
    accent: "#5B8FD4",
    icon: "◆",
  },
  {
    slug: "dopamin-booster",
    nameEn: "Dopamin Booster",
    nameAr: "معزز الدوبامين",
    descriptionAr: "يعزز الذاكرة، يزيد التركيز والانتباه، يدعم الخلايا العصبية ويحسّن الأداء الذهني",
    descriptionEn: "Enhances memory, focus, and cognitive performance",
    ingredients: "Citicoline 250mg / 5ml",
    tagsAr: ["تركيز", "ذاكرة"],
    tagsEn: ["Focus", "Memory"],
    accent: "#D9B344",
    icon: "◎",
  },
  {
    slug: "nad-plus",
    bookSlug: "nad-plus",
    nameEn: "NAD+ Drips",
    nameAr: "مغذيات NAD+",
    descriptionAr: "استعادة فورية للطاقة الخلوية، تركيز ذهني حاد، دعم متقدم للأعصاب، ومقاومة استثنائية للشيخوخة",
    descriptionEn: "Cellular energy restoration, sharp cognition, and anti-ageing support",
    ingredients: "NAD+ 500mg in each Invita vial",
    tagsAr: ["طاقة خلوية", "مكافحة الشيخوخة"],
    tagsEn: ["Cellular energy", "Anti-ageing"],
    accent: "#8B6BB8",
    icon: "∞",
  },
  {
    slug: "skin-radiance",
    bookSlug: "skin-radiance",
    nameEn: "Skin Radiance",
    nameAr: "إشراقة البشرة",
    descriptionAr: "تفتيح وتوحيد لون البشرة، تقليل التصبغات، ترطيب عميق، تنقية الجسم من السموم وتأخير علامات التقدم بالعمر",
    descriptionEn: "Brighten complexion, reduce pigmentation, and support detox",
    ingredients: "Glutathione 2.4g · Vitamin C 1000mg",
    tagsAr: ["إشراقة", "تفتيح"],
    tagsEn: ["Radiance", "Brightening"],
    accent: "#C4A882",
    icon: "❋",
  },
  {
    slug: "weight-management",
    bookSlug: "weight-management",
    nameEn: "Weight Loss Drip",
    nameAr: "مغذي خسارة الوزن",
    descriptionAr: "تحفيز حرق الدهون، رفع الطاقة أثناء الرجيم، دعم بناء العضلات والأداء البدني",
    descriptionEn: "Metabolic support for fat burning and active weight-loss programs",
    ingredients: "L-Carnitine 1000mg · Glutamine 300mg · Arginine 1g",
    tagsAr: ["حرق الدهون", "أيض"],
    tagsEn: ["Fat burn", "Metabolism"],
    accent: "#C45C5C",
    icon: "↯",
  },
  {
    slug: "fertility-libido",
    nameEn: "Fertility & Libido",
    nameAr: "الخصوبة والحيوية",
    descriptionAr: "دعم الخصوبة للرجال والنساء، تحسين التوازن الهرموني، وتعزيز الطاقة الجنسية والحيوية العامة",
    descriptionEn: "Fertility and hormonal balance support for men and women",
    ingredients: "Glutathione 1.2g · L-Carnitine 1000mg · MIC (Methionine – Inositol – Choline)",
    tagsAr: ["خصوبة", "حيوية"],
    tagsEn: ["Fertility", "Vitality"],
    accent: "#D48BA8",
    icon: "♡",
  },
  {
    slug: "jet-fuel",
    bookSlug: "jet-fuel",
    nameEn: "Jet Fuel",
    nameAr: "وقود الأداء",
    descriptionAr: "تعزيز الطاقة البدنية والذهنية، رفع القدرة على التحمل، وتخفيف الإرهاق — مثالية للرياضيين وأصحاب الأعمال المجهدة",
    descriptionEn: "Physical and mental performance for athletes and demanding schedules",
    ingredients: "B12 1000mcg · B2 25mg · B3 200mg · B6 250mg · Magnesium 250mg · Vitamin C 500mg",
    tagsAr: ["قوة", "تحمل"],
    tagsEn: ["Power", "Endurance"],
    accent: "#4A9E9E",
    icon: "▲",
  },
  {
    slug: "cola-drip-iron",
    nameEn: "Cola Drip (Iron)",
    nameAr: "مغذي الحديد",
    descriptionAr: "علاج فقر الدم، رفع الهيموغلوبين، تقليل الدوخة والتعب، وتحسين النشاط والطاقة",
    descriptionEn: "Iron replenishment for anaemia, haemoglobin, and fatigue",
    ingredients: "Iron Sucrose 200mg / 10ml",
    tagsAr: ["فقر الدم", "هيموغلوبين"],
    tagsEn: ["Anaemia", "Haemoglobin"],
    accent: "#6B4A3A",
    icon: "🩸",
  },
  {
    slug: "edta-chelation",
    nameEn: "EDTA Chelation",
    nameAr: "تخليب EDTA",
    descriptionAr: "تنقية الأوعية الدموية، إزالة المعادن السامة، ودعم صحة القلب والدورة الدموية",
    descriptionEn: "Vascular purification and cardiovascular support",
    ingredients: "EDTA 150mg/ml",
    tagsAr: ["ديتوكس", "صحة القلب"],
    tagsEn: ["Detox", "Heart health"],
    accent: "#8B7355",
    icon: "♥",
  },
];

export function getJustDrip(slug: string): JustDripItem | undefined {
  return JUST_DRIP_MENU.find((d) => d.slug === slug);
}
