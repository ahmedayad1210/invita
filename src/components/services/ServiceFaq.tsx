"use client";

import { useState } from "react";
import type { ServiceFaqItem } from "@/lib/invita/service-landings";

type Props = {
  items: ServiceFaqItem[];
  heading?: string;
};

export default function ServiceFaq({ items, heading = "FAQ" }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="service-landing-section">
      <h2 className="service-landing-heading">{heading}</h2>
      <div className="faq-list faq-list--full">
        {items.map((item, i) => (
          <article key={item.q} className="faq-item">
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              {item.q}
            </button>
            {open === i ? <p className="faq-answer">{item.a}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
