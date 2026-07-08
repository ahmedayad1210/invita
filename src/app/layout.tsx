import type { Metadata } from "next";
import "./globals.css";
import "./invita-pages.css";
import "./invita-premium.css";
import "./invita-assets.css";
import { INVITA } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";
import NavigationProgressWrapper from "@/components/ui/NavigationProgressWrapper";
import MobileConversionBar from "@/components/layout/MobileConversionBar";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import CallFab from "@/components/layout/CallFab";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import FigmaCaptureLoader from "@/components/dev/FigmaCaptureLoader";
import ClientShell from "@/components/layout/ClientShell";
import PromoStrip from "@/components/layout/PromoStrip";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import localFont from "next/font/local";

const plain = localFont({
  src: [
    { path: "../../public/fonts/plain/Plain-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/plain/Plain-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/plain/Plain-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/plain/Plain-Bold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-plain",
  display: "swap",
  fallback: ["DM Sans", "Helvetica Neue", "sans-serif"],
});

const siteUrl = getSiteUrl();

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${INVITA.name} — ${INVITA.tagline}`,
    template: `%s | ${INVITA.name}`,
  },
  description:
    "Iraq's leading IV therapy company. Official Liquivida® partner — premium clinical IV formulas, professional training, and nationwide supply for clinics, hospitals, and patients.",
  keywords: [
    "IV therapy Iraq",
    "IV drips Baghdad",
    "Invita",
    "Liquivida Iraq",
    "IV therapy clinics Iraq",
    "medical IV wellness",
    "B2B IV supply Iraq",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IQ": siteUrl,
      "ar-IQ": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IQ",
    siteName: INVITA.name,
    title: `${INVITA.name} — ${INVITA.tagline}`,
    description:
      "Iraq's leading IV therapy company. Official Liquivida® partner — clinical IV formulas, professional training, and nationwide supply for clinics and patients.",
    url: siteUrl,
    images: [{ url: "/og/default.svg", width: 1200, height: 630, alt: INVITA.name }],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: INVITA.name,
    statusBarStyle: "default",
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${plain.variable}`}
    >
      <body className="bg-ivory text-charcoal antialiased">
        <FigmaCaptureLoader />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NavigationProgressWrapper />
        <LocaleProvider>
          <AuthProvider>
            <PromoStrip />
            {children}
            <MobileConversionBar />
            <WhatsAppFab />
            <CallFab />
            <ClientShell />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
