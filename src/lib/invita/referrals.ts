/** Referral code helpers for loyalty program. */

export function generateReferralCode(userId: string): string {
  return `INV-${userId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function referralShareUrl(code: string, siteUrl: string): string {
  return `${siteUrl}/auth/register?ref=${encodeURIComponent(code)}`;
}
