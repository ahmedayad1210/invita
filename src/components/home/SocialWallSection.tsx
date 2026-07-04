import Image from "next/image";
import Link from "next/link";
import { FRAMER_IMAGES } from "@/lib/invita/framer-assets";

const PLACEHOLDERS = [
  { name: "Baghdad Client", handle: "@invitadrips" },
  { name: "Baghdad Client", handle: "@invitadrips" },
  { name: "Baghdad Client", handle: "@invitadrips" },
  { name: "Baghdad Client", handle: "@invitadrips" },
  { name: "Baghdad Client", handle: "@invitadrips" },
];

export default function SocialWallSection() {
  return (
    <section className="section-padding social-wall">
      <div className="section-inner">
        <header className="page-hero">
          <p className="page-eyebrow">As seen with</p>
          <h2 className="page-title">Trusted by Baghdad&apos;s most influential</h2>
          <p className="page-lead">
            Replace with your Baghdad celebrity and influencer clients for local trust.
          </p>
        </header>
        <div className="social-wall-grid">
          {FRAMER_IMAGES.socialWall.map((src, i) => (
            <article key={src} className="social-wall-card">
              <Image
                src={src}
                alt={`Invita client ${i + 1}`}
                width={320}
                height={400}
                style={{ objectFit: "cover", width: "100%", height: "220px" }}
              />
              <div className="social-wall-meta">
                <p>{PLACEHOLDERS[i]?.name ?? "Baghdad Client"}</p>
                <span>{PLACEHOLDERS[i]?.handle ?? "@invitadrips"}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="cta-band">
          <Link href="/book" className="btn-primary">
            Book now
          </Link>
        </div>
      </div>
    </section>
  );
}
