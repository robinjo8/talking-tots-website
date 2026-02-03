-- Create RPC function for logopedist child activity summary
-- Identical to get_child_activity_summary but uses logopedist_child_id

CREATE OR REPLACE FUNCTION public.get_logopedist_child_activity_summary(logopedist_child_uuid uuid)
RETURNS TABLE(
  activity_type activity_type,
  activity_subtype text,
  completion_count bigint,
  total_stars bigint
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.activity_type,
    p.activity_subtype,
    COUNT(*) as completion_count,
    SUM(COALESCE(p.stars_earned, 1)) as total_stars
  FROM public.progress p
  WHERE p.logopedist_child_id = logopedist_child_uuid
  GROUP BY p.activity_type, p.activity_subtype
  ORDER BY p.activity_type, p.activity_subtype;
$$;