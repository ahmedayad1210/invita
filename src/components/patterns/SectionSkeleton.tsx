/** Lightweight placeholder while below-fold sections load */
export default function SectionSkeleton({ minHeight = "12rem" }: { minHeight?: string }) {
  return (
    <div
      className="section-skeleton"
      style={{ minHeight }}
      aria-hidden="true"
    />
  );
}
