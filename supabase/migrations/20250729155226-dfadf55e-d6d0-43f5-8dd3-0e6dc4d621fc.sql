-- First, create a function to handle duplicate children cleanup
CREATE OR REPLACE FUNCTION cleanup_duplicate_children_with_progress()
RETURNS void AS $$
DECLARE
    duplicate_record RECORD;
    kept_child_id UUID;
    old_child_ids UUID[];
BEGIN
    -- Find groups of children with same parent_id and name
    FOR duplicate_record IN 
        SELECT parent_id, name, array_agg(id ORDER BY created_at) as child_ids
        FROM children 
        GROUP BY parent_id, name 
        HAVING count(*) > 1
    LOOP
        -- Keep the first child (oldest)
        kept_child_id := duplicate_record.child_ids[1];
        
        -- Get IDs of children to remove
        old_child_ids := duplicate_record.child_ids[2:array_length(duplicate_record.child_ids, 1)];
        
        -- Transfer progress data from duplicate children to the kept child
        UPDATE progress 
        SET child_id = kept_child_id 
        WHERE child_id = ANY(old_child_ids);
        
        -- Delete the duplicate children (progress will remain linked to kept child)
        DELETE FROM children WHERE id = ANY(old_child_ids);
        
        RAISE NOTICE 'Merged progress for parent % child % - kept ID %, removed IDs %', 
            duplicate_record.parent_id, duplicate_record.name, kept_child_id, old_child_ids;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the cleanup function
SELECT cleanup_duplicate_children_with_progress();

-- Add unique constraint to prevent multiple children per parent
ALTER TABLE public.children 
ADD CONSTRAINT unique_parent_child UNIQUE (parent_id);

-- Drop the cleanup function as it's no longer needed
DROP FUNCTION cleanup_duplicate_children_with_progress();