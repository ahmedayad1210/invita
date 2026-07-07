import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

export type HomepageBanner = {
  url: string;
  alt: string | null;
};

export async function getHomepageHeroBanner(): Promise<HomepageBanner | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("media_assets")
      .select("public_url, alt_text, title")
      .eq("is_active", true)
      .eq("role", "hero")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return null;
    const row = data as { public_url: string; alt_text: string | null; title: string };
    return { url: row.public_url, alt: row.alt_text ?? row.title };
  } catch {
    return null;
  }
}

export async function getHomepageCtaBanner(): Promise<HomepageBanner | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("media_assets")
      .select("public_url, alt_text, title")
      .eq("is_active", true)
      .in("role", ["homepage-cta", "footer-banner"])
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!data) return null;
    const row = data as { public_url: string; alt_text: string | null; title: string };
    return { url: row.public_url, alt: row.alt_text ?? row.title };
  } catch {
    return null;
  }
}
