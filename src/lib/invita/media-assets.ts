export type MediaCategory = "banner" | "image" | "video" | "brand" | "document";

export type MediaAssetRecord = {
  id: string;
  category: MediaCategory;
  role: string | null;
  title: string;
  alt_text: string | null;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const MEDIA_BUCKET = "invita-media";

export const MEDIA_CATEGORIES: {
  id: MediaCategory;
  label: string;
  accept: string;
  hint: string;
}[] = [
  {
    id: "banner",
    label: "Banner / Hero",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    hint: "Homepage heroes, section banners, promo strips",
  },
  {
    id: "image",
    label: "Image / Gallery",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    hint: "Clinic photos, infographics, gallery stills",
  },
  {
    id: "video",
    label: "Video / Reel",
    accept: "video/mp4,video/webm,video/quicktime",
    hint: "Instagram reels, promos, clinic walkthroughs",
  },
  {
    id: "brand",
    label: "Brand / Logo",
    accept: "image/jpeg,image/png,image/webp,image/svg+xml",
    hint: "Logos, marks, co-branded assets",
  },
  {
    id: "document",
    label: "Document / PDF",
    accept: "application/pdf",
    hint: "Catalogues, training PDFs, downloadable resources",
  },
];

export const MEDIA_ROLES = [
  { id: "hero", label: "Homepage hero" },
  { id: "homepage-cta", label: "Homepage CTA banner" },
  { id: "footer-banner", label: "Footer banner" },
  { id: "reel", label: "Video reel" },
  { id: "clinic", label: "Clinic photo" },
  { id: "infographic", label: "Infographic" },
  { id: "instagram", label: "Instagram / social" },
  { id: "general", label: "General / unassigned" },
] as const;

export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;

export function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isVideoMime(mime: string): boolean {
  return mime.startsWith("video/");
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export function sanitizeStorageFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return base.slice(0, 120) || "upload";
}
