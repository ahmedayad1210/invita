"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { INVITA } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

const HIDDEN_PREFIXES = ["/admin", "/auth", "/book"];

export default function CallFab() {
  const { t } = useLocale();
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <a href={`tel:${INVITA.phone.replace(/\s/g, "")}`} className="call-fab" aria-label={t.common.call}>
      <Phone size={20} aria-hidden="true" />
    </a>
  );
}
