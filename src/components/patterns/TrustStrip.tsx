import LiquividaBadge from "@/components/brand/LiquividaBadge";

type TrustStripProps = {
  showLiquivida?: boolean;
};

export default function TrustStrip({ showLiquivida = true }: TrustStripProps) {
  return (
    <div className="trust-strip" role="list">
      <div className="trust-strip-item" role="listitem">
        <span className="trust-strip-label">Licensed medical professionals</span>
      </div>
      <div className="trust-strip-item" role="listitem">
        <span className="trust-strip-label">Private infusion suite · Al-Mansour</span>
      </div>
      {showLiquivida ? (
        <div className="trust-strip-item trust-strip-badge" role="listitem">
          <LiquividaBadge variant="inline" />
        </div>
      ) : null}
    </div>
  );
}
