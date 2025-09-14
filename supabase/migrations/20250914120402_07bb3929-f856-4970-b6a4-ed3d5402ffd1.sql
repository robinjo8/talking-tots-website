-- Fix jsonb type casting in the security functions

-- Create enhanced RLS policy for children table to prevent admin overreach  
-- This policy logs admin access with proper jsonb casting
DROP POLICY IF EXISTS children_restricted_admin_access ON public.children;

CREATE POLICY "children_restricted_admin_access" 
ON public.children 
FOR ALL 
TO authenticated 
USING (
  -- Allow parent access or logged admin access
  auth.uid() = parent_id OR 
  (
    has_admin_role('super_admin'::admin_role_type) AND
    (SELECT log_security_event('admin_child_access', auth.uid(), jsonb_build_object('child_id', id)) IS NULL OR true)
  )
)
WITH CHECK (
  -- Allow parent modifications or logged admin modifications
  (auth.uid() = parent_id AND parent_id IS NOT NULL) OR 
  (
    has_admin_role('super_admin'::admin_role_type) AND
    (SELECT log_security_event('admin_child_modify', auth.uid(), jsonb_build_object('child_id', id)) IS NULL OR true)
  )
);

-- Update the audit trigger function with proper jsonb casting
CREATE OR REPLACE FUNCTION public.audit_children_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  -- Log all non-parent modifications  
  IF current_user_id IS DISTINCT FROM (
    SELECT parent_id FROM public.children WHERE id = COALESCE(NEW.id, OLD.id)
  ) THEN
    PERFORM public.log_security_event(
      'admin_child_' || lower(TG_OP),
      current_user_id,
      jsonb_build_object(
        'child_id', COALESCE(NEW.id, OLD.id),
        'operation', TG_OP
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS audit_children_changes ON public.children;
CREATE TRIGGER audit_children_access
  AFTER INSERT OR UPDATE OR DELETE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.audit_children_access();