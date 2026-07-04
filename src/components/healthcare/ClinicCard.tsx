"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import ClinicLogo from "@/components/healthcare/ClinicLogo";
import {
  COOPERATION_LABELS,
  SPECIALTY_LABELS,
  type HealthcareClinic,
} from "@/lib/invita/healthcare-network";
import { useLocale } from "@/contexts/LocaleContext";

type Props = {
  clinic: HealthcareClinic;
  compact?: boolean;
};

export default function ClinicCard({ clinic, compact = false }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <Link href={`/healthcare-network/${clinic.slug}`} className={`clinic-card${compact ? " clinic-card--compact" : ""}`}>
      <div className="clinic-card-cover">
        <Image
          src={clinic.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 280px"
          className="clinic-card-cover-image"
        />
        <div className="clinic-card-cover-overlay" />
        <ClinicLogo clinic={clinic} size={compact ? 44 : 52} className="clinic-card-logo" />
      </div>
      <div className="clinic-card-body">
        <p className="clinic-card-specialty">
          {isAr ? SPECIALTY_LABELS[clinic.specialty].ar : SPECIALTY_LABELS[clinic.specialty].en}
        </p>
        <h3 className="clinic-card-name">{isAr ? clinic.nameAr : clinic.name}</h3>
        <p className="clinic-card-location">
          <MapPin size={13} aria-hidden="true" />
          {isAr ? `${clinic.districtAr}، ${clinic.cityAr}` : `${clinic.district}, ${clinic.city}`}
        </p>
        {!compact && (
          <>
            <p className="clinic-card-status">
              {isAr
                ? COOPERATION_LABELS[clinic.cooperationStatus].ar
                : COOPERATION_LABELS[clinic.cooperationStatus].en}
              {" · "}
              {isAr ? `منذ ${clinic.cooperationSince}` : `Since ${clinic.cooperationSince}`}
            </p>
            {clinic.doctorCount != null && (
              <p className="clinic-card-meta">
                <Users size={13} aria-hidden="true" />
                {isAr
                  ? `${clinic.doctorCount} أطباء`
                  : `${clinic.doctorCount} doctors`}
              </p>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
