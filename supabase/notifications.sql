-- Booking notification queue (WhatsApp via Respond.io)
-- Run after patients-crm.sql

CREATE TABLE IF NOT EXISTS public.notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_id    UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  booking_id    UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  channel       TEXT NOT NULL DEFAULT 'whatsapp',
  template      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  scheduled_for TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  payload       JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_pending_idx
  ON public.notifications(status, scheduled_for)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS notifications_booking_idx ON public.notifications(booking_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
