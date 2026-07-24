import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import {
  achievementTier,
  formatCount,
  formatDayLabel,
  formatIQD,
  formatMillions,
  formatPercent,
  getPharmacySales,
  type DailySale,
} from "@/lib/sahar/pharmacy-sales";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مبيعات الصيدليات — صيدليات سحر",
  description: "متابعة المبيعات اليومية والأهداف عبر فروع صيدليات سحر.",
  robots: { index: false, follow: false },
};

// Sales figures are live-tracked; never cache a stale render.
export const dynamic = "force-dynamic";

const TIER_LABEL: Record<string, string> = {
  high: "متحقق",
  good: "جيد",
  warn: "متابعة",
  low: "منخفض",
};

function num(value: number | undefined): string {
  return value == null ? "—" : formatIQD(value);
}

function AchievementCell({ ratio }: { ratio: number }) {
  const tier = achievementTier(ratio);
  const width = Math.max(4, Math.min(100, Math.round(ratio * 100)));
  return (
    <div className="sps-ach">
      <span className={`sps-badge sps-badge--${tier}`}>{formatPercent(ratio)}</span>
      <span className="sps-bar" aria-hidden="true">
        <span className={`sps-bar__fill sps-bar__fill--${tier}`} style={{ width: `${width}%` }} />
      </span>
    </div>
  );
}

