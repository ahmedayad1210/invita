"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { INVITA } from "@/lib/constants";

const HIDDEN_PREFIXES = ["/admin", "/auth", "/book"];

export default function WhatsAppFab() {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <a
      href={INVITA.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Message Invita on WhatsApp"
    >
      <MessageCircle size={22} aria-hidden="true" />
    </a>
  );
}
