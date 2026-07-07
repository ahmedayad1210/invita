import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { upsertPatient, appendTimelineEvent } from "@/lib/patients/crm";
import { sendWhatsAppMessage } from "@/lib/notifications/respondio-client";

type LeadPayload = {
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  drip_slug?: string;
  locale?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: LeadPayload;

  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const source = (body.source ?? "website").trim().slice(0, 64);
  const name = body.name?.trim().slice(0, 200) ?? null;
  const email = body.email?.trim().slice(0, 320) ?? null;
  const phone = body.phone?.trim().slice(0, 32) ?? null;
  const message = body.message?.trim().slice(0, 4000) ?? null;
  const drip_slug = body.drip_slug?.trim().slice(0, 64) ?? null;
  const locale = body.locale === "ar" ? "ar" : "en";

  if (!email && !phone) {
    return NextResponse.json(
      { success: false, error: "Email or phone is required." },
      { status: 400 }
    );
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Invalid email." }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { success: false, error: "Lead capture is not configured." },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("leads").insert({
    source,
    name,
    email,
    phone,
    message,
    drip_slug,
    locale,
  } as never);

  if (error) {
    console.error("[leads] insert error:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not save your enquiry." },
      { status: 500 }
    );
  }

  if (phone && name) {
    const patient = await upsertPatient({
      name,
      phone,
      email,
      locale,
    });

    if (patient) {
      await appendTimelineEvent({
        patientId: patient.id,
        eventType: "lead_created",
        title: `Lead from ${source}`,
        body: message ?? drip_slug ?? undefined,
      });

      const welcome =
        locale === "ar"
          ? `مرحباً ${name} 👋\nشكراً لتواصلك مع Invita. سيرد فريقنا قريباً.`
          : `Hello ${name} 👋\nThanks for reaching out to Invita. Our team will reply shortly.`;
      await sendWhatsAppMessage(phone, welcome, name);
    }
  }

  return NextResponse.json({ success: true });
}
