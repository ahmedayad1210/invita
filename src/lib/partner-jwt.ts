// Partner portal JWT — separate cookie from admin

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE_NAME = "partner_token";
const JWT_ALG = "HS256";
const SESSION_SECS = 60 * 60 * 12;

export { COOKIE_NAME as PARTNER_COOKIE_NAME };

function getSecret(): Uint8Array {
  const raw = process.env.PARTNER_JWT_SECRET ?? process.env.ADMIN_JWT_SECRET;
  if (!raw) throw new Error("PARTNER_JWT_SECRET or ADMIN_JWT_SECRET is not set.");
  return new TextEncoder().encode(raw);
}

export interface PartnerJWTPayload extends JWTPayload {
  clinicName: string;
  role: "partner";
}

export async function signPartnerJWT(clinicName: string): Promise<string> {
  return new SignJWT({ clinicName, role: "partner" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECS}s`)
    .sign(getSecret());
}

export async function verifyPartnerJWT(token: string): Promise<PartnerJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [JWT_ALG] });
    if (payload.role !== "partner" || typeof payload.clinicName !== "string") return null;
    return payload as PartnerJWTPayload;
  } catch {
    return null;
  }
}

export function buildPartnerCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Max-Age=${SESSION_SECS}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function clearPartnerCookieHeader(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`;
}
