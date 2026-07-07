import AdminMediaLibrary from "@/components/admin/AdminMediaLibrary";

export default function AdminMediaPage() {
  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "#2C1810",
            marginBottom: "0.5rem",
          }}
        >
          Media Library
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#8B7355", maxWidth: "42rem" }}>
          Upload banners, videos, gallery images, brand assets, and PDFs. Files are stored in
          Supabase Storage and can be copied into certificates, homepage sections, or marketing
          pages.
        </p>
      </header>

      <AdminMediaLibrary />
    </div>
  );
}
