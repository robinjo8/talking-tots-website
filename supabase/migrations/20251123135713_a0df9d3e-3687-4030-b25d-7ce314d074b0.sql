-- Create function to get daily activities count for a child
-- Counts activities completed today in Slovenia timezone (Europe/Ljubljana)
-- Automatically resets at midnight as CURRENT_DATE changes
CREATE OR REPLACE FUNCTION public.get_child_daily_activities(child_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT COUNT(*)::integer
  FROM public.progress 
  WHERE child_id = child_uuid
    AND completed_at >= (CURRENT_DATE AT TIME ZONE 'Europe/Ljubljana')
    AND completed_at < (CURRENT_DATE AT TIME ZONE 'Europe/Ljubljana' + INTERVAL '1 day');
$function$;