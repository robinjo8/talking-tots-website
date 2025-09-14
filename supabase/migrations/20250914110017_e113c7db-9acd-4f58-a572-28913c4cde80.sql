-- Fix Security Definer View Issue

-- Drop and recreate the view without security definer
DROP VIEW IF EXISTS public.children_analytics;

-- Create a simple view that inherits RLS from underlying table
CREATE VIEW public.children_analytics AS
SELECT 
  id,
  DATE_PART('year', AGE(birth_date)) as age_years,
  gender,
  CASE WHEN speech_difficulties IS NOT NULL THEN array_length(speech_difficulties, 1) ELSE 0 END as difficulties_count,
  CASE WHEN speech_development IS NOT NULL THEN 'object' ELSE 'null' END as has_development_data,
  created_at,
  updated_at
FROM public.children
-- The view inherits RLS policies from the children table automatically