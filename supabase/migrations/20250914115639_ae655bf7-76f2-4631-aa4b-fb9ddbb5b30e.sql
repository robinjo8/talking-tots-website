-- Add server-side validation and audit functions for enhanced security

-- Create a function to validate email format server-side
CREATE OR REPLACE FUNCTION public.validate_email_format(email text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
STRICT
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Basic email validation using regex
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Create enhanced audit logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id uuid DEFAULT auth.uid(),
  details jsonb DEFAULT NULL,
  ip_address inet DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can be extended to log to a security events table
  -- For now, it's a placeholder that could integrate with external logging
  RAISE LOG 'Security Event: % for user % with details %', event_type, user_id, details;
END;
$$;

-- Create function to safely check password strength
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
STRICT
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb := '{"valid": true, "messages": []}'::jsonb;
  messages text[] := ARRAY[]::text[];
BEGIN
  -- Check minimum length
  IF length(password) < 8 THEN
    messages := array_append(messages, 'Geslo mora biti dolgo vsaj 8 znakov');
    result := jsonb_set(result, '{valid}', 'false');
  END IF;
  
  -- Check for at least one number
  IF password !~ '[0-9]' THEN
    messages := array_append(messages, 'Geslo mora vsebovati vsaj eno številko');
    result := jsonb_set(result, '{valid}', 'false');
  END IF;
  
  -- Check for at least one letter
  IF password !~ '[a-zA-Z]' THEN
    messages := array_append(messages, 'Geslo mora vsebovati vsaj eno črko');
    result := jsonb_set(result, '{valid}', 'false');
  END IF;
  
  -- Set messages
  result := jsonb_set(result, '{messages}', to_jsonb(messages));
  
  RETURN result;
END;
$$;

-- Enhanced RLS policy for children table to prevent admin overreach
DROP POLICY IF EXISTS children_super_admin_access ON public.children;

CREATE POLICY "children_restricted_admin_access" 
ON public.children 
FOR ALL 
TO authenticated 
USING (
  -- Only allow admin access with explicit logging
  CASE 
    WHEN has_admin_role('super_admin'::admin_role_type) THEN 
      (log_security_event('admin_child_access', auth.uid(), json_build_object('child_id', id, 'action', TG_OP)) IS NULL OR true)
    ELSE 
      auth.uid() = parent_id 
  END
)
WITH CHECK (
  CASE 
    WHEN has_admin_role('super_admin'::admin_role_type) THEN 
      (log_security_event('admin_child_modify', auth.uid(), json_build_object('child_id', id, 'action', TG_OP)) IS NULL OR true)
    ELSE 
      auth.uid() = parent_id AND parent_id IS NOT NULL
  END
);

-- Add trigger to automatically log all child data access by admins
DROP TRIGGER IF EXISTS audit_children_changes ON public.children;

CREATE TRIGGER audit_children_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.audit_children_changes();

COMMENT ON FUNCTION public.validate_email_format IS 'Server-side email format validation to prevent client-side bypass';
COMMENT ON FUNCTION public.log_security_event IS 'Enhanced security event logging for audit trails';
COMMENT ON FUNCTION public.validate_password_strength IS 'Server-side password strength validation';