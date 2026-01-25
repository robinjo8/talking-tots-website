-- Dodaj RLS politiko, ki omogoča internim logopedom branje vseh ocen
CREATE POLICY "Interni logopedi lahko berejo vse ocene"
ON public.articulation_evaluations
FOR SELECT
USING (is_internal_logopedist(auth.uid()));

-- Dodaj polje completed_at v articulation_test_sessions če še ne obstaja
-- (že obstaja v shemi, samo preverimo da ima pravilni update trigger)
CREATE OR REPLACE FUNCTION public.set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Ustvari trigger če še ne obstaja
DROP TRIGGER IF EXISTS set_completed_at_trigger ON public.articulation_test_sessions;
CREATE TRIGGER set_completed_at_trigger
BEFORE UPDATE ON public.articulation_test_sessions
FOR EACH ROW
EXECUTE FUNCTION public.set_completed_at();