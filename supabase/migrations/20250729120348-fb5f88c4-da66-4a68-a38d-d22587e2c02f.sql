-- Clean up duplicate children, keeping the most recent one for each parent
CREATE OR REPLACE FUNCTION public.cleanup_duplicate_children()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  duplicate_record RECORD;
BEGIN
  -- For each parent with multiple children, keep only the most recent one
  FOR duplicate_record IN 
    SELECT parent_id, COUNT(*) as child_count
    FROM public.children 
    GROUP BY parent_id 
    HAVING COUNT(*) > 1
  LOOP
    -- Delete all but the most recent child for this parent
    DELETE FROM public.children 
    WHERE parent_id = duplicate_record.parent_id 
    AND id NOT IN (
      SELECT id 
      FROM public.children 
      WHERE parent_id = duplicate_record.parent_id 
      ORDER BY created_at DESC 
      LIMIT 1
    );
  END LOOP;
END;
$$;

-- Execute the cleanup function
SELECT public.cleanup_duplicate_children();

-- Add unique constraint to prevent future duplicates
ALTER TABLE public.children 
ADD CONSTRAINT unique_parent_child UNIQUE (parent_id);

-- Drop the cleanup function as it's no longer needed
DROP FUNCTION public.cleanup_duplicate_children();