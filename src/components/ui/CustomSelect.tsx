// src/components/ui/CustomSelect.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options:      SelectOption[];
  value:        string;
  onChange:     (value: string) => void;
  placeholder?: string;
  disabled?:    boolean;
  error?:       string;
  label?:       string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled    = false,
  error,
  label,
}: CustomSelectProps) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {label && <label className="label-sevres">{label}</label>}
      <div ref={ref} style={{ position: "relative" }}>
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((p) => !p)}
          style={{
            width:           "100%",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            padding:         "0.875rem 1.125rem",
            backgroundColor: "#FFFFFF",
            border:          `1.5px solid ${error ? "#D9B344" : open ? "#D9B344" : "rgba(107,122,148,0.25)"}`,
            borderRadius:    "0.5rem",
            fontFamily:      "'DM Sans', sans-serif",
            fontSize:        "0.9375rem",
            color:           selected ? "#0F2341" : "#6B7A94",
            cursor:          disabled ? "not-allowed" : "pointer",
            opacity:         disabled ? 0.6 : 1,
            transition:      "all 0.3s ease",
            textAlign:       "left",
            boxShadow:       open ? "0 0 0 3px rgba(217,179,68,0.12)" : "none",
          }}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDown
            size={16}
            color="#6B7A94"
            style={{
              transform:  open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              flexShrink: 0,
            }}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            style={{
              position:        "absolute",
              top:             "calc(100% + 6px)",
              left:            0,
              right:           0,
              backgroundColor: "#FFFFFF",
              border:          "1.5px solid rgba(217,179,68,0.2)",
              borderRadius:    "0.5rem",
              boxShadow:       "0 8px 32px rgba(15,35,65,0.12)",
              zIndex:          50,
              overflow:        "hidden",
              animation:       "scaleIn 0.2s ease forwards",
            }}
          >
            {/* Placeholder option */}
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              style={{
                width:       "100%",
                padding:     "0.75rem 1.125rem",
                textAlign:   "left",
                fontFamily:  "'DM Sans', sans-serif",
                fontSize:    "0.9375rem",
                color:       "#6B7A94",
                background:  "none",
                border:      "none",
                cursor:      "pointer",
                borderBottom: "1px solid rgba(107,122,148,0.1)",
              }}
            >
              {placeholder}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setOpen(false); }}
                style={{
                  width:           "100%",
                  padding:         "0.75rem 1.125rem",
                  textAlign:       "left",
                  fontFamily:      "'DM Sans', sans-serif",
                  fontSize:        "0.9375rem",
                  color:           option.value === value ? "#D9B344" : "#0F2341",
                  backgroundColor: option.value === value ? "rgba(217,179,68,0.06)" : "transparent",
                  fontWeight:      option.value === value ? 500 : 400,
                  border:          "none",
                  cursor:          "pointer",
                  transition:      "background-color 0.2s ease",
                  display:         "block",
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    (e.target as HTMLElement).style.backgroundColor = "rgba(217,179,68,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}