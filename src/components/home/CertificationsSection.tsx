import { getCertificationsData } from "@/lib/invita/certifications.server";
import CertificationsRecognition from "@/components/certifications/CertificationsRecognition";

export default async function CertificationsSection() {
  const data = await getCertificationsData();
  return <CertificationsRecognition data={data} />;
}
