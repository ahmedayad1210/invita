import Link from "next/link";
import { LIQUIVIDA } from "@/lib/invita/liquivida-drips";

const TRUST = [
  "Developed by board-certified US physicians",
  "Pharmaceutical-grade ingredients",
  "Clinically tested and proven protocols",
  "Now exclusively available in Baghdad through Invita",
] as const;

export default function LiquividaPartnerSection() {
  return (
    <section className="section-padding liquivida-partner">
      <div className="section-inner liquivida-partner-inner">
        <h2 className="page-title">Why Liquivida® USA?</h2>
        <p>
          Liquivida® is one of America&apos;s most trusted IV therapy networks, with
          clinics across the United States serving hundreds of thousands of patients.
          Their formulas are developed by board-certified emergency physicians and
          pharmacists, backed by decades of clinical data and rigorous quality standards.
        </p>
        <p>
          Invita IV Drips is Liquivida&apos;s exclusive official distributor in Baghdad —
          bringing the same world-class IV protocols trusted in the USA directly to Iraq.
        </p>
        <ul className="liquivida-trust-list">
          {TRUST.map((item) => (
            <li key={item}>✅ {item}</li>
          ))}
        </ul>
        <Link
          href={LIQUIVIDA.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Learn about Liquivida®
        </Link>
      </div>
    </section>
  );
}
