import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { upsertPatient, appendTimelineEvent } from "@/lib/patients/crm";

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const phone =
    (payload.contact as { phone?: string } | undefined)?.phone ??
    (payload.phone as string | undefined);
  const text =
    (payload.message as { text?: string } | undefined)?.text ??
    (payload.text as string | undefined) ??
    JSON.stringify(payload);

  if (!phone || !text) {
    return NextResponse.json({ success: true, skipped: true });
  }

  const name =
    (payload.contact as { firstName?: string; lastName?: string } | undefined)?.firstName ??
    "Patient";

  const patient = await upsertPatient({ name: String(name), phone: String(phone) });
  if (!patient) {
    return NextResponse.json({ success: true, stored: false });
  }

  const supabase = createAdminClient();
  await supabase.from("messages").insert({
    patient_id: patient.id,
    direction: "inbound",
    channel: "whatsapp",
    body: String(text),
    external_id: (payload.messageId as string | undefined) ?? null,
  } as never);

  await appendTimelineEvent({
    patientId: patient.id,
    eventType: "whatsapp_inbound",
    title: "WhatsApp message received",
    body: String(text).slice(0, 500),
  });

  return NextResponse.json({ success: true, patient_id: patient.id });
}
