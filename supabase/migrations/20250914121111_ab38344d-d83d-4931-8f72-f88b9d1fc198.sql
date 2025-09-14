-- Let's check system information about views and functions that might have security definer
-- This query will help us identify what's causing the security definer warning

-- Check for any functions marked as security definer that might be problematic
SELECT 
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true 
  AND n.nspname IN ('public', 'auth', 'storage')
ORDER BY n.nspname, p.proname;