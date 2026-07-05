// src/app/api/user/profile/route.ts
// GET — return the authenticated user's profile using the server-side cookie client

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Profile missing (trigger lag or legacy account) — create from auth metadata.
    if (error?.code === "PGRST116") {
      const insertPayload = {
        id:        user.id,
        full_name: (user.user_metadata?.full_name as string | undefined)?.trim() || "",
        email:     user.email ?? "",
        phone:     (user.user_metadata?.phone as string | undefined)?.trim() || null,
      };

      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .upsert(insertPayload as never)
        .select("*")
        .single();

      if (insertError) {
        return NextResponse.json(
          { success: false, error: insertError.message },
          { status: 500 }
        );
      }

      data = created;
      error = null;
    }

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
