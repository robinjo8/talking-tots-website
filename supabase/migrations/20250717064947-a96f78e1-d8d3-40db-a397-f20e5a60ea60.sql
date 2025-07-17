-- First, create missing user records in public.users table
INSERT INTO public.users (id, email, name, role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)),
    'parent'
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- Create function to sync children from user metadata to database
CREATE OR REPLACE FUNCTION public.sync_children_from_metadata()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Run the sync function once to migrate existing data
SELECT public.sync_children_from_metadata();