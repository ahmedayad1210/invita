"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard    from "@/components/admin/StatCard";
import BookingsTable from "@/components/admin/BookingsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatPrice } from "@/lib/time-slots";
import type { BookingWithDetails, DashboardStats } from "@/lib/supabase/types";

interface Props {
  username: string;
}

export default function AdminDashboard({ username }: Props) {
  const [bookings,   setBookings]   = useState<BookingWithDetails[]>([]);
  const [stats,      setStats]      = useState<DashboardStats | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [filterDate, setFilterDate] = useState<string>("");

  // Cookies are sent automatically for same-origin requests — no auth header needed.
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);

      const res  = await fetch(
        `/api/admin/bookings${params.toString() ? `?${params}` : ""}`
      );
      const json = await res.json();

      if (json.success) {
        const all: BookingWithDetails[] = json.data;
        setBookings(all);

        const now      = new Date();
        const todayStr = now.toISOString().split("T")[0];

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekStr = weekStart.toISOString().split("T")[0];

        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const confirmed = all.filter((b) => b.status !== "cancelled");

        setStats({
          bookings_today:      confirmed.filter((b) => b.date === todayStr).length,
          bookings_this_week:  confirmed.filter((b) => b.date >= weekStr).length,
          bookings_this_month: confirmed.filter((b) => b.date.startsWith(monthStr)).length,
          revenue_this_month:  confirmed
            .filter((b) => b.date.startsWith(monthStr) && b.status === "confirmed")
            .reduce((sum, b) => sum + (b.service?.price ?? 0), 0),
        });
      }
    } catch {
      // fail silently — table shows empty state
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
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="eyebrow">Welcome, {username}</span>
        <h1
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize:   "1.375rem",
            fontWeight: 400,
            color:      "#0F2341",
            lineHeight: 1.15,
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div
        className="stats-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap:                 "1rem",
          marginBottom:        "2rem",
        }}
      >
        <StatCard label="Bookings Today"  value={stats?.bookings_today      ?? "—"} accent />
        <StatCard label="This Week"       value={stats?.bookings_this_week  ?? "—"} />
        <StatCard label="This Month"      value={stats?.bookings_this_month ?? "—"} />
        <StatCard
          label="Revenue (Month)"
          value={stats ? formatPrice(stats.revenue_this_month) : "—"}
          subLabel="Confirmed bookings only"
        />
      </div>

      {/* Bookings table */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   "1.25rem",
          flexWrap:       "wrap",
          gap:            "1rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize:   "1.125rem",
            fontWeight: 400,
            color:      "#0F2341",
          }}
        >
          All Bookings
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <label
            htmlFor="dashboard-filter-date"
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
              id="dashboard-filter-date"
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
              style={{ whiteSpace: "nowrap", alignSelf: "flex-end" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0" }}>
          <LoadingSpinner message="Loading bookings…" />
        </div>
      ) : (
        <BookingsTable bookings={bookings} onRefresh={fetchData} />
      )}

      <style>{`
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
