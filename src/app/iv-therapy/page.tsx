import ServiceLandingPage from "@/components/services/ServiceLandingPage";
import { IV_THERAPY_LANDING } from "@/lib/invita/service-landings";

export const metadata = {
  title: IV_THERAPY_LANDING.metadata.title,
  description: IV_THERAPY_LANDING.metadata.description,
};

export default function IvTherapyPage() {
  return <ServiceLandingPage landing={IV_THERAPY_LANDING} />;
}
