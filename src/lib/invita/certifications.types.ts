export type CertificateRecord = {
  id: string;
  featured: boolean;
  sortOrder: number;
  category: string;
  titleEn: string;
  titleAr: string;
  issuerEn: string;
  issuerAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltAr: string | null;
  pdfUrl: string | null;
  organizationLogoUrl: string | null;
  verificationUrl: string | null;
  certificateNumber: string | null;
  registrationNumber: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  recommendedWidth: number;
  recommendedHeight: number;
};

export type VerificationSlot = {
  id: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  verificationUrl: string | null;
  qrCodeUrl: string | null;
  certificateNumber: string | null;
  registrationNumber: string | null;
};

export type TimelineMilestone = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  date: string | null;
  dateLabelEn: string;
  dateLabelAr: string;
  completed: boolean;
};

export type CertificationsData = {
  certificates: CertificateRecord[];
  verificationSlots: VerificationSlot[];
  timeline: TimelineMilestone[];
};
