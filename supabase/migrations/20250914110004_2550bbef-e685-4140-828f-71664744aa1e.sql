-- Fix Function Search Path Warnings Only

-- Fix search_path for all security definer functions
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