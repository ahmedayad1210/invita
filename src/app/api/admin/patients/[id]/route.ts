import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import { respondIoContactUrl } from "@/lib/patients/crm";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(_request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createAdminClient();

  const { data: patient, error } = await supabase.from("patients").select("*").eq("id", id).single();
  if (error || !patient) {
    return NextResponse.json({ success: false, error: "Patient not found." }, { status: 404 });
  }

  const p = patient as Record<string, unknown> & { user_id: string | null; phone: string };

  const [profileRes, medicalRes, notesRes, timelineRes, bookingsRes, messagesRes, leadsRes] =
    await Promise.all([
      p.user_id
        ? supabase.from("profiles").select("*").eq("id", p.user_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from("patient_profiles").select("*").eq("patient_id", id).maybeSingle(),
      supabase.from("patient_notes").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
      supabase.from("patient_timeline").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*, service:services(name), stylist:stylists(name)").eq("patient_id", id).order("date", { ascending: false }),
      supabase.from("messages").select("*").eq("patient_id", id).order("created_at", { ascending: false }).limit(50),
      supabase
        .from("leads")
        .select("*")
        .or(`phone.eq.${p.phone},email.eq.${(p.email as string | undefined) ?? ""}`)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  return NextResponse.json({
    success: true,
    data: {
      patient: { ...p, respond_url: respondIoContactUrl(p.phone) },
      profile: profileRes.data,
      medical: medicalRes.data,
      notes: notesRes.data ?? [],
      timeline: timelineRes.data ?? [],
      bookings: bookingsRes.data ?? [],
      messages: messagesRes.data ?? [],
      leads: leadsRes.data ?? [],
    },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { body?: string };
  if (!body.body?.trim()) {
    return NextResponse.json({ success: false, error: "Note body is required." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patient_notes")
    .insert({ patient_id: id, body: body.body.trim(), author: "admin" } as never)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await supabase.from("patient_timeline").insert({
    patient_id: id,
    event_type: "note",
    title: "Staff note added",
    body: body.body.trim(),
  } as never);

  return NextResponse.json({ success: true, data });
}
