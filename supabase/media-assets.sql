-- ═══════════════════════════════════════════════════════════════
-- INVITA — MEDIA ASSETS (banners, videos, images, PDFs)
-- Run in Supabase SQL Editor after schema.sql
-- Enables /admin/media uploads to Supabase Storage
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.media_assets (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category      TEXT        NOT NULL DEFAULT 'image',
  role          TEXT,
  title         TEXT        NOT NULL,
  alt_text      TEXT,
  storage_path  TEXT        NOT NULL UNIQUE,
  public_url    TEXT        NOT NULL,
  mime_type     TEXT        NOT NULL,
  file_size     BIGINT,
  width         INTEGER,
  height        INTEGER,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS media_assets_category_idx ON public.media_assets(category);
CREATE INDEX IF NOT EXISTS media_assets_role_idx ON public.media_assets(role);
CREATE INDEX IF NOT EXISTS media_assets_active_idx ON public.media_assets(is_active);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read media assets" ON public.media_assets;
CREATE POLICY "Public read media assets"
  ON public.media_assets FOR SELECT
  USING (is_active = true);

-- Writes via service role in /api/admin/media

DROP TRIGGER IF EXISTS media_assets_updated_at ON public.media_assets;
CREATE TRIGGER media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage bucket (public read for site delivery)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('invita-media', 'invita-media', true, 52428800)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

DROP POLICY IF EXISTS "Public read invita media objects" ON storage.objects;
CREATE POLICY "Public read invita media objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'invita-media');
