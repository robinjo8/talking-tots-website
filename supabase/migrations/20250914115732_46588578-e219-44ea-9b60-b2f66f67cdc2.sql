-- Fix the previous migration - remove TG_OP references and correct the security policies

-- Drop the incorrect policies first
DROP POLICY IF EXISTS children_restricted_admin_access ON public.children;

-- Create enhanced RLS policy for children table to prevent admin overreach
-- This policy logs admin access without using TG_OP which isn't available in this context
CREATE POLICY "children_restricted_admin_access" 
ON public.children 
FOR ALL 
TO authenticated 
USING (
  -- Allow parent access or logged admin access
  auth.uid() = parent_id OR 
  (
    has_admin_role('super_admin'::admin_role_type) AND
    (SELECT log_security_event('admin_child_access', auth.uid(), json_build_object('child_id', id)) IS NULL OR true)
  )
)
WITH CHECK (
  -- Allow parent modifications or logged admin modifications
  (auth.uid() = parent_id AND parent_id IS NOT NULL) OR 
  (
    has_admin_role('super_admin'::admin_role_type) AND
    (SELECT log_security_event('admin_child_modify', auth.uid(), json_build_object('child_id', id)) IS NULL OR true)
  )
);

-- Create a more specific audit trigger function that doesn't rely on TG_OP in RLS context
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
      json_build_object(
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