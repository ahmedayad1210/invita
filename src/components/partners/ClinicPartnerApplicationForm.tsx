"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/ui/Toast";
import { sendContactMessage } from "@/lib/emailjs";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";
import {
  B2B_PARTNER_TYPES,
  PARTNER_APPLICATION_INTENTS,
  type PartnerApplicationIntentId,
} from "@/lib/invita/b2b-content";

const INTENT_IDS = new Set<string>(PARTNER_APPLICATION_INTENTS.map((item) => item.id));

function resolveIntent(raw: string | null): PartnerApplicationIntentId {
  if (raw && INTENT_IDS.has(raw)) return raw as PartnerApplicationIntentId;
  return "partnership";
}

type FormState = {
  clinic: string;
  city: string;
  facilityType: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  clinic: "",
  city: "",
  facilityType: B2B_PARTNER_TYPES[0].en,
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ClinicPartnerApplicationForm() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const initialIntent = useMemo(
    () => resolveIntent(searchParams.get("intent")),
    [searchParams]
  );

  const [intentId, setIntentId] = useState<PartnerApplicationIntentId>(initialIntent);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const selectedIntent =
    PARTNER_APPLICATION_INTENTS.find((item) => item.id === intentId) ??
    PARTNER_APPLICATION_INTENTS[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const intentLabel = isAr ? selectedIntent.labelAr : selectedIntent.labelEn;
    const composedMessage = [
      `[${intentLabel}]`,
      `Facility type: ${form.facilityType}`,
      `Clinic: ${form.clinic}`,
      `City: ${form.city}`,
      form.message.trim() ? `\n${form.message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await submitLead({
      source: selectedIntent.source,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: composedMessage,
      locale,
    });

    if (!result.success) {
      setLoading(false);
      setToast({
        message: result.error ?? (isAr ? "تعذر الإرسال." : "Could not submit application."),
        type: "error",
      });
      return;
    }

    await sendContactMessage({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: composedMessage,
    }).catch(() => null);

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="clinic-partner-application clinic-partner-application--success" role="status">
        <h2>{isAr ? "تم استلام طلبك" : "Application received"}</h2>
        <p>
          {isAr
            ? "فريق الشراكات سيراجع طلبك ويتواصل معك خلال 48 ساعة."
            : "Our partnerships team will review your request and respond within 48 hours."}
        </p>
      </div>
    );
  }

  return (
    <div className="clinic-partner-application">
      <h2>{isAr ? "طلب شراكة عيادة" : "Clinic & partner application"}</h2>
      <p>
        {isAr
          ? "املأ النموذج أدناه — للعيادات، المراكز الطبية، المستشفيات، ومرافق العافية في العراق."
          : "Complete the form below — for clinics, medical centres, hospitals, and wellness facilities across Iraq."}
      </p>

      <form onSubmit={handleSubmit} className="clinic-partner-application-form">
        <fieldset className="clinic-partner-intent-picker">
          <legend>{isAr ? "نوع الطلب" : "Request type"}</legend>
          {PARTNER_APPLICATION_INTENTS.map((item) => (
            <label key={item.id} className="clinic-partner-intent-option">
              <input
                type="radio"
                name="intent"
                value={item.id}
                checked={intentId === item.id}
                onChange={() => setIntentId(item.id)}
              />
              <span>
                <strong>{isAr ? item.labelAr : item.labelEn}</strong>
                <em>{isAr ? item.hintAr : item.hintEn}</em>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="clinic-partner-form-grid">
          <label className="intake-field">
            <span>{isAr ? "اسم العيادة / المنشأة" : "Clinic or organisation"} *</span>
            <input
              className="input-sevres"
              type="text"
              required
              value={form.clinic}
              onChange={(e) => setForm((prev) => ({ ...prev, clinic: e.target.value }))}
              placeholder={isAr ? "مثال: عيادة الرعاية الطبية" : "e.g. Al-Rafidain Medical Centre"}
            />
          </label>

          <label className="intake-field">
            <span>{isAr ? "المدينة" : "City"} *</span>
            <input
              className="input-sevres"
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              placeholder={isAr ? "بغداد، أربيل، البصرة…" : "Baghdad, Erbil, Basra…"}
            />
          </label>
        </div>

        <label className="intake-field">
          <span>{isAr ? "نوع المنشأة" : "Facility type"} *</span>
          <select
            className="input-sevres"
            required
            value={form.facilityType}
            onChange={(e) => setForm((prev) => ({ ...prev, facilityType: e.target.value }))}
          >
            {B2B_PARTNER_TYPES.map((type) => (
              <option key={type.en} value={type.en}>
                {isAr ? type.ar : type.en}
              </option>
            ))}
          </select>
        </label>

        <div className="clinic-partner-form-grid">
          <label className="intake-field">
            <span>{isAr ? "اسم جهة الاتصال" : "Contact name"} *</span>
            <input
              className="input-sevres"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>

          <label className="intake-field">
            <span>{isAr ? "البريد الإلكتروني" : "Email"} *</span>
            <input
              className="input-sevres"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>
        </div>

        <label className="intake-field">
          <span>{isAr ? "الهاتف" : "Phone"} *</span>
          <input
            className="input-sevres"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+964 770 000 0000"
          />
        </label>

        <label className="intake-field">
          <span>{isAr ? "تفاصيل إضافية" : "Additional details"}</span>
          <textarea
            className="input-sevres"
            rows={4}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder={
              isAr
                ? "الخدمات المطلوبة، عدد الموظفين، الجدول الزمني…"
                : "Services needed, staff count, timeline, current IV offering…"
            }
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
