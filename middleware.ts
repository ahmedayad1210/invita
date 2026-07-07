// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import { PARTNER_COOKIE_NAME, verifyPartnerJWT } from "@/lib/partner-jwt";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

const PROTECTED_USER_ROUTES = ["/account", "/bookings"];
const SUPABASE_SESSION_ROUTES = ["/account", "/bookings", "/book", "/auth"];

function isPartnerDashboard(pathname: string): boolean {
  return pathname.startsWith("/partners/dashboard");
}

function isAdminPageRoute(pathname: string): boolean {
  return pathname.startsWith("/admin/") || (pathname === "/admin" && false);
}

function isAdminApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/admin/") && pathname !== "/api/admin/login";
}

function needsSupabaseSession(pathname: string): boolean {
  return (
    SUPABASE_SESSION_ROUTES.some((r) => pathname.startsWith(r)) ||
    isAdminPageRoute(pathname) ||
    isAdminApiRoute(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy /bookings → account bookings section (before auth gate)
  if (pathname === "/bookings") {
    return NextResponse.redirect(new URL("/account?section=bookings", request.url), 308);
  }

  if (isPartnerDashboard(pathname)) {
    const token = request.cookies.get(PARTNER_COOKIE_NAME)?.value;
    const payload = token ? await verifyPartnerJWT(token) : null;
    if (!payload) {
      return NextResponse.redirect(new URL("/partners/login", request.url));
    }
  }

  if (isAdminPageRoute(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? await verifyAdminJWT(token) : null;

    if (!payload) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (isAdminApiRoute(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? await verifyAdminJWT(token) : null;

    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
    }
  }

  if (!needsSupabaseSession(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedUserRoute = PROTECTED_USER_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtectedUserRoute && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    const redirectPath = `${pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("redirectTo", redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
