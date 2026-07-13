import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import ServiceFaq from "@/components/services/ServiceFaq";
import type { ServiceLanding } from "@/lib/invita/service-landings";

type Props = {
  landing: ServiceLanding;
};

export default function ServiceLandingPage({ landing }: Props) {
  const { hero, overview, expectations, howItWorks, steps, faq, testimonials, relatedServices } =
    landing;

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main service-landing">
        <section className="service-landing-hero">
          <div className="section-inner service-landing-hero-inner">
            <div className="service-landing-hero-copy">
              <LiquividaBadge variant="block" />
              <p className="page-eyebrow">{hero.eyebrow}</p>
              <h1 className="page-title">{hero.title}</h1>
              <p className="page-lead">{hero.lead}</p>
              <div className="service-landing-hero-ctas">
                <Link href={hero.ctaHref} className="btn-primary">
                  {hero.ctaLabel}
                </Link>
                {hero.secondaryCtaHref && hero.secondaryCtaLabel ? (
                  <Link href={hero.secondaryCtaHref} className="btn-secondary">
                    {hero.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>
            {hero.image ? (
              <div className="service-landing-hero-visual">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt ?? hero.title}
                  width={560}
                  height={420}
                  className="service-landing-hero-image"
                  priority
                />
              </div>
            ) : null}
          </div>
        </section>

        <div className="section-inner service-landing-body">
          <section className="service-landing-section">
            <h2 className="service-landing-heading">{overview.heading}</h2>
            <p className="service-landing-prose">{overview.body}</p>
            <ul className="service-landing-benefits">
              {overview.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </section>

          <section className="service-landing-section service-landing-expect">
            <h2 className="service-landing-heading">{expectations.heading}</h2>
            <div className="service-landing-meta-grid">
              <div className="service-landing-meta-card">
                <span className="service-landing-meta-label">Service duration</span>
                <p className="service-landing-meta-value">{expectations.duration}</p>
              </div>
              <div className="service-landing-meta-card">
                <span className="service-landing-meta-label">How often to use</span>
                <p className="service-landing-meta-value">{expectations.frequency}</p>
              </div>
            </div>
            <h3 className="service-landing-subheading">{expectations.experienceTitle}</h3>
            <p className="service-landing-prose">{expectations.experienceBody}</p>
          </section>

          <section className="service-landing-section">
            <h2 className="service-landing-heading">{howItWorks.heading}</h2>
            <p className="service-landing-prose">{howItWorks.body}</p>
            {howItWorks.quote ? (
              <blockquote className="service-landing-quote">
                <p>&ldquo;{howItWorks.quote.text}&rdquo;</p>
                <footer>— {howItWorks.quote.author}</footer>
              </blockquote>
            ) : null}
          </section>

          {steps && steps.length > 0 ? (
            <section className="service-landing-section">
              <h2 className="service-landing-heading">How it works</h2>
              <div className="service-landing-steps">
                {steps.map((step, i) => (
                  <article key={step.title} className="service-landing-step">
                    <span className="service-landing-step-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {testimonials.length > 0 ? (
            <section className="service-landing-section">
              <h2 className="service-landing-heading">Client testimonials</h2>
              <div className="service-landing-testimonials">
                {testimonials.map((t) => (
                  <blockquote key={t.author} className="service-landing-testimonial">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                    <footer>— {t.author}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ) : null}

          <ServiceFaq items={faq} />

          {relatedServices.length > 0 ? (
            <section className="service-landing-section">
              <h2 className="service-landing-heading">Boost your benefits</h2>
              <div className="service-landing-related">
                {relatedServices.map((service) => (
                  <Link key={service.href} href={service.href} className="service-landing-related-card">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <ul>
                      {service.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <span className="service-landing-related-link">Learn more →</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <div className="cta-band">
            <p>Ready to begin? Every protocol starts with a private medical consultation.</p>
            <Link href={hero.ctaHref} className="btn-primary">
              {hero.ctaLabel}
            </Link>
            <p className="cta-hint">A clinician will confirm your protocol within 24 hours.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
