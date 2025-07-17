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
  -- Loop through all users who have children in metadata but not in database
  FOR user_record IN 
    SELECT id, raw_user_meta_data
    FROM auth.users 
    WHERE raw_user_meta_data ? 'children'
    AND raw_user_meta_data->'children' != 'null'::jsonb
    AND jsonb_array_length(raw_user_meta_data->'children') > 0
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

-- Create function to automatically sync children when user metadata is updated
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only sync if children data has changed
  IF OLD.raw_user_meta_data->'children' IS DISTINCT FROM NEW.raw_user_meta_data->'children' THEN
    PERFORM public.sync_children_from_metadata();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync children when metadata changes
DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;
CREATE TRIGGER on_auth_user_metadata_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_user_metadata_update();