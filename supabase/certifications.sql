-- ═══════════════════════════════════════════════════════════════
-- INVITA — CERTIFICATIONS CMS TABLES
-- Optional: run after schema.sql to enable admin overrides.
-- JSON at src/data/certifications.json remains the default source.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.certificates (
  id                    TEXT        PRIMARY KEY,
  featured              BOOLEAN     NOT NULL DEFAULT false,
  sort_order            INTEGER     NOT NULL DEFAULT 0,
  category              TEXT        NOT NULL DEFAULT 'general',
  title_en              TEXT        NOT NULL,
  title_ar              TEXT        NOT NULL,
  issuer_en             TEXT        NOT NULL,
  issuer_ar             TEXT        NOT NULL,
  description_en        TEXT        NOT NULL,
  description_ar        TEXT        NOT NULL,
  image_url             TEXT,
  image_alt_en          TEXT,
  image_alt_ar          TEXT,
  pdf_url               TEXT,
  organization_logo_url TEXT,
  verification_url      TEXT,
  certificate_number    TEXT,
  registration_number   TEXT,
  issue_date            DATE,
  expiry_date           DATE,
  recommended_width     INTEGER     NOT NULL DEFAULT 1200,
  recommended_height    INTEGER     NOT NULL DEFAULT 1600,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificate_verification_slots (
  id                  TEXT PRIMARY KEY,
  label_en            TEXT NOT NULL,
  label_ar            TEXT NOT NULL,
  description_en      TEXT NOT NULL,
  description_ar      TEXT NOT NULL,
  verification_url    TEXT,
  qr_code_url         TEXT,
  certificate_number  TEXT,
  registration_number TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificate_timeline (
  id              TEXT PRIMARY KEY,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  title_en        TEXT NOT NULL,
  title_ar        TEXT NOT NULL,
  description_en  TEXT NOT NULL,
  description_ar  TEXT NOT NULL,
  milestone_date  DATE,
  date_label_en   TEXT NOT NULL,
  date_label_ar   TEXT NOT NULL,
  completed       BOOLEAN NOT NULL DEFAULT false,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public read for certificates (no sensitive admin data)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verification_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read certificates"
  ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Public read verification slots"
  ON public.certificate_verification_slots FOR SELECT USING (true);

CREATE POLICY "Public read timeline"
  ON public.certificate_timeline FOR SELECT USING (true);

-- Service role handles writes via API routes

DROP TRIGGER IF EXISTS certificates_updated_at ON public.certificates;
CREATE TRIGGER certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
