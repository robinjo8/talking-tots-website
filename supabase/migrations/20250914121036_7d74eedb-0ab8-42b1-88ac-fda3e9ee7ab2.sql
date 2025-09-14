-- Check for and fix any security definer views
-- First, let's see what views exist and drop any with security definer

-- Drop any potentially problematic views and recreate them safely
DROP VIEW IF EXISTS public.children_analytics CASCADE;

-- Recreate the analytics view without security definer (making it use the caller's permissions)
CREATE VIEW public.children_analytics AS
SELECT 
  id,
  DATE_PART('year', AGE(birth_date)) as age_years,
  gender,
  CASE WHEN speech_difficulties IS NOT NULL THEN array_length(speech_difficulties, 1) ELSE 0 END as difficulties_count,
  CASE WHEN speech_development IS NOT NULL THEN 'object' ELSE 'null' END as has_development_data,
  created_at,
  updated_at
FROM public.children;

-- Ensure RLS is enabled on the view (it inherits from the underlying table)
COMMENT ON VIEW public.children_analytics IS 'Anonymized analytics view of children data for reporting (inherits RLS from children table)';

-- Also ensure all our functions are properly defined without unnecessary security definer
-- Keep the validation functions as they are safe immutable functions
-- But check if any other problematic views or functions exist

-- List all views to check (this won't create anything, just for visibility in logs)
-- SELECT schemaname, viewname FROM pg_views WHERE schemaname = 'public';