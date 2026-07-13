import type { Metadata } from "next";
import "./globals.css";
import "./just-drip.css";
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
import { Alexandria } from "next/font/google";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-alexandria",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: `${INVITA.name} — مغذيات وريدية`,
    template: `%s | ${INVITA.name}`,
  },
  description:
    "إنفيتا — فيتامينات وريدية في بغداد. 13 بروتوكول JUST DRIP، تبدأ من 150,000 دينار. حصرياً للعيادات والمراكز المرخصة.",
  keywords: [
    "مغذيات وريدية",
    "فيتامينات وريدية بغداد",
    "إنفيتا",
    "Invita",
    "IV therapy Iraq",
    "Liquivida Iraq",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: {
      "ar-IQ": siteUrl,
      "en-IQ": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    siteName: INVITA.name,
    title: `${INVITA.name} — JUST DRIP`,
    description:
      "فيتامينات وريدية من إنفيتا — طريقك الأقصر لصحة أفضل. بغداد، العراق.",
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
    <html lang="ar" dir="rtl" suppressHydrationWarning className={alexandria.variable}>
      <body className="bg-ivory text-charcoal antialiased font-sans">
        <FigmaCaptureLoader />
        <a href="#main-content" className="skip-link">
          انتقل إلى المحتوى
        </a>
        <NavigationProgressWrapper />
        <LocaleProvider>
          <AuthProvider>
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
