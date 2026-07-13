import { USE_CASES } from "@/lib/invita/liquivida-drips";

export default function UseCasesSection() {
  return (
    <section className="section-padding use-cases">
      <div className="section-inner">
        <header className="page-hero section-padding-sm">
          <p className="page-eyebrow">Applications</p>
          <h2 className="page-title page-title--compact">
            Applications of Invita IV drip infusions
          </h2>
          <p className="page-lead page-lead--narrow">
            IV vitamin therapy can be beneficial in maintaining a healthy, well-nourished body — whether
            you want to boost immunity, enhance energy, or support recovery.
          </p>
        </header>
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
