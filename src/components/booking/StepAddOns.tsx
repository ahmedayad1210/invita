"use client";

import { ADD_ONS } from "@/lib/invita/liquivida-drips";
import { useBookingStore } from "@/store/bookingStore";
import { useLocale } from "@/contexts/LocaleContext";

export default function StepAddOns() {
  const { selectedAddOns, toggleAddOn, nextStep, prevStep } = useBookingStore();
  const { t } = useLocale();

  return (
    <div>
      <header className="page-hero page-hero--center" style={{ marginBottom: "1.5rem" }}>
        <h2 className="page-title page-title--compact">{t.book.addonsTitle}</h2>
        <p className="page-lead page-lead--narrow">{t.book.addonsLead}</p>
      </header>

      <div className="addons-preview-grid">
        {ADD_ONS.map((addon) => {
          const selected = selectedAddOns.includes(addon.name);
          return (
            <button
              key={addon.name}
              type="button"
              className={`addon-preview-card addon-preview-card--selectable${selected ? " selected" : ""}`}
              onClick={() => toggleAddOn(addon.name)}
            >
              <h3>{addon.name}</h3>
              <p>{addon.description}</p>
            </button>
          );
        })}
      </div>

      <div className="booking-nav" style={{ marginTop: "2rem" }}>
        <button type="button" className="btn-secondary" onClick={prevStep}>
          {t.common.back}
        </button>
        <button type="button" className="btn-primary" onClick={nextStep}>
          {t.common.continue}
        </button>
      </div>
    </div>
  );
}
