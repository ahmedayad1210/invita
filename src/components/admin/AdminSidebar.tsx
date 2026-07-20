"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import {
  LayoutDashboard,
  Scissors,
  Users,
  LogOut,
  CalendarDays,
  ImageIcon,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin",           icon: <LayoutDashboard size={16} /> },
  { label: "Bookings",  href: "/admin/bookings",   icon: <CalendarDays    size={16} /> },
  { label: "Enquiries", href: "/admin/leads",      icon: <Users           size={16} /> },
  { label: "Patients", href: "/admin/patients", icon: <Users size={16} /> },
  { label: "Media",     href: "/admin/media",      icon: <ImageIcon       size={16} /> },
  { label: "Certificates", href: "/admin/certifications", icon: <Users   size={16} /> },
  { label: "DNA Lab",   href: "/admin/dna",        icon: <Users           size={16} /> },
  { label: "Services",  href: "/admin/services",   icon: <Scissors        size={16} /> },
  { label: "Clinicians", href: "/admin/stylists",  icon: <Users           size={16} /> },
];

export default function AdminSidebar() {
  const pathname   = usePathname();
  const { logout } = useAdmin();

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            fontFamily:    "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize:      "1.375rem",
            fontWeight:    300,
            color:         "#F6FAFB",
            letterSpacing: "0.08em",
            marginBottom:  "0.25rem",
          }}
        >
          Invita
        </p>
        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.6875rem",
            fontWeight:    500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "rgba(15,181,168,0.7)",
          }}
        >
          Admin Panel
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height:       "1px",
          background:   "linear-gradient(to right, rgba(15,181,168,0.3), transparent)",
          marginBottom: "2rem",
        }}
      />

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link ${isActive(item.href) ? "active" : ""}`}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
        <button
          onClick={logout}
          className="admin-nav-link"
          style={{ width: "100%", color: "rgba(15,181,168,0.7)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0FB5A8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(15,181,168,0.7)")}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
