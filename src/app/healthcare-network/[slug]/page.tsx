import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, Globe, Instagram, MapPin, Facebook } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClinicCard from "@/components/healthcare/ClinicCard";
import ClinicLogo from "@/components/healthcare/ClinicLogo";
import {
  COOPERATION_LABELS,
  SPECIALTY_LABELS,
  clinicMapEmbedUrl,
  getClinicBySlug,
  getRelatedClinics,
  HEALTHCARE_CLINICS,
} from "@/lib/invita/healthcare-network";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return HEALTHCARE_CLINICS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);
  if (!clinic) return { title: "Clinic" };
  return {
    title: clinic.name,
    description: clinic.aboutEn,
  };
}

export default async function ClinicProfilePage({ params }: Props) {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);
  if (!clinic) notFound();

  const related = getRelatedClinics(clinic);

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main clinic-profile">
        {/* Hero */}
        <section className="clinic-profile-hero">
          <div className="clinic-profile-hero-media">
            <Image
              src={clinic.cover}
              alt=""
              fill
              priority
              sizes="100vw"
              className="clinic-profile-hero-image"
            />
            <div className="clinic-profile-hero-overlay" />
          </div>
          <div className="section-inner clinic-profile-hero-content">
            <Link href="/healthcare-network" className="back-link">
              ← Healthcare network
            </Link>
            <ClinicLogo clinic={clinic} size={72} className="clinic-profile-hero-logo" />
            <p className="clinic-card-specialty">{SPECIALTY_LABELS[clinic.specialty].en}</p>
            <h1 className="page-title">{clinic.name}</h1>
            <p className="clinic-profile-location">
              <MapPin size={16} aria-hidden="true" />
              {clinic.district}, {clinic.city}
            </p>
            <p className="clinic-profile-status">
              {COOPERATION_LABELS[clinic.cooperationStatus].en} · Since {clinic.cooperationSince}
              {clinic.doctorCount != null && ` · ${clinic.doctorCount} doctors`}
            </p>
            <p className="clinic-profile-disclaimer">
              Reference profile — Invita has worked with this facility; not an exclusive partnership.
            </p>
          </div>
        </section>

        <div className="section-inner clinic-profile-sections">
          {/* About */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">About</h2>
            <p>{clinic.aboutEn}</p>
            {clinic.notesEn && <p className="text-muted">{clinic.notesEn}</p>}
          </section>

          {/* Services */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">Services</h2>
            <ul className="clinic-list">
              {clinic.servicesEn.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Gallery */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">Gallery</h2>
            <div className="clinic-gallery">
              {clinic.gallery.map((src, i) => (
                <div key={src} className="clinic-gallery-item">
                  <Image
                    src={src}
                    alt={`${clinic.name} gallery ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="clinic-gallery-image"
                  />
                </div>
              ))}
            </div>
            <p className="clinic-placeholder-note">Placeholder images — replace with clinic photography.</p>
          </section>

          {/* Doctors */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">Doctors</h2>
            {clinic.doctors.length > 0 ? (
              <ul className="clinic-doctors-list">
                {clinic.doctors.map((doc) => (
                  <li key={doc.name}>
                    <strong>{doc.name}</strong>
                    <span>{doc.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">
                Doctor profiles available on request — placeholder for future updates.
              </p>
            )}
          </section>

          {/* Products Used */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">Products used</h2>
            <ul className="clinic-list">
              {clinic.productsUsed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Location */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">Location</h2>
            <iframe
              title={`Map — ${clinic.name}`}
              src={clinicMapEmbedUrl(clinic)}
              className="clinic-map-iframe clinic-map-iframe--profile"
              loading="lazy"
            />
            <a
              href={`https://www.openstreetmap.org/?mlat=${clinic.map.lat}&mlon=${clinic.map.lng}#map=16/${clinic.map.lat}/${clinic.map.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="clinic-map-link"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Open in OpenStreetMap
            </a>
          </section>

          {/* Contact */}
          <section className="clinic-profile-section">
            <h2 className="clinic-section-title">Contact</h2>
            <ul className="clinic-contact-list">
              {clinic.website && (
                <li>
                  <Globe size={16} aria-hidden="true" />
                  <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </li>
              )}
              {clinic.instagram && (
                <li>
                  <Instagram size={16} aria-hidden="true" />
                  <a href={clinic.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </li>
              )}
              {clinic.facebook && (
                <li>
                  <Facebook size={16} aria-hidden="true" />
                  <a href={clinic.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </li>
              )}
              {!clinic.website && !clinic.instagram && !clinic.facebook && (
                <li className="text-muted">Contact details — placeholder for future updates.</li>
              )}
            </ul>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="clinic-profile-section">
              <h2 className="clinic-section-title">Related clinics</h2>
              <div className="clinic-card-grid clinic-card-grid--related">
                {related.map((item) => (
                  <ClinicCard key={item.slug} clinic={item} compact />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
