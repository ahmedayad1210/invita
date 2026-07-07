import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import { formatDateLabel, formatTimeLabel } from "@/lib/time-slots";
import { INVITA } from "@/lib/constants";
import { sendWhatsAppMessage, respondIoConfigured } from "./respondio-client";

type Locale = "en" | "ar";

export type BookingNotifyContact = {
  userId?: string | null;
  patientId?: string | null;
  bookingId: string;
  phone: string;
  name: string;
  locale?: Locale;
};

export type BookingNotifyMeta = {
  serviceName: string;
  practitionerName: string;
  date: string;
  timeSlot: string;
};

function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://invitadrips.com").replace(/\/+$/, "");
}

function formatWhen(date: string, timeSlot: string, locale: Locale): string {
  return `${formatDateLabel(date)} ${formatTimeLabel(timeSlot)}`;
}

export function buildBookingMessage(
  template:
    | "booking_received"
    | "booking_confirmed"
    | "reminder_24h"
    | "reminder_1h"
    | "booking_cancelled",
  ctx: {
    name: string;
    serviceName: string;
    practitionerName: string;
    when: string;
    bookingRef: string;
    locale: Locale;
  }
): string {
  const ar = ctx.locale === "ar";
  const bookUrl = `${siteBaseUrl()}/account`;

  switch (template) {
    case "booking_received":
      return ar
        ? `مرحباً ${ctx.name} 👋\nاستلمنا طلب حجز ${ctx.serviceName}.\n🗓️ ${ctx.when} (بغداد)\nالمرجع: ${ctx.bookingRef.slice(0, 8)}\nسيتواصل فريق Invita لتأكيد الموعد.\n${bookUrl}`
        : `Hello ${ctx.name} 👋\nWe received your ${ctx.serviceName} booking request.\n🗓️ ${ctx.when} (Baghdad)\nRef: ${ctx.bookingRef.slice(0, 8)}\nOur team will confirm shortly.\n${bookUrl}`;
    case "booking_confirmed":
      return ar
        ? `تم تأكيد موعدك ✅\n${ctx.serviceName} مع ${ctx.practitionerName}\n🗓️ ${ctx.when}\n📍 ${INVITA.address.fullAr}\n${bookUrl}`
        : `Your appointment is confirmed ✅\n${ctx.serviceName} with ${ctx.practitionerName}\n🗓️ ${ctx.when}\n📍 ${INVITA.address.full}\n${bookUrl}`;
    case "reminder_24h":
      return ar
        ? `تذكير: موعد ${ctx.serviceName} غداً.\n🗓️ ${ctx.when}\n${bookUrl}`
        : `Reminder: your ${ctx.serviceName} appointment is tomorrow.\n🗓️ ${ctx.when}\n${bookUrl}`;
    case "reminder_1h":
      return ar
        ? `موعد ${ctx.serviceName} بعد ساعة.\nنراك قريباً في Invita.\n📍 ${INVITA.address.fullAr}`
        : `Your ${ctx.serviceName} appointment is in 1 hour.\nSee you soon at Invita.\n📍 ${INVITA.address.full}`;
    case "booking_cancelled":
      return ar
        ? `تم إلغاء موعد ${ctx.serviceName}.\nأعد الحجز: ${siteBaseUrl()}/book`
        : `Your ${ctx.serviceName} appointment was cancelled.\nRebook: ${siteBaseUrl()}/book`;
  }
}

async function recordNotification(row: {
  userId?: string | null;
  patientId?: string | null;
  bookingId: string;
  template: string;
  status: "sent" | "failed" | "pending";
  scheduledFor?: string | null;
  payload: Record<string, unknown>;
}): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  try {
    const supabase = createAdminClient();
    await supabase.from("notifications").insert({
      user_id: row.userId ?? null,
      patient_id: row.patientId ?? null,
      booking_id: row.bookingId,
      channel: "whatsapp",
      template: row.template,
      status: row.status,
      scheduled_for: row.scheduledFor ?? null,
      sent_at: row.status === "sent" ? new Date().toISOString() : null,
      payload: row.payload,
    } as never);
  } catch (e) {
    console.error("[notifications] record failed", e);
  }
}

async function logOutboundMessage(patientId: string | null | undefined, bookingId: string, body: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !patientId) return;
  const supabase = createAdminClient();
  await supabase.from("messages").insert({
    patient_id: patientId,
    booking_id: bookingId,
    direction: "outbound",
    channel: "whatsapp",
    body,
  } as never);
}

