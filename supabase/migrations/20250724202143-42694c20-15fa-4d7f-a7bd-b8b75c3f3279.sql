-- CRITICAL SECURITY FIX: Enable RLS and create policies for unprotected tables (targeted fix)

-- 1. Enable RLS on artikulacijski_test table
ALTER TABLE public.artikulacijski_test ENABLE ROW LEVEL SECURITY;

-- Create policy for reading artikulacijski_test data (authenticated users only)
CREATE POLICY "Authenticated users can view test data" 
ON public.artikulacijski_test 
FOR SELECT 
TO authenticated
USING (true);

-- 2. Enable RLS on memory_cards table
ALTER TABLE public.memory_cards ENABLE ROW LEVEL SECURITY;

-- Create policy for reading memory_cards data (authenticated users only)
CREATE POLICY "Authenticated users can view memory cards" 
ON public.memory_cards 
FOR SELECT 
TO authenticated
USING (true);

-- 3. Enable RLS on memory_cards_Š_duplicate table
ALTER TABLE public.memory_cards_Š_duplicate ENABLE ROW LEVEL SECURITY;

-- Create policy for reading memory_cards_Š_duplicate data (authenticated users only)
CREATE POLICY "Authenticated users can view memory cards duplicate" 
ON public.memory_cards_Š_duplicate 
FOR SELECT 
TO authenticated
USING (true);

-- 4. Drop problematic conflicting policies only if they exist
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can modify roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can have roles assigned" ON public.user_roles;

-- Create secure admin role management policy (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Admins can manage all user roles'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can manage all user roles" 
                 ON public.user_roles 
                 FOR ALL 
                 TO authenticated
                 USING (public.has_role(auth.uid(), ''admin''::user_role))
                 WITH CHECK (public.has_role(auth.uid(), ''admin''::user_role))';
    END IF;
END $$;

-- 5. Secure database functions by adding search_path protection
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_child_total_stars(child_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT COALESCE(SUM(stars_earned), 0)::integer
  FROM public.progress 
  WHERE child_id = child_uuid;
$function$;

CREATE OR REPLACE FUNCTION public.get_child_activity_summary(child_uuid uuid)
RETURNS TABLE(activity_type activity_type, activity_subtype text, completion_count bigint, total_stars bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT 
    p.activity_type,
    p.activity_subtype,
    COUNT(*) as completion_count,
    SUM(p.stars_earned) as total_stars
  FROM public.progress p
  WHERE p.child_id = child_uuid
  GROUP BY p.activity_type, p.activity_subtype
  ORDER BY p.activity_type, p.activity_subtype;
$function$;

CREATE OR REPLACE FUNCTION public.get_auth_user_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.sync_children_from_metadata()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  user_record RECORD;
  child_data RECORD;
  child_metadata jsonb;
  existing_child_id uuid;
BEGIN
  -- Loop through all auth users who have children in metadata
  FOR user_record IN 
    SELECT au.id, au.raw_user_meta_data
    FROM auth.users au
    WHERE au.raw_user_meta_data ? 'children'
    AND au.raw_user_meta_data->'children' != 'null'::jsonb
    AND jsonb_array_length(au.raw_user_meta_data->'children') > 0
  LOOP
    -- Loop through each child in the metadata
    FOR child_data IN 
      SELECT * FROM jsonb_array_elements(user_record.raw_user_meta_data->'children')
    LOOP
      child_metadata := child_data.value;
      
      -- Check if child already exists in database (by name and parent_id)
      SELECT id INTO existing_child_id
      FROM public.children 
      WHERE parent_id = user_record.id 
      AND name = child_metadata->>'name'
      LIMIT 1;
      
      -- If child doesn't exist, create it
      IF existing_child_id IS NULL THEN
        INSERT INTO public.children (
          parent_id,
          name,
          age,
          gender,
          avatar_url,
          birth_date,
          speech_development,
          speech_difficulties,
          speech_difficulties_description
        ) VALUES (
          user_record.id,
          child_metadata->>'name',
          COALESCE((child_metadata->>'age')::integer, 5),
          child_metadata->>'gender',
          child_metadata->>'avatarUrl',
          CASE 
            WHEN child_metadata->>'birthDate' IS NOT NULL 
            THEN (child_metadata->>'birthDate')::date
            ELSE NULL
          END,
          CASE 
            WHEN child_metadata->'speechDevelopment' IS NOT NULL 
            THEN child_metadata->'speechDevelopment'
            ELSE NULL
          END,
          CASE 
            WHEN child_metadata->'speechDifficulties' IS NOT NULL 
            THEN ARRAY(SELECT jsonb_array_elements_text(child_metadata->'speechDifficulties'))
            ELSE NULL
          END,
          child_metadata->>'speechDifficultiesDescription'
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(role_name user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = role_name
  );
$function$;