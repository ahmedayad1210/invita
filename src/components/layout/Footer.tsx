"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  INVITA,
  FOOTER_ADVANCED_LINKS,
  FOOTER_B2B_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_TREATMENT_LINKS,
} from "@/lib/constants";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/invita/local-media";

export default function Footer() {
  const { locale, t } = useLocale();
  const currentYear = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const handleNewsletter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus("loading");

    const email = new FormData(e.currentTarget).get("email");
    const result = await submitLead({
      source: "footer-newsletter",
      email: String(email ?? ""),
      locale,
    });

    setNewsletterStatus(result.success ? "done" : "error");
  };

  return (
    <footer className="footer-invita">
      <div className="container-invita">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Image
              src={LOCAL_IMAGES.logoStack}
              alt="Invita — IV Vitamins Therapy"
              width={200}
              height={120}
              className="footer-brand-logo"
            />
            <p className="footer-brand-tagline">{INVITA.tagline}</p>
            <LiquividaBadge variant="block" />
            <div className="footer-social">
              <a
                href={INVITA.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="footer-heading">Company</p>
            <nav className="footer-nav">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {locale === "ar" ? link.labelAr : link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="footer-heading">IV Therapy</p>
            <nav className="footer-nav">
              {FOOTER_TREATMENT_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {locale === "ar" ? link.labelAr : link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="footer-heading">{locale === "ar" ? "للعيادات" : "For Clinics"}</p>
            <nav className="footer-nav">
              {FOOTER_B2B_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {locale === "ar" ? link.labelAr : link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="footer-heading">{locale === "ar" ? "خدمات متقدمة" : "Advanced"}</p>
            <nav className="footer-nav">
              {FOOTER_ADVANCED_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {locale === "ar" ? link.labelAr : link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="footer-heading">Contact</p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={14} className="footer-contact-icon" />
                <span>{INVITA.address.full}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={14} className="footer-contact-icon" />
                <span>{INVITA.phone}</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={14} className="footer-contact-icon" />
                <span>{INVITA.email}</span>
              </div>
            </div>

            <p className="footer-heading footer-heading--spaced">Hours</p>
            <div className="footer-hours">
              {Object.entries(INVITA.hours.short).map(([day, hours]) => (
                <div key={day} className="footer-hours-row">
                  <span>{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>

            <p className="footer-heading footer-heading--spaced">Wellness updates</p>
            {newsletterStatus === "done" ? (
              <p className="footer-newsletter-success" role="status">
                Thank you — you&apos;re on the list.
              </p>
            ) : (
              <form className="footer-newsletter" onSubmit={handleNewsletter}>
                <label className="sr-only" htmlFor="footer-email">
                  Email
                </label>
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  autoComplete="email"
                />
                <button type="submit" disabled={newsletterStatus === "loading"}>
                  {newsletterStatus === "loading" ? "…" : "Join"}
                </button>
              </form>
            )}
            {newsletterStatus === "error" ? (
              <p className="footer-newsletter-error" role="alert">
                Could not subscribe. Try again later.
              </p>
            ) : null}
          </div>
        </div>

        <div className="divider-full footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Invita — {INVITA.tagline}
          </p>
          <p className="footer-disclaimer">{t.footer.disclaimer}</p>
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
