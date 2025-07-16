-- Enhanced progress tracking for unified progress system

-- Create activity type enum
CREATE TYPE public.activity_type AS ENUM ('exercise', 'memory_game', 'puzzle');

-- Add columns to existing progress table for unified tracking
ALTER TABLE public.progress 
ADD COLUMN activity_type public.activity_type DEFAULT 'exercise',
ADD COLUMN activity_subtype text, -- e.g., 'K', 'R', 'S' for memory games, 'roka', 'riba', etc for puzzles
ADD COLUMN stars_earned integer DEFAULT 1,
ADD COLUMN session_metadata jsonb; -- for storing additional data like completion time, difficulty

-- Update existing records to have default activity_type
UPDATE public.progress SET activity_type = 'exercise' WHERE activity_type IS NULL;

-- Create index for better performance
CREATE INDEX idx_progress_child_activity ON public.progress(child_id, activity_type, activity_subtype);

-- Create function to calculate total stars for a child
CREATE OR REPLACE FUNCTION public.get_child_total_stars(child_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(stars_earned), 0)::integer
  FROM public.progress 
  WHERE child_id = child_uuid;
$$;

-- Create function to get activity summary for a child
CREATE OR REPLACE FUNCTION public.get_child_activity_summary(child_uuid uuid)
RETURNS TABLE(
  activity_type public.activity_type,
  activity_subtype text,
  completion_count bigint,
  total_stars bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    p.activity_type,
    p.activity_subtype,
    COUNT(*) as completion_count,
    SUM(p.stars_earned) as total_stars
  FROM public.progress p
  WHERE p.child_id = child_uuid
  GROUP BY p.activity_type, p.activity_subtype
  ORDER BY p.activity_type, p.activity_subtype;
$$;