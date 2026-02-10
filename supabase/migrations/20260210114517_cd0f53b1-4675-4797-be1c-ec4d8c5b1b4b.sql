
-- Drop the overly permissive logopedist SELECT policy
DROP POLICY "Logopedists can view org children progress" ON public.progress;

-- Create a proper logopedist SELECT policy - only their own children's progress
CREATE POLICY "Logopedists can view own children progress"
ON public.progress
FOR SELECT
USING (
  logopedist_child_id IS NOT NULL 
  AND logopedist_child_id IN (
    SELECT lc.id FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- Create separate policy for org-level access (only logopedist children, not parent data)
CREATE POLICY "Logopedists can view org children progress"
ON public.progress
FOR SELECT
USING (
  logopedist_child_id IS NOT NULL
  AND logopedist_child_id IN (
    SELECT lc.id FROM logopedist_children lc
    JOIN logopedist_profiles owner_lp ON lc.logopedist_id = owner_lp.id
    JOIN logopedist_profiles my_lp ON my_lp.user_id = auth.uid()
    JOIN organization_licenses ol ON ol.organization_id = my_lp.organization_id
    WHERE owner_lp.organization_id = my_lp.organization_id
    AND ol.status = 'active'
  )
);

-- Fix INSERT policy for logopedists - require logopedist_child_id
DROP POLICY "Logopedists can insert own children progress" ON public.progress;
CREATE POLICY "Logopedists can insert own children progress"
ON public.progress
FOR INSERT
WITH CHECK (
  logopedist_child_id IS NOT NULL
  AND logopedist_child_id IN (
    SELECT lc.id FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- Fix UPDATE policy for logopedists
DROP POLICY "Logopedists can update own children progress" ON public.progress;
CREATE POLICY "Logopedists can update own children progress"
ON public.progress
FOR UPDATE
USING (
  logopedist_child_id IS NOT NULL
  AND logopedist_child_id IN (
    SELECT lc.id FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- Fix DELETE policy for logopedists
DROP POLICY "Logopedists can delete own children progress" ON public.progress;
CREATE POLICY "Logopedists can delete own children progress"
ON public.progress
FOR DELETE
USING (
  logopedist_child_id IS NOT NULL
  AND logopedist_child_id IN (
    SELECT lc.id FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);
