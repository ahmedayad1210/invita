"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HEALTHCARE_CLINICS,
  SPECIALTY_LABELS,
  filterClinics,
  getRecommendedDripsForClinic,
  type ClinicSpecialty,
} from "@/lib/invita/healthcare-network";
import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { useLocale } from "@/contexts/LocaleContext";

const BBOX = { minLat: 33.26, maxLat: 33.38, minLng: 44.31, maxLng: 44.43 };

function toPercent(lat: number, lng: number) {
  const x = ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
  const y = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(98, Math.max(2, y)) };
}

export default function ProviderNetworkMap() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [specialty, setSpecialty] = useState<ClinicSpecialty | "all">("all");
  const [dripSlug, setDripSlug] = useState("all");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = filterClinics({ specialty, sort: "featured" });
    if (certifiedOnly) list = list.filter((c) => c.featured);
    if (dripSlug !== "all") {
      list = list.filter((c) => getRecommendedDripsForClinic(c).includes(dripSlug));
    }
    return list;
  }, [specialty, dripSlug, certifiedOnly]);

  const active = filtered.find((c) => c.slug === activeSlug) ?? filtered[0];

  const dripOptions = ["nad-plus", "immune-boost", "skin-radiance", "energy-boost", "myers-cocktail"];

  return (
    <section className="provider-network-map" aria-labelledby="provider-map-heading">
      <header className="provider-map-header">
        <h2 id="provider-map-heading">{isAr ? "خريطة الشركاء" : "Partner map"}</h2>
        <p>
          {isAr
            ? `${filtered.length} شريك — تصفية حسب التخصص والبروتوكول`
            : `${filtered.length} partners — filter by specialty and protocol`}
        </p>
      </header>

      <div className="provider-map-filters">
        <select
          className="clinic-select"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value as ClinicSpecialty | "all")}
        >
          <option value="all">{isAr ? "كل التخصصات" : "All specialties"}</option>
          {Object.entries(SPECIALTY_LABELS).map(([key, labels]) => (
            <option key={key} value={key}>
              {isAr ? labels.ar : labels.en}
            </option>
          ))}
        </select>
        <select
          className="clinic-select"
          value={dripSlug}
          onChange={(e) => setDripSlug(e.target.value)}
        >
          <option value="all">{isAr ? "كل البروتوكولات" : "All protocols"}</option>
          {dripOptions.map((slug) => {
            const drip = getLiquividaDrip(slug);
            return (
              <option key={slug} value={slug}>
                {drip?.name ?? slug}
              </option>
            );
          })}
        </select>
        <label className="provider-map-certified">
          <input
            type="checkbox"
            checked={certifiedOnly}
            onChange={(e) => setCertifiedOnly(e.target.checked)}
          />
          {isAr ? "Invita certified فقط" : "Invita certified only"}
        </label>
      </div>

      <div className="provider-map-layout">
        <div className="provider-map-canvas" aria-hidden="true">
          {filtered.map((clinic) => {
            const { x, y } = toPercent(clinic.map.lat, clinic.map.lng);
            const isActive = clinic.slug === active?.slug;
            return (
              <button
                key={clinic.slug}
                type="button"
                className={`provider-map-pin${isActive ? " is-active" : ""}${clinic.featured ? " is-certified" : ""}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                title={clinic.name}
                onClick={() => setActiveSlug(clinic.slug)}
              />
            );
          })}
        </div>

        {active && (
          <aside className="provider-map-detail">
            <h3>{isAr ? active.nameAr : active.name}</h3>
            <p>{SPECIALTY_LABELS[active.specialty][isAr ? "ar" : "en"]}</p>
            <p>
              {isAr ? active.districtAr : active.district}, {isAr ? active.cityAr : active.city}
            </p>
            {active.featured && (
              <span className="provider-map-badge">{isAr ? "معتمد Invita" : "Invita certified"}</span>
            )}
            <ul className="provider-map-drips">
              {getRecommendedDripsForClinic(active).slice(0, 3).map((slug) => {
                const drip = getLiquividaDrip(slug);
                return drip ? <li key={slug}>{drip.name}</li> : null;
              })}
            </ul>
            <div className="provider-map-actions">
              <Link href={`/healthcare-network/${active.slug}`} className="btn-secondary btn-sm">
                {isAr ? "الملف" : "Profile"}
              </Link>
              <Link href={`/book?drip=${getRecommendedDripsForClinic(active)[0] ?? "myers-cocktail"}`} className="btn-primary btn-sm">
                {isAr ? "احجز هنا" : "Book here"}
              </Link>
            </div>
          </aside>
        )}
      </div>

      <p className="provider-map-note">
        {isAr
          ? `إجمالي الشبكة: ${HEALTHCARE_CLINICS.length} شريك في العراق`
          : `Full network: ${HEALTHCARE_CLINICS.length} partners across Iraq`}
      </p>
    </section>
  );
}
