import { formatIqd, PRICING_DISCLAIMER_EN, PRICING_DISCLAIMER_AR } from "@/lib/format";

type PriceDisplayProps = {
  amount: number;
  locale?: "en" | "ar";
  showDisclaimer?: boolean;
  size?: "md" | "lg";
};

export default function PriceDisplay({
  amount,
  locale = "en",
  showDisclaimer = true,
  size = "md",
}: PriceDisplayProps) {
  const disclaimer = locale === "ar" ? PRICING_DISCLAIMER_AR : PRICING_DISCLAIMER_EN;

  return (
    <div className={`price-display price-display--${size}`}>
      <p className="price-display-amount">{formatIqd(amount, locale)}</p>
      {showDisclaimer ? <p className="price-display-disclaimer">{disclaimer}</p> : null}
    </div>
  );
}
