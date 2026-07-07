-- Phase 4 platform extensions + bookings intake + referrals
-- Run in Supabase SQL Editor

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS intake_goals       TEXT,
  ADD COLUMN IF NOT EXISTS intake_allergies   TEXT,
  ADD COLUMN IF NOT EXISTS intake_medications TEXT,
  ADD COLUMN IF NOT EXISTS intake_conditions  TEXT,
  ADD COLUMN IF NOT EXISTS intake_pregnant    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sms_reminder_opt_in BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code     TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by       UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS referral_credits  INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS profiles_referral_code_idx ON public.profiles(referral_code);
