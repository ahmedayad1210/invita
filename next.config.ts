import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Content Security Policy
// next, supabase, and emailjs all require certain relaxations.
// 'unsafe-inline' for scripts is needed by Next.js App Router hydration
// and EmailJS inline initialisation. Tighten via nonces in future.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://res.cloudinary.com https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.emailjs.com",
  "frame-src https://www.openstreetmap.org",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

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
        destination: "/iv-drip-menu",
        permanent: true,
      },
      {
        source: "/iv-therapy/nad-plus",
        destination: "/nad-plus",
        permanent: true,
      },
    ];
  },

  allowedDevOrigins: ["http://192.168.0.113:3000"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy",  value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
