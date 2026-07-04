"use client";

import Section from "@/components/patterns/Section";
import PageHeader from "@/components/patterns/PageHeader";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import MediaImage from "@/components/patterns/MediaImage";
import { CELEBRITY_CLIENTS } from "@/lib/invita/celebrities";
import { useLocale } from "@/contexts/LocaleContext";

export default function CelebrityWellness() {
  const { t } = useLocale();

  return (
    <Section variant="sm" className="celebrity-wellness">
      <ScrollReveal>
        <PageHeader
          eyebrow={t.celebrity.eyebrow}
          title={t.celebrity.title}
          lead={t.celebrity.lead}
        />
        <div className="celebrity-wellness-track" role="list" aria-label={t.celebrity.title}>
          {CELEBRITY_CLIENTS.map((client) => (
            <article key={client.id} className="celebrity-wellness-tile" role="listitem">
              <MediaImage
                src={client.image}
                alt={`${client.name} receiving IV drip therapy`}
                variant="portrait"
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                frameClassName="celebrity-wellness-frame"
              />
              <p className="celebrity-wellness-name">{client.name}</p>
              <p className="celebrity-wellness-handle">{client.handle}</p>
            </article>
          ))}
        </div>
        <p className="celebrity-wellness-note">{t.celebrity.note}</p>
      </ScrollReveal>
    </Section>
  );
}
