import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Content Security Policy
// next, supabase, and emailjs all require certain relaxations.
// 'unsafe-inline' for scripts is needed by Next.js App Router hydration
// and EmailJS inline initialisation. Tighten via nonces in future.
const CSP_BASE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://res.cloudinary.com https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.emailjs.com",
  "frame-src https://www.openstreetmap.org",
  "base-uri 'self'",
  "form-action 'self'",
];

// Default policy: the page may not be framed by anyone.
const CSP = [...CSP_BASE, "frame-ancestors 'none'"].join("; ");

// The Sahar OS dashboards under /noloco/* are published as embeddable iframes
// (e.g. into Softr / Noloco / Netlify surfaces), so they must permit framing.
const CSP_EMBEDDABLE = [...CSP_BASE, "frame-ancestors *"].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },

  images: {
    qualities: [75, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname:  "images.unsplash.com",
        port:      "",
        pathname:  "/**",
      },
      {
        protocol: "https",
        hostname:  "res.cloudinary.com",
        port:      "",
        pathname:  "/**",
      },
      {
        protocol: "https",
        hostname:  "*.supabase.co",
        port:      "",
        pathname:  "/storage/v1/object/public/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/bookings",
        destination: "/account?section=bookings",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/iv-therapy",
        permanent: true,
      },
    ];
  },

  allowedDevOrigins: ["http://192.168.0.113:3000"],

  async headers() {
    const shared = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      {
        // Everything except the embeddable /noloco dashboards stays frame-locked.
        source: "/((?!noloco).*)",
        headers: [
          ...shared,
          { key: "X-Frame-Options",         value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        // Embeddable Sahar OS dashboards — framing allowed, no X-Frame-Options.
        source: "/noloco/:path*",
        headers: [
          ...shared,
          { key: "Content-Security-Policy", value: CSP_EMBEDDABLE },
        ],
      },
    ];
  },
};

export default nextConfig;
