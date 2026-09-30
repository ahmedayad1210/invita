"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";

/** Home copy (Lapis & Bone) for the active locale. */
export function useLapis() {
  const { t, locale, setLocale, dir } = useLocale();
  const ar = locale === "ar";
  return {
    l: t.lapis,
    ar,
    locale,
    setLocale,
    dir,
    arrow: ar ? "←" : "→",
    fmtPrice: (n: number) => `${n.toLocaleString("en-US")} ${t.lapis.currency}`,
  };
}

/**
 * Section reveal. Browsers with scroll-driven animations get it from CSS;
 * the rest get an IntersectionObserver that adds .is-in.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (CSS.supports("animation-timeline: view()") || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Section with the standard reveal + container. */
export function Section({
  id,
  className = "",
  children,
  label,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  label: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id={id} className={className} aria-label={label}>
      <div ref={ref} className="lb-reveal">
        {children}
      </div>
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="lb-kicker">{children}</p>;
}

/** Infinite horizontal marquee — the track is duplicated so it loops seamlessly. */
export function Marquee({
  children,
  duration,
  className = "",
  fades = false,
}: {
  children: ReactNode;
  duration: number;
  className?: string;
  fades?: boolean;
}) {
  return (
    <div className={`lb-marquee ${className}`} dir="ltr">
      <div className="lb-marquee-track" style={{ ["--lb-marquee-dur" as string]: `${duration}s` }}>
        {children}
        <div aria-hidden="true" style={{ display: "contents" }}>
          {children}
        </div>
      </div>
      {fades && (
        <>
          <div aria-hidden="true" className="lb-marquee-fade start" />
          <div aria-hidden="true" className="lb-marquee-fade end" />
        </>
      )}
    </div>
  );
}

export function Stars() {
  return (
    <div className="lb-stars" role="img" aria-label="5-star review">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} />
      ))}
    </div>
  );
}
