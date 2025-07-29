-- Clean up duplicate children while preserving progress data
CREATE OR REPLACE FUNCTION public.cleanup_duplicate_children_with_progress()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  duplicate_record RECORD;
  kept_child_id uuid;
  old_child_id uuid;
BEGIN
  -- For each parent with multiple children
  FOR duplicate_record IN 
    SELECT parent_id, COUNT(*) as child_count
    FROM public.children 
    GROUP BY parent_id 
    HAVING COUNT(*) > 1
  LOOP
    -- Get the ID of the child we want to keep (most recent)
    SELECT id INTO kept_child_id
    FROM public.children 
    WHERE parent_id = duplicate_record.parent_id 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Update progress records from old children to point to the kept child
    FOR old_child_id IN 
      SELECT id 
      FROM public.children 
      WHERE parent_id = duplicate_record.parent_id 
      AND id != kept_child_id
    LOOP
      -- Transfer progress data to the kept child
      UPDATE public.progress 
      SET child_id = kept_child_id 
      WHERE child_id = old_child_id;
    END LOOP;
    
    -- Now delete the duplicate children (progress data is now safe)
    DELETE FROM public.children 
    WHERE parent_id = duplicate_record.parent_id 
    AND id != kept_child_id;
  END LOOP;
END;
$$;

-- Execute the cleanup function
SELECT public.cleanup_duplicate_children_with_progress();

-- Add unique constraint to prevent future duplicates
ALTER TABLE public.children 
ADD CONSTRAINT unique_parent_child UNIQUE (parent_id);

-- Drop the cleanup function as it's no longer needed
DROP FUNCTION public.cleanup_duplicate_children_with_progress();