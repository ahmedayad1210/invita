import Link from "next/link";
import MediaImage from "@/components/patterns/MediaImage";
import { ADD_ONS } from "@/lib/invita/liquivida-drips";
import { FRAMER_IMAGES } from "@/lib/invita/framer-assets";

export default function AddOnsPreview() {
  return (
    <section className="section-padding addons-preview">
      <div className="section-inner">
        <header className="addons-preview-header">
          <p className="page-eyebrow">While your drip runs, add one of these…</p>
          <h2 className="page-title">Elevate Your Session</h2>
        </header>
        <div className="addons-preview-grid">
          {ADD_ONS.slice(0, 4).map((addon, i) => (
            <article key={addon.name} className="addon-preview-card">
              {FRAMER_IMAGES.addOns[i % FRAMER_IMAGES.addOns.length] ? (
                <div className="addon-preview-image">
                  <MediaImage
                    src={FRAMER_IMAGES.addOns[i % FRAMER_IMAGES.addOns.length]}
                    alt=""
                    variant="inline"
                    width={400}
                    height={280}
                    frameClassName="addon-preview-frame"
                  />
                </div>
              ) : null}
              <div className="addon-preview-body">
                <h3>{addon.name}</h3>
                <p>{addon.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="cta-band">
          <Link href="/add-ons" className="btn-primary">
            View all add-ons
          </Link>
        </div>
      </div>
    </section>
  );
}
