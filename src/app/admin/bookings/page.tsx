// src/app/admin/bookings/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import BookingsTable from "@/components/admin/BookingsTable";
import AdminBookingsCalendar from "@/components/admin/AdminBookingsCalendar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BookingWithDetails } from "@/lib/supabase/types";

export default function AdminBookingsPage() {
  const [bookings,   setBookings]   = useState<BookingWithDetails[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [view, setView] = useState<"table" | "calendar">("table");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);

      // Cookie is sent automatically for same-origin requests.
      const res = await fetch(
        `/api/admin/bookings${params.toString() ? `?${params}` : ""}`
      );
      const json = await res.json();
      if (json.success) setBookings(json.data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <span
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.6875rem",
            fontWeight:    500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "#D9B344",
            display:       "block",
            marginBottom:  "0.5rem",
          }}
        >
          Manage
        </span>
        <h1
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize:   "1.375rem",
            fontWeight: 400,
            color:      "#0F2341",
            lineHeight: 1.15,
          }}
        >
          Bookings
        </h1>
      </div>

      {/* Date filter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <label
            htmlFor="bookings-filter-date"
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.6875rem",
                fontWeight:    500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "#6B7A94",
              }}
            >
              Filter by date
            </span>
            <input
              id="bookings-filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-sevres"
              style={{ width: "auto", padding: "0.5rem 0.875rem", fontSize: "0.875rem" }}
            />
          </label>
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="btn-secondary btn-sm"
              style={{ alignSelf: "flex-end" }}
            >
              Clear
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className={`btn-secondary btn-sm${view === "table" ? " active" : ""}`} onClick={() => setView("table")}>
            Table
          </button>
          <button type="button" className={`btn-secondary btn-sm${view === "calendar" ? " active" : ""}`} onClick={() => setView("calendar")}>
            Calendar
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0" }}>
          <LoadingSpinner message="Loading bookings…" />
        </div>
      ) : view === "calendar" ? (
        <>
          <AdminBookingsCalendar
            bookings={bookings}
            selectedDate={filterDate || new Date().toISOString().slice(0, 10)}
            onSelectDate={setFilterDate}
          />
          <div style={{ marginTop: "1.5rem" }}>
            <BookingsTable bookings={bookings.filter((b) => !filterDate || b.date === filterDate)} onRefresh={fetchData} />
          </div>
        </>
      ) : (
        <BookingsTable bookings={bookings} onRefresh={fetchData} />
      )}
    </div>
  );
}