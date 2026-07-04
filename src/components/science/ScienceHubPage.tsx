"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  Beaker,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import ScienceInfographics from "@/components/science/ScienceInfographics";
import {
  CLINIC_PROTOCOLS,
  DOWNLOADABLE_RESOURCES,
  KEY_NUTRIENTS,
  NAD_DEEP_DIVE,
  ORAL_VS_IV,
  RESEARCH_SPOTLIGHTS,
  SAFETY_CHECKLIST,
  SCIENCE_DISCLAIMER,
  SCIENCE_HERO_STATS,
  SCIENCE_TABS,
  SYMPTOM_INDICATORS,
  type ScienceTab,
} from "@/lib/invita/science-hub";

function pick<T extends { en: string; ar: string }>(item: T, isAr: boolean) {
  return isAr ? item.ar : item.en;
}

export default function ScienceHubPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [tab, setTab] = useState<ScienceTab>("overview");
  const [openNutrient, setOpenNutrient] = useState<number | null>(0);

  return (
    <>
      <section className="science-hero section-padding">
        <div className="section-inner science-hero-inner">
          <ScrollReveal>
            <p className="page-eyebrow">
              {isAr ? "مركز المعرفة" : "Knowledge hub"}
            </p>
            <h1 className="page-title science-hero-title">
              {isAr ? "العلم والتعليم والمراجع" : "Science, education & resources"}
            </h1>
            <p className="page-lead page-lead--narrow science-hero-lead">
              {isAr
                ? "من الأدبيات المراجعة وبروتوكولات السلامة إلى NAD+ والمغذيات — كل ما تحتاج معرفته عن العلاج الوريدي الطبي."
                : "From peer-reviewed literature and safety protocols to NAD+ and nutrients — everything you need to understand medically supervised IV therapy."}
            </p>
          </ScrollReveal>

          <div className="science-stat-grid">
            {SCIENCE_HERO_STATS.map((stat) => (
              <ScrollReveal key={stat.label.en}>
                <article className="science-stat-card">
                  <p className="science-stat-value">{stat.value}</p>
                  <p className="science-stat-label">{pick(stat.label, isAr)}</p>
                  <p className="science-stat-detail">{pick(stat.detail, isAr)}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="science-tab-bar-wrap">
        <nav className="science-tab-bar section-inner" aria-label={isAr ? "أقسام الصفحة" : "Page sections"}>
          {SCIENCE_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`science-tab-btn${tab === item.id ? " active" : ""}`}
              onClick={() => setTab(item.id)}
              aria-selected={tab === item.id}
            >
              {pick(item.label, isAr)}
            </button>
          ))}
        </nav>
      </div>

      <div className="section-inner science-panel">
        {tab === "overview" && (
          <div className="science-overview">
            <ScrollReveal>
              <header className="science-section-head">
                <Sparkles size={20} aria-hidden="true" />
                <div>
                  <h2>{isAr ? "لماذا العلاج الوريدي؟" : "Why IV therapy?"}</h2>
                  <p>
                    {isAr
                      ? "عند تناول الفيتامينات فموياً، يُفقد جزء كبير في الجهاز الهضمي. العلاج الوريدي يُسلّم المغذيات مباشرة إلى الدم — امتصاص شبه كامل وتأثير أسرع."
                      : "When vitamins are taken orally, much is lost in the digestive tract. IV therapy delivers nutrients directly to the bloodstream — near-complete absorption and faster effect."}
                  </p>
                </div>
              </header>
            </ScrollReveal>

            <ScrollReveal>
              <div className="science-compare-wrap">
                <table className="science-compare-table">
                  <thead>
                    <tr>
                      <th>{pick(ORAL_VS_IV.headers.factor, isAr)}</th>
                      <th>{pick(ORAL_VS_IV.headers.oral, isAr)}</th>
                      <th className="science-compare-highlight">
                        {pick(ORAL_VS_IV.headers.iv, isAr)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORAL_VS_IV.rows.map((row) => (
                      <tr key={row.factor.en}>
                        <th scope="row">{pick(row.factor, isAr)}</th>
                        <td>{pick(row.oral, isAr)}</td>
                        <td className="science-compare-highlight">{pick(row.iv, isAr)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h3 className="science-subtitle">
                {isAr ? "هل العلاج الوريدي مناسب لك؟" : "Could IV therapy help you?"}
              </h3>
              <div className="science-symptom-grid">
                {SYMPTOM_INDICATORS.map((item) => (
                  <article key={item.symptom.en} className="science-symptom-card">
                    <h4>{pick(item.symptom, isAr)}</h4>
                    <p>{pick(item.help, isAr)}</p>
                  </article>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h3 className="science-subtitle">
                {isAr ? "أبحاث مختارة" : "Research spotlight"}
              </h3>
              <div className="science-research-grid">
                {RESEARCH_SPOTLIGHTS.map((paper) => (
                  <article key={paper.id} className="science-research-card">
                    <p className="science-research-journal">{paper.journal}</p>
                    <h4>{pick(paper.title, isAr)}</h4>
                    <p className="science-research-authors">{paper.authors}</p>
                    <p>{pick(paper.summary, isAr)}</p>
                    {"href" in paper && paper.href ? (
                      <a
                        href={paper.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="science-research-link"
                      >
                        {isAr ? "اقرأ الدراسة" : "Read the study"}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </ScrollReveal>

            <ScienceInfographics
              isAr={isAr}
              title={{
                en: "Clinical education visuals",
                ar: "محتوى تعليمي من استوديو Invita",
              }}
              ids={["iv-01", "iv-06", "iv-10", "iv-07"]}
              limit={4}
            />
          </div>
        )}

        {tab === "nad" && (
          <ScrollReveal>
            <div className="science-nad">
              <header className="science-nad-header">
                <FlaskConical size={28} aria-hidden="true" />
                <div>
                  <p className="page-eyebrow">NAD+</p>
                  <h2>{pick(NAD_DEEP_DIVE.headline, isAr)}</h2>
                  <p className="science-nad-intro">{pick(NAD_DEEP_DIVE.intro, isAr)}</p>
                </div>
              </header>

              <div className="science-mechanism-rail">
                {NAD_DEEP_DIVE.mechanisms.map((item, i) => (
                  <article key={item.title.en} className="science-mechanism-card">
                    <span className="science-mechanism-index">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{pick(item.title, isAr)}</h3>
                    <p>{pick(item.body, isAr)}</p>
                  </article>
                ))}
              </div>

              <aside className="science-protocol-callout">
                <ShieldCheck size={20} aria-hidden="true" />
                <p>{pick(NAD_DEEP_DIVE.protocol, isAr)}</p>
              </aside>

              <div className="science-nad-cta">
                <Link href="/iv-therapy/anti-aging" className="btn-secondary">
                  {isAr ? "بروتوكولات NAD+ في Invita" : "Invita NAD+ protocols"}
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href="/resources/nad-plus-scientific-review.pdf"
                  className="btn-ghost science-download-link"
                  download
                >
                  <ArrowDownToLine size={16} aria-hidden="true" />
                  {isAr ? "تحميل المراجعة العلمية" : "Download scientific review"}
                </a>
              </div>
            </div>
          </ScrollReveal>
        )}

        {tab === "nad" && (
          <ScienceInfographics
            isAr={isAr}
            title={{
              en: "NAD+ visual guides",
              ar: "أدلة NAD+ التعليمية",
            }}
            ids={["iv-07", "iv-08", "iv-09"]}
            limit={3}
            featured
          />
        )}

        {tab === "safety" && (
          <div className="science-safety">
            <ScrollReveal>
              <header className="science-section-head">
                <ShieldCheck size={20} aria-hidden="true" />
                <div>
                  <h2>{isAr ? "السلامة أولاً" : "Safety first"}</h2>
                  <p>
                    {isAr
                      ? "كل جلسة Invita تبدأ بالتقييم الطبي. هذه القائمة — مستخرجة من دليل Safety 101 — تُستخدم في العيادات الشريكة."
                      : "Every Invita session begins with clinical assessment. This checklist — from our Safety 101 guide — is used across partner clinics."}
                  </p>
                </div>
              </header>
            </ScrollReveal>

            <ScrollReveal>
              <ol className="science-checklist">
                {SAFETY_CHECKLIST.map((item) => (
                  <li key={item.en}>{pick(item, isAr)}</li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal>
              <h3 className="science-subtitle">
                {isAr ? "بروتوكولات العيادة" : "Clinic protocols"}
              </h3>
              <div className="science-protocol-grid">
                {CLINIC_PROTOCOLS.map((protocol) => (
                  <article key={protocol.title.en} className="science-protocol-card">
                    <h4>{pick(protocol.title, isAr)}</h4>
                    <p>{pick(protocol.body, isAr)}</p>
                  </article>
                ))}
              </div>
            </ScrollReveal>
          </div>
        )}

        {tab === "nutrients" && (
          <div className="science-nutrients">
            <ScrollReveal>
              <header className="science-section-head">
                <Beaker size={20} aria-hidden="true" />
                <div>
                  <h2>{isAr ? "موسوعة المغذيات" : "Nutrient encyclopedia"}</h2>
                  <p>
                    {isAr
                      ? "المكونات الأساسية في تركيبات Liquivida® — وكيف تدعم أهدافك الصحية."
                      : "Core ingredients in Liquivida® formulations — and how they support your health goals."}
                  </p>
                </div>
              </header>
            </ScrollReveal>

            <div className="science-nutrient-accordion">
              {KEY_NUTRIENTS.map((nutrient, i) => (
                <ScrollReveal key={nutrient.name.en}>
                  <article className="science-nutrient-item">
                    <button
                      type="button"
                      className="science-nutrient-trigger"
                      aria-expanded={openNutrient === i}
                      onClick={() => setOpenNutrient(openNutrient === i ? null : i)}
                    >
                      <span>{pick(nutrient.name, isAr)}</span>
                      <ChevronRight
                        size={18}
                        className={`science-nutrient-chevron${openNutrient === i ? " open" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {openNutrient === i ? (
                      <div className="science-nutrient-body">
                        <p>{pick(nutrient.role, isAr)}</p>
                        <p className="science-nutrient-uses">
                          <strong>{isAr ? "الاستخدامات:" : "Uses:"}</strong>{" "}
                          {pick(nutrient.uses, isAr)}
                        </p>
                      </div>
                    ) : null}
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <ScienceInfographics
              isAr={isAr}
              title={{
                en: "Ingredient visual guides",
                ar: "أدلة المكونات البصرية",
              }}
              topic="beauty"
              limit={4}
            />
          </div>
        )}

        {tab === "resources" && (
          <div className="science-resources">
            <ScrollReveal>
              <header className="science-section-head">
                <BookOpen size={20} aria-hidden="true" />
                <div>
                  <h2>{isAr ? "مكتبة المراجع" : "Resource library"}</h2>
                  <p>
                    {isAr
                      ? "PDFs تعليمية من Invita وLiquivida® — للمرضى والأطباء والشركاء."
                      : "Educational PDFs from Invita and Liquivida® — for patients, physicians, and partners."}
                  </p>
                </div>
              </header>
            </ScrollReveal>

            <div className="science-resource-grid">
              {DOWNLOADABLE_RESOURCES.map((resource) => (
                <ScrollReveal key={resource.id}>
                  <article className="science-resource-card">
                    <span className="science-resource-audience">
                      {pick(resource.audience, isAr)}
                    </span>
                    <h3>{pick(resource.title, isAr)}</h3>
                    <p>{pick(resource.description, isAr)}</p>
                    <div className="science-resource-meta">
                      <span>{resource.size}</span>
                      <span>PDF</span>
                    </div>
                    <a href={resource.file} className="science-resource-download" download>
                      <ArrowDownToLine size={16} aria-hidden="true" />
                      {isAr ? "تحميل" : "Download"}
                    </a>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        <p className="science-disclaimer">{pick(SCIENCE_DISCLAIMER, isAr)}</p>

        <div className="science-bottom-cta">
          <Link href="/book" className="btn-primary">
            {isAr ? "تحدث مع فريقنا الطبي" : "Speak with our medical team"}
          </Link>
          <Link href="/for-clinics" className="btn-secondary">
            {isAr ? "للعيادات والشركاء" : "For clinics & partners"}
          </Link>
        </div>
      </div>
    </>
  );
}
