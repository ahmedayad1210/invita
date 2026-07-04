"use client";

import { TESTIMONIALS } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";

export default function Testimonials() {
  return (
    <section className="testimonials-carousel-section">
      <div className="container-invita">
        <div className="testimonials-carousel-header">
          <span className="eyebrow">Rated 5 stars</span>
          <h2 className="testimonials-carousel-title">
            Rated 5 stars by clients across Baghdad
          </h2>
          <p className="testimonials-verified">✓ Verified client reviews</p>
        </div>

        <div className="testimonials-carousel-track" role="list">
          {TESTIMONIALS.map((t, i) => (
            <article key={i} className="testimonial-card testimonial-carousel-card" role="listitem">
              <div className="testimonial-stars">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si}>★</span>
                ))}
              </div>
              <p className="testimonial-quote">{t.text}</p>
              <div className="testimonial-author">
                <InitialsAvatar name={t.name} size={40} />
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-role">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
