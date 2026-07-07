/** Keyword search over Invita FAQ + drip education — no diagnosis. */

import { COMPREHENSIVE_FAQ } from "@/lib/invita/faq-comprehensive";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";

export type AssistantReply = {
  answer: string;
  sources: string[];
  suggestBook?: string;
};

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "what", "how", "do", "does", "can", "i", "my", "for", "to", "in", "at",
  "هل", "ما", "كيف", "في", "من", "على",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF+-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function scoreText(queryTokens: string[], text: string): number {
  const hay = text.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    if (hay.includes(token)) score += token.length > 4 ? 2 : 1;
  }
  return score;
}

export function answerWellnessQuery(query: string, locale: "en" | "ar" = "en"): AssistantReply {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      answer:
        locale === "ar"
          ? "اسأل عن بروتوكول IV، السلامة، أو فحوصات DNA — لا نقدّم تشخيصاً طبياً."
          : "Ask about IV protocols, safety, or DNA panels — we do not provide medical diagnosis.",
      sources: [],
    };
  }

  const lower = trimmed.toLowerCase();
  const blocked =
    /diagnos|prescri|medicat|emergency|chest pain|heart attack|stroke|حالة طارئة|تشخيص|وصفة/i.test(
      trimmed
    );
  if (blocked) {
    return {
      answer:
        locale === "ar"
          ? "لا يمكننا تشخيص أو وصف علاج. تواصل مع طبيبك أو اتصل بنا عبر WhatsApp للاستشارة السريرية."
          : "We cannot diagnose or prescribe. Contact your physician or reach Invita on WhatsApp for clinical consultation.",
      sources: ["Safety policy"],
    };
  }

  const tokens = tokenize(trimmed);

  const faqHits = COMPREHENSIVE_FAQ.map((item) => ({
    score: scoreText(tokens, `${item.q} ${item.a}`),
    text: item.a,
    source: item.q,
  }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);

  const dripHits = LIQUIVIDA_DRIPS.map((drip) => ({
    score: scoreText(tokens, `${drip.name} ${drip.tagline} ${drip.description}`),
    drip,
  }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);

  if (faqHits.length === 0 && dripHits.length === 0) {
    return {
      answer:
        locale === "ar"
          ? "لم أجد إجابة محددة في مواد Invita. جرّب «NAD+» أو «المناعة» أو احجز استشارة."
          : "I couldn't find a specific answer in Invita materials. Try “NAD+”, “immunity”, or book a consultation.",
      sources: [],
      suggestBook: "/book",
    };
  }

  const parts: string[] = [];
  const sources: string[] = [];

  if (faqHits[0]) {
    parts.push(faqHits[0].text);
    sources.push(faqHits[0].source);
  }

  if (dripHits[0] && dripHits[0].score >= (faqHits[0]?.score ?? 0)) {
    const d = dripHits[0].drip;
    parts.unshift(`${d.name}: ${d.tagline}. ${d.description.slice(0, 200)}…`);
    sources.unshift(d.name);
  }

  return {
    answer: parts.slice(0, 2).join("\n\n"),
    sources: [...new Set(sources)].slice(0, 3),
    suggestBook: dripHits[0] ? `/book?drip=${dripHits[0].drip.slug}` : "/book",
  };
}
