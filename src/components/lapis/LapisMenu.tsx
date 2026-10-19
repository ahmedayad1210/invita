"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CELEBS,
  DRIPS,
  GOALS,
  IG_POSTS,
  TIERS,
  dripArt,
  dripHref,
  whatsappWithText,
  type DripTier,
  type LapisDrip,
} from "@/data/lapis-home";
import { INVITA } from "@/lib/constants";
import { Kicker, Section, Stars, useLapis } from "./shared";

/** WhatsApp deep link for a specific drip, in the active language. */
function useBookDrip() {
  const { l } = useLapis();
  return (d: LapisDrip) => whatsappWithText(l.bookMsg.replace("{name}", d.name));
}

export function DripMenu() {
  const { l, ar, arrow, fmtPrice } = useLapis();
  const bookHref = useBookDrip();
  const [tier, setTier] = useState<DripTier | "all">("all");
  const drips = tier === "all" ? DRIPS : DRIPS.filter((d) => d.tier === tier);
  const opts: { id: DripTier | "all"; label: string }[] = [
    { id: "all", label: l.menu.all },
    ...TIERS.map((id) => ({ id, label: l.tiers[id] })),
  ];

  return (
    <Section id="menu" label={l.menu.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad">
          <div className="lb-head-row">
            <div>
              <Kicker>{l.menu.kicker}</Kicker>
              <h2>{l.menu.title}</h2>
              <p className="lb-lead">{l.menu.lead}</p>
            </div>
            <div className="lb-seg" role="group" aria-label={l.menu.filterLabel}>
              {opts.map((o) => (
                <button key={o.id} type="button" aria-pressed={tier === o.id} onClick={() => setTier(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lb-menu-grid">
            {drips.map((d) => {
              const loc = ar ? d.ar : d.en;
              const art = dripArt(d.slug);
              const href = dripHref(d.slug);
              return (
                <article key={d.slug} className="lb-card">
                  <Link href={href} className={`lb-drip-art${art.contain ? " contain" : ""}`} tabIndex={-1} aria-hidden="true">
                    <Image src={art.src} alt="" fill sizes="(max-width: 640px) 100vw, 300px" loading="lazy" />
                    <span className="lb-tier">{l.tiers[d.tier]}</span>
                  </Link>
                  <div className="lb-card-body">
                    <div className="lb-card-top">
                      <h3><Link href={href}>{d.name}</Link></h3>
                      <span className="lb-price">{fmtPrice(d.price)}</span>
                    </div>
                    <p className="lb-card-tag">{loc.tag} · {d.min} {l.minutes}</p>
                    <p className="lb-card-desc">{loc.desc}</p>
                    <div className="lb-card-cta">
                      <a href={bookHref(d)} target="_blank" rel="noopener" className="lb-btn lb-btn-ink">
                        {l.menu.book} <span aria-hidden="true">{arrow}</span>
                      </a>
                      <Link href={href} className="lb-link lb-link-underline">
                        {l.menu.details} <span aria-hidden="true">{arrow}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="lb-note" style={{ marginTop: 16 }}>{l.menu.disclaimer}</p>
        </div>
      </div>
    </Section>
  );
}

/** Proof — celebrity carousel (auto-advance 3.5s, pauses on hover/touch), client quotes, Instagram grid. */
export function Proof() {
  const { l, ar } = useLapis();
  const carRef = useRef<HTMLDivElement>(null);
  const hold = useRef(false);

  const scrollBy = (dir: 1 | -1) => {
    const el = carRef.current;
    if (!el) return;
    const fig = el.querySelector("figure");
    const stride = fig ? fig.getBoundingClientRect().width + 18 : 308;
    const perPage = Math.max(1, Math.floor(el.clientWidth / stride));
    // scrollLeft is negative in RTL, so flip the logical direction.
    el.scrollBy({ left: dir * perPage * stride * (ar ? -1 : 1), behavior: "smooth" });
  };

  useEffect(() => {
    const el = carRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;
    const onEnter = () => { hold.current = true; };
    const onLeave = () => { hold.current = false; };
    const onTouch = () => {
      hold.current = true;
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { hold.current = false; }, 6000);
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onEnter);
    el.addEventListener("focusout", onLeave);
    el.addEventListener("touchstart", onTouch, { passive: true });
    const id = setInterval(() => {
      if (hold.current || document.hidden) return;
      const atEnd = Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 12;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: Math.min(320, el.clientWidth * 0.8) * (ar ? -1 : 1), behavior: "smooth" });
    }, 3500);
    return () => {
      clearInterval(id);
      clearTimeout(touchTimer);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onEnter);
      el.removeEventListener("focusout", onLeave);
      el.removeEventListener("touchstart", onTouch);
    };
  }, [ar]);

  return (
    <Section id="celebs" className="lb-panel" label={l.celebs.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad-sm">
          <div className="lb-head-row" style={{ marginBottom: 26 }}>
            <div>
              <Kicker>{l.celebs.kicker}</Kicker>
              <h2>{l.celebs.title}</h2>
              <p className="lb-lead">{l.celebs.lead}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="lb-round" aria-label={l.celebs.prev} onClick={() => scrollBy(-1)}>
                {ar ? "→" : "←"}
              </button>
              <button type="button" className="lb-round ink" aria-label={l.celebs.next} onClick={() => scrollBy(1)}>
                {ar ? "←" : "→"}
              </button>
            </div>
          </div>
          <div className="lb-car" ref={carRef}>
            {CELEBS.map((c) => (
              <figure key={c.handle} className="lb-celeb">
                <div className="lb-celeb-img">
                  <Image src={c.img} alt={c.name} fill sizes="290px" loading="lazy" />
                </div>
                <figcaption>
                  <strong>{c.name}</strong>
                  <span dir="ltr">{c.handle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="lb-note" style={{ marginTop: 10 }}>{l.celebs.note}</p>

          <div className="lb-sub">
            <Kicker>{l.quotes.kicker}</Kicker>
            <h3 className="lb-h3" style={{ marginBottom: 28 }}>{l.quotes.title}</h3>
            <div className="lb-quotes">
              {l.quotes.items.map((q) => (
                <figure key={q.text} className="lb-quote">
                  <Stars label={l.quotes.starsLabel} />
                  <blockquote>{q.text}</blockquote>
                  <figcaption>{q.who}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="lb-sub">
            <div className="lb-head-row" style={{ alignItems: "baseline", marginBottom: 28 }}>
              <div>
                <Kicker>{l.ig.kicker}</Kicker>
                <h3 className="lb-h3">{l.ig.title}</h3>
              </div>
              <a href={INVITA.social.instagram} target="_blank" rel="noopener" className="lb-btn lb-btn-line">
                {l.ig.follow}
              </a>
            </div>
            <div className="lb-ig">
              {IG_POSTS.map((p) => (
                <a key={p.id} href={INVITA.social.instagram} target="_blank" rel="noopener">
                  <Image src={p.src} alt={`${p.name} — Invita Instagram post`} fill sizes="240px" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Matcher() {
  const { l, ar, fmtPrice } = useLapis();
  const bookHref = useBookDrip();
  const [goal, setGoal] = useState<(typeof GOALS)[number]["id"] | null>(null);
  const def = GOALS.find((g) => g.id === goal);
  const matches = def ? def.drips.map((slug) => DRIPS.find((d) => d.slug === slug)!).filter(Boolean) : [];

  return (
    <Section id="matcher" label={l.matcher.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad">
          <Kicker>{l.matcher.kicker}</Kicker>
          <h2>{l.matcher.title}</h2>
          <p className="lb-lead" style={{ marginBottom: 28 }}>{l.matcher.lead}</p>
          <div className="lb-goals">
            {GOALS.map((g) => (
              <button key={g.id} type="button" className="lb-chip" aria-pressed={goal === g.id} onClick={() => setGoal(g.id)}>
                {l.goals[g.id]}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            {def && (
              <div className="lb-rule" style={{ marginTop: 36 }}>
                <p className="lb-book-label" style={{ margin: "20px 0 6px" }}>{l.matcher.resultsTitle}</p>
                {matches.map((d, i) => (
                  <div key={d.slug} className="lb-match">
                    <p className="lb-match-rank">{String(i + 1).padStart(2, "0")}</p>
                    <div>
                      <span className="lb-match-name">{d.name}</span>
                      <span className="lb-muted" style={{ fontSize: 13.5 }}>{(ar ? d.ar : d.en).tag}</span>
                    </div>
                    <div className="lb-match-end">
                      <span className="lb-price">{fmtPrice(d.price)}</span>
                      <a href={bookHref(d)} target="_blank" rel="noopener" className="lb-btn lb-btn-ink">
                        {l.menu.book}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
