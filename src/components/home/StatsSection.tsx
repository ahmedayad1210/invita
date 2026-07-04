"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { COMPANY_STATS, type StatItem } from "@/lib/invita/brand-trust";
import { useLocale } from "@/contexts/LocaleContext";

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) return;

    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

function StatCard({ stat, active }: { stat: StatItem; active: boolean }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const count = useCountUp(stat.value, active && !stat.displayText);

  const display = stat.displayText
    ? isAr
      ? stat.displayText.ar
      : stat.displayText.en
    : `${stat.prefix ?? ""}${count.toLocaleString()}${stat.suffix ?? ""}`;

  return (
    <div className="stat-card">
      <p className="stat-value">{display}</p>
      <p className="stat-label">{isAr ? stat.labelAr : stat.labelEn}</p>
    </div>
  );
}

export default function StatsSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setActive(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section section-padding-sm" ref={ref}>
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center stats-header">
            <p className="page-eyebrow">{isAr ? "بالأرقام" : "By the numbers"}</p>
            <h2 className="page-title page-title--compact">
              {isAr ? "شبكة صحية تنمو" : "A growing healthcare network"}
            </h2>
          </header>
        </ScrollReveal>
        <div className="stats-grid">
          {COMPANY_STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
