// src/components/services/CategoryFilter.tsx
"use client";

import { SERVICE_CATEGORIES } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

interface CategoryFilterProps {
  active: string;
  onChange: (category: string) => void;
  /** Booking flow only lists bookable IV protocols */
  mode?: "booking" | "all";
}

type FilterCategory = {
  id: string;
  label: string;
};

export default function CategoryFilter({
  active,
  onChange,
  mode = "all",
}: CategoryFilterProps) {
  const { locale, t } = useLocale();

  const categories: FilterCategory[] =
    mode === "booking"
      ? [
          { id: "all", label: t.book.allServices },
          ...SERVICE_CATEGORIES.filter((c) => c.id === "iv-therapy").map((c) => ({
            id: c.id,
            label: locale === "ar" ? c.labelAr : c.label,
          })),
        ]
      : [
          { id: "all", label: locale === "ar" ? "كل الخدمات" : "All Services" },
          ...SERVICE_CATEGORIES.map((c) => ({
            id: c.id,
            label: locale === "ar" ? c.labelAr : c.label,
          })),
        ];

  return (
    <div className="category-filter">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`category-filter-btn${isActive ? " active" : ""}`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
