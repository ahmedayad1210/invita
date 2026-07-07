-- Patient CRM for IV studio portal
-- Run after schema.sql and services-catalog.sql

CREATE TABLE IF NOT EXISTS public.patients (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  phone               TEXT        NOT NULL,
  phone_normalized    TEXT        NOT NULL UNIQUE,
  full_name           TEXT        NOT NULL,
  email               TEXT,
  locale              TEXT        NOT NULL DEFAULT 'en',
  tags                TEXT[]      NOT NULL DEFAULT '{}',
  respond_contact_id  TEXT,
  last_visit_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS patients_user_id_idx ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS patients_name_idx ON public.patients(lower(full_name));

CREATE TABLE IF NOT EXISTS public.patient_profiles (
  patient_id    UUID PRIMARY KEY REFERENCES public.patients(id) ON DELETE CASCADE,
  goals         TEXT,
  allergies     TEXT,
  medications   TEXT,
  conditions    TEXT,
  pregnant      BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.patient_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  author      TEXT NOT NULL DEFAULT 'admin',
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS patient_notes_patient_idx ON public.patient_notes(patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.patient_timeline (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id    UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT,
  reference_id  UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS patient_timeline_patient_idx ON public.patient_timeline(patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id    UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  booking_id    UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  direction     TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  channel       TEXT NOT NULL DEFAULT 'whatsapp',
  body          TEXT NOT NULL,
  external_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_patient_idx ON public.messages(patient_id, created_at DESC);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patients read own profile row" ON public.patient_profiles;
CREATE POLICY "Patients read own profile row"
  ON public.patient_profiles FOR SELECT
  USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Patients update own profile row" ON public.patient_profiles;
CREATE POLICY "Patients update own profile row"
  ON public.patient_profiles FOR UPDATE
  USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Patients read own messages" ON public.messages;
CREATE POLICY "Patients read own messages"
  ON public.messages FOR SELECT
  USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

DROP TRIGGER IF EXISTS patients_updated_at ON public.patients;
CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS patient_profiles_updated_at ON public.patient_profiles;
CREATE TRIGGER patient_profiles_updated_at
  BEFORE UPDATE ON public.patient_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_patient_id_fkey;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_patient_id_fkey
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE SET NULL;
