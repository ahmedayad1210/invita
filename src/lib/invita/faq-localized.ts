import type { FaqItem } from "./faq-comprehensive";

/** Arabic FAQ translations keyed by English question. */
export const FAQ_AR: Record<string, { q: string; a: string }> = {
  "What is IV therapy?": {
    q: "ما هو العلاج الوريدي؟",
    a: "العلاج الوريدي يُسلّم الفيتامينات والمعادن والأحماض الأمينية مباشرة في الدم. بذلك تتجاوز الجهاز الهضمي ويكون الامتصاص شبه كامل — unlike المكملات الفموية.",
  },
  "How long does a session take?": {
    q: "كم تستغرق الجلسة؟",
    a: "الجلسة النموذجية 30–60 دقيقة، بعد استشارة طبية ~15 دقيقة لمراجعة تاريخك الصحي وأهدافك.",
  },
  "Is IV therapy safe?": {
    q: "هل العلاج الوريدي آمن؟",
    a: "نعم، عند إعطائه من قبل مختصين مرخّصين وبمنتجات مسجّلة. Invita تستخدم تركيبات Liquivida® الرسمية وبروتوكولات سريرية صارمة.",
  },
  "How much does IV therapy cost?": {
    q: "كم يكلف العلاج الوريدي؟",
    a: "الأسعار معروضة بالدينار العراقي على كل صفحة drip. تشمل الاستشارة الطبية المجانية.",
  },
  "What is NAD+ IV therapy?": {
    q: "ما هو NAD+ الوريدي؟",
    a: "NAD+ coenzyme حيوي للطاقة الخلوية وإصلاح DNA. التسليم الوريدي يوفر bioavailability أعلى من المكملات الفموية.",
  },
  "What DNA panels does Invita offer?": {
    q: "ما لوحات DNA التي تقدمها Invita؟",
    a: "Nutrigenomics، Longevity Comprehensive، Pharmacogenomics، وSkin & Beauty Genetics — مع تقارير سرية وجلسات تفسير.",
  },
};

export function localizeFaqItem(item: FaqItem, isAr: boolean): FaqItem {
  if (!isAr) return item;
  const ar = FAQ_AR[item.q];
  if (!ar) return item;
  return { ...item, q: ar.q, a: ar.a };
}
