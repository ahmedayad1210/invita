import certificationsJson from "@/data/certifications.json";
import type { CertificateRecord, CertificationsData } from "@/lib/invita/certifications.types";

const jsonData = certificationsJson as CertificationsData;

function sortCertificates(certs: CertificateRecord[]): CertificateRecord[] {
  return [...certs].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Default data from JSON — edit src/data/certifications.json without code changes. */
export function getCertificationsFromJson(): CertificationsData {
  return {
    certificates: sortCertificates(jsonData.certificates),
    verificationSlots: jsonData.verificationSlots,
    timeline: jsonData.timeline,
  };
}

export function getFeaturedCertificate(
  certificates: CertificateRecord[]
): CertificateRecord {
  return certificates.find((c) => c.featured) ?? certificates[0];
}

export function getSupportingCertificates(
  certificates: CertificateRecord[]
): CertificateRecord[] {
  const featured = getFeaturedCertificate(certificates);
  return certificates.filter((c) => c.id !== featured.id);
}

export type {
  CertificateRecord,
  CertificationsData,
  TimelineMilestone,
  VerificationSlot,
} from "@/lib/invita/certifications.types";
