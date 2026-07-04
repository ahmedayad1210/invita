"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Calendar, Phone } from "lucide-react";
import { INVITA } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

const HIDDEN_PREFIXES = ["/book", "/admin", "/auth"];

export default function MobileConversionBar() {
  const pathname = usePathname();
  const { t } = useLocale();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <div className="mobile-conversion-bar" role="navigation" aria-label="Quick actions">
      <Link href="/book" className="mobile-conversion-btn mobile-conversion-btn--primary">
        <Calendar size={16} aria-hidden="true" />
        <span>{t.cta.reserveAppointment}</span>
      </Link>
      <a
        href={`tel:${INVITA.phone.replace(/\s/g, "")}`}
        className="mobile-conversion-btn mobile-conversion-btn--secondary"
        aria-label={t.common.call}
      >
        <Phone size={16} aria-hidden="true" />
      </a>
      <a
        href={INVITA.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-conversion-btn mobile-conversion-btn--secondary"
        aria-label={t.common.whatsapp}
      >
        <MessageCircle size={16} aria-hidden="true" />
      </a>
    </div>
  );
}
