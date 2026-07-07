"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  MATCHER_QUESTIONS,
  topMatcherResults,
} from "@/lib/invita/wellness-matcher";
import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";

export default function WellnessMatcherSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const question = MATCHER_QUESTIONS[step];
  const progress = finished
    ? 100
    : Math.round((step / MATCHER_QUESTIONS.length) * 100);

  const results = useMemo(() => {
    if (!finished) return [];
    return topMatcherResults(answers, 3)
      .map((slug) => getLiquividaDrip(slug))
      .filter(Boolean);
  }, [answers, finished]);

  const pickOption = (optionId: string) => {
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    if (step >= MATCHER_QUESTIONS.length - 1) {
      setFinished(true);
      return;
    }

    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
  };

  return (
    <section className="section-padding wellness-matcher" aria-labelledby="matcher-heading">
      <div className="section-inner wellness-matcher-inner">
        <header className="wellness-matcher-header">
          <p className="page-eyebrow">
            {isAr ? "مطابقة شخصية" : "Personalised matching"}
          </p>
          <h2 id="matcher-heading" className="page-title">
            {isAr ? "أي drip يناسبك؟" : "Which drip fits you?"}
          </h2>
          <p className="page-lead page-lead--narrow">
            {isAr
              ? "اختبار من 5 أسئلة — نوصي ببروتوكول Invita المناسب لأهدافك."
              : "A 5-question quiz — we recommend the Invita protocol that matches your goals."}
          </p>
        </header>

        <div className="wellness-matcher-card">
          <div
            className="wellness-matcher-progress"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          {!finished ? (
            <div className="wellness-matcher-quiz">
              <p className="wellness-matcher-step">
                {isAr
                  ? `السؤال ${step + 1} من ${MATCHER_QUESTIONS.length}`
                  : `Question ${step + 1} of ${MATCHER_QUESTIONS.length}`}
              </p>
              <h3 className="wellness-matcher-question">
                {isAr ? question.questionAr : question.questionEn}
              </h3>
              <ul className="wellness-matcher-options">
                {question.options.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className="wellness-matcher-option"
                      onClick={() => pickOption(option.id)}
                    >
                      {isAr ? option.labelAr : option.labelEn}
                    </button>
                  </li>
                ))}
              </ul>
              {step > 0 && (
                <button
                  type="button"
                  className="wellness-matcher-back"
                  onClick={() => setStep((s) => s - 1)}
                >
                  {isAr ? "← السابق" : "← Back"}
                </button>
              )}
            </div>
          ) : (
            <div className="wellness-matcher-results">
              <div className="wellness-matcher-results-head">
                <Sparkles size={20} aria-hidden="true" />
                <h3>
                  {isAr ? "بروتوكولاتك الموصى بها" : "Your recommended protocols"}
                </h3>
              </div>

              <ul className="wellness-matcher-result-list">
                {results.map((drip, index) => {
                  if (!drip) return null;
                  return (
                    <li key={drip.slug} className="wellness-matcher-result">
                      <div className="wellness-matcher-result-rank">{index + 1}</div>
                      <Image
                        src={getProtocolDripImage(drip.slug, drip.imageSlug) ?? DRIP_IMAGE_FALLBACK}
                        alt=""
                        width={56}
                        height={56}
                        className="wellness-matcher-result-icon"
                      />
                      <div className="wellness-matcher-result-copy">
                        <strong>{drip.name}</strong>
                        <span>{drip.tagline}</span>
                      </div>
                      <Link
                        href={`/book?drip=${drip.slug}`}
                        className="btn-primary btn-sm wellness-matcher-book"
                      >
                        {isAr ? "احجز" : "Book"}
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="wellness-matcher-actions">
                <Link href="/book" className="btn-primary">
                  {isAr ? "ابدأ الاستشارة" : "Start consultation"}
                </Link>
                <button type="button" className="btn-secondary" onClick={restart}>
                  <RotateCcw size={16} aria-hidden="true" />
                  {isAr ? "أعد الاختبار" : "Retake quiz"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
