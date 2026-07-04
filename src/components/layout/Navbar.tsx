// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";
import { NAV_LINKS, INVITA } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

import { useLocale } from "@/contexts/LocaleContext";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import { LOCAL_IMAGES } from "@/lib/invita/local-media";

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const pathname                  = usePathname();
  const router                    = useRouter();
  const { user, initialized, signOut } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const startProgress = () => window.dispatchEvent(new Event("navigation-start"));

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  };

  // ── Scroll detection ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Lock body scroll when menu open ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Close menu on route change ──
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const path = href.split("#")[0] || "/";
    if (href.includes("#")) {
      return pathname === path || (path === "/" && pathname === "/");
    }
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <header className={`navbar-pill ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="navbar-brand navbar-brand-lockup">
          <Image
            src={LOCAL_IMAGES.logoWordmark}
            alt="Invita — IV Vitamins Therapy"
            width={120}
            height={28}
            className="navbar-brand-wordmark"
            priority
          />
        </Link>
        <div className="navbar-liquivida desktop-cta">
          <LiquividaBadge />
        </div>

        <nav
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.25rem",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.8rem",
                fontWeight:    isActive(link.href) ? 500 : 400,
                letterSpacing: "0.06em",
                color:         isActive(link.href) ? "#0F2341" : "#6B7A94",
                padding:       "0.375rem 0.875rem",
                borderRadius:  "9999px",
                backgroundColor: isActive(link.href)
                  ? "rgba(15,35,65,0.06)"
                  : "transparent",
                transition:    "all 0.25s ease",
                whiteSpace:    "nowrap",
              }}
              onClick={startProgress}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) {
                  e.currentTarget.style.color           = "#0F2341";
                  e.currentTarget.style.backgroundColor = "rgba(15,35,65,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) {
                  e.currentTarget.style.color           = "#6B7A94";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {locale === "en" ? link.label : link.labelAr}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            className="locale-toggle desktop-cta"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            aria-label="Toggle language"
          >
            {locale === "en" ? "عربي" : "EN"}
          </button>
          {/* My Account + Sign Out — desktop, logged in only */}
          {user && (
            <>
              <Link
                href="/account"
                className="desktop-cta"
                style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  gap:             "0.5rem",
                  fontFamily:      "'DM Sans', sans-serif",
                  fontSize:        "0.8rem",
                  fontWeight:      500,
                  color:           "#0F2341",
                  padding:         "0.375rem 0.875rem 0.375rem 0.375rem",
                  borderRadius:    "9999px",
                  border:          "1.5px solid rgba(15,35,65,0.12)",
                  transition:      "all 0.25s ease",
                  whiteSpace:      "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(196,149,106,0.5)";
                  e.currentTarget.style.color = "#D9B344";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(15,35,65,0.12)";
                  e.currentTarget.style.color = "#0F2341";
                }}
              >
                <span style={{
                  width:           "26px",
                  height:          "26px",
                  borderRadius:    "9999px",
                  background:      "linear-gradient(135deg, #D9B344 0%, #B8965A 100%)",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  color:           "#F0EDE4",
                  fontSize:        "0.625rem",
                  fontWeight:      600,
                  letterSpacing:   "0.05em",
                  flexShrink:      0,
                }}>
                  {user.email?.slice(0, 2).toUpperCase()}
                </span>
                My Account
              </Link>

              <button
                onClick={handleSignOut}
                className="desktop-cta"
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      "0.8rem",
                  fontWeight:    400,
                  letterSpacing: "0.06em",
                  color:         "#6B7A94",
                  padding:       "0.375rem 0.75rem",
                  borderRadius:  "9999px",
                  background:    "none",
                  border:        "none",
                  cursor:        "pointer",
                  transition:    "all 0.25s ease",
                  whiteSpace:    "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#0F2341"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7A94"; }}
              >
                Sign Out
              </button>
            </>
          )}

          {/* Sign In — desktop, logged out only, after auth is confirmed */}
          {initialized && !user && (
            <Link
              href="/auth/login"
              className="desktop-cta"
              style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "0.8rem",
                fontWeight:    400,
                letterSpacing: "0.06em",
                color:         "#6B7A94",
                padding:       "0.375rem 0.75rem",
                borderRadius:  "9999px",
                transition:    "all 0.25s ease",
                whiteSpace:    "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#0F2341"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7A94"; }}
            >
              Sign In
            </Link>
          )}

          {/* Book Now CTA — desktop */}
          <Link
            href="/book"
            className="btn-primary btn-sm desktop-cta"
          >
            {t.nav.book}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="hamburger-btn"
            style={{
              width:           "38px",
              height:          "38px",
              borderRadius:    "9999px",
              border:          "1.5px solid rgba(15,35,65,0.15)",
              backgroundColor: menuOpen ? "#0F2341" : "transparent",
              alignItems:      "center",
              justifyContent:  "center",
              color:           menuOpen ? "#F0EDE4" : "#0F2341",
              transition:      "all 0.3s ease",
              flexShrink:      0,
            }}
            onMouseEnter={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.backgroundColor = "rgba(15,35,65,0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Full Screen Overlay Menu ── */}
      <div
        className={`overlay-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button top right */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{
            position:        "fixed",
            top:             "1.5rem",
            right:           "1.75rem",
            width:           "44px",
            height:          "44px",
            borderRadius:    "9999px",
            border:          "1.5px solid rgba(15,35,65,0.2)",
            backgroundColor: "transparent",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            color:           "#0F2341",
            transition:      "all 0.3s ease",
            zIndex:          61,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0F2341";
            e.currentTarget.style.color           = "#F0EDE4";
            e.currentTarget.style.borderColor     = "#0F2341";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color           = "#0F2341";
            e.currentTarget.style.borderColor     = "rgba(15,35,65,0.2)";
          }}
        >
          <X size={18} />
        </button>

        {/* Brand mark in overlay */}
        <div
          style={{
            position:      "absolute",
            top:           "1.75rem",
            left:          "50%",
            transform:     "translateX(-50%)",
            fontFamily:    "'Cormorant Garamond', Georgia, serif",
            fontSize:      "1.125rem",
            fontWeight:    300,
            color:         "#0F2341",
            letterSpacing: "0.1em",
            opacity:       0.5,
            whiteSpace:    "nowrap",
          }}
        >
          Invita
        </div>

        {/* Nav links */}
        <nav
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            "0.25rem",
            textAlign:      "center",
          }}
        >
          {NAV_LINKS.map((link) => {
            return (
              <div key={link.href} className="overlay-nav-item">
                <Link
                  href={link.href}
                  className="overlay-menu-link"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: isActive(link.href) ? "#D9B344" : "#0F2341",
                  }}
                >
                  {locale === "en" ? link.label : link.labelAr}
                </Link>
              </div>
            );
          })}

          <div className="overlay-nav-item" style={{ marginTop: "1rem" }}>
            <Link
              href="/book"
              className="btn-primary"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "0.8125rem" }}
            >
              {t.nav.book}
            </Link>
          </div>

          {/* Auth links in overlay */}
          <div
            className="overlay-nav-item"
            style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
          >
            {user ? (
              <>
                <Link
                  href="/account"
                  className="btn-primary"
                  onClick={() => setMenuOpen(false)}
                  style={{ fontSize: "0.8125rem" }}
                >
                  My Account
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      "0.8125rem",
                    fontWeight:    400,
                    letterSpacing: "0.08em",
                    color:         "#6B7A94",
                    background:    "none",
                    border:        "none",
                    cursor:        "pointer",
                    padding:       "0.25rem 0",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="btn-secondary"
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "0.8125rem" }}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Bottom bar in overlay */}
        <div
          style={{
            position:   "absolute",
            bottom:     "2.5rem",
            left:       0,
            right:      0,
            textAlign:  "center",
          }}
        >
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.75rem",
              color:         "#6B7A94",
              letterSpacing: "0.1em",
            }}
          >
            {INVITA.address.full}
          </p>
        </div>
      </div>
    </>
  );
}