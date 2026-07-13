import ServiceLandingPage from "@/components/services/ServiceLandingPage";
import { NAD_PLUS_LANDING } from "@/lib/invita/service-landings";

export const metadata = {
  title: NAD_PLUS_LANDING.metadata.title,
  description: NAD_PLUS_LANDING.metadata.description,
};

export default function NadPlusPage() {
  return <ServiceLandingPage landing={NAD_PLUS_LANDING} />;
}
