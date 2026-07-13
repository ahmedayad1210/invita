/** DNA analysis brochure — sourced from DNA_Brochure_Arabic PDF. */

export const DNA_HERO_AR = "اقرأ جسدك من حمضك النووي";
export const DNA_HERO_EN = "Read your body from your DNA";

export const DNA_LEAD_AR =
  "فحص DNA من إنفيتا يكشف كيف يتفاعل جسمك مع التغذية، الرياضة، الأدوية، والعناية بالبشرة — لتبني قرارات صحية مبنية على علمك لا على التخمين.";
export const DNA_LEAD_EN =
  "Invita DNA testing reveals how your body responds to nutrition, fitness, medication, and skincare — so your choices are personal, not generic.";

export const DNA_STEPS = [
  {
    step: "01",
    titleAr: "عينة لعاب",
    titleEn: "Saliva sample",
    bodyAr: "تجميع بسيط في المنزل خلال 5 دقائق",
    bodyEn: "Simple at-home collection in 5 minutes",
  },
  {
    step: "02",
    titleAr: "تحليل DNA",
    titleEn: "DNA analysis",
    bodyAr: "فحص في مختبرات متخصصة",
    bodyEn: "Analysis in specialised laboratories",
  },
  {
    step: "03",
    titleAr: "تقريرك الخاص",
    titleEn: "Your private report",
    bodyAr: "نتائج مفصلة مع توصيات علمية",
    bodyEn: "Detailed results with scientific recommendations",
  },
] as const;

export const DNA_CATEGORIES = [
  {
    id: "nutrition",
    titleAr: "التغذية",
    titleEn: "Nutrition",
    count: "40+",
    countLabelAr: "سمة",
    countLabelEn: "traits",
    tagsAr: ["فيتامينات", "استقلاب", "حساسية غذائية", "الوزن"],
    tagsEn: ["Vitamins", "Metabolism", "Food sensitivity", "Weight"],
    icon: "🍽",
  },
  {
    id: "skin-hair",
    titleAr: "البشرة والشعر",
    titleEn: "Skin & hair",
    count: "25+",
    countLabelAr: "سمة",
    countLabelEn: "traits",
    tagsAr: ["كولاجين", "أشعة UV", "تساقط الشعر", "الترطيب"],
    tagsEn: ["Collagen", "UV", "Hair loss", "Hydration"],
    icon: "✧",
  },
  {
    id: "sports",
    titleAr: "الرياضة واللياقة",
    titleEn: "Sports & fitness",
    count: "30+",
    countLabelAr: "سمة",
    countLabelEn: "traits",
    tagsAr: ["قوة", "تحمل", "تعافي", "إصابات"],
    tagsEn: ["Power", "Endurance", "Recovery", "Injury risk"],
    icon: "◈",
  },
  {
    id: "pharma",
    titleAr: "الاستجابة للأدوية",
    titleEn: "Drug response",
    count: "50+",
    countLabelAr: "دواء",
    countLabelEn: "medications",
    tagsAr: ["قلب", "جهاز هضمي", "ألم", "هرمونات"],
    tagsEn: ["Cardiac", "GI", "Pain", "Hormones"],
    icon: "💊",
  },
] as const;

export const DNA_RESULT_LEGEND = [
  {
    color: "#4A9B6E",
    labelAr: "طبيعي / قوي",
    labelEn: "Normal / strong",
    bodyAr: "نتيجة إيجابية — استمر بعاداتك الصحية",
    bodyEn: "Positive result — continue healthy habits",
  },
  {
    color: "#D9B344",
    labelAr: "تنبيه",
    labelEn: "Alert",
    bodyAr: "يحتاج انتباه — يمكن تحسينه بتعديل نمط الحياة",
    bodyEn: "Needs attention — improvable with lifestyle changes",
  },
  {
    color: "#C45C5C",
    labelAr: "تركيز",
    labelEn: "Focus",
    bodyAr: "أولوية عالية — يتطلب إجراء أو استشارة طبية",
    bodyEn: "High priority — may require medical consultation",
  },
] as const;

export const DNA_FOOTER_AR = "عينة لعاب واحدة — معرفة تدوم مدى الحياة";
export const DNA_FOOTER_EN = "One saliva sample — knowledge that lasts a lifetime";
