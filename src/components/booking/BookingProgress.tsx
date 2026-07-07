"use client";

import { useBookingNavigation } from "@/store/bookingStore";
import { useLocale } from "@/contexts/LocaleContext";

export default function BookingProgress() {
  const { currentStep } = useBookingNavigation();
  const { t } = useLocale();

  const STEPS = [
    { number: 1 as const, label: t.book.stepService },
    { number: 2 as const, label: t.book.stepClinician },
    { number: 3 as const, label: t.book.stepSchedule },
    { number: 4 as const, label: t.book.stepIntake },
    { number: 5 as const, label: "Add-ons" },
    { number: 6 as const, label: t.book.stepConfirm },
  ];

  return (
    <div>
      <div className="step-indicator">
        {STEPS.map((step, index) => (
          <div key={step.number} style={{ display: "flex", alignItems: "center" }}>
            <div
              className={`step-dot ${
                currentStep === step.number
                  ? "active"
                  : currentStep > step.number
                    ? "completed"
                    : ""
              }`}
            >
              {currentStep > step.number ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div className={`step-line ${currentStep > step.number ? "completed" : ""}`} />
            )}
          </div>
        ))}
      </div>

      <div className="step-labels">
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            style={{
              flex: 1,
              textAlign: index === 0 ? "start" : index === STEPS.length - 1 ? "end" : "center",
            }}
          >
            <span
              className={`step-label ${
                currentStep === step.number ? "active" : currentStep > step.number ? "done" : ""
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
