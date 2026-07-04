import { type Page } from "@playwright/test";
import { CUSTOMER_EMAIL, CUSTOMER_PASS, ADMIN_USER, ADMIN_PASS } from "./env";

/**
 * Log in as the test customer via the UI.
 * The login form does NOT use htmlFor/id on labels, so we use input type selectors.
 */
export async function loginAsCustomer(page: Page): Promise<void> {
  await page.goto("/auth/login");
  // Labels are not associated with inputs via htmlFor — use type/autocomplete attrs
  await page.locator('input[type="email"], input[autocomplete="email"]').fill(CUSTOMER_EMAIL);
  await page.locator('input[type="password"], input[autocomplete="current-password"]').first().fill(CUSTOMER_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"), {
    timeout: 20_000,
  });
}

/**
 * Log in as admin via the UI on /admin.
 * Admin auth is localStorage-based. Labels are not wired to inputs via htmlFor.
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/admin");
  // Clear any existing admin session so we always start from the login form
  await page.evaluate(() => {
    try { localStorage.removeItem("sevres_admin_session"); } catch {}
  });
  await page.reload();
  await page.waitForLoadState("networkidle");

  // The admin form inputs have autocomplete="username" / "current-password"
  await page.locator('input[autocomplete="username"], input[placeholder*="Admin username"], input[placeholder*="username"]').first().fill(ADMIN_USER);
  await page.locator('input[type="password"]').first().fill(ADMIN_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();

  // After successful login the page does window.location.href = "/admin" (full reload)
  await page.waitForFunction(
    () => {
      const h1 = document.querySelector("h1");
      return h1?.textContent?.includes("Dashboard");
    },
    { timeout: 20_000 }
  );
}

/**
 * Builds a valid admin Bearer token identical to what the app sends.
 * The session JSON is base64-encoded — same encoding as btoa(JSON.stringify(session)).
 */
export function buildAdminBearerToken(
  username: string = ADMIN_USER,
  expiresOffsetMs: number = 1000 * 60 * 60 // 1 h from now
): string {
  const session = {
    authenticated: true,
    username,
    expires_at: Date.now() + expiresOffsetMs,
  };
  return "Bearer " + Buffer.from(JSON.stringify(session)).toString("base64");
}

/**
 * Builds an EXPIRED admin Bearer token (for security tests).
 */
export function buildExpiredAdminBearerToken(): string {
  const session = {
    authenticated: true,
    username: "attacker",
    expires_at: Date.now() - 1000, // already expired
  };
  return "Bearer " + Buffer.from(JSON.stringify(session)).toString("base64");
}
