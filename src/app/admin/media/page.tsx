import AdminMediaLibrary from "@/components/admin/AdminMediaLibrary";

export default function AdminMediaPage() {
  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: "1.125rem",
            fontWeight: 400,
            color: "#0F2341",
            marginBottom: "0.5rem",
          }}
        >
          Media Library
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7A94", maxWidth: "42rem" }}>
          Upload banners, videos, gallery images, brand assets, and PDFs. Files are stored in
          Supabase Storage and can be copied into certificates, homepage sections, or marketing
          pages.
        </p>
      </header>

      <AdminMediaLibrary />
    </div>
  );
}
