import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import { respondIoContactUrl } from "@/lib/patients/crm";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const supabase = createAdminClient();

  let query = supabase
    .from("patients")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).filter((row) => {
    if (!q) return true;
    const p = row as { full_name: string; phone: string; email: string | null };
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email ?? "").toLowerCase().includes(q)
    );
  });

  return NextResponse.json({
    success: true,
    data: rows.map((row) => {
      const p = row as Record<string, unknown> & { phone: string };
      return { ...p, respond_url: respondIoContactUrl(p.phone) };
    }),
  });
}
