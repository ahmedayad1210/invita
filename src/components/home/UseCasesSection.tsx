import { USE_CASES } from "@/lib/invita/liquivida-drips";

export default function UseCasesSection() {
  return (
    <section className="section-padding use-cases">
      <div className="section-inner">
        <h2 className="page-title" style={{ textAlign: "center", marginBottom: "2rem" }}>
          What Can IV Therapy Help With?
        </h2>
        <div className="use-cases-pills">
          {USE_CASES.map((item) => (
            <span key={item} className="use-case-pill">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
