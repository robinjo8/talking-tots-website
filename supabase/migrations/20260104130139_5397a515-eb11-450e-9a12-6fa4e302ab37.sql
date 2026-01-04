-- Fix SECURITY DEFINER views by setting security_invoker=true
-- This ensures the view uses RLS policies of the querying user, not the view owner

-- Drop the dependent function first
DROP FUNCTION IF EXISTS public.get_children_analytics();

-- Drop and recreate children_analytics view with security_invoker
DROP VIEW IF EXISTS public.children_analytics CASCADE;
CREATE VIEW public.children_analytics 
WITH (security_invoker=true) AS
SELECT 
    c.id AS child_id,
    c.name AS child_name,
    count(p.id) AS sessions_count,
    COALESCE(round(avg(p.score), 2), 0::numeric) AS avg_score,
    COALESCE(sum(p.stars_earned), 0::bigint) AS stars_total,
    max(p.completed_at) AS last_activity_at
FROM children c
LEFT JOIN progress p ON p.child_id = c.id
GROUP BY c.id, c.name;

-- Drop and recreate children_analytics_admin view with security_invoker
DROP VIEW IF EXISTS public.children_analytics_admin CASCADE;
CREATE VIEW public.children_analytics_admin 
WITH (security_invoker=true) AS
SELECT 
    c.id AS child_id,
    c.name AS child_name,
    count(p.id) AS sessions_count,
    COALESCE(round(avg(p.score), 2), 0::numeric) AS avg_score,
    COALESCE(sum(p.stars_earned), 0::bigint) AS stars_total,
    max(p.completed_at) AS last_activity_at
FROM children c
LEFT JOIN progress p ON p.child_id = c.id
GROUP BY c.id, c.name;

-- Recreate the function with SECURITY INVOKER instead of SECURITY DEFINER
-- This is more secure as it uses the caller's permissions
CREATE OR REPLACE FUNCTION public.get_children_analytics()
RETURNS TABLE (
    child_id uuid,
    child_name text,
    sessions_count bigint,
    avg_score numeric,
    stars_total bigint,
    last_activity_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT * FROM public.children_analytics;
$$;

-- Grant SELECT access to authenticated users for children_analytics
GRANT SELECT ON public.children_analytics TO authenticated;

-- Grant SELECT access to authenticated users for children_analytics_admin
GRANT SELECT ON public.children_analytics_admin TO authenticated;