"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import Image from "next/image";
import { BRAND, DOCTOR_PHOTOS, DOCTOR_REELS } from "@/data/lapis-home";
import { Kicker, Marquee, useLapis } from "./shared";

function BandMark() {
  return <div aria-hidden="true" className="lb-band-mark" style={{ backgroundImage: `url('${BRAND.markGold}')` }} />;
}

/** Doctors of Baghdad — Arabic heading in both locales (as designed), photo marquee, 4 reels. */
export function DoctorsBand() {
  const { l } = useLapis();
  const reelsRef = useRef<HTMLDivElement>(null);

  // Autoplay muted reels only while on screen.
  useEffect(() => {
    const root = reelsRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos = Array.from(root.querySelectorAll("video"));
    if (reduce || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (v.muted) v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 },
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  // Playing one reel with sound pauses the others.
  const onPlay = (e: SyntheticEvent<HTMLVideoElement>) => {
    const current = e.currentTarget;
    document.querySelectorAll("video").forEach((v) => {
      if (v !== current && !v.muted) v.pause();
    });
    if (!current.muted) {
      document.querySelectorAll<HTMLVideoElement>(".lb-reel video").forEach((v) => {
        if (v !== current) v.pause();
      });
    }
  };

  return (
    <section className="lb-band" aria-label={l.doctors.title + " " + l.doctors.titleEm}>
      <BandMark />
      <div className="lb-wrap lb-doc-head" dir="rtl" lang="ar">
        <p className="lb-doc-kicker">
          <i aria-hidden="true" />
          {l.doctors.kicker}
          <i aria-hidden="true" />
        </p>
        <h2>
          {l.doctors.title} <span className="lb-gold">{l.doctors.titleEm}</span>
        </h2>
        <p className="lb-doc-lead">{l.doctors.lead}</p>
      </div>
      <Marquee duration={80} fades className="lb-doc-photos">
        {DOCTOR_PHOTOS.map((src) => (
          <div key={src} className="lb-doc-photo">
            <Image src={src} alt="طبيب معتمد — Invita" fill sizes="300px" loading="lazy" />
          </div>
        ))}
      </Marquee>
      <div className="lb-wrap">
        <div className="lb-reels-head">
          <i aria-hidden="true" />
          <p>{l.docExp.kicker}</p>
          <i aria-hidden="true" />
        </div>
        <div className="lb-reels" ref={reelsRef}>
          {DOCTOR_REELS.map((r) => (
            <div key={r.src} className="lb-reel">
              <video
                src={r.src}
                poster={r.poster}
                muted
                loop
                playsInline
                controls
                preload="metadata"
                onPlay={onPlay}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhatYouGet() {
  const { l } = useLapis();
  return (
    <section className="lb-get" aria-label={l.get[0]?.t}>
      <div className="lb-wrap lb-get-grid">
        {l.get.map((g) => (
          <div key={g.t} className="lb-get-item">
            <span className="lb-dot" aria-hidden="true" />
            <div>
              <strong>{g.t}</strong>
              <span>{g.b}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function UseCaseTicker() {
  const { l } = useLapis();
  return (
    <div className="lb-ticker" aria-hidden="true">
      <Marquee duration={48}>
        {l.ticker.map((u) => (
          <span key={u} className="lb-ticker-item">
            <span className="lb-dot" style={{ width: 6, height: 6 }} />
            {u}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

const STAT_NUMS = [null, 37, 5000, 12] as const;

/** Stats — count up the first time the band scrolls into view. */
export function StatsBand() {
  const { l } = useLapis();
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") {
      setP(1);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min((now - t0) / 1500, 1);
          setP(Math.round((1 - Math.pow(1 - k, 3)) * 24) / 24);
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className="lb-band" aria-label={l.stats.kicker}>
      <BandMark />
      <div className="lb-wrap lb-pad-sm">
        <Kicker>{l.stats.kicker}</Kicker>
        <div className="lb-stats-grid">
          {l.stats.labels.map((label, i) => {
            const n = STAT_NUMS[i];
            const val = n == null ? l.first : `${Math.round(n * p).toLocaleString("en-US")}+`;
            return (
              <div key={label} className="lb-stat">
                <p className="lb-stat-val lb-tnum">{val}</p>
                <p className="lb-stat-label">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
