import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyAdminJWT(token);
  return payload !== null;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("dna_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, result_url } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("dna_orders")
      .update({ status, result_url: result_url ?? null } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
