"use client";

import { useMemo } from "react";
import type { BookingWithDetails } from "@/lib/supabase/types";
import { formatTimeLabel } from "@/lib/time-slots";

type Props = {
  bookings: BookingWithDetails[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

const STATUS_COLOR: Record<string, string> = {
  pending: "#6B7A94",
  confirmed: "#D9B344",
  cancelled: "#ccc",
};

export default function AdminBookingsCalendar({ bookings, selectedDate, onSelectDate }: Props) {
  const weekDays = useMemo(() => {
    const base = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
    const start = new Date(base);
    start.setDate(base.getDate() - base.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  }, [selectedDate]);

  const byDate = useMemo(() => {
    const map = new Map<string, BookingWithDetails[]>();
    for (const b of bookings) {
      const list = map.get(b.date) ?? [];
      list.push(b);
      map.set(b.date, list);
    }
    return map;
  }, [bookings]);

  return (
    <div className="admin-bookings-calendar">
      <div className="admin-bookings-calendar-grid">
        {weekDays.map((date) => {
          const dayBookings = (byDate.get(date) ?? []).sort((a, b) =>
            a.time_slot.localeCompare(b.time_slot)
          );
          const active = date === selectedDate;

          return (
            <button
              key={date}
              type="button"
              className={`admin-bookings-calendar-day${active ? " active" : ""}`}
              onClick={() => onSelectDate(date)}
            >
              <span className="admin-bookings-calendar-date">{date}</span>
              <ul>
                {dayBookings.length === 0 ? (
                  <li className="empty">—</li>
                ) : (
                  dayBookings.map((b) => (
                    <li key={b.id} style={{ borderLeftColor: STATUS_COLOR[b.status] ?? "#ccc" }}>
                      <strong>{formatTimeLabel(b.time_slot)}</strong>
                      <span>{b.service?.name ?? "Session"}</span>
                      <em>{b.guest_name ?? b.profile?.full_name ?? "Patient"}</em>
                    </li>
                  ))
                )}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
