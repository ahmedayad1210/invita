/** Topic tags for shoppable Instagram feed. */

export type InstagramTopic = {
  id: string;
  labelEn: string;
  labelAr: string;
  /** Drip slug for book/deep-link */
  dripSlug?: string;
  keywords: string[];
};

export const INSTAGRAM_TOPICS: InstagramTopic[] = [
  {
    id: "nad",
    labelEn: "NAD+",
    labelAr: "NAD+",
    dripSlug: "nad-plus",
    keywords: ["nad", "nad+", "longevity", "anti-aging", "cellular", "rejuvenation"],
  },
  {
    id: "immunity",
    labelEn: "Immunity",
    labelAr: "المناعة",
    dripSlug: "immune-boost",
    keywords: ["immune", "immunity", "vitamin c", "flu", "cold", "مناعة"],
  },
  {
    id: "beauty",
    labelEn: "Beauty",
    labelAr: "الجمال",
    dripSlug: "skin-radiance",
    keywords: ["skin", "glow", "beauty", "radiance", "hair", "biotin", "جمال", "بشرة"],
  },
  {
    id: "energy",
    labelEn: "Energy",
    labelAr: "الطاقة",
    dripSlug: "energy-boost",
    keywords: ["energy", "fatigue", "boost", "vitality", "طاقة", "jet fuel", "jet-fuel"],
  },
  {
    id: "sport",
    labelEn: "Sport",
    labelAr: "رياضة",
    dripSlug: "sport-endurance-recovery",
    keywords: ["sport", "athlete", "recovery", "endurance", "training", "رياض"],
  },
  {
    id: "detox",
    labelEn: "Detox",
    labelAr: "تنظيف",
    dripSlug: "glutathione-detox",
    keywords: ["detox", "glutathione", "cleanse", "liver", "تنظيف"],
  },
];

export function postMatchesTopic(
  caption: string,
  topicId: string
): boolean {
  const topic = INSTAGRAM_TOPICS.find((t) => t.id === topicId);
  if (!topic) return false;
  const lower = caption.toLowerCase();
  return topic.keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export function inferPostTopic(caption: string): InstagramTopic | null {
  for (const topic of INSTAGRAM_TOPICS) {
    if (postMatchesTopic(caption, topic.id)) return topic;
  }
  return null;
}
