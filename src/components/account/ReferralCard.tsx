"use client";

import { useEffect, useState } from "react";
import { getSiteUrl } from "@/lib/seo";
import { referralShareUrl } from "@/lib/invita/referrals";

export default function ReferralCard() {
  const [code, setCode] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/user/referral")
      .then((r) => r.json())
      .then((json: { success: boolean; data?: { referral_code: string; referral_credits: number } }) => {
        if (json.success && json.data) {
          setCode(json.data.referral_code);
          setCredits(json.data.referral_credits);
        }
      })
      .catch(() => null);
  }, []);

  if (!code) return null;

  const shareUrl = referralShareUrl(code, getSiteUrl());

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="referral-card">
      <h2>Refer a friend</h2>
      <p>
        Share Invita with friends — you earn credit when they join.{" "}
        <strong>{credits}</strong> successful referral{credits !== 1 ? "s" : ""}.
      </p>
      <p className="referral-code">
        Your code: <strong>{code}</strong>
      </p>
      <div className="referral-actions">
        <button type="button" className="btn-secondary btn-sm" onClick={copy}>
          {copied ? "Copied!" : "Copy invite link"}
        </button>
        <a href={shareUrl} className="btn-primary btn-sm">
          Share link
        </a>
      </div>
    </section>
  );
}
