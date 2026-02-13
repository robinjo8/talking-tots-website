
-- Allow logopedists to view profiles of colleagues in same organization
-- This is needed so org-level queries (JOIN logopedist_profiles) work correctly
CREATE POLICY "Org members can view org profiles"
ON public.logopedist_profiles
FOR SELECT
USING (
  organization_id IN (
    SELECT lp.organization_id 
    FROM logopedist_profiles lp 
    WHERE lp.user_id = auth.uid()
  )
);
