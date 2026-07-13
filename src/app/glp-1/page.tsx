import ServiceLandingPage from "@/components/services/ServiceLandingPage";
import { GLP1_LANDING } from "@/lib/invita/service-landings";

export const metadata = {
  title: GLP1_LANDING.metadata.title,
  description: GLP1_LANDING.metadata.description,
};

export default function Glp1Page() {
  return <ServiceLandingPage landing={GLP1_LANDING} />;
}
