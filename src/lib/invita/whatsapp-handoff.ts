/** Build prefilled WhatsApp URL for booking confirmation handoff. */

import { INVITA } from "@/lib/constants";
import { formatDateLabel, formatTimeLabel } from "@/lib/time-slots";

export type BookingWhatsAppContext = {
  bookingRef: string;
  serviceName: string;
  stylistName: string;
  date: string;
  timeSlot: string;
  guestName?: string;
};

export function buildBookingWhatsAppUrl(ctx: BookingWhatsAppContext): string {
  const base = INVITA.whatsapp.replace(/\?.*$/, "");
  const phone = base.match(/wa\.me\/(\d+)/)?.[1] ?? "9647748885559";

  const lines = [
    "Hello Invita — I'd like to confirm my IV booking:",
    "",
    `Ref: ${ctx.bookingRef.slice(0, 8).toUpperCase()}`,
    `Protocol: ${ctx.serviceName}`,
    `Clinician: ${ctx.stylistName}`,
    `Date: ${formatDateLabel(ctx.date)}`,
    `Time: ${formatTimeLabel(ctx.timeSlot)}`,
  ];

  if (ctx.guestName) {
    lines.push(`Name: ${ctx.guestName}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${text}`;
}
