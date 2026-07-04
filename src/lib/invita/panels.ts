export type DnaPanel = {
  slug: string;
  name: string;
  nameAr: string;
  price: string;
  turnaround: string;
  markers: string[];
  includes: string[];
  description: string;
  descriptionAr: string;
};

export const DNA_PANELS: DnaPanel[] = [
  {
    slug: "nutrigenomics",
    name: "Nutrigenomics Panel",
    nameAr: "لوحة التغذية الجينية",
    price: "350,000 IQD",
    turnaround: "14–21 days",
    markers: ["Metabolism", "Vitamin response", "Food sensitivities", "Weight genetics"],
    includes: ["Kit or in-clinic collection", "Encrypted PDF report", "45-min interpretation"],
    description:
      "Understand how your genes shape nutrition, metabolism, and supplementation — not guesswork.",
    descriptionAr:
      "افهم كيف تشكّل جيناتك التغذية والاستقلاب والمكملات — لا تخمين.",
  },
  {
    slug: "longevity-comprehensive",
    name: "Longevity Comprehensive",
    nameAr: "الفحص الشامل لإطالة العمر",
    price: "580,000 IQD",
    turnaround: "21–28 days",
    markers: ["Ageing pathways", "Inflammation", "Detoxification", "Hormone metabolism"],
    includes: ["Premium kit", "Visual summary dashboard", "60-min clinician session"],
    description:
      "Our most complete genomic wellness profile for those building a long-term health strategy.",
    descriptionAr:
      "أشمل ملف جينومي للعافية لمن يبني استراتيجية صحية طويلة المدى.",
  },
  {
    slug: "pharmacogenomics",
    name: "Pharmacogenomics",
    nameAr: "علم الأدوية الجيني",
    price: "420,000 IQD",
    turnaround: "14–21 days",
    markers: ["Drug metabolism", "Efficacy variants", "Adverse reaction risk"],
    includes: ["Clinical-grade report", "Pharmacist-reviewed summary", "Interpretation session"],
    description:
      "Know how your body processes medications before they are prescribed.",
    descriptionAr:
      "اعرف كيف يعالج جسمك الأدوية قبل وصفها.",
  },
  {
    slug: "skin-beauty-genetics",
    name: "Skin & Beauty Genetics",
    nameAr: "جينات الجمال والبشرة",
    price: "310,000 IQD",
    turnaround: "14 days",
    markers: ["Collagen", "UV response", "Oxidative stress", "Skin ageing"],
    includes: ["Beauty-focused report", "Skincare protocol suggestions", "30-min review"],
    description:
      "Genetic insights for skincare and beauty protocols that actually match your biology.",
    descriptionAr:
      "رؤى جينية لبروتوكولات العناية تتوافق مع بيولوجيتك فعلاً.",
  },
];

export function getPanel(slug: string): DnaPanel | undefined {
  return DNA_PANELS.find((p) => p.slug === slug);
}
