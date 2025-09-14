-- Fix Security Linter Warnings

-- 1. Fix the security definer view issue by recreating without security definer
DROP VIEW IF EXISTS public.children_analytics;

CREATE VIEW public.children_analytics AS
SELECT 
  id,
  DATE_PART('year', AGE(birth_date)) as age_years,
  gender,
  CASE WHEN speech_difficulties IS NOT NULL THEN array_length(speech_difficulties, 1) ELSE 0 END as difficulties_count,
  CASE WHEN speech_development IS NOT NULL THEN 'object' ELSE 'null' END as has_development_data,
  created_at,
  updated_at
FROM public.children;

-- Enable RLS on the view
ALTER VIEW public.children_analytics SET (security_invoker = true);

-- Create RLS policy for the view
CREATE POLICY "analytics_view_access" ON public.children_analytics
FOR SELECT USING (has_admin_role('data_analyst'::admin_role_type));

-- 2. Fix search_path for all security definer functions
CREATE OR REPLACE FUNCTION public.log_child_access(
  p_child_id UUID,
  p_access_type TEXT,
  p_access_reason TEXT DEFAULT NULL
)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.children_access_log (
    child_id,
    accessed_by,
    access_type,
    access_reason
  ) VALUES (
    p_child_id,
    auth.uid(),
    p_access_type,
    p_access_reason
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role(p_role admin_role_type)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND role = p_role 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_children_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log all non-parent modifications
  IF auth.uid() IS DISTINCT FROM (SELECT parent_id FROM public.children WHERE id = COALESCE(NEW.id, OLD.id)) THEN
    PERFORM public.log_child_access(
      COALESCE(NEW.id, OLD.id),
      TG_OP,
      'Admin modification'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_role(
  p_user_id UUID,
  p_role admin_role_type,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only super admins can grant roles
  IF NOT has_admin_role('super_admin'::admin_role_type) THEN
    RAISE EXCEPTION 'Only super administrators can grant admin roles';
  END IF;
  
  INSERT INTO public.admin_permissions (user_id, role, granted_by, expires_at)
  VALUES (p_user_id, p_role, auth.uid(), p_expires_at)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    is_active = true,
    expires_at = EXCLUDED.expires_at,
    granted_by = auth.uid(),
    granted_at = now();
END;
$$;