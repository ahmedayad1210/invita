"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { useAvailability } from "@/hooks/useBooking";
import TimeSlotGrid from "./TimeSlotGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLocale } from "@/contexts/LocaleContext";
import {
  getWeekDates,
  getCurrentWeekMonday,
  isStudioClosed,
  isPastDate,
  getTodayString,
  formatDateLabel,
  DAY_LABELS,
} from "@/lib/time-slots";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StepDateTime() {
  const { t, locale } = useLocale();
  const {
    selectedService,
    selectedStylist,
    selectedDate,
    selectedTimeSlot,
    setDate,
    nextStep,
    prevStep,
  } = useBookingStore();

  const [weekStart, setWeekStart] = useState(getCurrentWeekMonday());
  const weekDates = getWeekDates(weekStart);

  const { timeSlots, loading, error, refetch } = useAvailability(
    selectedStylist?.id ?? "",
    selectedDate,
    selectedService?.duration ?? 60
  );

  const PrevIcon = locale === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  useEffect(() => {
    if (!selectedDate) {
      const today = getTodayString();
      if (!isStudioClosed(today)) {
        setDate(today);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPrevWeek = () => {
    const current = new Date(weekStart + "T00:00:00");
    current.setDate(current.getDate() - 7);
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, "0");
    const d = current.getDate().toString().padStart(2, "0");
    setWeekStart(`${y}-${m}-${d}`);
  };

  const goToNextWeek = () => {
    const current = new Date(weekStart + "T00:00:00");
    current.setDate(current.getDate() + 7);
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, "0");
    const d = current.getDate().toString().padStart(2, "0");
    setWeekStart(`${y}-${m}-${d}`);
  };

  const today = getTodayString();
  const currentMonday = getCurrentWeekMonday();
  const isPrevDisabled = weekStart <= currentMonday;

  const scheduleLead = selectedStylist
    ? t.book.scheduleWith.replace("{name}", selectedStylist.name)
    : t.book.scheduleLead;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 className="step-title">{t.book.scheduleTitle}</h2>
        <p className="step-desc">{scheduleLead}</p>
      </div>

      <div className="booking-schedule-card">
        <div className="booking-week-nav">
          <button
            type="button"
            onClick={goToPrevWeek}
            disabled={isPrevDisabled}
            className="booking-week-nav-btn"
            aria-label="Previous week"
          >
            <PrevIcon size={16} />
          </button>

          <span className="booking-week-label">
            {new Date(weekStart + "T00:00:00").toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-IN", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button type="button" onClick={goToNextWeek} className="booking-week-nav-btn" aria-label="Next week">
            <NextIcon size={16} />
          </button>
        </div>

        <div className="booking-day-labels">
          {DAY_LABELS.map((label) => (
            <div key={label} className="booking-day-label">
              {label}
            </div>
          ))}
        </div>

        <div className="booking-day-grid">
          {weekDates.map((date) => {
            const closed = isStudioClosed(date);
            const past = isPastDate(date);
            const disabled = closed || past;
            const isToday = date === today;
            const isSelected = date === selectedDate;

            return (
              <button
                key={date}
                type="button"
                onClick={() => !disabled && setDate(date)}
                disabled={disabled}
                className={`calendar-day ${isSelected ? "selected" : ""} ${isToday && !isSelected ? "today" : ""} ${disabled ? "disabled" : ""}`}
                title={
                  closed ? t.book.closedDay : past ? t.book.pastDay : formatDateLabel(date)
                }
              >
                {new Date(date + "T00:00:00").getDate()}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <p className="booking-selected-date">{formatDateLabel(selectedDate)}</p>
        )}
      </div>

      {selectedDate && (
        <div className="booking-schedule-card" style={{ marginBottom: "2rem" }}>
          <h4 className="booking-times-title">{t.book.availableTimes}</h4>

          {loading ? (
            <LoadingSpinner message={t.book.checkingAvailability} />
          ) : error ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <p className="step-desc">{t.book.availabilityError}</p>
              <button type="button" onClick={refetch} className="btn-ghost btn-sm">
                {t.common.tryAgain}
              </button>
            </div>
          ) : (
            <TimeSlotGrid slots={timeSlots} />
          )}
        </div>
      )}

      <div className="step-actions">
        <button type="button" onClick={prevStep} className="btn-secondary btn-sm">
          {t.common.back}
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!selectedDate || !selectedTimeSlot}
          className="btn-primary"
          style={{
            opacity: selectedDate && selectedTimeSlot ? 1 : 0.45,
            cursor: selectedDate && selectedTimeSlot ? "pointer" : "not-allowed",
          }}
        >
          {t.book.continueIntake}
        </button>
      </div>
    </div>
  );
}
