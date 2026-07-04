/** Human labels for ingested infographic IDs — matches Invita editorial tone */

export const INFOGRAPHIC_LABELS: Record<
  string,
  { en: string; ar: string; topic?: "nad" | "immunity" | "beauty" | "energy" | "science" }
> = {
  "iv-01": { en: "IV Therapy Essentials", ar: "أساسيات العلاج الوريدي", topic: "science" },
  "iv-02": { en: "Hydration Protocol", ar: "بروتوكول الترطيب", topic: "science" },
  "iv-04": { en: "Recovery & Performance", ar: "التعافي والأداء", topic: "energy" },
  "iv-05": { en: "Wellness Support", ar: "دعم العافية", topic: "science" },
  "iv-06": { en: "Clinical Nutrition", ar: "التغذية السريرية", topic: "science" },
  "iv-07": { en: "NAD+ Drips", ar: "قطرات NAD+", topic: "nad" },
  "iv-08": { en: "Cellular Energy", ar: "الطاقة الخلوية", topic: "nad" },
  "iv-09": { en: "Longevity Support", ar: "دعم طول العمر", topic: "nad" },
  "iv-10": { en: "Immune Boost", ar: "تعزيز المناعة", topic: "immunity" },
  "iv-11": { en: "Immunity & Vitality", ar: "المناعة والحيوية", topic: "immunity" },
  "iv-12": { en: "Panthenol B5", ar: "Panthenol B5", topic: "beauty" },
  "iv-13": { en: "Skin Radiance", ar: "إشراق البشرة", topic: "beauty" },
  "iv-14": { en: "Hair & Nails", ar: "الشعر والأظافر", topic: "beauty" },
  "iv-15": { en: "Beauty IV", ar: "الجمال الوريدي", topic: "beauty" },
  "iv-16": { en: "Detox Support", ar: "دعم إزالة السموم", topic: "science" },
  "iv-17": { en: "Energy Boost", ar: "تعزيز الطاقة", topic: "energy" },
  "iv-18": { en: "Jet Fuel Protocol", ar: "بروتوكول Jet Fuel", topic: "energy" },
};

export function infographicLabel(id: string, locale: "en" | "ar"): string {
  return INFOGRAPHIC_LABELS[id]?.[locale] ?? id.replace("iv-", "Protocol ");
}
