/** DNA panel → recommended IV protocol mappings. */

export type DnaPathway = {
  dripSlugs: string[];
  rationaleEn: string;
  rationaleAr: string;
};

export const DNA_PANEL_PATHWAYS: Record<string, DnaPathway> = {
  nutrigenomics: {
    dripSlugs: ["myers-cocktail", "energy-boost", "vitamin-d3-boost"],
    rationaleEn:
      "Nutrigenomics often highlights metabolism and micronutrient gaps — these protocols support baseline wellness while your report guides personalised supplementation.",
    rationaleAr:
      "التغذية الجينية تكشف فجوات في الاستقلاب والمغذيات — هذه البروتوكولات تدعم العافية الأساسية بينما يوجّه تقريرك المكملات.",
  },
  "longevity-comprehensive": {
    dripSlugs: ["nad-plus", "glutathione-detox", "immune-boost"],
    rationaleEn:
      "Our most complete genomic profile pairs naturally with NAD+ cellular repair, glutathione detox support, and immune resilience.",
    rationaleAr:
      "أشمل ملف جينومي يتكامل مع NAD+ للإصلاح الخلوي، الجلوتاثيون للتنظيف، والمناعة.",
  },
  pharmacogenomics: {
    dripSlugs: ["myers-cocktail", "immune-boost"],
    rationaleEn:
      "While your pharmacogenomics report informs medication choices, Myers Cocktail and Immune Boost support general recovery and nutrient status.",
    rationaleAr:
      "تقرير علم الأدوية الجيني يوجّه اختيار الأدوية — Myers وImmune Boost يدعمان التغذية والتعافي.",
  },
  "skin-beauty-genetics": {
    dripSlugs: ["skin-radiance", "hair-skin-nails", "glutathione-detox"],
    rationaleEn:
      "Beauty genetics insights align with radiance and biotin-forward IV protocols plus antioxidant detox support.",
    rationaleAr:
      "جينات الجمال تتوافق مع بروتوكولات الإشراق والبيوتين والتنظيف المضاد للأكسدة.",
  },
};

export function getPathwayForPanel(slug: string): DnaPathway | null {
  return DNA_PANEL_PATHWAYS[slug] ?? null;
}
