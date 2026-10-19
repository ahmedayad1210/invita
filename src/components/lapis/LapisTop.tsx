"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, WHATSAPP_BOOK_URL, WHATSAPP_URL } from "@/data/lapis-home";
import { FRAMER_IMAGES } from "@/lib/invita/framer-assets";
import { useLapis } from "./shared";

/** Floating pill nav (Modern layer). */
export function LapisNav() {
  const { l, ar, setLocale } = useLapis();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Mark JS as running (the reveal fallback only hides sections once JS can show them again),
  // and drive the scroll progress bar where scroll-driven animations aren't supported.
  useEffect(() => {
    const root = navRef.current?.closest(".lb");
    root?.classList.add("lb-js");
    if (CSS.supports("animation-timeline: scroll()")) return;
    const bar = root?.querySelector<HTMLElement>(".lb-prog");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  const links = [
    { href: "/iv-therapy", label: l.nav.menu },
    { href: "/science", label: l.nav.science },
    { href: "#clinics", label: l.nav.clinics },
    { href: "/partners", label: l.nav.partners },
  ];

  return (
    <nav ref={navRef} className="lb-nav" aria-label="Main">
      <Link href="/" className="lb-nav-brand" aria-label="Invita — IV Vitamins Therapy">
        <Image src={BRAND.mark} alt="" width={34} height={34} style={{ height: 34, width: "auto" }} priority />
        <Image src={BRAND.wordmark} alt="Invita" width={96} height={19} style={{ height: 19, width: "auto" }} priority />
      </Link>
      {links.map((ln) => (
        <Link key={ln.href} href={ln.href} className="lb-nav-link lb-hide-m">
          {ln.label}
        </Link>
      ))}
      <button
        type="button"
        className="lb-btn lb-btn-line"
        onClick={() => setLocale(ar ? "en" : "ar")}
        aria-label="Switch language"
        lang={ar ? "en" : "ar"}
      >
        {l.langLabel}
      </button>
      <a href={WHATSAPP_BOOK_URL} target="_blank" rel="noopener" className="lb-btn lb-btn-ink lb-btn-primary lb-hide-m">
        {l.nav.book}
      </a>
      <button
        type="button"
        className="lb-nav-toggle"
        aria-expanded={open}
        aria-controls="lb-nav-drop"
        aria-label={l.menuBtn}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div id="lb-nav-drop" className="lb-nav-drop">
          {links.map((ln) => (
            <Link key={ln.href} href={ln.href} onClick={() => setOpen(false)}>
              {ln.label}
            </Link>
          ))}
          <a href={WHATSAPP_BOOK_URL} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
            {l.nav.book}
          </a>
        </div>
      )}
    </nav>
  );
}

export function LapisHero({ bannerUrl, bannerAlt }: { bannerUrl?: string | null; bannerAlt?: string | null }) {
  const { l, arrow } = useLapis();
  const src = bannerUrl ?? FRAMER_IMAGES.clinicHero ?? BRAND.hero;
  const delay = (s: number) => ({ animationDelay: `${s}s` });

  return (
    <header className="lb-hero">
      <div className="lb-hero-media" aria-hidden="true">
        <Image
          src={src}
          alt={bannerAlt ?? ""}
          fill
          priority
          sizes="100vw"
          unoptimized={Boolean(bannerUrl?.startsWith("http"))}
        />
        <div className="lb-hero-shade" />
        <div className="lb-hero-floor" />
      </div>
      <div className="lb-hero-body">
        <p className="lb-hero-badge lb-rise">{l.hero.badge}</p>
        <h1>
          <span className="lb-rise" style={delay(0.12)}>{l.hero.l1}</span>
          <span className="lb-rise" style={delay(0.28)}>{l.hero.l2}</span>
        </h1>
        <p className="lb-hero-sub lb-rise" style={delay(0.42)}>{l.hero.sub}</p>
        <div className="lb-hero-ctas lb-rise" style={delay(0.54)}>
          <a href={WHATSAPP_BOOK_URL} target="_blank" rel="noopener" className="lb-btn lb-btn-lg lb-btn-gold lb-btn-primary">
            {l.hero.ctaBook}
          </a>
          <a href="#menu" className="lb-btn lb-btn-lg lb-btn-glass">
            {l.hero.ctaMenu} <span aria-hidden="true">{arrow}</span>
          </a>
          <a href="#clinics" className="lb-btn lb-btn-lg lb-btn-quiet">
            {l.hero.ctaClinics}
          </a>
        </div>
        <p className="lb-hero-from lb-rise" style={delay(0.62)}>
          {l.hero.fromLine}{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            <span dir="ltr">+964 774 888 5559</span>
          </a>
        </p>
      </div>
      <div className="lb-hero-tags lb-rise" style={delay(0.72)}>
        {l.hero.tags.map((tag) => (
          <span key={tag} className="lb-hero-tag">{tag}</span>
        ))}
      </div>
      <div className="lb-hero-cue" aria-hidden="true"><span /></div>
    </header>
  );
}

export function TrustStrip() {
  const { l } = useLapis();
  return (
    <section className="lb-trust" aria-label={l.trust.title}>
      <div className="lb-wrap lb-trust-in">
        <div style={{ flex: 1, minWidth: 260 }}>
          <p className="lb-trust-title">{l.trust.title}</p>
          <p className="lb-note" style={{ fontSize: 13.5, marginTop: 6, maxWidth: "58ch" }}>{l.trust.sub}</p>
        </div>
        <div className="lb-trust-badges">
          <span className="lb-trust-badge">American IV Association</span>
          <span className="lb-trust-badge">KMCA</span>
          <span className="lb-trust-badge">{l.trust.liqui}</span>
        </div>
      </div>
    </section>
  );
}

/** Pink October awareness strip (shown only while the campaign is active). */
export function AwarenessStrip() {
  const { l } = useLapis();
  return (
    <aside className="lb-aware" aria-label={l.pink.label}>
      <svg viewBox="0 0 16 22" aria-hidden="true">
        <path
          d="M8 1.5c2.3 0 3.6 1.7 3.6 3.6 0 1.6-.8 3.2-2.1 5.1l5 9.3-2.6 1.1L8 12.9 4.1 20.6 1.5 19.5l5-9.3C5.2 8.3 4.4 6.7 4.4 5.1 4.4 3.2 5.7 1.5 8 1.5Zm0 2.4c-.8 0-1.3.6-1.3 1.3 0 .8.5 1.9 1.3 3.2.8-1.3 1.3-2.4 1.3-3.2 0-.7-.5-1.3-1.3-1.3Z"
          fill="#E0709B"
        />
      </svg>
      <p><strong>{l.pink.label}.</strong> {l.pink.body}</p>
    </aside>
  );
}
