"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ClinicCard from "@/components/healthcare/ClinicCard";
import NetworkStatsBar from "@/components/healthcare/NetworkStatsBar";
import {
  CLINIC_SPECIALTIES,
  SPECIALTY_LABELS,
  filterClinics,
  paginateClinics,
  clinicMapEmbedUrl,
  type ClinicSpecialty,
  type HealthcareClinic,
} from "@/lib/invita/healthcare-network";
import { useLocale } from "@/contexts/LocaleContext";

const PER_PAGE = 12;
const PREVIEW_COUNT = 8;

type Props = {
  showStats?: boolean;
  showMap?: boolean;
  preview?: boolean;
  initialPerPage?: number;
};

export default function ClinicDirectory({
  showStats = true,
  showMap = true,
  preview = false,
  initialPerPage = PER_PAGE,
}: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState<ClinicSpecialty | "all">("all");
  const [sort, setSort] = useState<"alpha" | "newest">("alpha");
  const [page, setPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      filterClinics({
        query,
        specialty,
        sort: preview ? "featured" : sort,
        featuredOnly: preview,
      }),
    [query, specialty, sort, preview]
  );

  const perPage = preview ? PREVIEW_COUNT : initialPerPage;
  const paginated = useMemo(
    () => paginateClinics(filtered, page, perPage),
    [filtered, page, perPage]
  );

  const selectedClinic: HealthcareClinic | undefined = selectedSlug
    ? filtered.find((c) => c.slug === selectedSlug) ?? filtered[0]
    : filtered[0];

  const mapUrl =
    selectedClinic && filtered.length > 0
      ? clinicMapEmbedUrl(selectedClinic)
      : "https://www.openstreetmap.org/export/embed.html?bbox=44.32%2C33.28%2C44.42%2C33.38&layer=mapnik&marker=33.33%2C44.37";

  const handleFilterChange = (next: ClinicSpecialty | "all") => {
    setSpecialty(next);
    setPage(1);
  };

  return (
    <div className="clinic-directory">
      {showStats && <NetworkStatsBar />}

      {!preview && (
      <div className="clinic-directory-toolbar">
        <label className="clinic-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isAr ? "ابحث عن عيادة أو منطقة…" : "Search clinics or districts…"}
            aria-label={isAr ? "بحث العيادات" : "Search clinics"}
          />
        </label>

        <div className="clinic-directory-controls">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "alpha" | "newest")}
            aria-label={isAr ? "ترتيب" : "Sort"}
            className="clinic-select"
          >
            <option value="alpha">{isAr ? "أ–ي" : "A–Z"}</option>
            <option value="newest">{isAr ? "الأحدث" : "Newest cooperation"}</option>
          </select>
        </div>
      </div>
      )}

      {!preview && (
        <div className="clinic-filters" role="tablist" aria-label={isAr ? "تصفية التخصص" : "Filter by specialty"}>
          <button
            type="button"
            role="tab"
            aria-selected={specialty === "all"}
            className={`clinic-filter-btn${specialty === "all" ? " is-active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            {isAr ? "الكل" : "All"}
          </button>
          {CLINIC_SPECIALTIES.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={specialty === key}
              className={`clinic-filter-btn${specialty === key ? " is-active" : ""}`}
              onClick={() => handleFilterChange(key)}
            >
              {isAr ? SPECIALTY_LABELS[key].ar : SPECIALTY_LABELS[key].en}
            </button>
          ))}
        </div>
      )}

      <p className="clinic-directory-count">
        {preview
          ? isAr
            ? `${paginated.total} عيادة مميزة`
            : `${paginated.total} featured clinics`
          : isAr
            ? `${paginated.total} مقدّم رعاية صحية`
            : `${paginated.total} healthcare providers`}
      </p>

      <div className={`clinic-directory-layout${showMap && !preview ? " clinic-directory-layout--with-map" : ""}`}>
        <div className="clinic-card-grid">
          {paginated.items.map((clinic) => (
            <div
              key={clinic.slug}
              onMouseEnter={() => setSelectedSlug(clinic.slug)}
              onFocus={() => setSelectedSlug(clinic.slug)}
            >
              <ClinicCard clinic={clinic} compact={preview} />
            </div>
          ))}
        </div>

        {showMap && !preview && filtered.length > 0 && (
          <aside className="clinic-map-panel" aria-label={isAr ? "خريطة العيادات" : "Clinic map"}>
            <p className="clinic-map-label">
              {selectedClinic
                ? isAr
                  ? selectedClinic.nameAr
                  : selectedClinic.name
                : isAr
                  ? "بغداد"
                  : "Baghdad"}
            </p>
            <iframe
              title={isAr ? "خريطة موقع العيادة" : "Clinic location map"}
              src={mapUrl}
              className="clinic-map-iframe"
              loading="lazy"
            />
            <p className="clinic-map-note">
              {isAr
                ? "مواقع تقريبية — يمكن تحديثها لكل عيادة."
                : "Approximate locations — updatable per clinic."}
            </p>
          </aside>
        )}
      </div>

      {!preview && paginated.totalPages > 1 && (
        <nav className="clinic-pagination" aria-label={isAr ? "صفحات الدليل" : "Directory pagination"}>
          <button
            type="button"
            className="btn-secondary btn-sm"
            disabled={paginated.page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {isAr ? "السابق" : "Previous"}
          </button>
          <span>
            {isAr
              ? `صفحة ${paginated.page} من ${paginated.totalPages}`
              : `Page ${paginated.page} of ${paginated.totalPages}`}
          </span>
          <button
            type="button"
            className="btn-secondary btn-sm"
            disabled={paginated.page >= paginated.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {isAr ? "التالي" : "Next"}
          </button>
        </nav>
      )}
    </div>
  );
}
