"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ExternalLink,
  FileText,
  Lock,
  Upload,
} from "lucide-react";
import type { CertificateRecord } from "@/lib/invita/certifications";

type Props = {
  certificate: CertificateRecord;
  locale: "en" | "ar";
  variant?: "featured" | "supporting";
  adminMode?: boolean;
  onReplaceImage?: (id: string) => void;
};

function formatDate(date: string | null, locale: "en" | "ar"): string | null {
  if (!date) return null;
  try {
    return new Date(date).toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export default function CertificateCard({
  certificate,
  locale,
  variant = "supporting",
  adminMode = false,
  onReplaceImage,
}: Props) {
  const isAr = locale === "ar";
  const title = isAr ? certificate.titleAr : certificate.titleEn;
  const issuer = isAr ? certificate.issuerAr : certificate.issuerEn;
  const description = isAr ? certificate.descriptionAr : certificate.descriptionEn;
  const imageAlt =
    (isAr ? certificate.imageAltAr : certificate.imageAltEn) ?? title;
  const hasImage = Boolean(certificate.imageUrl);
  const hasVerification = Boolean(certificate.verificationUrl);
  const issueDate = formatDate(certificate.issueDate, locale);
  const expiryDate = formatDate(certificate.expiryDate, locale);

  return (
    <article
      className={`certificate-card certificate-card--${variant}${hasImage ? " certificate-card--has-image" : ""}`}
    >
      <div className="certificate-card-frame">
        <div className="certificate-image-area">
          {hasImage && certificate.imageUrl ? (
            <Image
              src={certificate.imageUrl}
              alt={imageAlt}
              fill
              sizes={variant === "featured" ? "(max-width: 768px) 100vw, 50vw" : "280px"}
              className="certificate-image"
            />
          ) : (
            <div className="certificate-upload-placeholder">
              <span className="certificate-upload-icon" aria-hidden="true">
                <Award size={variant === "featured" ? 32 : 24} strokeWidth={1.25} />
              </span>
              <p className="certificate-upload-label">
                {isAr ? "وثيقة رسمية" : "Official document"}
              </p>
              <p className="certificate-upload-dims">
                {isAr ? "متاحة عند الطلب" : "Available on request"}
              </p>
              {adminMode ? (
                <p className="certificate-upload-dims">
                  {certificate.recommendedWidth} × {certificate.recommendedHeight}{" "}
                  {isAr ? "بكسل موصى به" : "px recommended"}
                </p>
              ) : null}
              {adminMode ? (
                <button
                  type="button"
                  className="certificate-replace-btn"
                  onClick={() => onReplaceImage?.(certificate.id)}
                >
                  <Upload size={14} />
                  {isAr ? "استبدال الصورة" : "Replace Image"}
                </button>
              ) : null}
            </div>
          )}
          <div className="certificate-image-shine" aria-hidden="true" />
        </div>

        <div className="certificate-card-body">
          <div className="certificate-card-meta">
            <span className="certificate-org-logo" aria-hidden="true">
              {certificate.organizationLogoUrl ? (
                <Image
                  src={certificate.organizationLogoUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="certificate-org-logo-img"
                />
              ) : (
                <Award size={18} strokeWidth={1.25} />
              )}
            </span>
            <div className="certificate-card-titles">
              <h3 className="certificate-title">{title}</h3>
              <p className="certificate-issuer">{issuer}</p>
            </div>
          </div>

          <p className="certificate-description">{description}</p>

          {(issueDate || expiryDate || certificate.certificateNumber) && (
            <dl className="certificate-dates">
              {issueDate ? (
                <>
                  <dt>{isAr ? "تاريخ الإصدار" : "Issued"}</dt>
                  <dd>{issueDate}</dd>
                </>
              ) : null}
              {expiryDate ? (
                <>
                  <dt>{isAr ? "تاريخ الانتهاء" : "Expires"}</dt>
                  <dd>{expiryDate}</dd>
                </>
              ) : null}
              {certificate.certificateNumber ? (
                <>
                  <dt>{isAr ? "رقم الشهادة" : "Certificate #"}</dt>
                  <dd>{certificate.certificateNumber}</dd>
                </>
              ) : null}
            </dl>
          )}

          <div className="certificate-card-actions">
            {certificate.pdfUrl ? (
              <Link
                href={certificate.pdfUrl}
                className="certificate-action-btn certificate-action-btn--pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={14} />
                {isAr ? "عرض PDF" : "View PDF"}
              </Link>
            ) : (
              <span className="certificate-action-btn certificate-action-btn--disabled">
                <FileText size={14} />
                {isAr ? "PDF — قريباً" : "PDF — pending"}
              </span>
            )}

            {hasVerification ? (
              <Link
                href={certificate.verificationUrl!}
                className="certificate-action-btn certificate-action-btn--verify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                {isAr ? "تحقق" : "Verify"}
              </Link>
            ) : (
              <button
                type="button"
                className="certificate-action-btn certificate-action-btn--verify certificate-action-btn--disabled"
                disabled
                title={isAr ? "رابط التحقق غير متاح بعد" : "Verification link not yet available"}
              >
                <Lock size={14} />
                {isAr ? "تحقق" : "Verify"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
