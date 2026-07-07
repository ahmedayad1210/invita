-- Phase 4 platform extensions + bookings intake + referrals
-- Run in Supabase → SQL Editor (paste and run the whole file)

-- Bookings: structured clinical intake
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_goals TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_allergies TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_medications TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_conditions TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_pregnant BOOLEAN DEFAULT FALSE;

-- Profiles: referral / loyalty
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_credits INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_key ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS profiles_referral_code_idx ON public.profiles(referral_code);
