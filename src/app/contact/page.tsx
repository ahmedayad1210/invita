// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { INVITA, NAV_LINKS } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Toast from "@/components/ui/Toast";
import { sendContactMessage } from "@/lib/emailjs";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";

export default function ContactPage() {
  const { locale } = useLocale();
  const [form, setForm] = useState({
    name:    "",
    email:   "",
    phone:   "",
    message: "",
  });
  const [loading, setLoading]   = useState(false);
  const [toast,   setToast]     = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadResult = await submitLead({
        source: "contact-form",
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        locale,
      });

      if (!leadResult.success) {
        setToast({
          message: leadResult.error ?? "Could not save your message.",
          type: "error",
        });
        return;
      }

      // Optional EmailJS notification — Supabase lead is source of truth
      await sendContactMessage(form).catch(() => null);

      setToast({
        message: "Thank you. We will be in touch within 24 hours.",
        type: "success",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            paddingTop:      "10rem",
            paddingBottom:   "5rem",
            textAlign:       "center",
          }}
        >
          <div className="container-invita">
            <span className="eyebrow">Get in Touch</span>
            <h1
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight:    300,
                color:         "#2C1810",
                letterSpacing: "-0.02em",
                marginBottom:  "1rem",
              }}
            >
              We would love to hear from you.
            </h1>
            <div className="divider-rose" />
          </div>
        </section>

        {/* ── Content ── */}
        <section style={{ padding: "2rem 0 6rem" }}>
          <div className="container-invita">
            <div
              className="contact-grid"
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 1.4fr",
                gap:                 "5rem",
                alignItems:          "start",
              }}
            >
              {/* Left — Info */}
              <div>
                <h2
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "1.875rem",
                    fontWeight:   400,
                    color:        "#2C1810",
                    marginBottom: "2rem",
                  }}
                >
                  Clinic information
                </h2>

                <div
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "1.5rem",
                    marginBottom:  "3rem",
                  }}
                >
                  {[
                    {
                      icon:  <MapPin size={16} />,
                      label: "Address",
                      value: INVITA.address.full,
                    },
                    {
                      icon:  <Phone size={16} />,
                      label: "Phone",
                      value: INVITA.phone,
                    },
                    {
                      icon:  <Mail size={16} />,
                      label: "Email",
                      value: INVITA.email,
                    },
                    {
                      icon:  <Clock size={16} />,
                      label: "Hours",
                      value: `${INVITA.hours.weekdays}\n${INVITA.hours.friday}\n${INVITA.hours.saturday}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
                    >
                      <div
                        style={{
                          width:           "40px",
                          height:          "40px",
                          borderRadius:    "9999px",
                          backgroundColor: "rgba(196,149,106,0.1)",
                          display:         "flex",
                          alignItems:      "center",
                          justifyContent:  "center",
                          color:           "#C4956A",
                          flexShrink:      0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily:    "'DM Sans', sans-serif",
                            fontSize:      "0.6875rem",
                            fontWeight:    500,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color:         "#8B7355",
                            marginBottom:  "0.25rem",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize:   "0.9375rem",
                            color:      "#2C1810",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div
                  style={{
                    borderRadius: "0.75rem",
                    overflow:     "hidden",
                    border:       "1px solid rgba(196,149,106,0.15)",
                    height:       "240px",
                  }}
                >
                  <iframe
                    src={INVITA.map.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Invita location map"
                  />
                </div>
              </div>

              {/* Right — Form */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius:    "1rem",
                  border:          "1px solid rgba(196,149,106,0.15)",
                  boxShadow:       "0 4px 40px rgba(44,24,16,0.07)",
                  padding:         "2.5rem",
                }}
              >
                <h2
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "1.875rem",
                    fontWeight:   400,
                    color:        "#2C1810",
                    marginBottom: "0.5rem",
                  }}
                >
                  Send us a message
                </h2>
                <p
                  style={{
                    fontFamily:   "'DM Sans', sans-serif",
                    fontSize:     "0.9rem",
                    color:        "#8B7355",
                    marginBottom: "2rem",
                    lineHeight:   1.6,
                  }}
                >
                  For bookings, please use our{" "}
                  <a
                    href="/book"
                    style={{ color: "#C4956A", textDecoration: "underline" }}
                  >
                    online booking page
                  </a>
                  . For all other enquiries, we respond within 24 hours.
                </p>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <div>
                    <label className="label-sevres" htmlFor="contact-name">Full Name *</label>
                    <input
                      id="contact-name"
                      className="input-sevres"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label-sevres" htmlFor="contact-email">Email Address *</label>
                    <input
                      id="contact-email"
                      className="input-sevres"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label-sevres" htmlFor="contact-phone">Phone (optional)</label>
                    <input
                      id="contact-phone"
                      className="input-sevres"
                      type="tel"
                      placeholder="+964 770 000 0000"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-sevres" htmlFor="contact-message">Message *</label>
                    <textarea
                      id="contact-message"
                      className="input-sevres"
                      rows={5}
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      required
                      style={{ resize: "vertical", minHeight: "120px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{
                      opacity: loading ? 0.7 : 1,
                      cursor:  loading ? "not-allowed" : "pointer",
                      marginTop: "0.5rem",
                    }}
                  >
                    {loading ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </>
  );
}