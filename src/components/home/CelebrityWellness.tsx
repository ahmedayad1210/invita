"use client";

import Section from "@/components/patterns/Section";
import PageHeader from "@/components/patterns/PageHeader";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import MediaImage from "@/components/patterns/MediaImage";
import { CELEBRITY_CLIENTS } from "@/lib/invita/celebrities";
import { useLocale } from "@/contexts/LocaleContext";

const SPOTLIGHT_COUNT = 5;

export default function CelebrityWellness() {
  const { t } = useLocale();
  const clients = CELEBRITY_CLIENTS.filter((client) => client.image);
  const slots =
    clients.length > 0
      ? clients
      : Array.from({ length: SPOTLIGHT_COUNT }, (_, index) => ({
          id: `spotlight-${index + 1}`,
          name: "",
          handle: "",
          image: "",
        }));

  return (
    <Section variant="sm" className="celebrity-wellness">
      <ScrollReveal>
        <PageHeader
          eyebrow={t.celebrity.eyebrow}
          title={t.celebrity.title}
          lead={t.celebrity.lead}
        />
        <div className="celebrity-wellness-track" role="list" aria-label={t.celebrity.title}>
          {slots.map((client) => (
            <article key={client.id} className="celebrity-wellness-tile" role="listitem">
              {client.image ? (
                <MediaImage
                  src={client.image}
                  alt={`${client.name} receiving IV drip therapy`}
                  variant="portrait"
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                  frameClassName="celebrity-wellness-frame"
                />
              ) : (
                <div
                  className="celebrity-wellness-photo"
                  aria-hidden="true"
                  role="presentation"
                />
              )}
              {client.name ? (
                <>
                  <p className="celebrity-wellness-name">{client.name}</p>
                  {client.handle ? (
                    <p className="celebrity-wellness-handle">{client.handle}</p>
                  ) : null}
                </>
              ) : null}
            </article>
          ))}
        </div>
        <p className="celebrity-wellness-note">{t.celebrity.note}</p>
      </ScrollReveal>
    </Section>
  );
}
