
-- Izbrisi problematicno politiko
DROP POLICY IF EXISTS "Org members can view org profiles" 
  ON public.logopedist_profiles;

-- Ustvari novo politiko z SECURITY DEFINER funkcijo
CREATE POLICY "Org members can view org profiles" 
  ON public.logopedist_profiles FOR SELECT
  USING (
    organization_id = get_user_organization_id(auth.uid())
  );
