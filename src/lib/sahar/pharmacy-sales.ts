/**
 * Sahar Pharmacies — daily sales tracker data (مبيعات الصيدليات).
 *
 * Source of truth: the Noloco `sahar` project, tables
 *   - `dailyPharmacySalesTrackerPharmacies` (Pharmacies / روستر الفروع)
 *   - `dailyPharmacySalesTrackerDailySales`  (Daily_Sales / التسجيلات اليومية)
 * which in turn mirror the "Daily Pharmacy Sales Tracker" Airtable base.
 *
 * The values below are a real snapshot pulled from that project. It renders the
 * /noloco/sales dashboard immediately without any runtime credentials. To go
 * live, replace the body of `getPharmacySales()` with a fetch against the Noloco
 * data API (keyed by an env var) — the rest of the page consumes this shape and
 * needs no changes.
 */

export interface Pharmacy {
  /** Airtable/Noloco row id */
  id: number;
  /** Pharmacy name — اسم الصيدلية */
  name: string;
  /** Area / neighbourhood — الموقع */
  location: string;
  /** Branch manager — المدير */
  manager: string;
  /** Total daily target in IQD — الهدف اليومي الكلي */
  dailyTarget: number;
  /** Per-shift targets [morning, evening, guard] in IQD, when defined */
  shiftTargets?: { morning: number; evening: number; guard: number };
}

export interface DailySale {
  id: number;
  /** Business date (ISO) — تاريخ العمل */
  date: string;
  /** Employee who logged the shift — الموظف */
  employee: string;
  /** Daily target carried from the linked pharmacy — الهدف */
  target: number;
  /** Morning shift — الشفت الصباحي */
  morning?: number;
  /** Guard / overnight shift — الخفر */
  guard?: number;
  /** Evening shift — الشفت العصري */
  evening?: number;
  /** Lab income booked that day — دخل المختبر */
  lab?: number;
  /** Total sales for the day — إجمالي المبيعات */
  total: number;
  /** Achievement ratio vs. target (1 = 100%) — نسبة الإنجاز */
  achievement: number;
}

export interface PharmacySalesSnapshot {
  /** Human-readable "as of" label (Arabic) */
  asOf: string;
  /** ISO date the snapshot represents */
  asOfIso: string;
  pharmacies: Pharmacy[];
  dailySales: DailySale[];
}

/** Real branch roster — 10 active Sahar pharmacies. */
const PHARMACIES: Pharmacy[] = [
  {
    id: 104,
    name: "فريق د. نبأ صلاح",
    location: "بغداد",
    manager: "نبأ صلاح",
    dailyTarget: 20_000_000,
  },
  {
    id: 105,
    name: "تاج المنصور",
    location: "المنصور",
    manager: "د. زهراء",
    dailyTarget: 4_000_000,
  },
  {
    id: 102,
    name: "سحر العلاج",
    location: "فلكة ٨٣",
    manager: "محمد الباقر",
    dailyTarget: 4_000_000,
    shiftTargets: { morning: 1_125_000, evening: 1_875_000, guard: 1_000_000 },
  },
  {
    id: 109,
    name: "أحمد النعيمي",
    location: "الحبيبية",
    manager: "حسن",
    dailyTarget: 2_500_000,
    shiftTargets: { morning: 750_000, evening: 1_500_000, guard: 250_000 },
  },
  {
    id: 107,
    name: "روح الياس",
    location: "مدينة الصدر",
    manager: "مصطفى حنش",
    dailyTarget: 2_500_000,
    shiftTargets: { morning: 750_000, evening: 1_250_000, guard: 500_000 },
  },
  {
    id: 103,
    name: "سحر البنوك",
    location: "البنوك",
    manager: "نور حيدر",
    dailyTarget: 2_500_000,
    shiftTargets: { morning: 500_000, evening: 750_000, guard: 250_000 },
  },
  {
    id: 108,
    name: "عبير فرج",
    location: "الوشاش",
    manager: "د. أحمد",
    dailyTarget: 2_000_000,
  },
  {
    id: 101,
    name: "الحياة المركزية",
    location: "المنصور",
    manager: "علي يحيى",
    dailyTarget: 2_000_000,
  },
  {
    id: 100,
    name: "الميزان الطبي",
    location: "الدورة",
    manager: "إبراهيم",
    dailyTarget: 2_000_000,
  },
  {
    id: 106,
    name: "ريم الشفاء",
    location: "الطالبية",
    manager: "ريم النعيمي",
    dailyTarget: 1_500_000,
    shiftTargets: { morning: 750_000, evening: 1_250_000, guard: 500_000 },
  },
];

