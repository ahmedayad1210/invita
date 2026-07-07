"use client";

import { useState } from "react";
import Toast from "@/components/ui/Toast";
import type { BookingWithDetails } from "@/lib/supabase/types";

export default function RescheduleBookingModal({
  booking,
  onClose,
  onDone,
}: {
  booking: BookingWithDetails;
  onClose: () => void;
  onDone: () => void;
}) {
  const [date, setDate] = useState(booking.date);
  const [timeSlot, setTimeSlot] = useState(booking.time_slot);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: booking.id, action: "reschedule", date, time_slot: timeSlot }),
    });
    const json = await res.json();
    setLoading(false);

    if (!json.success) {
      setToast({ message: json.error ?? "Reschedule failed.", type: "error" });
      return;
    }

    onDone();
    onClose();
  };

  return (
    <div className="account-modal-backdrop" role="dialog" aria-modal="true">
      <div className="account-modal">
        <h3>Reschedule appointment</h3>
        <label className="intake-field">
          <span>Date</span>
          <input className="input-sevres" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="intake-field">
          <span>Time</span>
          <input className="input-sevres" type="time" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
        </label>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="button" className="btn-primary btn-sm" onClick={submit} disabled={loading}>
            {loading ? "Saving…" : "Save new time"}
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
