import { LIQUIVIDA } from "@/lib/invita/liquivida-drips";

type Props = {
  variant?: "inline" | "block";
  className?: string;
};

export default function LiquividaBadge({ variant = "inline", className = "" }: Props) {
  return (
    <div
      className={`liquivida-badge ${variant === "block" ? "liquivida-badge-block" : ""} ${className}`}
      title={LIQUIVIDA.website}
    >
      <span className="liquivida-badge-flag">🇺🇸</span>
      <span className="liquivida-badge-text">
        <strong>{LIQUIVIDA.badgeEn}</strong>
        <em>{LIQUIVIDA.distributorEn}</em>
      </span>
    </div>
  );
}
