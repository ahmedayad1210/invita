import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Invita Circle and Longevity membership — annual wellness programmes with priority booking and DNA benefits.",
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
