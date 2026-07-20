// src/components/booking/StepConfirm.tsx
"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useSubmitBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDuration, formatDateLabel, formatTimeLabel } from "@/lib/time-slots";
import { INVITA } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import { buildBookingWhatsAppUrl } from "@/lib/invita/whatsapp-handoff";
import { CalendarDays, Clock, User, Stethoscope, MapPin, CheckCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function StepConfirm() {
  const { user, profile } = useAuth();
  const { t } = useLocale();

  const {
    selectedService,
    selectedStylist,
    selectedDate,
    selectedTimeSlot,
    selectedAddOns,
    notes,
    intake,
    guestName,
    guestPhone,
    guestEmail,
    setNotes,
    setGuest,
    prevStep,
    confirmedBookingId,
    bookedAsGuest,
    isSubmitting,
    submitError,
    setBookedAsGuest,
  } = useBookingStore();

  const { submitBooking } = useSubmitBooking();

  const handleConfirm = async () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTimeSlot) return;

    if (!user && (!guestName.trim() || !guestPhone.trim())) {
      useBookingStore.getState().setSubmitError("Name and phone are required for guest booking.");
      return;
    }

    setBookedAsGuest(!user);

    const success = await submitBooking({
      service_id:       selectedService.id,
      stylist_id:       selectedStylist.id,
      date:             selectedDate,
      time_slot:        selectedTimeSlot,
      notes:            notes || undefined,
      intake,
      add_ons:          selectedAddOns,
      service_duration: selectedService.duration,
      userId:           user?.id,
      userEmail:        user?.email ?? guestEmail ?? "",
      userName:         profile?.full_name ?? guestName ?? user?.email ?? "Guest",
      guest_name:       user ? undefined : guestName.trim(),
      guest_phone:      user ? undefined : guestPhone.trim(),
      guest_email:      user ? undefined : guestEmail.trim() || undefined,
    });

    if (success) {
      // Stay on step 6 — show success state
    }
  };

  // ── Success state ──
  const whatsappUrl =
    confirmedBookingId && selectedService && selectedStylist
      ? buildBookingWhatsAppUrl({
          bookingRef: confirmedBookingId,
          serviceName: selectedService.name,
          stylistName: selectedStylist.name,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          guestName: profile?.full_name ?? guestName ?? undefined,
        })
      : INVITA.whatsapp;

  if (confirmedBookingId) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <div
          style={{
            width:           "72px",
            height:          "72px",
            borderRadius:    "9999px",
            backgroundColor: "rgba(15,181,168,0.1)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            margin:          "0 auto 1.5rem",
          }}
        >
          <CheckCircle size={32} color="#0FB5A8" />
        </div>

        <h2
          style={{
            fontFamily:   "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
            fontSize:     "2.25rem",
            fontWeight:   400,
            color:        "#0C2430",
            marginBottom: "0.75rem",
          }}
        >
          {t.book.successPending}
        </h2>

        <div className="divider-rose" />

        <p
          style={{
            fontFamily:   "'DM Sans', sans-serif",
            fontSize:     "0.9375rem",
            color:        "#6B7A94",
            lineHeight:   1.75,
            maxWidth:     "440px",
            margin:       "0 auto 0.75rem",
          }}
        >
          {bookedAsGuest ? t.book.successPendingGuest : t.book.successPendingBody}
        </p>

        {!bookedAsGuest && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#6B7A94",
              maxWidth: "440px",
              margin: "0 auto 1rem",
            }}
          >
            {t.book.successAccount}
          </p>
        )}

        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.8125rem",
            color:         "#6B7A94",
            letterSpacing: "0.05em",
            marginBottom:  "2.5rem",
          }}
        >
          {t.book.bookingRef}: <strong style={{ color: "#0FB5A8" }}>{confirmedBookingId.slice(0, 8).toUpperCase()}</strong>
        </p>

        {/* Summary pill */}
        <div
          style={{
            display:         "inline-flex",
            flexWrap:        "wrap",
            gap:             "1.5rem",
            backgroundColor: "#F6FAFB",
            borderRadius:    "0.75rem",
            padding:         "1.25rem 2rem",
            marginBottom:    "2rem",
            justifyContent:  "center",
          }}
        >
          {[
            { label: t.book.stepService, value: selectedService?.name ?? "" },
            { label: t.book.stepClinician, value: selectedStylist?.name ?? "" },
            { label: t.book.dateLabel, value: formatDateLabel(selectedDate) },
            { label: t.book.timeLabel, value: formatTimeLabel(selectedTimeSlot) },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      "0.6rem",
                  fontWeight:    500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color:         "#6B7A94",
                  marginBottom:  "0.25rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.875rem",
                  fontWeight: 500,
                  color:      "#0C2430",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {!bookedAsGuest && (
            <Link href="/account" className="btn-primary">
              {t.nav.myAccount}
            </Link>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle size={16} aria-hidden="true" />
            {t.book.chatWhatsApp}
          </a>
          <Link
            href="/"
            className="btn-secondary"
            onClick={() => useBookingStore.getState().resetBooking()}
          >
            {t.book.goHome}
          </Link>
        </div>
      </div>
    );
  }

  // ── Guest without contact yet (fallback) ──
  if (!user && (!guestName.trim() || !guestPhone.trim())) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 className="page-title page-title--compact">{t.book.guestConfirmTitle}</h2>
          <p className="page-lead page-lead--narrow">{t.book.guestConfirmLead}</p>
        </div>

        <label className="intake-field">
          <span>{t.intake.fullName} *</span>
          <input className="input-sevres" value={guestName} onChange={(e) => setGuest({ guestName: e.target.value })} required />
        </label>
        <label className="intake-field">
          <span>{t.intake.phone} *</span>
          <input className="input-sevres" value={guestPhone} onChange={(e) => setGuest({ guestPhone: e.target.value })} required />
        </label>
        <label className="intake-field">
          <span>{t.intake.emailOptional}</span>
          <input className="input-sevres" type="email" value={guestEmail} onChange={(e) => setGuest({ guestEmail: e.target.value })} />
        </label>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <button type="button" className="btn-primary" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? t.book.confirming : t.book.confirmBooking}
          </button>
          <Link href="/auth/login?redirectTo=/book" className="btn-secondary">
            {t.nav.login}
          </Link>
        </div>

        {submitError ? <p style={{ color: "#b44", marginTop: "1rem" }}>{submitError}</p> : null}

        <button type="button" onClick={prevStep} className="btn-secondary btn-sm" style={{ marginTop: "1rem" }}>
          {t.common.back}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 className="step-title">{t.book.reviewTitle}</h2>
        <p className="step-desc">{t.book.reviewLead}</p>
      </div>

      {/* Summary card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius:    "0.75rem",
          border:          "1px solid rgba(15,181,168,0.15)",
          overflow:        "hidden",
          marginBottom:    "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#0C2430",
            padding:         "1.25rem 1.5rem",
          }}
        >
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color:         "rgba(250,247,242,0.6)",
            }}
          >
            Booking Summary — Invita
          </p>
        </div>

        {/* Details */}
        <div style={{ padding: "1.5rem" }}>
          {[
            {
              icon:  <Stethoscope size={15} />,
              label: t.book.stepService,
              value: selectedService
                ? `${selectedService.name} · ${formatDuration(selectedService.duration)}`
                : "",
              sub: selectedService ? formatPrice(selectedService.price) : "",
            },
            {
              icon:  <User size={15} />,
              label: t.book.stepClinician,
              value: selectedStylist?.name ?? "",
              avatar: selectedStylist?.name,
            },
            {
              icon:  <CalendarDays size={15} />,
              label: t.book.dateLabel,
              value: formatDateLabel(selectedDate),
            },
            {
              icon:  <Clock size={15} />,
              label: t.book.timeLabel,
              value: formatTimeLabel(selectedTimeSlot),
            },
            {
              icon:  <MapPin size={15} />,
              label: "Location",
              value: INVITA.address.full,
            },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                display:       "flex",
                alignItems:    "flex-start",
                gap:           "1rem",
                paddingBottom: i < 4 ? "1.125rem" : 0,
                marginBottom:  i < 4 ? "1.125rem" : 0,
                borderBottom:  i < 4 ? "1px solid rgba(15,181,168,0.1)" : "none",
              }}
            >
              <div
                style={{
                  width:           "34px",
                  height:          "34px",
                  borderRadius:    "9999px",
                  backgroundColor: "rgba(15,181,168,0.1)",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  color:           "#0FB5A8",
                  flexShrink:      0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      "0.6875rem",
                    fontWeight:    500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:         "#6B7A94",
                    marginBottom:  "0.2rem",
                  }}
                >
                  {item.label}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {item.avatar && (
                    <InitialsAvatar name={item.avatar} size={22} fontSize={9} />
                  )}
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   "0.9375rem",
                      fontWeight: 500,
                      color:      "#0C2430",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
                {item.sub && (
                  <p
                    style={{
                      fontFamily:  "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
                      fontSize:    "1.125rem",
                      color:       "#0FB5A8",
                      marginTop:   "0.125rem",
                    }}
                  >
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label className="label-sevres">
          Special requests or notes (optional)
        </label>
        <textarea
          className="input-sevres"
          rows={3}
          placeholder="Allergies, preferences, or anything we should know…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ resize: "vertical", minHeight: "80px" }}
        />
      </div>

      {/* Error */}
      {submitError && (
        <div
          style={{
            padding:         "0.875rem 1rem",
            backgroundColor: "rgba(15,181,168,0.08)",
            border:          "1px solid rgba(15,181,168,0.25)",
            borderRadius:    "0.5rem",
            marginBottom:    "1.5rem",
          }}
        >
          <p className="error-text" style={{ marginTop: 0 }}>{submitError}</p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={prevStep} className="btn-secondary btn-sm" disabled={isSubmitting}>
          {t.common.back}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor:  isSubmitting ? "not-allowed" : "pointer",
            minWidth: "180px",
          }}
        >
          {isSubmitting ? t.book.confirming : t.book.confirmBooking}
        </button>
      </div>
    </div>
  );
}