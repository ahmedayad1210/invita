/** Wellness Matcher — maps quiz answers to Invita catalogue drips. */

export type MatcherQuestion = {
  id: string;
  questionEn: string;
  questionAr: string;
  options: {
    id: string;
    labelEn: string;
    labelAr: string;
    /** Drip slug → weight */
    scores: Record<string, number>;
  }[];
};

export const MATCHER_QUESTIONS: MatcherQuestion[] = [
  {
    id: "goal",
    questionEn: "What is your primary wellness goal right now?",
    questionAr: "ما هدفك الصحي الرئيسي حالياً؟",
    options: [
      { id: "energy", labelEn: "More energy & focus", labelAr: "طاقة وتركيز", scores: { "energy-boost": 3, "jet-fuel": 2, "myers-cocktail": 2 } },
      { id: "immunity", labelEn: "Stronger immunity", labelAr: "مناعة أقوى", scores: { "immune-boost": 3, "myers-cocktail": 1 } },
      { id: "beauty", labelEn: "Skin, hair & glow", labelAr: "بشرة وشعر وإشراق", scores: { "skin-radiance": 3, "hair-skin-nails": 2, "glutathione-detox": 1 } },
      { id: "performance", labelEn: "Athletic performance", labelAr: "أداء رياضي", scores: { "sport-endurance-recovery": 3, "jet-fuel": 2, "energy-boost": 1 } },
      { id: "longevity", labelEn: "Anti-ageing & longevity", labelAr: "مكافحة الشيخوخة", scores: { "nad-plus": 3, "glutathione-detox": 2 } },
    ],
  },
  {
    id: "lifestyle",
    questionEn: "Which best describes your week?",
    questionAr: "أي وصف يناسب أسبوعك؟",
    options: [
      { id: "busy", labelEn: "High-stress / long hours", labelAr: "ضغط وعمل طويل", scores: { "jet-fuel": 2, "energy-boost": 2, "myers-cocktail": 1 } },
      { id: "travel", labelEn: "Travel or jet lag", labelAr: "سفر أو jet lag", scores: { "jet-fuel": 3, "immune-boost": 1 } },
      { id: "training", labelEn: "Regular training", labelAr: "تمرين منتظم", scores: { "sport-endurance-recovery": 3, "energy-boost": 1 } },
      { id: "recovery", labelEn: "Recovering from illness", labelAr: "تعافٍ من مرض", scores: { "immune-boost": 2, "myers-cocktail": 2, "vitamin-d3-boost": 1 } },
      { id: "balanced", labelEn: "Mostly balanced", labelAr: "متوازن غالباً", scores: { "myers-cocktail": 2, "energy-boost": 1 } },
    ],
  },
  {
    id: "concern",
    questionEn: "Any specific concern?",
    questionAr: "هل لديك concern محدد؟",
    options: [
      { id: "fatigue", labelEn: "Persistent fatigue", labelAr: "إرهاق مستمر", scores: { "energy-boost": 2, "nad-plus": 2, "myers-cocktail": 2 } },
      { id: "skin", labelEn: "Dull skin or event prep", labelAr: "بشرة باهتة أو مناسبة", scores: { "skin-radiance": 3, "hair-skin-nails": 1 } },
      { id: "detox", labelEn: "Detox & oxidative stress", labelAr: "تنظيف وإجهاد تأكسدي", scores: { "glutathione-detox": 3, "nad-plus": 1 } },
      { id: "weight", labelEn: "Weight management support", labelAr: "دعم إدارة الوزن", scores: { "weight-management": 3, "energy-boost": 1 } },
      { id: "none", labelEn: "General wellness", labelAr: "عافية عامة", scores: { "myers-cocktail": 2, "immune-boost": 1 } },
    ],
  },
  {
    id: "frequency",
    questionEn: "How often would you like to drip?",
    questionAr: "كم مرة تفضل العلاج الوريدي؟",
    options: [
      { id: "weekly", labelEn: "Weekly programme", labelAr: "برنامج أسبوعي", scores: { "energy-boost": 1, "immune-boost": 1, "skin-radiance": 1, "nad-plus": 2 } },
      { id: "monthly", labelEn: "Monthly maintenance", labelAr: "صيانة شهرية", scores: { "myers-cocktail": 2, "nad-plus": 1, "vitamin-d3-boost": 1 } },
      { id: "event", labelEn: "One-off / before an event", labelAr: "مرة واحدة / قبل مناسبة", scores: { "skin-radiance": 2, "jet-fuel": 2, "energy-boost": 1 } },
      { id: "unsure", labelEn: "Not sure yet", labelAr: "لست متأكداً", scores: { "myers-cocktail": 1 } },
    ],
  },
  {
    id: "experience",
    questionEn: "Have you had IV therapy before?",
    questionAr: "هل جربت العلاج الوريدي من قبل؟",
    options: [
      { id: "yes-nad", labelEn: "Yes — interested in NAD+", labelAr: "نعم — مهتم بـ NAD+", scores: { "nad-plus": 3 } },
      { id: "yes-other", labelEn: "Yes — open to upgrades", labelAr: "نعم — مفتوح للترقية", scores: { "nad-plus": 1, "jet-fuel": 1, "glutathione-detox": 1 } },
      { id: "no-gentle", labelEn: "No — start gentle", labelAr: "لا — ابدأ بلطف", scores: { "immune-boost": 2, "vitamin-d3-boost": 2, "myers-cocktail": 1 } },
      { id: "no-signature", labelEn: "No — go for signature", labelAr: "لا — بروتوكول مميز", scores: { "nad-plus": 1, "myers-cocktail": 2, "skin-radiance": 1 } },
    ],
  },
];

export function scoreMatcherAnswers(
  answers: Record<string, string>
): { slug: string; score: number }[] {
  const totals: Record<string, number> = {};

  for (const q of MATCHER_QUESTIONS) {
    const optionId = answers[q.id];
    if (!optionId) continue;
    const option = q.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [slug, weight] of Object.entries(option.scores)) {
      totals[slug] = (totals[slug] ?? 0) + weight;
    }
  }

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, score]) => ({ slug, score }));
}

export function topMatcherResults(
  answers: Record<string, string>,
  count = 3
): string[] {
  return scoreMatcherAnswers(answers)
    .slice(0, count)
    .map((r) => r.slug);
}
