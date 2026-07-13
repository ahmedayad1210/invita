"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
};

export default function DripDetailFaq({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="drip-detail-section">
      <h2 className="service-landing-heading">Frequently asked questions</h2>
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
