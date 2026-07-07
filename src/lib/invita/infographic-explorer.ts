/** Infographic explorer — symptom/topic search over curated assets. */

import { GALLERY_TOPIC_ROWS } from "@/lib/invita/content-curation";
import { getInfographic, getAllInfographics, type MediaItem } from "@/lib/invita/local-media";
import { INFOGRAPHIC_LABELS } from "@/lib/invita/asset-labels";

export type InfographicSymptom = {
  id: string;
  labelEn: string;
  labelAr: string;
  keywords: string[];
  topicIds: string[];
};

export const INFOGRAPHIC_SYMPTOMS: InfographicSymptom[] = [
  {
    id: "fatigue",
    labelEn: "Fatigue & energy",
    labelAr: "إرهاق وطاقة",
    keywords: ["fatigue", "energy", "tired", "nad", "boost"],
    topicIds: ["nad", "energy", "science"],
  },
  {
    id: "immunity",
    labelEn: "Immunity",
    labelAr: "المناعة",
    keywords: ["immune", "immunity", "vitamin c", "flu"],
    topicIds: ["immunity", "science"],
  },
  {
    id: "skin",
    labelEn: "Skin & beauty",
    labelAr: "البشرة والجمال",
    keywords: ["skin", "beauty", "glow", "radiance", "hair"],
    topicIds: ["beauty"],
  },
  {
    id: "sport",
    labelEn: "Sport & recovery",
    labelAr: "رياضة وتعافٍ",
    keywords: ["sport", "athlete", "recovery", "endurance"],
    topicIds: ["energy"],
  },
  {
    id: "longevity",
    labelEn: "Longevity",
    labelAr: "إطالة العمر",
    keywords: ["longevity", "nad", "ageing", "anti-aging"],
    topicIds: ["nad", "science"],
  },
];

export type ExplorerInfographic = MediaItem & {
  labelEn: string;
  labelAr: string;
  topicId: string;
};

export function getExplorerInfographics(): ExplorerInfographic[] {
  const ids = new Set<string>();
  const items: ExplorerInfographic[] = [];

  for (const row of GALLERY_TOPIC_ROWS) {
    for (const id of row.ids) {
      if (ids.has(id)) continue;
      const item = getInfographic(id);
      if (!item) continue;
      ids.add(id);
      const labels = INFOGRAPHIC_LABELS[id];
      items.push({
        ...item,
        labelEn: labels?.en ?? id,
        labelAr: labels?.ar ?? id,
        topicId: row.id,
      });
    }
  }

  const orphans = getAllInfographics().filter((i) => !ids.has(i.id));
  for (const item of orphans) {
    const labels = INFOGRAPHIC_LABELS[item.id];
    items.push({
      ...item,
      labelEn: labels?.en ?? item.id,
      labelAr: labels?.ar ?? item.id,
      topicId: "science",
    });
  }

  return items;
}

export function filterExplorerInfographics(options: {
  query?: string;
  topicId?: string;
  symptomId?: string;
}): ExplorerInfographic[] {
  let items = getExplorerInfographics();

  if (options.topicId && options.topicId !== "all") {
    items = items.filter((i) => i.topicId === options.topicId);
  }

  if (options.symptomId && options.symptomId !== "all") {
    const symptom = INFOGRAPHIC_SYMPTOMS.find((s) => s.id === options.symptomId);
    if (symptom) {
      items = items.filter((i) => symptom.topicIds.includes(i.topicId));
    }
  }

  const q = options.query?.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (i) =>
        i.labelEn.toLowerCase().includes(q) ||
        i.labelAr.includes(q) ||
        i.id.toLowerCase().includes(q)
    );
  }

  return items;
}

export const EXPLORER_TOPICS = GALLERY_TOPIC_ROWS.map((r) => ({
  id: r.id,
  labelEn: r.labelEn,
  labelAr: r.labelAr,
}));
