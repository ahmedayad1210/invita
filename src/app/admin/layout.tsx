import { cookies }        from "next/headers";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import AdminSidebar        from "@/components/admin/AdminSidebar";
import AdminMobileBar      from "@/components/admin/AdminMobileBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token       = cookieStore.get(COOKIE_NAME)?.value;
  const payload     = token ? await verifyAdminJWT(token) : null;

  // Unauthenticated users only reach /admin (the login page — middleware blocks
  // all other /admin/* routes). Render the bare login form without the shell.
  if (!payload) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100svh" }}>
      <AdminSidebar />
      <div className="admin-body">
        <AdminMobileBar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
