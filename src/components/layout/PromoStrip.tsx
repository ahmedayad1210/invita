"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const DISMISS_KEY = "invita_promo_dismissed";
const HIDDEN_PREFIXES = ["/admin", "/auth", "/book"];

export default function PromoStrip() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
  }, []);

  if (!visible || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <div className="promo-strip">
      <p>
        {t.promoStrip.body}{" "}
        <Link href="/book">{t.promoStrip.cta}</Link>
      </p>
      <button
        type="button"
        aria-label={t.common.dismiss}
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setVisible(false);
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
