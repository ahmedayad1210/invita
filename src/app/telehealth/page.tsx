import TelehealthPageClient from "./TelehealthPageClient";

export const metadata = {
  title: "IV Pre-Screen",
  description:
    "Telehealth-style pre-screen questionnaire before your first Invita IV session — clinician-reviewed protocol recommendation.",
};

export default function TelehealthPage() {
  return <TelehealthPageClient />;
}
