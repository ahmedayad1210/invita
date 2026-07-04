/** Format Iraqi Dinar amounts for display */
export function formatIqd(amount: number, locale: "en" | "ar" = "en"): string {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-IQ" : "en-IQ", {
    maximumFractionDigits: 0,
  }).format(amount);

  return locale === "ar" ? `${formatted} د.ع` : `${formatted} IQD`;
}

export const PRICING_DISCLAIMER_EN =
  "Price includes a complimentary medical assessment. Your clinician may recommend adjustments based on your individual needs.";

export const PRICING_DISCLAIMER_AR =
  "يشمل السعر تقييماً طبياً مجانياً. قد يوصي طبيبك بتعديلات بناءً على احتياجاتك الفردية.";
