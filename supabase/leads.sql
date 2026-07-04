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
