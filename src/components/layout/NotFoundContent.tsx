"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function NotFoundContent() {
  const { t } = useLocale();

  return (
    <div className="not-found-page">
      <span className="eyebrow">404</span>
      <h1 className="not-found-title">{t.notFound.title}</h1>
      <div className="divider-rose" />
      <p className="not-found-lead">{t.notFound.body}</p>
      <Link href="/" className="btn-primary">
        {t.notFound.cta}
      </Link>
    </div>
  );
}
