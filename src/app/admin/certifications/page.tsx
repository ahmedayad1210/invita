"use client";

import { useCallback, useEffect, useState } from "react";
import CertificateCard from "@/components/certifications/CertificateCard";
import type { CertificateRecord, CertificationsData } from "@/lib/invita/certifications";

type FieldKey =
  | "imageUrl"
  | "pdfUrl"
  | "organizationLogoUrl"
  | "verificationUrl"
  | "certificateNumber"
  | "registrationNumber"
  | "issueDate"
  | "expiryDate"
  | "titleEn"
  | "issuerEn"
  | "descriptionEn";

const EDITABLE_FIELDS: { key: FieldKey; label: string; type?: string }[] = [
  { key: "titleEn", label: "Title (EN)" },
  { key: "issuerEn", label: "Issuer (EN)" },
  { key: "descriptionEn", label: "Description (EN)" },
  { key: "imageUrl", label: "Certificate image URL" },
  { key: "organizationLogoUrl", label: "Organisation logo URL" },
  { key: "pdfUrl", label: "PDF URL" },
  { key: "verificationUrl", label: "Verification URL" },
  { key: "certificateNumber", label: "Certificate number" },
  { key: "registrationNumber", label: "Registration number" },
  { key: "issueDate", label: "Issue date", type: "date" },
  { key: "expiryDate", label: "Expiry date", type: "date" },
];

export default function AdminCertificationsPage() {
  const [data, setData] = useState<CertificationsData | null>(null);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<CertificateRecord>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/certifications");
    const json = await res.json();
    if (json.success) {
      setData(json.data);
      setSource(json.source ?? "json");
      if (!activeId && json.data.certificates[0]) {
        setActiveId(json.data.certificates[0].id);
      }
    }
    setLoading(false);
  }, [activeId]);

  useEffect(() => {
    load();
  }, [load]);

  const active = data?.certificates.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (active) setDraft({ ...active });
  }, [active]);

  const save = async () => {
    if (!activeId || !draft) return;
    setStatus("saving");
    setError(null);

    const res = await fetch("/api/admin/certifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeId, ...draft }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      setStatus("error");
      setError(json.error ?? "Save failed.");
      return;
    }

    setStatus("saved");
    await load();
    setTimeout(() => setStatus("idle"), 2000);
  };

  if (loading) {
    return <p style={{ color: "#8B7355" }}>Loading certificates…</p>;
  }

  if (!data) {
    return <p style={{ color: "#8B7355" }}>Could not load certificates.</p>;
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "#2C1810",
            marginBottom: "0.5rem",
          }}
        >
          Certifications CMS
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#8B7355", maxWidth: "42rem" }}>
          Data source: <strong>{source}</strong>. Upload images in{" "}
          <a href="/admin/media" style={{ color: "#C4956A" }}>
            Media Library
          </a>
          , copy the URL, then paste below. Or edit{" "}
          <code style={{ fontSize: "0.8rem" }}>src/data/certifications.json</code> for full
          control without Supabase.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem" }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {data.certificates.map((cert) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => setActiveId(cert.id)}
              style={{
                textAlign: "start",
                padding: "0.6rem 0.75rem",
                border:
                  activeId === cert.id
                    ? "1px solid #2C1810"
                    : "1px solid rgba(44,24,16,0.12)",
                borderRadius: "0.5rem",
                background: activeId === cert.id ? "#2C1810" : "#fff",
                color: activeId === cert.id ? "#FAF7F2" : "#2C1810",
                fontSize: "0.8125rem",
                cursor: "pointer",
              }}
            >
              {cert.titleEn}
            </button>
          ))}
        </nav>

        {active && draft ? (
          <div>
            <div style={{ maxWidth: "420px", marginBottom: "1.5rem" }}>
              <CertificateCard
                certificate={{ ...active, ...draft } as CertificateRecord}
                locale="en"
                variant={active.featured ? "featured" : "supporting"}
                adminMode
                onReplaceImage={() => {
                  const url = window.prompt("Paste certificate image URL:");
                  if (url) setDraft((d) => ({ ...d, imageUrl: url.trim() }));
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                maxWidth: "640px",
              }}
            >
              {EDITABLE_FIELDS.map(({ key, label, type }) => (
                <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#8B7355" }}>{label}</span>
                  <input
                    type={type ?? "text"}
                    value={(draft[key] as string) ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        [key]: e.target.value || null,
                      }))
                    }
                    style={{
                      padding: "0.5rem 0.65rem",
                      border: "1px solid rgba(44,24,16,0.15)",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                  />
                </label>
              ))}
            </div>

            {error ? (
              <p style={{ color: "#b44", fontSize: "0.875rem", marginTop: "1rem" }} role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              style={{
                marginTop: "1.5rem",
                padding: "0.65rem 1.5rem",
                background: "#2C1810",
                color: "#FAF7F2",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save to database"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
