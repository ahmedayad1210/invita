"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BRAND,
  DRIPS,
  WHATSAPP_BOOK_URL,
  WHATSAPP_URL,
  whatsappWithText,
} from "@/data/lapis-home";
import { INVITA } from "@/lib/constants";
import { Kicker, Section, useLapis } from "./shared";

const SLOTS = ["09:00", "09:30", "10:00", "11:00", "12:00", "13:00", "16:00", "16:30", "17:00", "18:00", "19:00", "19:30"];

type Loc = "suite" | "home";

/** Concierge booking — four steps; confirming composes a WhatsApp message (no backend). */
export function Booking() {
  const { l, ar, arrow, fmtPrice } = useLapis();
  const b = l.booking;
  const topRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [drip, setDrip] = useState<string | null>(null);
  const [loc, setLoc] = useState<Loc | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  const go = (n: number) => {
    setStep(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sel = DRIPS.find((d) => d.slug === drip);
  const locs = [
    { id: "suite" as const, title: l.visit.suiteName, sub: l.visit.suiteDesc },
    { id: "home" as const, title: l.visit.homeName, sub: l.visit.homeDesc },
  ];
  const locSel = locs.find((x) => x.id === loc);
  const dateLocale = ar ? "ar-IQ" : "en-GB";
  const days = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date();
    dt.setDate(dt.getDate() + i + 1);
    dt.setHours(12, 0, 0, 0);
    return dt;
  });
  const dayNum = day ? new Date(day).getDate() : 0;
  const cantSchedule = !(loc && day && time);
  const when = day
    ? `${new Intl.DateTimeFormat(dateLocale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(day))} · ${time ?? ""}`
    : "";

  const summary = [
    { k: b.refL, v: ref ?? "" },
    { k: b.sumProtocol, v: sel?.name ?? "" },
    { k: b.sumWhere, v: locSel?.title ?? "" },
    { k: b.sumWhen, v: when },
    { k: b.sumName, v: name },
  ];
  const message = [
    `${b.kicker} · ${ref ?? ""}`,
    ...summary.slice(1).map((r) => `${r.k}: ${r.v}`),
    `${b.phoneL}: ${phone}`,
    note.trim() ? `${b.noteL}: ${note.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const confirmedHref = whatsappWithText(message);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const digits = (phone.match(/\d/g) ?? []).length;
    if (!name.trim() || digits < 9) {
      setErr(true);
      return;
    }
    setErr(false);
    setRef(`INV-${1000 + Math.floor(Math.random() * 9000)}`);
    go(4);
  };

  const reset = () => {
    setStep(1); setDrip(null); setLoc(null); setDay(null); setTime(null);
    setName(""); setPhone(""); setNote(""); setRef(null); setErr(false);
  };

  return (
    <Section id="book" className="lb-panel" label={b.title}>
      <div className="lb-wrap" ref={topRef} style={{ scrollMarginTop: 96 }}>
        <hr className="lb-hr" />
        <div className="lb-pad">
          <Kicker>{b.kicker}</Kicker>
          <h2>{b.title}</h2>
          <p className="lb-lead" style={{ maxWidth: "58ch", marginBottom: 32 }}>{b.lead}</p>
          <div className="lb-book">
            <div className="lb-book-rail">
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {b.steps.map((label, i) => {
                const n = i + 1;
                return (
                  <li key={label} className={`lb-rail-step${step >= n ? " on" : ""}${step === n ? " current" : ""}`} aria-current={step === n ? "step" : undefined}>
                    <span className="lb-rail-num">0{n}</span>
                    <span className="lb-rail-label">{label}</span>
                  </li>
                );
              })}
            </ol>
              <p className="lb-note" style={{ fontSize: 12, marginTop: 18 }}>{b.trust}</p>
            </div>
            <div className="lb-book-main" aria-live="polite">
              {step === 1 && (
                <>
                  <h3>{b.chooseTitle}</h3>
                  <div className="lb-opts" style={{ gap: 10 }}>
                    {DRIPS.map((d) => (
                      <button
                        key={d.slug}
                        type="button"
                        className="lb-chip"
                        style={{ whiteSpace: "normal", textAlign: "start" }}
                        aria-pressed={drip === d.slug}
                        onClick={() => { setDrip(d.slug); go(2); }}
                      >
                        <bdi>{d.name}</bdi> · <bdi className="lb-tnum">{fmtPrice(d.price)}</bdi>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline", flexWrap: "wrap", marginBottom: 18 }}>
                    <h3 style={{ margin: 0 }}>{sel ? `${sel.name} — ${fmtPrice(sel.price)}` : ""}</h3>
                    <button type="button" className="lb-btn lb-btn-line" onClick={() => go(1)}>{b.change}</button>
                  </div>
                  <p className="lb-book-label">{b.locTitle}</p>
                  <div className="lb-locs">
                    {locs.map((x) => (
                      <button key={x.id} type="button" className="lb-opt" aria-pressed={loc === x.id} onClick={() => setLoc(x.id)}>
                        <strong>{x.title}</strong>
                        <small>{x.sub}</small>
                      </button>
                    ))}
                  </div>
                  <p className="lb-book-label">{b.dateTitle}</p>
                  <div className="lb-opts">
                    {days.map((dt) => {
                      const ts = dt.getTime();
                      return (
                        <button key={ts} type="button" className="lb-opt lb-day" aria-pressed={day === ts} onClick={() => { setDay(ts); setTime(null); }}>
                          <small>{new Intl.DateTimeFormat(dateLocale, { weekday: "short" }).format(dt)}</small>
                          <strong>{dt.getDate()}</strong>
                        </button>
                      );
                    })}
                  </div>
                  <p className="lb-book-label">{b.timeTitle}</p>
                  <div className="lb-opts" style={{ marginBottom: 28 }}>
                    {SLOTS.map((s, i) => {
                      // Two slots per day are shown as taken, as in the design.
                      const off = !day || i === (dayNum * 5) % 12 || i === (dayNum * 5 + 4) % 12;
                      return (
                        <button key={s} type="button" className="lb-chip lb-tnum" disabled={off} aria-pressed={time === s} onClick={() => setTime(s)}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" className="lb-btn lb-btn-ink" disabled={cantSchedule} onClick={() => go(3)}>
                    {b.continue} <span aria-hidden="true">{arrow}</span>
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <h3>{b.detailsTitle}</h3>
                  <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 460 }}>
                    <div className="lb-field">
                      <label htmlFor="bk-name">{b.nameL} <span aria-hidden="true">*</span></label>
                      <input id="bk-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required aria-required="true" autoComplete="name" />
                    </div>
                    <div className="lb-field">
                      <label htmlFor="bk-phone">{b.phoneL} <span aria-hidden="true">*</span></label>
                      <input
                        id="bk-phone"
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        aria-required="true"
                        aria-invalid={err || undefined}
                        aria-describedby={err ? "bk-err" : undefined}
                        autoComplete="tel"
                        placeholder="+964 7XX XXX XXXX"
                      />
                    </div>
                    <div className="lb-field">
                      <label htmlFor="bk-note">{b.noteL}</label>
                      <textarea id="bk-note" value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>
                    {err && <p id="bk-err" role="alert" className="lb-err">{b.err}</p>}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <button type="submit" className="lb-btn lb-btn-ink">{b.confirm}</button>
                      <button type="button" className="lb-btn lb-btn-line" onClick={() => { setErr(false); go(2); }}>{b.back}</button>
                    </div>
                  </form>
                </>
              )}

              {step === 4 && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <span className="lb-check" aria-hidden="true">✓</span>
                    <h3 style={{ fontSize: 24, margin: 0 }}>{b.confTitle}</h3>
                  </div>
                  <p className="lb-lead" style={{ fontSize: 15, maxWidth: "52ch", marginBottom: 20 }}>{b.confBody}</p>
                  <div className="lb-sum">
                    {summary.map((r) => (
                      <div key={r.k}>
                        <span>{r.k}</span>
                        <strong>{r.v}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                    <a href={confirmedHref} target="_blank" rel="noopener" className="lb-btn lb-btn-ink lb-btn-primary">{b.whatsapp}</a>
                    <button type="button" className="lb-btn lb-btn-line" onClick={reset}>{b.again}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ClinicsB2B() {
  const { l } = useLapis();
  return (
    <Section id="clinics" className="lb-b2b" label={l.b2b.title}>
      <div className="lb-wrap lb-pad lb-b2b-grid">
        <div>
          <Kicker>{l.b2b.kicker}</Kicker>
          <h2 style={{ fontSize: "clamp(28px,3.4vw,42px)" }}>{l.b2b.title}</h2>
          <p className="lb-lead" style={{ maxWidth: "54ch", marginBottom: 24 }}>{l.b2b.copy}</p>
          <p className="lb-b2b-stat">{l.b2b.stat}</p>
          <p className="lb-muted" style={{ fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", margin: "10px 0 28px", maxWidth: "30ch" }}>{l.b2b.statL}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/partners" className="lb-btn lb-btn-ink lb-btn-primary">{l.b2b.cta}</Link>
            <a href="mailto:info@invitadrips.com" className="lb-btn lb-btn-line">{l.b2b.cta2}</a>
          </div>
        </div>
        <div>
          {l.b2b.points.map((p) => (
            <div key={p.t} className="lb-b2b-point">
              <h3><span className="lb-dot" aria-hidden="true" />{p.t}</h3>
              <p>{p.b}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function MembershipDna() {
  const { l, arrow } = useLapis();
  return (
    <Section id="membership" className="lb-panel" label={l.membership.title}>
      <div className="lb-wrap">
        <div style={{ padding: "clamp(48px,6vw,88px) 0 clamp(32px,4vw,56px)" }}>
          <Kicker>{l.membership.kicker}</Kicker>
          <h2 style={{ marginBottom: 28 }}>{l.membership.title}</h2>
          <div className="lb-tiers">
            {l.membership.tiers.map((m) => (
              <div key={m.name} className={`lb-tier-card${m.tag ? " featured" : ""}`}>
                <header>
                  <h3>{m.name}</h3>
                  {m.tag && <span className="lb-tier-tag">{m.tag}</span>}
                </header>
                <p className="lb-price" style={{ fontSize: 19, margin: "6px 0 14px" }}>{m.price}</p>
                {m.perks.map((pk) => (
                  <p key={pk} className="lb-perk">
                    <span className="lb-dot" style={{ width: 7, height: 7 }} aria-hidden="true" />
                    <span>{pk}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="lb-btn lb-btn-line">
              {l.membership.cta} <span aria-hidden="true">{arrow}</span>
            </a>
          </div>
        </div>
        <div className="lb-dna">
          <p className="lb-kicker" style={{ margin: 0, flex: "none" }}>{l.dna.kicker}</p>
          <p className="lb-lead" style={{ fontSize: 15, maxWidth: "52ch" }}>
            <strong style={{ color: "var(--lb-text)" }}>{l.dna.title}</strong> {l.dna.copy}
          </p>
          <Link href="/dna" className="lb-link" style={{ fontWeight: 600 }}>
            {l.dna.link} <span aria-hidden="true">{arrow}</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}

export function Faq() {
  const { l } = useLapis();
  return (
    <Section id="faq" label={l.faq.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad">
          <Kicker>{l.faq.kicker}</Kicker>
          <h2 style={{ marginBottom: 24 }}>{l.faq.title}</h2>
          <div className="lb-faq">
            {l.faq.items.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function PosterClose() {
  const { l } = useLapis();
  return (
    <section className="lb-poster" aria-label={`${l.close.l1} ${l.close.l2}`}>
      <div aria-hidden="true" className="lb-band-mark" style={{ backgroundImage: `url('${BRAND.mark}')` }} />
      <div className="lb-wrap" style={{ position: "relative", paddingBlock: "clamp(56px,7vw,96px)" }}>
        <Image src={BRAND.mark} alt="" width={84} height={84} style={{ height: "clamp(56px,7vw,84px)", width: "auto", marginBottom: 30 }} />
        <h2>
          <span>{l.close.l1}</span>
          <span>{l.close.l2}</span>
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
          <a href={WHATSAPP_BOOK_URL} target="_blank" rel="noopener" className="lb-btn lb-btn-ghost">{l.close.ctaBook}</a>
          <a href="#clinics" className="lb-btn lb-btn-ghost">{l.close.ctaPartner}</a>
        </div>
      </div>
    </section>
  );
}

export function LapisFooter() {
  const { l } = useLapis();
  const f = l.footer;
  return (
    <footer className="lb-foot">
      <div className="lb-wrap" style={{ padding: "clamp(44px,5vw,72px) var(--lb-gutter) 32px" }}>
        <div className="lb-foot-grid">
          <div>
            <p style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Image src={BRAND.mark} alt="" width={30} height={30} style={{ height: 30, width: "auto" }} />
              <Image src={BRAND.wordmark} alt="Invita" width={86} height={17} style={{ height: 17, width: "auto" }} />
            </p>
            <p className="lb-muted" style={{ fontSize: 13.5, marginBottom: 14 }}>{f.tagline}</p>
            <p className="lb-note" style={{ fontSize: 12, maxWidth: "36ch" }}>{f.disclaimer}</p>
          </div>
          <div>
            <h6>{f.contact}</h6>
            <p><a href="tel:+9647748885559"><span dir="ltr">+964 774 888 5559</span></a></p>
            <p><a href="mailto:info@invitadrips.com">info@invitadrips.com</a></p>
            <p><a href={INVITA.social.instagram} target="_blank" rel="noopener" dir="ltr">@invita_iv_drips</a></p>
            <p className="lb-muted">{f.address}</p>
          </div>
          <div>
            <h6>{f.hours}</h6>
            <p className="lb-muted lb-tnum" style={{ fontSize: 13.5, lineHeight: 1.9 }}>
              {f.hoursLines.split(" — ").map((line) => (
                <span key={line} style={{ display: "block" }}>{line}</span>
              ))}
            </p>
          </div>
          <div>
            <h6>{f.explore}</h6>
            {f.links.map((ln) => {
              const href = ln.href === "whatsapp" ? WHATSAPP_BOOK_URL : ln.href;
              const external = href.startsWith("http");
              return (
                <p key={ln.label} style={{ marginBottom: 8 }}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener">{ln.label}</a>
                  ) : (
                    <Link href={href}>{ln.label}</Link>
                  )}
                </p>
              );
            })}
          </div>
        </div>
        <hr className="lb-hr" style={{ margin: "36px 0 16px" }} />
        <p className="lb-note">{f.copyright}</p>
      </div>
    </footer>
  );
}