async function dispatchNow(
  contact: BookingNotifyContact,
  template: Parameters<typeof buildBookingMessage>[0],
  meta: BookingNotifyMeta
): Promise<void> {
  const locale = contact.locale ?? "en";
  const when = formatWhen(meta.date, meta.timeSlot, locale);
  const text = buildBookingMessage(template, {
    name: contact.name,
    serviceName: meta.serviceName,
    practitionerName: meta.practitionerName,
    when,
    bookingRef: contact.bookingId,
    locale,
  });

  const result = await sendWhatsAppMessage(contact.phone, text, contact.name);
  await recordNotification({
    userId: contact.userId,
    patientId: contact.patientId,
    bookingId: contact.bookingId,
    template,
    status: result.delivered ? "sent" : respondIoConfigured() ? "failed" : "pending",
    payload: { text, result },
  });

  if (result.delivered) {
    await logOutboundMessage(contact.patientId, contact.bookingId, text);
  }
}

function scheduledIso(date: string, timeSlot: string, offsetMs: number): string | null {
  const when = new Date(`${date}T${timeSlot}:00+03:00`);
  if (Number.isNaN(when.getTime())) return null;
  return new Date(when.getTime() - offsetMs).toISOString();
}

export async function sendBookingReceived(
  contact: BookingNotifyContact,
  meta: BookingNotifyMeta
): Promise<void> {
  await dispatchNow(contact, "booking_received", meta);

  const supabase = createAdminClient();
  const reminders = [
    { template: "reminder_24h", offsetMs: 24 * 60 * 60 * 1000 },
    { template: "reminder_1h", offsetMs: 60 * 60 * 1000 },
  ] as const;

  for (const item of reminders) {
    const scheduledFor = scheduledIso(meta.date, meta.timeSlot, item.offsetMs);
    if (!scheduledFor || new Date(scheduledFor) <= new Date()) continue;

    await supabase.from("notifications").insert({
      user_id: contact.userId ?? null,
      patient_id: contact.patientId ?? null,
      booking_id: contact.bookingId,
      channel: "whatsapp",
      template: item.template,
      status: "pending",
      scheduled_for: scheduledFor,
      payload: { serviceName: meta.serviceName, practitionerName: meta.practitionerName },
    } as never);
  }
}

export async function sendBookingConfirmed(
  contact: BookingNotifyContact,
  meta: BookingNotifyMeta
): Promise<void> {
  await dispatchNow(contact, "booking_confirmed", meta);
}

export async function sendBookingCancelled(
  contact: BookingNotifyContact,
  meta: BookingNotifyMeta
): Promise<void> {
  await dispatchNow(contact, "booking_cancelled", meta);

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const supabase = createAdminClient();
  await supabase
    .from("notifications")
    .update({ status: "failed" } as never)
    .eq("booking_id", contact.bookingId)
    .eq("status", "pending");
}

export async function dispatchDueNotifications(): Promise<{ sent: number; failed: number }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { sent: 0, failed: 0 };

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: rows } = await supabase
    .from("notifications")
    .select("*, booking:bookings(id, date, time_slot, guest_phone, guest_name, user_id, patient_id, service:services(name), stylist:stylists(name))")
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .limit(50);

  let sent = 0;
  let failed = 0;

  for (const row of rows ?? []) {
    const n = row as {
      id: string;
      template: string;
      booking_id: string;
      patient_id: string | null;
      booking: {
        date: string;
        time_slot: string;
        guest_phone: string | null;
        guest_name: string | null;
        user_id: string | null;
        patient_id: string | null;
        service: { name: string } | null;
        stylist: { name: string } | null;
      } | null;
    };

    const booking = n.booking;
    if (!booking) continue;

    let phone = booking.guest_phone;
    let name = booking.guest_name ?? "Patient";

    if (!phone && booking.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone, full_name")
        .eq("id", booking.user_id)
        .maybeSingle();
      phone = (profile as { phone?: string } | null)?.phone ?? null;
      name = (profile as { full_name?: string } | null)?.full_name ?? name;
    }

    if (!phone) {
      failed += 1;
      await supabase.from("notifications").update({ status: "failed" } as never).eq("id", n.id);
      continue;
    }

    const meta: BookingNotifyMeta = {
      serviceName: booking.service?.name ?? "IV session",
      practitionerName: booking.stylist?.name ?? "Invita team",
      date: booking.date,
      timeSlot: booking.time_slot,
    };

    const text = buildBookingMessage(n.template as "reminder_24h" | "reminder_1h", {
      name,
      serviceName: meta.serviceName,
      practitionerName: meta.practitionerName,
      when: formatWhen(meta.date, meta.timeSlot, "en"),
      bookingRef: n.booking_id,
      locale: "en",
    });

    const result = await sendWhatsAppMessage(phone, text, name);
    await supabase
      .from("notifications")
      .update({
        status: result.delivered ? "sent" : "failed",
        sent_at: result.delivered ? new Date().toISOString() : null,
      } as never)
      .eq("id", n.id);

    if (result.delivered) {
      sent += 1;
      await logOutboundMessage(booking.patient_id ?? n.patient_id, n.booking_id, text);
    } else {
      failed += 1;
    }
  }

  return { sent, failed };
}
