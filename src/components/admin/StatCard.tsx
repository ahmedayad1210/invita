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
        borderLeft: accent ? "3px solid #D9B344" : "1px solid rgba(217,179,68,0.12)",
      }}
    >
      <p
        style={{
          fontFamily:    "'DM Sans', sans-serif",
          fontSize:      "0.6875rem",
          fontWeight:    500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color:         "#6B7A94",
          marginBottom:  "0.75rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily:   "'Cormorant Garamond', Georgia, serif",
          fontSize:     "3rem",
          fontWeight:   300,
          color:        accent ? "#D9B344" : "#0F2341",
          lineHeight:   1,
          marginBottom: subLabel ? "0.5rem" : 0,
        }}
      >
        {value}
      </p>
      {subLabel && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "0.8125rem",
            color:      "#6B7A94",
          }}
        >
          {subLabel}
        </p>
      )}
    </div>
  );
}