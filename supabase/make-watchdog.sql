-- Make.com scenario watchdog log
-- Every automated health check + remediation action for the Make scenarios
-- the in-app watchdog keeps alive is recorded here.
-- Run after the other Invita migrations (needs uuid_generate_v4 — enabled by
-- phase4-platform.sql / notifications.sql).

CREATE TABLE IF NOT EXISTS public.make_scenario_health (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id   TEXT NOT NULL,
  scenario_name TEXT,
  status        TEXT NOT NULL DEFAULT 'unknown'
                CHECK (status IN ('healthy', 'degraded', 'down', 'unknown')),
  is_active     BOOLEAN,
  is_invalid    BOOLEAN,
  dlq_count     INTEGER,
  action_taken  TEXT NOT NULL DEFAULT 'none',
  problems      TEXT[] NOT NULL DEFAULT '{}',
  detail        JSONB NOT NULL DEFAULT '{}',
  alerted_at    TIMESTAMPTZ,
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast "latest check for this scenario" lookups (used for alert de-duplication).
CREATE INDEX IF NOT EXISTS make_scenario_health_scenario_idx
  ON public.make_scenario_health(scenario_id, checked_at DESC);

-- All reads/writes go through the service-role key from server routes only.
-- No public policies — RLS on with no policy = deny by default for anon/auth.
ALTER TABLE public.make_scenario_health ENABLE ROW LEVEL SECURITY;
