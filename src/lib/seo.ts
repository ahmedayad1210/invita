import { INVITA } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invitadrips.com";

export function getSiteUrl(): string {
  return SITE_URL.replace(/\/$/, "");
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: INVITA.name,
    description:
      "Iraq's leading IV therapy company — official Liquivida® partner. Clinical IV formulas in a private Baghdad suite.",
    url: getSiteUrl(),
    telephone: INVITA.phone,
    email: INVITA.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: INVITA.address.city,
      addressCountry: INVITA.address.country,
      streetAddress: INVITA.address.line1,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "14:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      INVITA.social.instagram,
      INVITA.social.instagramDnaLab,
      INVITA.social.linkedin,
      INVITA.social.facebook,
    ],
  };
}

export function dripProcedureJsonLd(drip: {
  name: string;
  description: string;
  slug: string;
  priceIqd: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: drip.name,
    description: drip.description,
    url: `${getSiteUrl()}/iv-therapy/${drip.slug}`,
    provider: {
      "@type": "MedicalBusiness",
      name: INVITA.name,
      url: getSiteUrl(),
    },
    offers: {
      "@type": "Offer",
      price: drip.priceIqd,
      priceCurrency: "IQD",
      availability: "https://schema.org/InStock",
    },
  };
}
