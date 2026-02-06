
-- Create plan_activity_completions table for tracking completed activities
CREATE TABLE public.plan_activity_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.child_monthly_plans(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  day_date DATE NOT NULL,
  activity_index INTEGER NOT NULL CHECK (activity_index >= 0 AND activity_index <= 4),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(plan_id, child_id, day_date, activity_index)
);

-- Enable RLS
ALTER TABLE public.plan_activity_completions ENABLE ROW LEVEL SECURITY;

-- Parents can view their child's completions
CREATE POLICY "Parents can view their child's activity completions"
  ON public.plan_activity_completions
  FOR SELECT
  USING (auth.uid() = (SELECT parent_id FROM public.children WHERE id = child_id));

-- Parents can insert completions for their child
CREATE POLICY "Parents can insert their child's activity completions"
  ON public.plan_activity_completions
  FOR INSERT
  WITH CHECK (auth.uid() = (SELECT parent_id FROM public.children WHERE id = child_id));

-- Index for fast lookups
CREATE INDEX idx_plan_activity_completions_lookup 
  ON public.plan_activity_completions(plan_id, child_id, day_date);

-- RPC function to get stars per day for a child in a date range
CREATE OR REPLACE FUNCTION public.get_child_stars_by_date(
  child_uuid UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE(day DATE, stars BIGINT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    (completed_at AT TIME ZONE 'Europe/Ljubljana')::date as day,
    COALESCE(SUM(stars_earned), 0) as stars
  FROM public.progress 
  WHERE child_id = child_uuid
    AND (completed_at AT TIME ZONE 'Europe/Ljubljana')::date >= start_date
    AND (completed_at AT TIME ZONE 'Europe/Ljubljana')::date <= end_date
  GROUP BY (completed_at AT TIME ZONE 'Europe/Ljubljana')::date
  ORDER BY day;
$$;
