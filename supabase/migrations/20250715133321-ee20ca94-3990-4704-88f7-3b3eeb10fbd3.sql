-- Create a function to get user metadata including raw data
CREATE OR REPLACE FUNCTION public.get_user_metadata(user_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT user_metadata FROM auth.users WHERE id = user_id),
    (SELECT raw_user_meta_data FROM auth.users WHERE id = user_id),
    '{}'::jsonb
  );
$$;