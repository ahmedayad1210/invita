"use client";

// src/components/home/GalleryStrip.tsx
import Image from "next/image";
import Link from "next/link";
import { GALLERY_IMAGES } from "@/lib/constants";

export default function GalleryStrip() {
  return (
    <section
      style={{
        backgroundColor: "#0C2430",
        padding:         "6rem 0",
      }}
    >
      <div className="container-invita">
        {/* Header */}
        <div
          style={{
            textAlign:    "center",
            marginBottom: "3rem",
          }}
        >
          <span
            style={{
              display:       "inline-block",
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "rgba(15,181,168,0.8)",
              marginBottom:  "1rem",
            }}
          >
            The Studio
          </span>
          <h2
            style={{
              fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
              fontSize:   "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 400,
              color:      "#F6FAFB",
              lineHeight: 1.15,
            }}
          >
            Inside Invita
          </h2>
        </div>

        {/* Gallery grid */}
        <div className="gallery-strip">
          {GALLERY_IMAGES.map((image, i) => (
            <div key={i} className="gallery-item">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{
                  objectFit: "cover",
                }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Hover overlay */}
              <div
                style={{
                  position:        "absolute",
                  inset:           0,
                  backgroundColor: "rgba(15,35,65,0)",
                  transition:      "background-color 0.4s ease",
                }}
                className="gallery-overlay"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/book"
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              padding:         "0.9375rem 2.25rem",
              backgroundColor: "transparent",
              color:           "rgba(250,247,242,0.85)",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.8125rem",
              fontWeight:      500,
              letterSpacing:   "0.12em",
              textTransform:   "uppercase",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(250,247,242,0.25)",
              transition:      "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0FB5A8";
              e.currentTarget.style.borderColor     = "#0FB5A8";
              e.currentTarget.style.color           = "#F6FAFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor     = "rgba(250,247,242,0.25)";
              e.currentTarget.style.color           = "rgba(250,247,242,0.85)";
            }}
          >
            Reserve Your Visit
          </Link>
        </div>
      </div>

      <style>{`
        .gallery-overlay:hover {
          background-color: rgba(15,35,65,0.35) !important;
        }
      `}</style>
    </section>
  );
}