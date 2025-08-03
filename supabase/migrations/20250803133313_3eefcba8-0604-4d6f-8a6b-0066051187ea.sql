-- Clean up duplicate progress entries for memory games
-- Keep only one entry per child for each memory game type based on earliest completion

-- First, let's see what we have
CREATE TEMPORARY TABLE memory_game_duplicates AS
SELECT 
  child_id,
  activity_subtype,
  MIN(completed_at) as first_completion,
  COUNT(*) as duplicate_count
FROM progress 
WHERE activity_type = 'memory_game'
GROUP BY child_id, activity_subtype
HAVING COUNT(*) > 1;

-- Delete all duplicate entries except the first one for each child/game combination
DELETE FROM progress 
WHERE id IN (
  SELECT p.id 
  FROM progress p
  INNER JOIN memory_game_duplicates mgd ON (
    p.child_id = mgd.child_id AND 
    p.activity_subtype = mgd.activity_subtype AND
    p.activity_type = 'memory_game' AND
    p.completed_at > mgd.first_completion
  )
);

-- Clean up temporary table
DROP TABLE memory_game_duplicates;