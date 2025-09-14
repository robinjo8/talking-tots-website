-- Security Enhancement: Protect Children's Personal Data
-- Remove blanket admin access and implement proper privacy controls

-- 1. Create audit logging table for children data access
CREATE TABLE IF NOT EXISTS public.children_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL,
  accessed_by UUID NOT NULL,
  access_type TEXT NOT NULL, -- 'view', 'edit', 'delete'
  access_reason TEXT, -- Optional justification
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.children_access_log ENABLE ROW LEVEL SECURITY;

-- 2. Create secure admin roles enum
CREATE TYPE public.admin_role_type AS ENUM ('super_admin', 'support_admin', 'data_analyst');

-- 3. Create admin permissions table with specific roles
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role admin_role_type NOT NULL,
  granted_by UUID NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, role)
);

-- Enable RLS on admin permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- 4. Create function to log children data access
CREATE OR REPLACE FUNCTION public.log_child_access(
  p_child_id UUID,
  p_access_type TEXT,
  p_access_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.children_access_log (
    child_id,
    accessed_by,
    access_type,
    access_reason,
    ip_address,
    user_agent
  ) VALUES (
    p_child_id,
    auth.uid(),
    p_access_type,
    p_access_reason,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to check specific admin permissions
CREATE OR REPLACE FUNCTION public.has_admin_role(p_role admin_role_type)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND role = p_role 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. Create anonymized view for data analysts (no PII)
CREATE OR REPLACE VIEW public.children_analytics AS
SELECT 
  id,
  DATE_PART('year', AGE(birth_date)) as age_years,
  gender,
  CASE WHEN speech_difficulties IS NOT NULL THEN array_length(speech_difficulties, 1) ELSE 0 END as difficulties_count,
  CASE WHEN speech_development IS NOT NULL THEN jsonb_object_keys(speech_development) ELSE NULL END as has_development_data,
  created_at,
  updated_at
FROM public.children;

-- 7. Drop the overly permissive admin policy
DROP POLICY IF EXISTS "children_admin_access" ON public.children;

-- 8. Create new restrictive admin policies with logging
CREATE POLICY "children_super_admin_access" ON public.children
FOR ALL USING (
  has_admin_role('super_admin'::admin_role_type)
);

-- 9. Create support admin policy (read-only with logging)
CREATE POLICY "children_support_admin_view" ON public.children
FOR SELECT USING (
  has_admin_role('support_admin'::admin_role_type)
);

-- 10. Enhanced parent policies with logging triggers
CREATE OR REPLACE FUNCTION public.trigger_log_child_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access for non-parent users
  IF auth.uid() != (SELECT parent_id FROM public.children WHERE id = COALESCE(NEW.id, OLD.id)) THEN
    PERFORM public.log_child_access(
      COALESCE(NEW.id, OLD.id),
      TG_OP,
      'Admin access'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create logging trigger
CREATE TRIGGER log_children_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_child_access();

-- 12. RLS Policies for audit log (super admins and record owners can view)
CREATE POLICY "access_log_super_admin" ON public.children_access_log
FOR SELECT USING (has_admin_role('super_admin'::admin_role_type));

CREATE POLICY "access_log_own_records" ON public.children_access_log
FOR SELECT USING (
  accessed_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE children.id = children_access_log.child_id 
    AND children.parent_id = auth.uid()
  )
);

-- 13. RLS Policies for admin permissions (only super admins can manage)
CREATE POLICY "admin_permissions_super_admin" ON public.admin_permissions
FOR ALL USING (has_admin_role('super_admin'::admin_role_type));

CREATE POLICY "admin_permissions_view_own" ON public.admin_permissions
FOR SELECT USING (user_id = auth.uid());

-- 14. Grant access to analytics view for data analysts
GRANT SELECT ON public.children_analytics TO authenticated;

CREATE POLICY "analytics_view_access" ON public.children_analytics
FOR SELECT USING (has_admin_role('data_analyst'::admin_role_type));

-- 15. Create function to safely grant admin roles (only by super admins)
CREATE OR REPLACE FUNCTION public.grant_admin_role(
  p_user_id UUID,
  p_role admin_role_type,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;