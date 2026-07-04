import type { ReactNode } from "react";

type CtaBandProps = {
  children: ReactNode;
  align?: "start" | "center";
};

export default function CtaBand({ children, align = "center" }: CtaBandProps) {
  return <div className={`cta-band cta-band--${align}`}>{children}</div>;
}
