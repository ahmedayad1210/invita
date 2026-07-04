export type LeadInput = {
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  drip_slug?: string;
  locale?: "en" | "ar";
};

export async function submitLead(
  payload: LeadInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { success: boolean; error?: string };

    if (!res.ok || !data.success) {
      return { success: false, error: data.error ?? "Could not submit enquiry." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
