"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  EXPLORER_TOPICS,
  INFOGRAPHIC_SYMPTOMS,
  filterExplorerInfographics,
} from "@/lib/invita/infographic-explorer";
import { useLocale } from "@/contexts/LocaleContext";

export default function InfographicExplorer() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [topicId, setTopicId] = useState("all");
  const [symptomId, setSymptomId] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const items = useMemo(
    () => filterExplorerInfographics({ query, topicId, symptomId }),
    [query, topicId, symptomId]
  );

  const lightboxItem = items.find((i) => i.path === lightbox);

  return (
    <div className="infographic-explorer">
      <div className="infographic-explorer-toolbar">
        <input
          type="search"
          className="input-sevres"
          placeholder={isAr ? "ابحث بالموضوع أو العرض…" : "Search by topic or symptom…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="infographic-explorer-filters">
          <select
            className="clinic-select"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            aria-label={isAr ? "الموضوع" : "Topic"}
          >
            <option value="all">{isAr ? "كل المواضيع" : "All topics"}</option>
            {EXPLORER_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {isAr ? t.labelAr : t.labelEn}
              </option>
            ))}
          </select>
          <select
            className="clinic-select"
            value={symptomId}
            onChange={(e) => setSymptomId(e.target.value)}
            aria-label={isAr ? "العرض" : "Symptom"}
          >
            <option value="all">{isAr ? "كل الأعراض" : "All symptoms"}</option>
            {INFOGRAPHIC_SYMPTOMS.map((s) => (
              <option key={s.id} value={s.id}>
                {isAr ? s.labelAr : s.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="infographic-explorer-count">
        {items.length} {isAr ? "دليلاً" : "guides"}
      </p>

      <div className="infographic-explorer-grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="infographic-explorer-tile"
            onClick={() => setLightbox(item.path)}
          >
            <Image
              src={item.path}
              alt={isAr ? item.labelAr : item.labelEn}
              width={400}
              height={560}
              sizes="(max-width:640px) 50vw, 280px"
              style={{ width: "100%", height: "auto" }}
            />
            <span>{isAr ? item.labelAr : item.labelEn}</span>
          </button>
        ))}
      </div>

      {lightboxItem && (
        <div
          className="infographic-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="infographic-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="infographic-lightbox-close" onClick={() => setLightbox(null)}>
              ×
            </button>
            <Image
              src={lightboxItem.path}
              alt={isAr ? lightboxItem.labelAr : lightboxItem.labelEn}
              width={900}
              height={1200}
              style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain" }}
            />
            <p>{isAr ? lightboxItem.labelAr : lightboxItem.labelEn}</p>
          </div>
        </div>
      )}
    </div>
  );
}
