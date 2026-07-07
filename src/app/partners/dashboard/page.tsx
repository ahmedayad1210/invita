import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PartnerSupportForm from "@/components/partners/PartnerSupportForm";
import PartnerLogoutButton from "@/components/partners/PartnerLogoutButton";
import { PARTNER_COOKIE_NAME, verifyPartnerJWT } from "@/lib/partner-jwt";
import { INVITA } from "@/lib/constants";

const TRAINING_ASSETS = [
  { title: "Safety 101", href: "/resources/invita-safety-101.pdf" },
  { title: "Clinical guide", href: "/resources/liquivida-clinical-guide.pdf" },
  { title: "Patient education", href: "/resources/invita-patient-education.pdf" },
  { title: "IV catalogue", href: "/resources/invita-catalogue.pdf" },
  { title: "Professional training", href: "/for-clinics" },
];

export default async function PartnerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PARTNER_COOKIE_NAME)?.value;
  const session = token ? await verifyPartnerJWT(token) : null;

  if (!session) {
    redirect("/partners/login");
  }

  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="section-inner partner-dashboard">
          <header className="partner-dashboard-header">
            <div>
              <p className="page-eyebrow">Partner portal</p>
              <h1 className="page-title">{session.clinicName}</h1>
              <p className="page-lead">Training, assets, and support for Invita partner clinics.</p>
            </div>
            <PartnerLogoutButton />
          </header>

          <section className="partner-dashboard-section">
            <h2>Training &amp; certification</h2>
            <ul className="partner-asset-list">
              {TRAINING_ASSETS.map((asset) => (
                <li key={asset.href}>
                  <a href={asset.href} target="_blank" rel="noopener noreferrer">
                    {asset.title} →
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="partner-dashboard-section">
            <h2>Co-branded resources</h2>
            <ul className="partner-asset-list">
              <li>
                <Link href="/science">Science hub &amp; infographics</Link>
              </li>
              <li>
                <Link href="/healthcare-network">Healthcare network directory</Link>
              </li>
              <li>
                <a href={INVITA.social.instagram} target="_blank" rel="noopener noreferrer">
                  @invita_iv_drips on Instagram
                </a>
              </li>
            </ul>
          </section>

          <section className="partner-dashboard-section">
            <h2>Support ticket</h2>
            <PartnerSupportForm clinicName={session.clinicName} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
