import MediaImage from "@/components/patterns/MediaImage";
import { FRAMER_IMAGES } from "@/lib/invita/framer-assets";

const CAPTIONS = [
  "100% bloodstream absorption",
  "Liquivida® USA formulas",
  "Medical-grade wellness",
];

export default function BenefitsGallery() {
  return (
    <section className="benefits-gallery" aria-label="IV therapy benefits">
      <div className="benefits-gallery-grid benefits-gallery-grid--framed">
        {FRAMER_IMAGES.benefits.map((src, i) => (
          <MediaImage
            key={src}
            src={src}
            alt={CAPTIONS[i] ?? "IV therapy benefits"}
            variant="editorial"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            caption={CAPTIONS[i]}
            objectPosition="center"
          />
        ))}
      </div>
    </section>
  );
}
