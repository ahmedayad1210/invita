import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

export const BASE_URL       = process.env.BASE_URL       || "https://sevres.vercel.app";
export const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL || "";
export const CUSTOMER_PASS  = process.env.CUSTOMER_PASSWORD || "";
export const ADMIN_USER     = process.env.ADMIN_USERNAME || "";
export const ADMIN_PASS     = process.env.ADMIN_PASSWORD || "";

if (!CUSTOMER_EMAIL || !CUSTOMER_PASS) {
  console.warn("[env] CUSTOMER_EMAIL / CUSTOMER_PASSWORD not set — customer tests will fail.");
}
if (!ADMIN_USER || !ADMIN_PASS) {
  console.warn("[env] ADMIN_USERNAME / ADMIN_PASSWORD not set — admin tests will fail.");
}
