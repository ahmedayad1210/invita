import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DnaBrochurePage from "@/components/dna/DnaBrochurePage";
import Link from "next/link";
import { DNA_PANELS } from "@/lib/invita/panels";

export const metadata = {
  title: "تحليل DNA",
  description:
    "فحص DNA من إنفيتا — التغذية، البشرة، الرياضة، والاستجابة للأدوية. عينة لعاب واحدة، معرفة تدوم مدى الحياة.",
};

export default function DnaLabPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <DnaBrochurePage />
        <section className="dna-brochure" style={{ paddingTop: 0 }}>
          <h2 className="jd-section-title">لوحات DNA المتاحة</h2>
          <div className="jd-quick-links">
            {DNA_PANELS.map((panel) => (
              <Link key={panel.slug} href={`/dna/${panel.slug}`} className="jd-quick-link">
                <span>{panel.nameAr}</span>
                <small>{panel.price}</small>
              </Link>
            ))}
          </div>
          <a
            href="/resources/dna-brochure-arabic.pdf"
            className="jd-btn jd-btn--ghost"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            تحميل كتيب DNA PDF
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
