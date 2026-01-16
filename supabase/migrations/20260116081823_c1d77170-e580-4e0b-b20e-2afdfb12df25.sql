-- Drop old function and create new one with display_name
DROP FUNCTION IF EXISTS public.get_parent_emails(uuid[]);

CREATE FUNCTION public.get_parent_emails(parent_ids uuid[])
RETURNS TABLE(user_id uuid, email text, display_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    id, 
    email,
    COALESCE(
      raw_user_meta_data->>'full_name',
      raw_user_meta_data->>'name'
    ) as display_name
  FROM auth.users 
  WHERE id = ANY(parent_ids);
$$;