import "server-only";

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

function baseUrl(): string {
  return (env("RESPOND_IO_BASE_URL") ?? "https://api.respond.io/v2").replace(/\/+$/, "");
}

export function normalizePhone(value: string): string | null {
  let p = value.replace(/[^\d+]/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = `964${p.slice(1)}`;
  if (!p.startsWith("964") && p.length <= 10) p = `964${p}`;
  return /^\d{8,15}$/.test(p) ? p : null;
}

export function respondIoConfigured(): boolean {
  return Boolean(env("RESPOND_IO_API_TOKEN") && env("RESPOND_IO_CHANNEL_ID"));
}

export type SendResult =
  | { delivered: true; status: number }
  | { delivered: false; reason: string; status?: number };

async function post(path: string, body: unknown): Promise<{ ok: boolean; status: number }> {
  const token = env("RESPOND_IO_API_TOKEN")!;
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status };
}

async function upsertContact(phone: string, name?: string): Promise<void> {
  try {
    await post(`/contact/create_or_update/phone:${encodeURIComponent(`+${phone}`)}`, {
      firstName: name?.split(" ")[0] ?? "Patient",
      lastName: name?.split(" ").slice(1).join(" ") || undefined,
      phone: `+${phone}`,
    });
  } catch (e) {
    console.error("[respondio] upsertContact failed", e);
  }
}

export async function sendWhatsAppMessage(
  rawPhone: string,
  text: string,
  name?: string
): Promise<SendResult> {
  if (!respondIoConfigured()) {
    return { delivered: false, reason: "respondio_not_configured" };
  }

  const phone = normalizePhone(rawPhone);
  if (!phone) return { delivered: false, reason: "invalid_phone" };

  try {
    await upsertContact(phone, name);
    const channelId = env("RESPOND_IO_CHANNEL_ID")!;
    const result = await post("/message", {
      channelId: Number(channelId),
      contact: { phone: `+${phone}` },
      message: { type: "text", text },
    });

    if (!result.ok) {
      return { delivered: false, reason: "send_failed", status: result.status };
    }

    return { delivered: true, status: result.status };
  } catch (e) {
    console.error("[respondio] sendWhatsAppMessage failed", e);
    return { delivered: false, reason: "network_error" };
  }
}
