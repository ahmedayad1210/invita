"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { Copy, FileText, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MEDIA_BUCKET,
  MEDIA_CATEGORIES,
  MEDIA_ROLES,
  MAX_MEDIA_BYTES,
  formatFileSize,
  isImageMime,
  isVideoMime,
  type MediaAssetRecord,
  type MediaCategory,
} from "@/lib/invita/media-assets";

type UploadMeta = {
  category: MediaCategory;
  title: string;
  altText: string;
  role: string;
};

const DEFAULT_META: UploadMeta = {
  category: "banner",
  title: "",
  altText: "",
  role: "general",
};

export default function AdminMediaLibrary() {
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [filter, setFilter] = useState<MediaCategory | "all">("all");
  const [meta, setMeta] = useState<UploadMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const query = filter === "all" ? "" : `?category=${filter}`;
    const res = await fetch(`/api/admin/media${query}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error ?? "Could not load media library.");
      setAssets([]);
    } else {
      setAssets(json.data as MediaAssetRecord[]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFile = async (file: File) => {
    if (file.size > MAX_MEDIA_BYTES) {
      setError("File exceeds 50 MB limit.");
      return;
    }

    setUploading(true);
    setError(null);
    setStatus(`Uploading ${file.name}…`);

    try {
      const presignRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          category: meta.category,
          title: meta.title || file.name,
          altText: meta.altText,
          role: meta.role,
          fileSize: file.size,
        }),
      });

      const presign = (await presignRes.json()) as {
        success: boolean;
        error?: string;
        data?: { asset: MediaAssetRecord; storagePath: string; token: string };
      };

      if (!presignRes.ok || !presign.success || !presign.data) {
        throw new Error(presign.error ?? "Could not prepare upload.");
      }

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .uploadToSignedUrl(presign.data.storagePath, presign.data.token, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setStatus(`Uploaded ${file.name}`);
      setMeta((prev) => ({ ...prev, title: "", altText: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length || uploading) return;
    void uploadFile(files[0]);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setStatus("URL copied to clipboard");
    setTimeout(() => setStatus(null), 2000);
  };

  const deleteAsset = async (asset: MediaAssetRecord) => {
    if (!window.confirm(`Delete “${asset.title}”? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/media?id=${asset.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error ?? "Delete failed.");
      return;
    }
    await load();
  };

  const activeCategory = MEDIA_CATEGORIES.find((item) => item.id === meta.category);

  return (
    <div className="admin-media-layout">
      <section className="admin-media-upload">
        <h2>Upload asset</h2>
        <p className="admin-media-hint">
          Banners, gallery images, reels, logos, and PDFs upload directly to Supabase Storage (max
          50 MB). Run <code>supabase/media-assets.sql</code> once if uploads fail.
        </p>

        <div className="admin-media-fields">
          <label>
            <span>Category</span>
            <select
              value={meta.category}
              onChange={(e) => setMeta((prev) => ({ ...prev, category: e.target.value as MediaCategory }))}
            >
              {MEDIA_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Placement (optional)</span>
            <select
              value={meta.role}
              onChange={(e) => setMeta((prev) => ({ ...prev, role: e.target.value }))}
            >
              {MEDIA_ROLES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Title</span>
            <input
              type="text"
              placeholder="Homepage hero — spring campaign"
              value={meta.title}
              onChange={(e) => setMeta((prev) => ({ ...prev, title: e.target.value }))}
            />
          </label>

          <label>
            <span>Alt text (images)</span>
            <input
              type="text"
              placeholder="IV lounge with natural light"
              value={meta.altText}
              onChange={(e) => setMeta((prev) => ({ ...prev, altText: e.target.value }))}
            />
          </label>
        </div>

        <div
          className={`admin-media-dropzone${dragOver ? " drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <Upload size={28} strokeWidth={1.5} />
          <p>{uploading ? "Uploading…" : "Drop a file here or click to browse"}</p>
          <small>{activeCategory?.hint}</small>
          <input
            ref={fileInputRef}
            type="file"
            accept={activeCategory?.accept}
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </section>

      <section className="admin-media-library">
        <div className="admin-media-library-header">
          <h2>Media library</h2>
          <div className="admin-media-filters">
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            {MEDIA_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={filter === item.id ? "active" : ""}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="admin-media-error" role="alert">
            {error}
          </p>
        ) : null}
        {status ? <p className="admin-media-status">{status}</p> : null}

        {loading ? (
          <p className="admin-media-hint">Loading assets…</p>
        ) : assets.length === 0 ? (
          <p className="admin-media-hint">No assets yet. Upload your first banner, image, or video above.</p>
        ) : (
          <div className="admin-media-grid">
            {assets.map((asset) => (
              <article key={asset.id} className="admin-media-card">
                <div className="admin-media-preview">
                  {isVideoMime(asset.mime_type) ? (
                    <video src={asset.public_url} muted playsInline controls preload="metadata" />
                  ) : isImageMime(asset.mime_type) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.public_url} alt={asset.alt_text ?? asset.title} />
                  ) : (
                    <div className="admin-media-doc">
                      <FileText size={32} />
                      <span>PDF</span>
                    </div>
                  )}
                </div>

                <div className="admin-media-card-body">
                  <p className="admin-media-card-title">{asset.title}</p>
                  <p className="admin-media-card-meta">
                    {asset.category}
                    {asset.role ? ` · ${asset.role}` : ""} · {formatFileSize(asset.file_size)}
                  </p>
                  <div className="admin-media-card-actions">
                    <button type="button" onClick={() => copyUrl(asset.public_url)} title="Copy URL">
                      <Copy size={14} />
                      Copy URL
                    </button>
                    <a href={asset.public_url} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteAsset(asset)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
