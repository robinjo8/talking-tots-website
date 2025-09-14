-- Simplified security enhancements focusing on core protections

-- First, let's create the logging function with explicit parameter types
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id uuid DEFAULT auth.uid(),
  details jsonb DEFAULT NULL::jsonb,
  ip_address inet DEFAULT NULL::inet
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log security events - this is a simple implementation that can be extended
  RAISE LOG 'Security Event: % for user % with details %', event_type, user_id, details;
END;
$$;

-- Create a simpler enhanced RLS policy for children table
DROP POLICY IF EXISTS children_restricted_admin_access ON public.children;

-- Create the policy without complex logging in the USING clause to avoid issues
CREATE POLICY "children_restricted_admin_access" 
ON public.children 
FOR ALL 
TO authenticated 
USING (
  -- Parents can access their children, admins need explicit permission
  auth.uid() = parent_id OR has_admin_role('super_admin'::admin_role_type)
)
WITH CHECK (
  -- Parents can modify their children, admins need explicit permission  
  (auth.uid() = parent_id AND parent_id IS NOT NULL) OR has_admin_role('super_admin'::admin_role_type)
);

-- Create server-side validation functions
CREATE OR REPLACE FUNCTION public.validate_email_format(email_input text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
STRICT
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Create password strength validation
CREATE OR REPLACE FUNCTION public.validate_password_strength(password_input text)
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
  IF length(password_input) < 8 THEN
    messages := array_append(messages, 'Geslo mora biti dolgo vsaj 8 znakov');
    result := jsonb_set(result, '{valid}', 'false');
  END IF;
  
  -- Check for at least one number
  IF password_input !~ '[0-9]' THEN
    messages := array_append(messages, 'Geslo mora vsebovati vsaj eno številko');
    result := jsonb_set(result, '{valid}', 'false');
  END IF;
  
  -- Check for at least one letter
  IF password_input !~ '[a-zA-Z]' THEN
    messages := array_append(messages, 'Geslo mora vsebovati vsaj eno črko');
    result := jsonb_set(result, '{valid}', 'false');
  END IF;
  
  result := jsonb_set(result, '{messages}', to_jsonb(messages));
  RETURN result;
END;
$$;

COMMENT ON FUNCTION public.validate_email_format IS 'Server-side email format validation';
COMMENT ON FUNCTION public.validate_password_strength IS 'Server-side password strength validation';
COMMENT ON FUNCTION public.log_security_event IS 'Security event logging function';