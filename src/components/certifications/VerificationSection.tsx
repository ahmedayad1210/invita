"use client";

import { ExternalLink, QrCode, Hash, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import type { VerificationSlot } from "@/lib/invita/certifications";

const SLOT_ICONS = {
  "verify-portal": ShieldCheck,
  "verify-qr": QrCode,
  "verify-registration": Hash,
  "verify-certificate-id": Hash,
} as const;

type Props = {
  slots: VerificationSlot[];
  locale: "en" | "ar";
};

export default function VerificationSection({ slots, locale }: Props) {
  const isAr = locale === "ar";

  return (
    <div className="credentials-verify">
      <ScrollReveal>
        <header className="credentials-verify-header">
          <h3 className="credentials-verify-title">
            {isAr ? "تحقق من اعتماداتنا" : "Verify Our Credentials"}
          </h3>
          <p className="credentials-verify-lead">
            {isAr
              ? "روابط التحقق وأرقام التسجيل ورموز QR — جاهزة للتفعيل عند توفر الوثائق الرسمية."
              : "Verification links, registration numbers, and QR codes — ready to activate when official documents are in place."}
          </p>
        </header>
      </ScrollReveal>

      <div className="credentials-verify-grid">
        {slots.map((slot) => {
          const Icon = SLOT_ICONS[slot.id as keyof typeof SLOT_ICONS] ?? ShieldCheck;
          const label = isAr ? slot.labelAr : slot.labelEn;
          const description = isAr ? slot.descriptionAr : slot.descriptionEn;
          const hasLink = Boolean(slot.verificationUrl);
          const hasQr = Boolean(slot.qrCodeUrl);
          const displayValue =
            slot.registrationNumber ?? slot.certificateNumber ?? null;

          return (
            <ScrollReveal key={slot.id}>
              <article className="credentials-verify-card">
                <span className="credentials-verify-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <h4 className="credentials-verify-label">{label}</h4>
                <p className="credentials-verify-desc">{description}</p>

                {hasQr && slot.qrCodeUrl ? (
                  <div className="credentials-verify-qr">
                    <Image
                      src={slot.qrCodeUrl}
                      alt={isAr ? "رمز QR للتحقق" : "Verification QR code"}
                      width={96}
                      height={96}
                    />
                  </div>
                ) : (
                  <div className="credentials-verify-qr credentials-verify-qr--placeholder">
                    <QrCode size={32} strokeWidth={1} />
                    <span>{isAr ? "QR — قريباً" : "QR — pending"}</span>
                  </div>
                )}

                {displayValue ? (
                  <p className="credentials-verify-number">
                    <span className="credentials-verify-number-label">
                      {isAr ? "الرقم:" : "No:"}
                    </span>{" "}
                    {displayValue}
                  </p>
                ) : (
                  <p className="credentials-verify-number credentials-verify-number--placeholder">
                    {isAr ? "رقم التسجيل — قريباً" : "Registration number — pending"}
                  </p>
                )}

                {hasLink ? (
                  <Link
                    href={slot.verificationUrl!}
                    className="credentials-verify-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} />
                    {isAr ? "بوابة التحقق" : "Verification portal"}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="credentials-verify-link credentials-verify-link--disabled"
                    disabled
                  >
                    <ExternalLink size={14} />
                    {isAr ? "بوابة التحقق — قريباً" : "Portal — pending"}
                  </button>
                )}
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
