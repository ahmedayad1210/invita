import { createAdminClient } from "@/lib/supabase/server";
import {
  getCertificationsFromJson,
  type CertificateRecord,
  type CertificationsData,
} from "@/lib/invita/certifications";

type DbCertificateRow = {
  id: string;
  featured: boolean;
  sort_order: number;
  category: string;
  title_en: string;
  title_ar: string;
  issuer_en: string;
  issuer_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string | null;
  image_alt_en: string | null;
  image_alt_ar: string | null;
  pdf_url: string | null;
  organization_logo_url: string | null;
  verification_url: string | null;
  certificate_number: string | null;
  registration_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  recommended_width: number;
  recommended_height: number;
};

function rowToCertificate(row: DbCertificateRow): CertificateRecord {
  return {
    id: row.id,
    featured: row.featured,
    sortOrder: row.sort_order,
    category: row.category,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    issuerEn: row.issuer_en,
    issuerAr: row.issuer_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    imageUrl: row.image_url,
    imageAltEn: row.image_alt_en,
    imageAltAr: row.image_alt_ar,
    pdfUrl: row.pdf_url,
    organizationLogoUrl: row.organization_logo_url,
    verificationUrl: row.verification_url,
    certificateNumber: row.certificate_number,
    registrationNumber: row.registration_number,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    recommendedWidth: row.recommended_width,
    recommendedHeight: row.recommended_height,
  };
}

function mergeCertificate(
  base: CertificateRecord,
  override: CertificateRecord
): CertificateRecord {
  return { ...base, ...override, id: base.id };
}

/**
 * Loads certifications: Supabase overrides JSON when configured.
 * Replace images, URLs, and dates in JSON or via admin — no code deploy needed.
 */
export async function getCertificationsData(): Promise<CertificationsData> {
  const base = getCertificationsFromJson();

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return base;
  }

  try {
    const supabase = createAdminClient();
    const { data: rows, error } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !rows?.length) {
      return base;
    }

    const overrideMap = new Map(
      (rows as DbCertificateRow[]).map((row) => [row.id, rowToCertificate(row)])
    );

    const certificates = base.certificates.map((cert) => {
      const override = overrideMap.get(cert.id);
      return override ? mergeCertificate(cert, override) : cert;
    });

    return {
      ...base,
      certificates: [...certificates].sort((a, b) => a.sortOrder - b.sortOrder),
    };
  } catch {
    return base;
  }
}
