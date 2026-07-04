"use client";

import ScrollReveal from "@/components/patterns/ScrollReveal";
import type { TimelineMilestone } from "@/lib/invita/certifications";

type Props = {
  milestones: TimelineMilestone[];
  locale: "en" | "ar";
};

function formatMilestoneDate(
  milestone: TimelineMilestone,
  locale: "en" | "ar"
): string {
  if (milestone.date) {
    try {
      return new Date(milestone.date).toLocaleDateString(
        locale === "ar" ? "ar-IQ" : "en-GB",
        { year: "numeric", month: "long" }
      );
    } catch {
      return milestone.date;
    }
  }
  return locale === "ar" ? milestone.dateLabelAr : milestone.dateLabelEn;
}

export default function TrustTimeline({ milestones, locale }: Props) {
  const isAr = locale === "ar";

  return (
    <div className="trust-timeline">
      <ScrollReveal>
        <header className="trust-timeline-header">
          <h3 className="trust-timeline-title">
            {isAr ? "مسيرة الثقة" : "Trust timeline"}
          </h3>
          <p className="trust-timeline-lead">
            {isAr
              ? "معالم رئيسية في بناء شركة العلاج الوريدي الرائدة في العراق."
              : "Key milestones in building Iraq's leading IV therapy company."}
          </p>
        </header>
      </ScrollReveal>

      <ol className="trust-timeline-track" role="list">
        {milestones.map((milestone, index) => (
          <ScrollReveal key={milestone.id}>
            <li
              className={`trust-timeline-item${milestone.completed ? " trust-timeline-item--completed" : " trust-timeline-item--upcoming"}`}
              role="listitem"
            >
              <span className="trust-timeline-marker" aria-hidden="true">
                <span className="trust-timeline-dot" />
                {index < milestones.length - 1 ? (
                  <span className="trust-timeline-line" />
                ) : null}
              </span>
              <div className="trust-timeline-content">
                <time className="trust-timeline-date" dateTime={milestone.date ?? undefined}>
                  {formatMilestoneDate(milestone, locale)}
                </time>
                <h4 className="trust-timeline-milestone-title">
                  {isAr ? milestone.titleAr : milestone.titleEn}
                </h4>
                <p className="trust-timeline-desc">
                  {isAr ? milestone.descriptionAr : milestone.descriptionEn}
                </p>
              </div>
            </li>
          </ScrollReveal>
        ))}
      </ol>
    </div>
  );
}
