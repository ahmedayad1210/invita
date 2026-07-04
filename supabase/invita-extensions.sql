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
