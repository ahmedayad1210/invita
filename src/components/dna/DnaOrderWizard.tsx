"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/contexts/LocaleContext";
import type { DnaPanel } from "@/lib/invita/panels";

type Props = {
  panel: DnaPanel;
};

export default function DnaOrderWizard({ panel }: Props) {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();
  const isAr = locale === "ar";

  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(`/dna/${panel.slug}`)}`;

  const handleOrder = async () => {
    if (!user) {
      router.push(loginUrl);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/dna-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panel_slug: panel.slug,
          panel_name: panel.name,
        }),
      });

      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        setToast({
          message: json.error ?? (isAr ? "تعذر إنشاء الطلب." : "Could not place order."),
          type: "error",
        });
        return;
      }

      setOrdered(true);
      setToast({
        message: isAr
          ? "تم تسجيل طلبك. تابع الحالة في حسابك."
          : "Order placed. Track status in your account.",
        type: "success",
      });
    } catch {
      setToast({
        message: isAr ? "خطأ في الشبكة." : "Network error.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="dna-order-wizard dna-order-wizard--success">
        <p role="status">
          {isAr
            ? `تم طلب ${panel.nameAr}. سيتواصل معك فريق Invita DNA Lab خلال 24 ساعة.`
            : `${panel.name} order received. Invita DNA Lab will contact you within 24 hours.`}
        </p>
        <div className="dna-order-wizard-actions">
          <Link href="/account" className="btn-primary">
            {isAr ? "عرض في حسابي" : "View in account"}
          </Link>
          <Link href="/dna" className="btn-secondary">
            {isAr ? "كل اللوحات" : "All panels"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dna-order-wizard">
      <p className="dna-order-wizard-lead">
        {isAr
          ? "اطلب مجموعة العينات — يتطلب حساب Invita. التسليم أو الاستلام في العيادة."
          : "Order your kit — requires an Invita account. Home delivery or in-clinic collection."}
      </p>

      <ul className="dna-order-wizard-summary">
        <li>
          <span>{isAr ? "اللوحة" : "Panel"}</span>
          <strong>{isAr ? panel.nameAr : panel.name}</strong>
        </li>
        <li>
          <span>{isAr ? "السعر" : "Price"}</span>
          <strong>{panel.price}</strong>
        </li>
        <li>
          <span>{isAr ? "المدة" : "Turnaround"}</span>
          <strong>{panel.turnaround}</strong>
        </li>
      </ul>

      {!initialized ? (
        <button type="button" className="btn-primary" disabled>
          {isAr ? "جاري التحميل…" : "Loading…"}
        </button>
      ) : user ? (
        <button
          type="button"
          className="btn-primary"
          onClick={handleOrder}
          disabled={loading}
        >
          {loading
            ? isAr
              ? "جاري الطلب…"
              : "Placing order…"
            : isAr
              ? "اطلب هذه اللوحة"
              : "Order this panel"}
        </button>
      ) : (
        <>
          <Link href={loginUrl} className="btn-primary">
            {isAr ? "سجّل الدخول للطلب" : "Sign in to order"}
          </Link>
          <p className="dna-order-wizard-hint">
            {isAr ? "ليس لديك حساب؟" : "No account?"}{" "}
            <Link href={`/auth/register?redirectTo=${encodeURIComponent(`/dna/${panel.slug}`)}`}>
              {isAr ? "إنشاء حساب" : "Create one"}
            </Link>
          </p>
        </>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
