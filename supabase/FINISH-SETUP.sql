-- Run this ONLY if RUN-THIS-ONCE.sql stopped with "policy already exists"
-- Safe to run multiple times.

DROP POLICY IF EXISTS "Public read certificates" ON public.certificates;
CREATE POLICY "Public read certificates"
  ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read verification slots" ON public.certificate_verification_slots;
CREATE POLICY "Public read verification slots"
  ON public.certificate_verification_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read timeline" ON public.certificate_timeline;
CREATE POLICY "Public read timeline"
  ON public.certificate_timeline FOR SELECT USING (true);

DROP TRIGGER IF EXISTS certificates_updated_at ON public.certificates;
CREATE TRIGGER certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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

NOTIFY pgrst, 'reload schema';
