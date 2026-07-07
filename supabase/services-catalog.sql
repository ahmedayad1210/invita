-- Services catalog + booking extensions
-- Run in Supabase SQL Editor

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tier TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS services_slug_key ON public.services(slug) WHERE slug IS NOT NULL;

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS patient_id UUID;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'baghdad-studio';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS add_ons TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS bookings_patient_id_idx ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS bookings_date_status_idx ON public.bookings(date, status);
