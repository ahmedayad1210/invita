// src/components/admin/StatCard.tsx

interface StatCardProps {
  label:     string;
  value:     number | string;
  subLabel?: string;
  accent?:   boolean;
}

export default function StatCard({
  label,
  value,
  subLabel,
  accent = false,
}: StatCardProps) {
  return (
    <div
      className="stat-card"
      style={{
        borderLeft: accent ? "3px solid #D9B344" : undefined,
      }}
    >
      <p
        style={{
          fontFamily:    "'DM Sans', sans-serif",
          fontSize:      "0.6875rem",
          fontWeight:    600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color:         "#6B7A94",
          marginBottom:  "0.5rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily:        "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize:          "1.875rem",
          fontWeight:        600,
          fontVariantNumeric:"tabular-nums",
          color:             "#0F2341",
          lineHeight:        1.1,
          letterSpacing:     "-0.01em",
          marginBottom:      subLabel ? "0.35rem" : 0,
        }}
      >
        {value}
      </p>
      {subLabel && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.75rem",
            color:      "#6B7A94",
          }}
        >
          {subLabel}
        </p>
      )}
    </div>
  );
}