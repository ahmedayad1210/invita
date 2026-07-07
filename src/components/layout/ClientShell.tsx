"use client";

import dynamic from "next/dynamic";
import PwaRegister from "@/components/pwa/PwaRegister";

const WellnessAssistantWidget = dynamic(
  () => import("@/components/assistant/WellnessAssistantWidget"),
  { ssr: false }
);

export default function ClientShell() {
  return (
    <>
      <WellnessAssistantWidget />
      <PwaRegister />
    </>
  );
}
