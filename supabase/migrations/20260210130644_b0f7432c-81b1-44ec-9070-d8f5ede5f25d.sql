
-- 1. RESTRICT get_parent_emails() - only logopedists can call it
CREATE OR REPLACE FUNCTION public.get_parent_emails(parent_ids uuid[])
RETURNS TABLE(user_id uuid, email text, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    au.id, 
    au.email,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name'
    ) as display_name
  FROM auth.users au
  WHERE au.id = ANY(parent_ids)
    AND public.is_logopedist(auth.uid());
$$;

-- 2. HARDEN children_logopedist_view - only see children assigned to them or their org
DROP POLICY IF EXISTS "children_logopedist_view" ON public.children;

CREATE POLICY "children_logopedist_view"
ON public.children
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND (
      -- Internal org logopedists can see children with submitted/assigned tests
      (
        EXISTS (
          SELECT 1 FROM organizations o 
          WHERE o.id = lp.organization_id AND o.type = 'internal'
        )
        AND EXISTS (
          SELECT 1 FROM articulation_test_sessions ats
          WHERE ats.child_id = children.id
          AND ats.status IN ('pending', 'assigned', 'in_review', 'completed')
        )
      )
      -- External org logopedists can only see children assigned to them
      OR EXISTS (
        SELECT 1 FROM articulation_test_sessions ats
        WHERE ats.child_id = children.id
        AND ats.assigned_to = lp.id
      )
    )
  )
);

-- 3. ADD RLS policies to mfa_codes (currently has RLS enabled but no policies)
-- Users should only be able to read their own MFA codes (for display purposes only, verification happens server-side)
CREATE POLICY "Users can view own mfa_codes"
ON public.mfa_codes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Prevent any client-side inserts/updates/deletes (only service_role via edge functions)
CREATE POLICY "No client insert on mfa_codes"
ON public.mfa_codes
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No client update on mfa_codes"
ON public.mfa_codes
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "No client delete on mfa_codes"
ON public.mfa_codes
FOR DELETE
TO authenticated
USING (false);
