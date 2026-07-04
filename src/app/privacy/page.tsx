import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Invita IV Drips collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <div className="section-inner legal-page">
          <header className="page-hero">
            <p className="page-eyebrow">Legal</p>
            <h1 className="page-title">Privacy Policy</h1>
            <p className="page-lead">Last updated: June 2026</p>
          </header>
          <div className="legal-body">
            <p>
              Invita IV Drips (&quot;Invita&quot;, &quot;we&quot;) respects your privacy. This policy
              explains how we collect and use personal information when you visit our website,
              book a session, or contact us.
            </p>
            <h2>Information we collect</h2>
            <p>
              We may collect your name, email address, phone number, booking details, and
              health-related information you provide during clinical intake. Enquiries submitted
              through our website are stored securely in our database.
            </p>
            <h2>How we use your information</h2>
            <p>
              We use your information to respond to enquiries, manage appointments, deliver
              clinical services, and improve our patient experience. We do not sell your personal
              data to third parties.
            </p>
            <h2>Data security</h2>
            <p>
              Patient and booking data is stored using industry-standard encryption and access
              controls. Only authorised Invita staff may access clinical records.
            </p>
            <h2>Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data by
              contacting us at{" "}
              <a href="mailto:hello@invitadrips.com">hello@invitadrips.com</a>.
            </p>
            <h2>Contact</h2>
            <p>
              For privacy questions, email{" "}
              <a href="mailto:hello@invitadrips.com">hello@invitadrips.com</a> or visit our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
