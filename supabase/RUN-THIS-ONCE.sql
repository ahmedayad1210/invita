-- ═══════════════════════════════════════════════════
-- INVITA: RUN THIS ONE FILE IN SUPABASE SQL EDITOR
-- Project MUST be: xlwpnodyighqpepfaekh
-- https://supabase.com/dashboard/project/xlwpnodyighqpepfaekh/sql/new
-- ═══════════════════════════════════════════════════

-- INVITA BOOTSTRAP — run in Supabase SQL Editor
-- Project: xlwpnodyighqpepfaekh
-- https://supabase.com/dashboard/project/xlwpnodyighqpepfaekh/sql/new

-- ═══════════════════════════════════════════════════════════════
-- INVITA — SUPABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- Project Settings → SQL Editor → New Query → Paste → Run
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE service_category AS ENUM ('iv-therapy', 'dna');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- ─────────────────────────────────────────────
-- PROFILES TABLE
-- Extends Supabase auth.users
-- One row per authenticated user
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on profiles
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- Trigger fires when a new user registers via
-- Supabase Auth — creates their profile row
-- automatically so no manual insert is needed
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────
-- SERVICES TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.services (
  id          UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT             NOT NULL,
  category    service_category NOT NULL,
  duration    INTEGER          NOT NULL CHECK (duration >= 15),
  price       INTEGER          NOT NULL CHECK (price >= 0),
  description TEXT,
  active      BOOLEAN          NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS services_category_idx ON public.services(category);
CREATE INDEX IF NOT EXISTS services_active_idx   ON public.services(active);

-- Updated_at trigger
DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─────────────────────────────────────────────
-- STYLISTS TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.stylists (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL,
  bio         TEXT,
  photo_url   TEXT,
  specialties TEXT[]      NOT NULL DEFAULT '{}',
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS stylists_active_idx ON public.stylists(active);

-- Updated_at trigger
DROP TRIGGER IF EXISTS stylists_updated_at ON public.stylists;
CREATE TRIGGER stylists_updated_at
  BEFORE UPDATE ON public.stylists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─────────────────────────────────────────────
-- BOOKINGS TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bookings (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID           NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
  service_id  UUID           NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  stylist_id  UUID           NOT NULL REFERENCES public.stylists(id) ON DELETE RESTRICT,
  date        DATE           NOT NULL,
  time_slot   TEXT           NOT NULL,
  status      booking_status NOT NULL DEFAULT 'pending',
  notes       TEXT,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  -- Prevent double-booking same stylist at same slot
  CONSTRAINT unique_stylist_slot
    UNIQUE (stylist_id, date, time_slot)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS bookings_user_id_idx   ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_stylist_id_idx ON public.bookings(stylist_id);
CREATE INDEX IF NOT EXISTS bookings_date_idx       ON public.bookings(date);
CREATE INDEX IF NOT EXISTS bookings_status_idx     ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_date_stylist_idx
  ON public.bookings(stylist_id, date);

-- Updated_at trigger
DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- ENABLE RLS ON ALL TABLES
-- ─────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings  ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────
-- PROFILES POLICIES
-- ─────────────────────────────────────────────

-- Users can read their own profile only
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (belt-and-suspenders alongside trigger)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users cannot delete their own profile
-- Deletion happens via auth.users cascade


-- ─────────────────────────────────────────────
-- SERVICES POLICIES
-- Public read — anyone can browse services
-- Write — service role only (admin API routes)
-- ─────────────────────────────────────────────

-- Anyone (including anonymous) can read active services
DROP POLICY IF EXISTS "services_select_active_public" ON public.services;
CREATE POLICY "services_select_active_public"
  ON public.services
  FOR SELECT
  USING (active = TRUE);

-- Authenticated users can also read inactive services
-- (for completeness — admin uses service role which bypasses RLS)
DROP POLICY IF EXISTS "services_select_all_authed" ON public.services;
CREATE POLICY "services_select_all_authed"
  ON public.services
  FOR SELECT
  USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────
-- STYLISTS POLICIES
-- Public read of active stylists
-- Write — service role only
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "stylists_select_active_public" ON public.stylists;
CREATE POLICY "stylists_select_active_public"
  ON public.stylists
  FOR SELECT
  USING (active = TRUE);

DROP POLICY IF EXISTS "stylists_select_all_authed" ON public.stylists;
CREATE POLICY "stylists_select_all_authed"
  ON public.stylists
  FOR SELECT
  USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────
-- BOOKINGS POLICIES
-- Critical: users see only their own bookings
-- Admin uses service role which bypasses RLS
-- ─────────────────────────────────────────────

-- Users can only read their own bookings
DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
CREATE POLICY "bookings_select_own"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert bookings for themselves only
DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
-- (used to cancel — status change only)
DROP POLICY IF EXISTS "bookings_update_own" ON public.bookings;
CREATE POLICY "bookings_update_own"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users cannot delete bookings — cancellation is a status update
-- Hard deletes reserved for service role / admin


-- ═══════════════════════════════════════════════════════════════
-- SEED DATA
-- Paste and run AFTER tables are created
-- Comment out if you prefer to add via Admin Dashboard
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- SEED STYLISTS
-- ─────────────────────────────────────────────

INSERT INTO public.stylists (name, bio, specialties, active) VALUES
(
  'Dr. Sarah Al-Rashid',
  'Board-certified physician specialising in IV therapy and clinical wellness protocols.',
  ARRAY['IV Therapy', 'Clinical Assessment', 'Liquivida Protocols'],
  TRUE
),
(
  'Nurse Layla Hassan',
  'Licensed infusion specialist with advanced training in IV administration and patient safety.',
  ARRAY['IV Administration', 'Immunity', 'Hydration'],
  TRUE
)
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────
-- SEED SERVICES (IV therapy — matches service_category enum)
-- ─────────────────────────────────────────────

INSERT INTO public.services (name, category, duration, price, description, active) VALUES
('IV Wellness Consultation',     'iv-therapy', 30,  0,     'Complimentary medical assessment and drip protocol selection.',                    TRUE),
('Hydration IV Drip',            'iv-therapy', 45,  150000, 'Replenish fluids and electrolytes for recovery and energy.',                       TRUE),
('Immunity IV Drip',             'iv-therapy', 60,  200000, 'High-dose vitamins and antioxidants for immune support.',                          TRUE),
('Energy & Performance IV',      'iv-therapy', 60,  225000, 'B-vitamins and amino acids for sustained energy and focus.',                       TRUE),
('Beauty & Glow IV',             'iv-therapy', 60,  250000, 'Biotin, glutathione, and collagen-support nutrients for radiant skin.',            TRUE),
('DNA Nutrigenomics Panel',      'dna',        30,  350000, 'Personalised nutrition insights from genetic analysis.',                           TRUE)
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- VERIFY SETUP
-- Run these SELECT statements after setup to confirm
-- ═══════════════════════════════════════════════════════════════

-- SELECT COUNT(*) FROM public.stylists;  -- should be 6
-- SELECT COUNT(*) FROM public.services;  -- should be 17
-- SELECT schemaname, tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public';          -- RLS should be TRUE for all tables
-- Invita — leads / enquiries table
-- Run in Supabase SQL Editor after schema.sql

CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  source      TEXT        NOT NULL DEFAULT 'website',
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  message     TEXT,
  drip_slug   TEXT,
  locale      TEXT        DEFAULT 'en',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads(source);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Inserts via service-role API only; no public read
DROP POLICY IF EXISTS "Service role full access on leads" ON public.leads;
CREATE POLICY "Service role full access on leads"
  ON public.leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Invita extensions — run after schema.sql in dedicated Supabase project

DO $$ BEGIN
  CREATE TYPE dna_order_status AS ENUM ('ordered', 'collected', 'processing', 'ready', 'delivered');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update service categories for Invita (run on fresh project; alter if migrating from Sevres)
DO $$ BEGIN
  ALTER TYPE service_category RENAME VALUE 'hair' TO 'iv-therapy';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.dna_orders (
  id          UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID              NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  panel_slug  TEXT              NOT NULL,
  panel_name  TEXT              NOT NULL,
  status      dna_order_status  NOT NULL DEFAULT 'ordered',
  result_url  TEXT,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dna_orders_user_idx ON public.dna_orders(user_id);
CREATE INDEX IF NOT EXISTS dna_orders_status_idx ON public.dna_orders(status);

ALTER TABLE public.dna_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dna_orders_select_own" ON public.dna_orders;
CREATE POLICY "dna_orders_select_own"
  ON public.dna_orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "dna_orders_insert_own" ON public.dna_orders;
CREATE POLICY "dna_orders_insert_own"
  ON public.dna_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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

DROP POLICY IF EXISTS "Public read certificates" ON public.certificates;
CREATE POLICY "Public read certificates"
  ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read verification slots" ON public.certificate_verification_slots;
CREATE POLICY "Public read verification slots"
  ON public.certificate_verification_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read timeline" ON public.certificate_timeline;
CREATE POLICY "Public read timeline"
  ON public.certificate_timeline FOR SELECT USING (true);

-- Service role handles writes via API routes

DROP TRIGGER IF EXISTS certificates_updated_at ON public.certificates;
CREATE TRIGGER certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Run AFTER bootstrap.sql if REST API returns PGRST205 (table not found)
-- https://supabase.com/dashboard/project/xlwpnodyighqpepfaekh/sql/new

-- 1) Verify tables exist (should return rows)
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2) Grant API roles access to public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO postgres, service_role;

-- 3) Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
