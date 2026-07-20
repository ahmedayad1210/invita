// src/app/contact/page.tsx
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section
          style={{
            backgroundColor: "#FAF7F2",
            paddingTop: "10rem",
            paddingBottom: "5rem",
            textAlign: "center",
          }}
        >
          <div className="container-invita">
            <span className="eyebrow">Get in Touch</span>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 300,
                color: "#0F2341",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              We would love to hear from you.
            </h1>
            <div className="divider-rose" />
          </div>
        </section>

        <section style={{ padding: "2rem 0 6rem" }}>
          <div className="container-invita">
            <div
              className="contact-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr",
                gap: "5rem",
                alignItems: "start",
              }}
            >
              <ContactInfo />
              <Suspense
                fallback={
                  <div style={{ padding: "3rem", textAlign: "center" }}>
                    <LoadingSpinner message="Loading form…" />
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </>
  );
}
