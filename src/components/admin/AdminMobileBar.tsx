"use client";

import Link             from "next/link";
import { usePathname }  from "next/navigation";
import { useAdmin }     from "@/hooks/useAdmin";
import { LayoutDashboard, Scissors, Users, CalendarDays, LogOut, ImageIcon, Contact } from "lucide-react";

const MOBILE_NAV = [
  { label: "Dashboard", href: "/admin",           icon: <LayoutDashboard size={20} /> },
  { label: "Bookings",  href: "/admin/bookings",   icon: <CalendarDays    size={20} /> },
  { label: "Patients",  href: "/admin/patients",   icon: <Contact         size={20} /> },
  { label: "Media",     href: "/admin/media",      icon: <ImageIcon       size={20} /> },
  { label: "Services",  href: "/admin/services",   icon: <Scissors        size={20} /> },
  { label: "Stylists",  href: "/admin/stylists",   icon: <Users           size={20} /> },
];

export default function AdminMobileBar() {
  const pathname   = usePathname();
  const { logout } = useAdmin();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="admin-mobile-bar">
      <span
        style={{
          fontFamily:    "'Cormorant Garamond', Georgia, serif",
          fontSize:      "1.125rem",
          fontWeight:    300,
          color:         "#FAF7F2",
          letterSpacing: "0.06em",
        }}
      >
        Invita Admin
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`admin-mobile-icon${isActive(item.href) ? " active" : ""}`}
          >
            {item.icon}
          </Link>
        ))}
        <button
          onClick={logout}
          title="Sign out"
          className="admin-mobile-icon"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
