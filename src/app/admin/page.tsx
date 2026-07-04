// src/app/admin/page.tsx
// Server component — reads the JWT cookie on the server before rendering.
// Authenticated admins see the dashboard; unauthenticated users see the
// login form. No client-side auth check, no loading flash.

import { cookies } from "next/headers";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import AdminLoginForm  from "@/components/admin/AdminLoginForm";
import AdminDashboard  from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get(COOKIE_NAME)?.value;
  const payload     = token ? await verifyAdminJWT(token) : null;

  if (payload) {
    return <AdminDashboard username={payload.username} />;
  }

  return <AdminLoginForm />;
}
