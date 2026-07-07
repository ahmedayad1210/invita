"use client";

import { INVITA } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactInfo() {
  const items = [
    { icon: <MapPin size={16} />, label: "Address", value: INVITA.address.full },
    { icon: <Phone size={16} />, label: "Phone", value: INVITA.phone },
    { icon: <Mail size={16} />, label: "Email", value: INVITA.email },
    {
      icon: <Clock size={16} />,
      label: "Hours",
      value: `${INVITA.hours.weekdays}\n${INVITA.hours.friday}\n${INVITA.hours.saturday}`,
    },
  ];

  return (
    <div>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.875rem",
          fontWeight: 400,
          color: "#2C1810",
          marginBottom: "2rem",
        }}
      >
        Clinic information
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                backgroundColor: "rgba(196,149,106,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C4956A",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8B7355",
                  marginBottom: "0.25rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9375rem",
                  color: "#2C1810",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderRadius: "0.75rem",
          overflow: "hidden",
          border: "1px solid rgba(196,149,106,0.15)",
          height: "240px",
        }}
      >
        <iframe
          src={INVITA.map.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          title="Invita location map"
        />
      </div>
    </div>
  );
}
