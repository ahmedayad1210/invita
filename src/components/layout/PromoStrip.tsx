"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const DISMISS_KEY = "invita_promo_dismissed";

export default function PromoStrip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="promo-strip">
      <p>
        Book a session — receive a <strong>complimentary wellness assessment</strong>.{" "}
        <Link href="/book">Book now</Link>
      </p>
      <button
        type="button"
        aria-label="Dismiss"
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
