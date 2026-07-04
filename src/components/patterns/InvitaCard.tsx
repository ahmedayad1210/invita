import type { ReactNode } from "react";

type InvitaCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
};

export default function InvitaCard({
  children,
  className = "",
  as: Tag = "div",
}: InvitaCardProps) {
  return <Tag className={`invita-card ${className}`.trim()}>{children}</Tag>;
}
