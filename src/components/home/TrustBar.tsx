import LiquividaBadge from "@/components/brand/LiquividaBadge";
import { LIQUIVIDA } from "@/lib/invita/liquivida-drips";

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Partners and trust">
      <div className="trust-bar-inner">
        <LiquividaBadge />
        <span className="trust-bar-divider" />
        <p className="trust-bar-text">
          Official Distributor · <strong>{LIQUIVIDA.name} USA</strong>
        </p>
        <span className="trust-bar-divider" />
        <p className="trust-bar-text trust-bar-muted">Medical-grade · Baghdad, Iraq</p>
      </div>
    </section>
  );
}
