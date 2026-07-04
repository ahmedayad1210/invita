"use client";

import { Shield, Stethoscope, Sparkles, ClipboardCheck } from "lucide-react";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { useLocale } from "@/contexts/LocaleContext";

const ICONS = [Stethoscope, Shield, ClipboardCheck, Sparkles] as const;

export default function TrustCredentials() {
  const { t } = useLocale();

  const items = [
    { label: t.trust.licensed, icon: ICONS[0] },
    { label: t.trust.sterile, icon: ICONS[1] },
    { label: t.trust.supervision, icon: ICONS[2] },
    { label: t.trust.assessment, icon: ICONS[3] },
  ];

  return (
    <section className="trust-credentials section-padding-sm" aria-label="Medical credentials">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center trust-credentials-header">
            <p className="page-eyebrow">{t.trust.liquivida}</p>
            <h2 className="page-title page-title--compact">{t.trust.credentialsTitle}</h2>
            <p className="page-lead page-lead--narrow">{t.trust.credentialsLead}</p>
          </header>
          <ul className="trust-credentials-grid" role="list">
            {items.map(({ label, icon: Icon }) => (
              <li key={label} className="trust-credential-card" role="listitem">
                <span className="trust-credential-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <span className="trust-credential-label">{label}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
