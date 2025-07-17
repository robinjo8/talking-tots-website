-- Clean up incorrect progress entries and keep only the correct number
-- First, get the correct counts per child for vaje_motorike_govoril
WITH correct_counts AS (
  SELECT 
    child_id,
    -- Count should be 3 full exercises based on the user's confirmation
    3 as correct_count
  FROM public.progress 
  WHERE exercise_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  GROUP BY child_id
),
ranked_progress AS (
  SELECT 
    p.*,
    ROW_NUMBER() OVER (PARTITION BY p.child_id ORDER BY p.completed_at) as rn
  FROM public.progress p
  JOIN correct_counts cc ON p.child_id = cc.child_id
  WHERE p.exercise_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
)
-- Delete excess progress entries, keeping only the first 3 for each child
DELETE FROM public.progress 
WHERE id IN (
  SELECT id 
  FROM ranked_progress rp
  JOIN correct_counts cc ON rp.child_id = cc.child_id
  WHERE rp.rn > cc.correct_count
);