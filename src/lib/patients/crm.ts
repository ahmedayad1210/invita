import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

export function normalizePhone(value: string): string | null {
  let p = value.replace(/[^\d+]/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = `964${p.slice(1)}`;
  if (!p.startsWith("964") && p.length <= 10) p = `964${p}`;
  return /^\d{8,15}$/.test(p) ? p : null;
}

export type UpsertPatientInput = {
  userId?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  locale?: "en" | "ar";
};

export type PatientRecord = {
  id: string;
  user_id: string | null;
  phone: string;
  phone_normalized: string;
  full_name: string;
  email: string | null;
  locale: string;
  tags: string[];
  respond_contact_id: string | null;
  last_visit_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function upsertPatient(input: UpsertPatientInput): Promise<PatientRecord | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  const phoneNormalized = normalizePhone(input.phone);
  if (!phoneNormalized) return null;

  const supabase = createAdminClient();
  const payload = {
    user_id: input.userId ?? null,
    phone: input.phone.trim(),
    phone_normalized: phoneNormalized,
    full_name: input.name.trim(),
    email: input.email?.trim() || null,
    locale: input.locale ?? "en",
  };

  const { data, error } = await supabase
    .from("patients")
    .upsert(payload as never, { onConflict: "phone_normalized" })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[patients] upsert failed", error?.message);
    return null;
  }

  return data as PatientRecord;
}

export async function appendTimelineEvent(input: {
  patientId: string;
  eventType: string;
  title: string;
  body?: string | null;
  referenceId?: string | null;
}): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const supabase = createAdminClient();
  await supabase.from("patient_timeline").insert({
    patient_id: input.patientId,
    event_type: input.eventType,
    title: input.title,
    body: input.body ?? null,
    reference_id: input.referenceId ?? null,
  } as never);
}

export async function linkPatientToUser(patientId: string, userId: string): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const supabase = createAdminClient();
  await supabase.from("patients").update({ user_id: userId } as never).eq("id", patientId);
}

export async function getPatientByUserId(userId: string): Promise<PatientRecord | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("patients").select("*").eq("user_id", userId).maybeSingle();
  return (data as PatientRecord | null) ?? null;
}

export async function getPatientById(id: string): Promise<PatientRecord | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
  return (data as PatientRecord | null) ?? null;
}

export function respondIoContactUrl(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!normalized) return "https://app.respond.io/";
  return `https://app.respond.io/contacts/phone:+${normalized}`;
}
