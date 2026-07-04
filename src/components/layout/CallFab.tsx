"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { INVITA } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

export default function CallFab() {
  const { t } = useLocale();

  return (
    <a href={`tel:${INVITA.phone.replace(/\s/g, "")}`} className="call-fab" aria-label={t.common.call}>
      <Phone size={20} aria-hidden="true" />
    </a>
  );
}