export default async function PharmacySalesPage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const sp = await searchParams;
  const embed = sp?.embed === "1" || sp?.embed === "true";

  const { asOf, pharmacies, dailySales } = getPharmacySales();

  // ── Derived KPIs (computed, so they stay correct if the data changes) ──
  const activeBranches = pharmacies.length;
  const totalDailyTarget = pharmacies.reduce((s, p) => s + p.dailyTarget, 0);
  const recordedSales = dailySales.reduce((s, d) => s + d.total, 0);
  const avgAchievement =
    dailySales.length > 0
      ? dailySales.reduce((s, d) => s + d.achievement, 0) / dailySales.length
      : 0;

  const roster = [...pharmacies].sort((a, b) => b.dailyTarget - a.dailyTarget);
  const feed = [...dailySales].sort(
    (a, b) => b.date.localeCompare(a.date) || b.total - a.total,
  );

  const kpis = [
    { label: "الصيدليات النشطة", value: formatCount(activeBranches), hint: "فروع سحر" },
    { label: "إجمالي الأهداف اليومية", value: `${formatMillions(totalDailyTarget)}`, hint: "د.ع / يوم" },
    {
      label: "مبيعات مسجّلة",
      value: `${formatMillions(recordedSales)}`,
      hint: `${formatCount(dailySales.length)} تسجيلات · د.ع`,
    },
    { label: "متوسط الإنجاز", value: formatPercent(avgAchievement), hint: "أحدث التسجيلات" },
  ];

  return (
    <main
      dir="rtl"
      lang="ar"
      className={`${cairo.className} sps${embed ? " sps--embed" : ""}`}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="sps-wrap">
        <header className="sps-head">
          <div className="sps-brandline">
            <span className="sps-dot" aria-hidden="true" />
            صيدليات سحر
          </div>
          <h1 className="sps-title">مبيعات الصيدليات</h1>
          <p className="sps-sub">متابعة المبيعات اليومية والأهداف عبر فروع سحر</p>
          <div className="sps-asof">لقطة بيانات · آخر تحديث {asOf}</div>
        </header>

        <section className="sps-kpis" aria-label="مؤشرات المبيعات">
          {kpis.map((k) => (
            <div className="sps-kpi" key={k.label}>
              <div className="sps-kpi__label">{k.label}</div>
              <div className="sps-kpi__value">{k.value}</div>
              <div className="sps-kpi__hint">{k.hint}</div>
            </div>
          ))}
        </section>

        <section className="sps-card" aria-labelledby="sps-roster-h">
          <div className="sps-card__head">
            <h2 id="sps-roster-h">أداء الفروع — الأهداف اليومية</h2>
            <span className="sps-card__meta">{formatCount(roster.length)} فرع</span>
          </div>
          <div className="sps-scroll">
            <table className="sps-table">
              <thead>
                <tr>
                  <th scope="col">الصيدلية</th>
                  <th scope="col">الموقع</th>
                  <th scope="col">المدير</th>
                  <th scope="col" className="sps-num">الهدف اليومي</th>
                  <th scope="col" className="sps-num">توزيع الشفتات (صباحي / عصري / خفر)</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((p) => (
                  <tr key={p.id}>
                    <td className="sps-strong">{p.name}</td>
                    <td className="sps-muted">{p.location}</td>
                    <td className="sps-muted">{p.manager}</td>
                    <td className="sps-num sps-strong">{formatIQD(p.dailyTarget)}</td>
                    <td className="sps-num sps-muted">
                      {p.shiftTargets
                        ? `${formatIQD(p.shiftTargets.morning)} · ${formatIQD(
                            p.shiftTargets.evening,
                          )} · ${formatIQD(p.shiftTargets.guard)}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="sps-card" aria-labelledby="sps-feed-h">
          <div className="sps-card__head">
            <h2 id="sps-feed-h">أحدث تسجيلات المبيعات</h2>
            <span className="sps-card__meta">{formatCount(feed.length)} تسجيل</span>
          </div>
          <div className="sps-scroll">
            <table className="sps-table">
              <thead>
                <tr>
                  <th scope="col">التاريخ</th>
                  <th scope="col">الموظف</th>
                  <th scope="col" className="sps-num">الصباحي</th>
                  <th scope="col" className="sps-num">الخفر</th>
                  <th scope="col" className="sps-num">العصري</th>
                  <th scope="col" className="sps-num">المختبر</th>
                  <th scope="col" className="sps-num">الإجمالي</th>
                  <th scope="col" className="sps-num">الهدف</th>
                  <th scope="col">الإنجاز</th>
                </tr>
              </thead>
              <tbody>
                {feed.map((d: DailySale) => (
                  <tr key={d.id}>
                    <td className="sps-strong">{formatDayLabel(d.date)}</td>
                    <td className="sps-muted">{d.employee}</td>
                    <td className="sps-num sps-muted">{num(d.morning)}</td>
                    <td className="sps-num sps-muted">{num(d.guard)}</td>
                    <td className="sps-num sps-muted">{num(d.evening)}</td>
                    <td className="sps-num sps-muted">{num(d.lab)}</td>
                    <td className="sps-num sps-strong">{formatIQD(d.total)}</td>
                    <td className="sps-num sps-muted">{formatIQD(d.target)}</td>
                    <td>
                      <AchievementCell ratio={d.achievement} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sps-legend" aria-hidden="true">
            <span className="sps-legend__item"><i className="sps-swatch sps-swatch--high" />{TIER_LABEL.high} (١٠٠٪+)</span>
            <span className="sps-legend__item"><i className="sps-swatch sps-swatch--good" />{TIER_LABEL.good} (٨٠–٩٩٪)</span>
            <span className="sps-legend__item"><i className="sps-swatch sps-swatch--warn" />{TIER_LABEL.warn} (٦٠–٧٩٪)</span>
            <span className="sps-legend__item"><i className="sps-swatch sps-swatch--low" />{TIER_LABEL.low} (&lt;٦٠٪)</span>
          </div>
        </section>

        <footer className="sps-foot">
          <span>مصدر البيانات: Sahar OS · متتبع مبيعات الصيدليات</span>
          <span className="sps-foot__sep">·</span>
          <span>صيدليات سحر</span>
        </footer>
      </div>
    </main>
  );
}

/* Scoped, self-contained styles — the page is designed to render standalone
   inside an iframe, independent of the host site's chrome and globals. */
const CSS = `
.sps {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  background: #faf9f4;
  color: #0f2341;
  padding: clamp(16px, 3.5vw, 40px);
  line-height: 1.5;
  text-align: right;
}
.sps--embed { padding: clamp(12px, 2.5vw, 24px); }
.sps *, .sps *::before, .sps *::after { box-sizing: border-box; }
.sps-wrap { max-width: 1120px; margin: 0 auto; }

.sps-head { margin-bottom: clamp(18px, 3vw, 28px); }
.sps-brandline {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700; letter-spacing: .2px;
  color: #7798ce;
}
.sps-dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: #d9b344; box-shadow: 0 0 0 4px rgba(217,179,68,.16);
}
.sps-title {
  margin: 10px 0 4px; font-size: clamp(24px, 4.6vw, 38px);
  font-weight: 700; color: #0f2341; letter-spacing: -.2px;
}
.sps-sub { margin: 0; color: #52627d; font-size: clamp(14px, 1.8vw, 16px); }
.sps-asof {
  margin-top: 12px; display: inline-block;
  font-size: 12px; font-weight: 600; color: #4b678f;
  background: rgba(119,152,206,.12);
  border: 1px solid rgba(119,152,206,.28);
  padding: 5px 12px; border-radius: 999px;
}

.sps-kpis {
  display: grid; gap: clamp(10px, 1.6vw, 16px);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: clamp(16px, 2.4vw, 22px);
}
.sps-kpi {
  background: #fff; border: 1px solid rgba(119,152,206,.22);
  border-radius: 14px; padding: 16px 18px;
  box-shadow: 0 8px 28px -18px rgba(29,63,118,.4);
}
.sps-kpi__label { font-size: 12.5px; font-weight: 600; color: #6b7a94; }
.sps-kpi__value {
  margin-top: 8px; font-size: clamp(22px, 3.2vw, 30px);
  font-weight: 700; color: #0f2341; line-height: 1.15;
}
.sps-kpi__hint { margin-top: 4px; font-size: 12px; color: #94a2ba; }

.sps-card {
  background: #fff; border: 1px solid rgba(119,152,206,.22);
  border-radius: 16px; padding: clamp(14px, 2vw, 22px);
  box-shadow: 0 10px 30px -20px rgba(29,63,118,.45);
  margin-bottom: clamp(14px, 2vw, 20px);
}
.sps-card__head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 12px; margin-bottom: 14px;
}
.sps-card__head h2 {
  margin: 0; font-size: clamp(16px, 2.2vw, 19px); font-weight: 700; color: #12294b;
}
.sps-card__meta {
  font-size: 12px; font-weight: 600; color: #7798ce;
  background: rgba(119,152,206,.12); padding: 3px 10px; border-radius: 999px;
  white-space: nowrap;
}

.sps-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.sps-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 560px; }
.sps-table thead th {
  text-align: right; font-weight: 600; color: #6b7a94; font-size: 12px;
  padding: 0 12px 10px; border-bottom: 1px solid rgba(119,152,206,.28);
  white-space: nowrap;
}
.sps-table tbody td {
  padding: 12px; border-bottom: 1px solid rgba(119,152,206,.14);
  vertical-align: middle;
}
.sps-table tbody tr:last-child td { border-bottom: 0; }
.sps-table tbody tr:hover { background: rgba(119,152,206,.06); }
.sps-num { text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sps-strong { font-weight: 700; color: #0f2341; }
.sps-muted { color: #52627d; }

.sps-ach { display: flex; align-items: center; gap: 8px; min-width: 108px; }
.sps-badge {
  font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 7px;
  white-space: nowrap;
}
.sps-badge--high { color: #1c7a54; background: rgba(47,158,111,.14); }
.sps-badge--good { color: #2f5f96; background: rgba(63,127,196,.14); }
.sps-badge--warn { color: #9a6b16; background: rgba(217,164,65,.18); }
.sps-badge--low  { color: #a83f35; background: rgba(209,101,90,.16); }
.sps-bar {
  flex: 1; height: 6px; border-radius: 999px;
  background: rgba(119,152,206,.18); overflow: hidden; min-width: 42px;
}
.sps-bar__fill { display: block; height: 100%; border-radius: 999px; }
.sps-bar__fill--high { background: #2f9e6f; }
.sps-bar__fill--good { background: #3f7fc4; }
.sps-bar__fill--warn { background: #d9a441; }
.sps-bar__fill--low  { background: #d1655a; }

.sps-legend {
  display: flex; flex-wrap: wrap; gap: 14px;
  margin-top: 14px; padding-top: 12px;
  border-top: 1px solid rgba(119,152,206,.16);
  font-size: 11.5px; color: #6b7a94;
}
.sps-legend__item { display: inline-flex; align-items: center; gap: 6px; }
.sps-swatch { width: 10px; height: 10px; border-radius: 3px; }
.sps-swatch--high { background: #2f9e6f; }
.sps-swatch--good { background: #3f7fc4; }
.sps-swatch--warn { background: #d9a441; }
.sps-swatch--low  { background: #d1655a; }

.sps-foot {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
  margin-top: 18px; padding-bottom: 8px;
  font-size: 12px; color: #94a2ba;
}
.sps-foot__sep { color: #c4cede; }
`;
