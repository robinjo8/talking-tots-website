-- Create a function to get complete user auth data including raw metadata
CREATE OR REPLACE FUNCTION public.get_auth_user_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_data jsonb;
BEGIN
  -- Get the current user's auth data
  SELECT COALESCE(raw_user_meta_data, '{}'::jsonb) 
  INTO user_data
  FROM auth.users 
  WHERE id = auth.uid();
  
  RETURN user_data;
END;
$$;