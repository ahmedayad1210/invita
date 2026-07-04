import { VALUE_PROPS } from "@/lib/invita/liquivida-drips";

const ICONS = ["◆", "🇺🇸", "✦", "◇"];

export default function ValuePropsGrid() {
  return (
    <section className="section-padding value-props">
      <div className="section-inner">
        <div className="value-props-grid">
          {VALUE_PROPS.map((prop, i) => (
            <article key={prop.title} className="value-prop-card">
              <span className="value-prop-icon">{ICONS[i]}</span>
              <h3>{prop.title}</h3>
              <p>{prop.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
