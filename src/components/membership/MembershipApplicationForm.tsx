"use client";

import { useState, type FormEvent } from "react";
import Toast from "@/components/ui/Toast";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";
import { MEMBERSHIP_TIERS } from "@/lib/constants";

export default function MembershipApplicationForm() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  const [tierId, setTierId] = useState<string>(MEMBERSHIP_TIERS[0].id);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const selectedTier = MEMBERSHIP_TIERS.find((t) => t.id === tierId) ?? MEMBERSHIP_TIERS[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitLead({
      source: `membership-${tierId}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `[${selectedTier.name}] ${form.message}`.trim(),
      locale,
    });

    setLoading(false);

    if (!result.success) {
      setToast({
        message: result.error ?? (isAr ? "تعذر الإرسال." : "Could not submit application."),
        type: "error",
      });
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="membership-application membership-application--success" role="status">
        <h2>{isAr ? "تم استلام طلبك" : "Application received"}</h2>
        <p>
          {isAr
            ? "فريق الكونسيرج سيراجع طلب العضوية ويتواصل معك خلال 24 ساعة."
            : "Our concierge team will review your membership request within 24 hours."}
        </p>
      </div>
    );
  }

  return (
    <div className="membership-application">
      <h2>{isAr ? "قدّم طلب عضوية" : "Apply for membership"}</h2>
      <p>
        {isAr
          ? "اختر المستوى وأخبرنا عن أهدافك — المراجعة بالدعوة فقط."
          : "Choose your tier and tell us your goals — membership is by invitation."}
      </p>

      <form onSubmit={handleSubmit} className="membership-application-form">
        <fieldset className="membership-tier-picker">
          <legend>{isAr ? "المستوى" : "Tier"}</legend>
          {MEMBERSHIP_TIERS.map((tier) => (
            <label key={tier.id} className="membership-tier-option">
              <input
                type="radio"
                name="tier"
                value={tier.id}
                checked={tierId === tier.id}
                onChange={() => setTierId(tier.id)}
              />
              <span>
                <strong>{isAr ? tier.nameAr : tier.name}</strong>
                <em>{tier.price}</em>
              </span>
            </label>
          ))}
        </fieldset>

        <label className="intake-field">
          <span>{isAr ? "الاسم الكامل" : "Full name"} *</span>
          <input
            className="input-sevres"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </label>

        <label className="intake-field">
          <span>{isAr ? "البريد الإلكتروني" : "Email"} *</span>
          <input
            className="input-sevres"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </label>

        <label className="intake-field">
          <span>{isAr ? "الهاتف" : "Phone"} *</span>
          <input
            className="input-sevres"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </label>

        <label className="intake-field">
          <span>{isAr ? "لماذا Invita؟" : "Why Invita?"}</span>
          <textarea
            className="input-sevres"
            rows={4}
            placeholder={
              isAr
                ? "أهدافك الصحية، تجربتك السابقة مع IV…"
                : "Your wellness goals, prior IV experience…"
            }
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? isAr
              ? "جاري الإرسال…"
              : "Submitting…"
            : isAr
              ? "إرسال الطلب"
              : "Submit application"}
        </button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
