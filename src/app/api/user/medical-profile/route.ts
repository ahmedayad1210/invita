import { NextRequest, NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { getPatientByUserId } from "@/lib/patients/crm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  const patient = await getPatientByUserId(user.id);
  if (!patient) {
    return NextResponse.json({ success: true, data: null });
  }

  const supabase = await createClient();
  const { data: medical } = await supabase
    .from("patient_profiles")
    .select("*")
    .eq("patient_id", patient.id)
    .maybeSingle();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("patient_id", patient.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    success: true,
    data: { patient, medical, messages: messages ?? [] },
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const { goals, allergies, medications, conditions, pregnant } = body;

  const patient = await getPatientByUserId(user.id);
  if (!patient) {
    return NextResponse.json({ success: false, error: "Patient record not found." }, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patient_profiles")
    .upsert(
      {
        patient_id: patient.id,
        goals: goals ?? null,
        allergies: allergies ?? null,
        medications: medications ?? null,
        conditions: conditions ?? null,
        pregnant: Boolean(pregnant),
      } as never,
      { onConflict: "patient_id" }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
