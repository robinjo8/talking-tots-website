-- Ustvari funkcijo za pridobitev emailov staršev iz auth.users
CREATE OR REPLACE FUNCTION public.get_parent_emails(parent_ids uuid[])
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT id, email 
  FROM auth.users 
  WHERE id = ANY(parent_ids);
$$;

-- Dovoli klic te funkcije za avtenticirane uporabnike
GRANT EXECUTE ON FUNCTION public.get_parent_emails(uuid[]) TO authenticated;