/** Most recent window of completed daily-sales entries (real records). */
const DAILY_SALES: DailySale[] = [
  { id: 345, date: "2026-07-14", employee: "منتظر جخيور", target: 4_000_000, morning: 650_000, total: 4_520_000, achievement: 1.13 },
  { id: 344, date: "2026-07-14", employee: "حمزه محمد", target: 1_500_000, morning: 125_000, guard: 330_000, evening: 585_000, total: 1_040_000, achievement: 0.6933 },
  { id: 341, date: "2026-07-15", employee: "منتظر جخيور", target: 4_000_000, morning: 794_000, total: 4_143_000, achievement: 1.03575 },
  { id: 342, date: "2026-07-15", employee: "منتظر جخيور", target: 4_000_000, morning: 645_000, total: 3_945_000, achievement: 0.98625 },
  { id: 346, date: "2026-07-15", employee: "حسن رحيم", target: 2_500_000, morning: 690_000, guard: 760_000, evening: 1_400_000, total: 2_850_000, achievement: 1.14 },
  { id: 347, date: "2026-07-15", employee: "مصطفى", target: 2_500_000, morning: 520_000, guard: 375_000, evening: 1_405_000, total: 2_300_000, achievement: 0.92 },
  { id: 349, date: "2026-07-15", employee: "حسن رحيم", target: 2_500_000, morning: 340_000, guard: 605_000, evening: 1_255_000, total: 2_200_000, achievement: 0.88 },
  { id: 343, date: "2026-07-15", employee: "نور", target: 2_500_000, morning: 180_000, guard: 502_000, evening: 1_175_000, lab: 70_000, total: 1_857_000, achievement: 0.7428 },
  { id: 348, date: "2026-07-15", employee: "أحمد", target: 2_000_000, lab: 105_000, total: 1_575_000, achievement: 0.7875 },
  { id: 350, date: "2026-07-16", employee: "حمزه محمد", target: 1_500_000, morning: 125_000, guard: 40_000, evening: 670_000, total: 835_000, achievement: 0.5567 },
];

/**
 * Returns the pharmacy sales snapshot the dashboard renders.
 *
 * This is the single data seam: swap the return for a live Noloco fetch
 * (e.g. `NOLOCO_API_KEY` + the project's data API) when live wiring is desired.
 * Kept synchronous today; callers already `await` so a Promise return is a
 * drop-in change.
 */
export function getPharmacySales(): PharmacySalesSnapshot {
  return {
    asOf: "١٦ تموز ٢٠٢٦",
    asOfIso: "2026-07-16",
    pharmacies: PHARMACIES,
    dailySales: DAILY_SALES,
  };
}

/* ── Formatting helpers (Iraqi Arabic locale) ───────────────────────── */

const AR = "ar-IQ";

/** Full IQD amount with thousands separators, e.g. "٤٬١٤٣٬٠٠٠ د.ع". */
export function formatIQD(n: number): string {
  return `${new Intl.NumberFormat(AR).format(Math.round(n))} د.ع`;
}

/** Compact millions form for KPI tiles, e.g. "٤٣٫٠ مليون". */
export function formatMillions(n: number): string {
  const millions = n / 1_000_000;
  const value = new Intl.NumberFormat(AR, {
    minimumFractionDigits: millions >= 10 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(millions);
  return `${value} مليون`;
}

/** Percentage from a ratio, e.g. 0.8873 → "٨٩٪". */
export function formatPercent(ratio: number): string {
  return new Intl.NumberFormat(AR, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(ratio);
}

/** Localised day + month label, e.g. "١٥ تموز". */
export function formatDayLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(AR, { day: "numeric", month: "long" }).format(d);
}

/** Plain integer in Arabic-Indic digits. */
export function formatCount(n: number): string {
  return new Intl.NumberFormat(AR).format(n);
}

/** Achievement tier used for colour coding. */
export type AchievementTier = "high" | "good" | "warn" | "low";

export function achievementTier(ratio: number): AchievementTier {
  if (ratio >= 1) return "high";
  if (ratio >= 0.8) return "good";
  if (ratio >= 0.6) return "warn";
  return "low";
}
