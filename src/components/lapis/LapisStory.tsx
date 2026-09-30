"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND, WHATSAPP_URL } from "@/data/lapis-home";
import { Kicker, Section, useLapis } from "./shared";

/**
 * Home film (uploads/vvv.mp4 in the design). The file isn't in the repo yet —
 * drop it at public/media/film/invita-film.mp4 and set this path.
 */
const HOME_FILM_SRC: string | null = null;

export function HowAndVisit() {
  const { l } = useLapis();
  return (
    <Section id="how" className="lb-panel" label={l.how.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad">
          <Kicker>{l.how.kicker}</Kicker>
          <h2 style={{ marginBottom: 24 }}>{l.how.title}</h2>
          <div>
            {l.how.steps.map((st) => (
              <div key={st.n} className="lb-step">
                <p className="lb-step-n">{st.n}</p>
                <div>
                  <h3>{st.title}</h3>
                  <p>{st.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lb-visit">
            <div>
              <Kicker>{l.visit.kicker}</Kicker>
              <h3 className="lb-h3" style={{ marginBottom: 14 }}>{l.visit.title}</h3>
              <p className="lb-lead" style={{ marginBottom: 28, maxWidth: "52ch" }}>{l.visit.copy}</p>
              <div className="lb-visit-row">
                <strong>{l.visit.suiteName}</strong>
                <span>{l.visit.suiteDesc}</span>
              </div>
              <div className="lb-visit-row">
                <strong>{l.visit.homeName}</strong>
                <span>{l.visit.homeDesc}</span>
              </div>
              <p className="lb-note lb-tnum" style={{ marginTop: 16 }}>{l.visit.hours}</p>
            </div>
            <figure className="lb-visit-fig">
              <div>
                <Image src={BRAND.suite} alt={l.visit.suiteName} fill sizes="440px" loading="lazy" style={{ objectPosition: "36% 50%" }} />
                <figcaption>
                  <span className="lb-dot" style={{ width: 7, height: 7 }} aria-hidden="true" />
                  {l.visit.suiteName}
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ScienceTeaser() {
  const { l, arrow } = useLapis();
  return (
    <Section id="science" label={l.science.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad">
          <Kicker>{l.science.kicker}</Kicker>
          <h2>{l.science.title}</h2>
          <p className="lb-lead" style={{ maxWidth: "58ch", marginBottom: 36 }}>{l.science.copy}</p>
          <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 22, marginBottom: 44 }}>
            <div>
              <div className="lb-bar-row">
                <span>{l.science.ivLabel}</span>
                <strong>{l.science.ivVal}</strong>
              </div>
              <div className="lb-bar">
                <div style={{ width: "100%", background: "linear-gradient(90deg,#0D2551,#4A6096)" }} />
              </div>
            </div>
            <div>
              <div className="lb-bar-row">
                <span>{l.science.oralLabel}</span>
                <strong style={{ color: "var(--color-neutral-600)" }}>{l.science.oralVal}</strong>
              </div>
              <div className="lb-bar">
                <div style={{ width: "26%", background: "#93A8D8", animationDelay: ".15s" }} />
              </div>
            </div>
          </div>
          <div className="lb-props">
            {l.science.props.map((p) => (
              <div key={p.n} className="lb-prop lb-card">
                <span className="lb-prop-n">{p.n}</span>
                <h3>{p.t}</h3>
                <p>{p.b}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 28 }}>
            <Link href="/science" className="lb-link" style={{ fontSize: 15 }}>
              {l.science.more} <span aria-hidden="true">{arrow}</span>
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}

export function StandardAndCerts() {
  const { l, arrow } = useLapis();
  const certs = [
    { name: "ISO 13485", body: l.certs.c1, href: BRAND.iso13485 },
    { name: "ISO 14001", body: l.certs.c2, href: BRAND.iso14001 },
  ];
  return (
    <Section id="standard" className="lb-panel" label={l.standard.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad-sm">
          <Kicker>{l.standard.kicker}</Kicker>
          <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)", marginBottom: 24 }}>{l.standard.title}</h2>
          <div className="lb-std">
            {l.standard.items.map((it) => (
              <p key={it}>{it}</p>
            ))}
          </div>
        </div>
        <div className="lb-certs lb-sub">
          <div>
            <Kicker>{l.certs.kicker}</Kicker>
            <h3 className="lb-h3" style={{ marginBottom: 12, maxWidth: "24ch" }}>{l.certs.title}</h3>
            <p className="lb-lead" style={{ maxWidth: "50ch", marginBottom: 22 }}>{l.certs.lead}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="lb-btn lb-btn-ink lb-btn-primary">
              {l.certs.cta}
            </a>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {certs.map((c) => (
              <div key={c.name} className="lb-card lb-cert">
                <span className="lb-cert-badge" aria-hidden="true">ISO</span>
                <div>
                  <h4>{c.name}</h4>
                  <p>{c.body}</p>
                  <a href={c.href} target="_blank" rel="noopener" className="lb-link" style={{ fontWeight: 600 }}>
                    {l.certs.view} <span aria-hidden="true">{arrow}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Films() {
  const { l, arrow } = useLapis();
  const pb = l.partnersFilm;
  return (
    <Section id="film" label={pb.title}>
      <div className="lb-wrap">
        <hr className="lb-hr" />
        <div className="lb-pad-sm">
          <Kicker>{pb.kicker}</Kicker>
          <h2>{pb.title}</h2>
          <p className="lb-lead" style={{ maxWidth: "58ch", marginBottom: 28 }}>{pb.copy}</p>
          <div className="lb-film">
            {HOME_FILM_SRC ? (
              <video src={HOME_FILM_SRC} poster={BRAND.suite} controls playsInline preload="metadata" />
            ) : (
              <Image src="/images/invita/product-still-life.webp" alt="Invita — Liquivida® formulas" fill sizes="(max-width: 1200px) 100vw, 1056px" loading="lazy" />
            )}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/partners" className="lb-btn lb-btn-ink">
              {pb.btn} <span aria-hidden="true">{arrow}</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
