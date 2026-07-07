import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertPatient } from "@/lib/patients/crm";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    let { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (error?.code === "PGRST116") {
      const insertPayload = {
        id: user.id,
        full_name: (user.user_metadata?.full_name as string | undefined)?.trim() || "",
        email: user.email ?? "",
        phone: (user.user_metadata?.phone as string | undefined)?.trim() || null,
      };

      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .upsert(insertPayload as never)
        .select("*")
        .single();

      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }

      data = created;
      error = null;
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const full_name = body.full_name?.trim();
    const phone = body.phone?.trim();

    if (!full_name) {
      return NextResponse.json({ success: false, error: "Full name is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name, phone: phone || null } as never)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (phone) {
      await upsertPatient({
        userId: user.id,
        name: full_name,
        phone,
        email: user.email,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
