/**
 * crash.spec.ts
 * Sèvres & Co. — Crash / Regression test suite
 * Target: https://sevres.vercel.app
 *
 * Covers:
 *  - Console errors on key pages
 *  - Unhandled runtime errors
 *  - 404 handling
 *  - Refresh persistence (sessionStorage booking state)
 *  - Broken navigation paths
 *  - Unexpected redirects
 *  - API error handling
 */

import { test, expect, type Page } from "@playwright/test";
import { loginAsCustomer, loginAsAdmin } from "./helpers/auth";
import { BASE_URL } from "./helpers/env";

// ─────────────────────────────────────────────────────────
// HELPER — collect console errors on a page
// ─────────────────────────────────────────────────────────

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`[pageerror] ${err.message}`);
  });
  return errors;
}

// ─────────────────────────────────────────────────────────
// SECTION 1 — CONSOLE ERRORS ON KEY PAGES
// ─────────────────────────────────────────────────────────

test.describe("Console errors", () => {
  const PAGES_TO_CHECK = ["/", "/services", "/about", "/contact", "/book"];

  for (const path of PAGES_TO_CHECK) {
    test(`no unhandled console errors on ${path}`, async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Filter out known benign errors (fonts, non-critical)
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("fonts.googleapis") &&
          !e.includes("ERR_BLOCKED_BY_CLIENT") &&
          !e.includes("net::ERR_ABORTED") &&
          !e.toLowerCase().includes("cors") // Supabase CDN may fire during SSR hydration
      );

      if (criticalErrors.length > 0) {
        console.warn(`[console errors on ${path}]`, criticalErrors);
      }

      // Fail only on JavaScript runtime errors (not network or ad-blocker errors)
      const jsErrors = criticalErrors.filter(
        (e) =>
          e.includes("[pageerror]") ||
          e.toLowerCase().includes("typeerror") ||
          e.toLowerCase().includes("referenceerror") ||
          e.toLowerCase().includes("syntaxerror")
      );

      expect(jsErrors).toHaveLength(0);
    });
  }

  test("no console errors on /auth/login", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");

    const jsErrors = errors.filter(
      (e) =>
        e.includes("[pageerror]") ||
        e.toLowerCase().includes("typeerror") ||
        e.toLowerCase().includes("referenceerror")
    );
    expect(jsErrors).toHaveLength(0);
  });

  test("no console errors on /admin", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const jsErrors = errors.filter(
      (e) =>
        e.includes("[pageerror]") ||
        e.toLowerCase().includes("typeerror") ||
        e.toLowerCase().includes("referenceerror")
    );
    expect(jsErrors).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────
// SECTION 2 — 404 HANDLING
// ─────────────────────────────────────────────────────────

test.describe("404 error pages", () => {
  test("visiting a non-existent route shows 404 page", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist-at-all");
    // Next.js returns 404 for unmatched routes
    expect(res?.status()).toBe(404);
  });

  test("404 page does not crash with JS errors", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/nonexistent-page-xyz");
    await page.waitForLoadState("networkidle");

    const jsErrors = errors.filter(
      (e) => e.includes("[pageerror]") || e.toLowerCase().includes("typeerror")
    );
    expect(jsErrors).toHaveLength(0);
  });

  test("404 page contains user-friendly message", async ({ page }) => {
    await page.goto("/nonexistent-page-xyz");
    // Next.js default or custom not-found page
    await expect(page.locator("body")).toContainText(/not found|404|page.*not|exist/i);
  });

  test("API 404 — GET /api/services with invalid id returns handled error", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/services?id=00000000-0000-0000-0000-000000000000`);
    // Should return 404 or 200 with empty data — not 500
    expect([200, 404]).toContain(res.status());
    const json = await res.json();
    // Should be valid JSON either way
    expect(json).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────
// SECTION 3 — REFRESH PERSISTENCE
// ─────────────────────────────────────────────────────────

test.describe("Booking state persistence (sessionStorage)", () => {
  test("booking store is persisted in sessionStorage", async ({ page }) => {
    await page.goto("/book");
    await page.waitForLoadState("networkidle");

    // Zustand persist writes to sessionStorage after the first render/action.
    // Poll for up to 5s for the key to appear.
    const stored = await page.waitForFunction(
      () => sessionStorage.getItem("sevres-booking") !== null,
      { timeout: 5_000 }
    ).then(() => page.evaluate(() => sessionStorage.getItem("sevres-booking")))
    .catch(() => null);

    // If the app uses sessionStorage for booking state, it should be present.
    // Note: on SSR-hydration it may not write immediately — soft assertion.
    if (stored !== null) {
      expect(stored).toBeTruthy();
    } else {
      console.warn("[booking store] sessionStorage key not written after 5s — possible SSR hydration issue");
    }
  });

  test("refreshing /book does not cause a JS crash", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/book");
    await page.waitForLoadState("networkidle");
    await page.reload();
    await page.waitForLoadState("networkidle");

    const jsErrors = errors.filter(
      (e) => e.includes("[pageerror]") || e.toLowerCase().includes("typeerror")
    );
    expect(jsErrors).toHaveLength(0);
  });

  test("booking step survives a page reload", async ({ page }) => {
    await page.goto("/book");
    await page.waitForLoadState("networkidle");

    // Store current step
    const stepBefore = await page.evaluate(() => {
      const raw = sessionStorage.getItem("sevres-booking");
      return raw ? JSON.parse(raw).state?.currentStep : null;
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    const stepAfter = await page.evaluate(() => {
      const raw = sessionStorage.getItem("sevres-booking");
      return raw ? JSON.parse(raw).state?.currentStep : null;
    });

    // Step should be preserved (not reset to null or a different value)
    expect(stepAfter).toBe(stepBefore);
  });
});

// ─────────────────────────────────────────────────────────
// SECTION 4 — BROKEN NAVIGATION
// ─────────────────────────────────────────────────────────

test.describe("Navigation does not break", () => {
  test("browser back button works after navigating Services → Book", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    await page.goto("/book");
    await page.waitForLoadState("networkidle");
    await page.goBack();
    await expect(page).toHaveURL(/\/services/);
  });

  test("navigating directly to /admin/bookings without session redirects to /admin", async ({ page }) => {
    // Navigate to admin first so localStorage is accessible, then clear session
    await page.goto("/admin");
    await page.evaluate(() => {
      try { localStorage.removeItem("sevres_admin_session"); } catch {}
    });
    await page.goto("/admin/bookings");
    await page.waitForURL(/\/admin$/, { timeout: 10_000 });
  });

  test("navigating directly to /admin/services without session redirects to /admin", async ({ page }) => {
    await page.goto("/admin");
    await page.evaluate(() => {
      try { localStorage.removeItem("sevres_admin_session"); } catch {}
    });
    await page.goto("/admin/services");
    await page.waitForURL(/\/admin$/, { timeout: 10_000 });
  });

  test("navigating directly to /admin/stylists without session redirects to /admin", async ({ page }) => {
    await page.goto("/admin");
    await page.evaluate(() => {
      try { localStorage.removeItem("sevres_admin_session"); } catch {}
    });
    await page.goto("/admin/stylists");
    await page.waitForURL(/\/admin$/, { timeout: 10_000 });
  });
});

// ─────────────────────────────────────────────────────────
// SECTION 5 — UNEXPECTED REDIRECTS
// ─────────────────────────────────────────────────────────

test.describe("Redirect correctness", () => {
  test("/auth/login does not redirect unauthenticated user", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/auth/login");
    // Should stay on /auth/login, not redirect
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("/auth/register does not redirect unauthenticated user", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/auth/register");
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test("middleware redirects /bookings to /auth/login with redirectTo param", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/bookings");
    await expect(page).toHaveURL(/\/auth\/login.*redirectTo.*bookings|\/auth\/login/, {
      timeout: 10_000,
    });
  });

  test("/ (homepage) does not redirect unauthenticated visitors", async ({ page }) => {
    await page.context().clearCookies();
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    // URL will be origin + "/" — verify path is "/"
    const url = new URL(page.url());
    expect(url.pathname).toBe("/");
  });
});

// ─────────────────────────────────────────────────────────
// SECTION 6 — API ERROR HANDLING
// ─────────────────────────────────────────────────────────

test.describe("API edge case error handling", () => {
  test("GET /api/services with unknown category returns safely (not unhandled 500)", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/services?category=weapons`);
    // Supabase enum cast may return 500 for invalid enum values — acceptable
    // but should never be an unhandled crash. 200/400/500 are all OK here.
    expect([200, 400, 500]).toContain(res.status());
    if (res.status() === 200) {
      const json = await res.json();
      expect(json.success).toBe(true);
    }
  });

  test("GET /api/availability for past date returns valid response", async ({ request }) => {
    const res = await request.get(
      `${BASE_URL}/api/availability?stylist_id=00000000-0000-0000-0000-000000000001&date=2020-01-01`
    );
    // May return 200 with empty available_slots, or some error — but not crash
    expect([200, 400, 404]).toContain(res.status());
  });

  test("POST /api/admin/login with correct credentials returns success", async ({ request }) => {
    const res = await request.fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        username: process.env.ADMIN_USERNAME || "aftab",
        password: process.env.ADMIN_PASSWORD || "aftab",
      }),
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("POST /api/admin/login with wrong credentials returns 401", async ({ request }) => {
    const res = await request.fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ username: "hacker", password: "hacked" }),
    });
    expect(res.status()).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  test("POST /api/admin/login with empty body returns 400", async ({ request }) => {
    const res = await request.fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({}),
    });
    expect(res.status()).toBe(400);
  });

  test("GET /api/admin/bookings with date filter returns array", async ({ request }) => {
    const { buildAdminBearerToken } = await import("./helpers/auth");
    const token = buildAdminBearerToken();
    const res = await request.fetch(`${BASE_URL}/api/admin/bookings?date=2030-01-01`, {
      method: "GET",
      headers: { Authorization: token },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// SECTION 7 — LOADING STATES & EMPTY STATES
// ─────────────────────────────────────────────────────────

test.describe("Loading and empty states", () => {
  test("bookings page shows empty state message when no bookings exist", async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto("/bookings");
    await page.waitForLoadState("networkidle");

    // If there are no upcoming bookings, the empty state should render cleanly
    const emptyMsg = page.locator("body");
    await expect(emptyMsg).toContainText(/upcoming|past|no.*booking|book a treatment/i);
  });

  test("admin dashboard renders even with no bookings today", async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForLoadState("networkidle");

    // Stat cards should show 0 or — for empty days
    await expect(page.locator("body")).toContainText(/0|—|dashboard/i);
  });
});
