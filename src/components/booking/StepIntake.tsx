"use client";

import { useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/hooks/useAuth";
import { useBookingStore, useBookingNavigation, useStepValidity } from "@/store/bookingStore";
import { Button } from "@/components/ui/Button";

export default function StepIntake() {
  const { t } = useLocale();
  const { user } = useAuth();
  const { intake, setIntake, guestName, guestPhone, guestEmail, setGuest } = useBookingStore();
  const { nextStep, prevStep } = useBookingNavigation();
  const { step4Valid } = useStepValidity();

  const guestReady = Boolean(guestName.trim() && guestPhone.trim());
  const canContinue = step4Valid && (user || guestReady);

  useEffect(() => {
    if (!user) return;

    fetch("/api/user/medical-profile")
      .then((r) => r.json())
      .then((json) => {
        if (!json.success || !json.data?.medical) return;
        const m = json.data.medical;
        setIntake({
          goals: m.goals ?? intake.goals,
          allergies: m.allergies ?? intake.allergies,
          medications: m.medications ?? intake.medications,
          conditions: m.conditions ?? intake.conditions,
          pregnant: Boolean(m.pregnant),
        });
      })
      .catch(() => undefined);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const field = (label: string, key: keyof typeof intake, multiline = true) => (
    <label className="intake-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          className="input-sevres"
          rows={3}
          value={String(intake[key])}
          onChange={(e) => setIntake({ [key]: e.target.value })}
        />
      ) : (
        <input
          type="checkbox"
          checked={intake.pregnant}
          onChange={(e) => setIntake({ pregnant: e.target.checked })}
        />
      )}
    </label>
  );

  return (
    <div>
      <h2 className="step-title">{t.intake.title}</h2>
      <p className="step-desc">{t.intake.lead}</p>

      {!user && (
        <div className="booking-guest-contact">
          <h3 className="booking-guest-contact-title">{t.intake.guestSection}</h3>
          <label className="intake-field">
            <span>{t.intake.fullName} *</span>
            <input
              className="input-sevres"
              value={guestName}
              onChange={(e) => setGuest({ guestName: e.target.value })}
              required
            />
          </label>
          <label className="intake-field">
            <span>{t.intake.phone} *</span>
            <input
              className="input-sevres"
              value={guestPhone}
              onChange={(e) => setGuest({ guestPhone: e.target.value })}
              required
            />
          </label>
          <label className="intake-field">
            <span>{t.intake.emailOptional}</span>
            <input
              className="input-sevres"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuest({ guestEmail: e.target.value })}
            />
          </label>
        </div>
      )}

      {field(t.intake.goals, "goals")}
      {field(t.intake.allergies, "allergies")}
      {field(t.intake.medications, "medications")}
      {field(t.intake.conditions, "conditions")}

      <label className="intake-checkbox">
        <input
          type="checkbox"
          checked={intake.pregnant}
          onChange={(e) => setIntake({ pregnant: e.target.checked })}
        />
        <span>{t.intake.pregnant}</span>
      </label>

      <div className="step-actions">
        <Button variant="ghost" onClick={prevStep}>
          {t.common.back}
        </Button>
        <Button onClick={nextStep} disabled={!canContinue}>
          {t.common.continue}
        </Button>
      </div>
    </div>
  );
}
