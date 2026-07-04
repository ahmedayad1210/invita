import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getCertificationsFromJson } from "@/lib/invita/certifications";
import { getCertificationsData } from "@/lib/invita/certifications.server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const data = await getCertificationsData();
  const source = process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase+json" : "json";

  return NextResponse.json({ success: true, data, source });
}

type CertificatePatch = {
  id: string;
  imageUrl?: string | null;
  imageAltEn?: string | null;
  imageAltAr?: string | null;
  pdfUrl?: string | null;
  organizationLogoUrl?: string | null;
  verificationUrl?: string | null;
  certificateNumber?: string | null;
  registrationNumber?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  titleEn?: string;
  titleAr?: string;
  issuerEn?: string;
  issuerAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
};

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Supabase not configured. Edit src/data/certifications.json directly, or run supabase/certifications.sql and set SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 }
    );
  }

  let body: CertificatePatch;
  try {
    body = (await request.json()) as CertificatePatch;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ success: false, error: "Certificate id is required." }, { status: 400 });
  }

  const base = getCertificationsFromJson().certificates.find((c) => c.id === body.id);
  if (!base) {
    return NextResponse.json({ success: false, error: "Unknown certificate id." }, { status: 404 });
  }

  const merged = { ...base, ...body };

  const supabase = createAdminClient();
  const { error } = await supabase.from("certificates").upsert(
    {
      id: merged.id,
      featured: merged.featured,
      sort_order: merged.sortOrder,
      category: merged.category,
      title_en: merged.titleEn,
      title_ar: merged.titleAr,
      issuer_en: merged.issuerEn,
      issuer_ar: merged.issuerAr,
      description_en: merged.descriptionEn,
      description_ar: merged.descriptionAr,
      image_url: merged.imageUrl,
      image_alt_en: merged.imageAltEn,
      image_alt_ar: merged.imageAltAr,
      pdf_url: merged.pdfUrl,
      organization_logo_url: merged.organizationLogoUrl,
      verification_url: merged.verificationUrl,
      certificate_number: merged.certificateNumber,
      registration_number: merged.registrationNumber,
      issue_date: merged.issueDate,
      expiry_date: merged.expiryDate,
      recommended_width: merged.recommendedWidth,
      recommended_height: merged.recommendedHeight,
    } as never,
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
