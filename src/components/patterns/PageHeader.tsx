type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
};

export default function PageHeader({
  eyebrow,
  title,
  lead,
  align = "center",
}: PageHeaderProps) {
  return (
    <header className={`page-hero page-hero--${align}`}>
      {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
      <h2 className="page-title">{title}</h2>
      {lead ? <p className="page-lead">{lead}</p> : null}
    </header>
  );
}
