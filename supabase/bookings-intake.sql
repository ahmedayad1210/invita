-- Structured clinical intake columns for bookings
-- Run in Supabase SQL Editor after main schema

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS intake_goals       TEXT,
  ADD COLUMN IF NOT EXISTS intake_allergies   TEXT,
  ADD COLUMN IF NOT EXISTS intake_medications TEXT,
  ADD COLUMN IF NOT EXISTS intake_conditions  TEXT,
  ADD COLUMN IF NOT EXISTS intake_pregnant    BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.bookings.intake_goals IS 'Patient wellness goals from booking intake';
COMMENT ON COLUMN public.bookings.intake_allergies IS 'Known allergies from booking intake';
COMMENT ON COLUMN public.bookings.intake_medications IS 'Current medications from booking intake';
COMMENT ON COLUMN public.bookings.intake_conditions IS 'Medical conditions from booking intake';
COMMENT ON COLUMN public.bookings.intake_pregnant IS 'Pregnancy status from booking intake';
