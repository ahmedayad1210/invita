import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "sm" | "rose-light";
  reveal?: boolean;
};

export default function Section({
  id,
  children,
  className = "",
  variant = "default",
  reveal = false,
}: SectionProps) {
  const padding =
    variant === "sm" ? "section-padding-sm" : "section-padding";
  const bg = variant === "rose-light" ? " section-rose-light" : "";

  return (
    <section
      id={id}
      className={`${padding}${bg} ${reveal ? "content-reveal" : ""} ${className}`.trim()}
    >
      <div className="section-inner">{children}</div>
    </section>
  );
}
