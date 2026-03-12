
-- Add set_number column to plan_activity_completions
ALTER TABLE public.plan_activity_completions 
  ADD COLUMN IF NOT EXISTS set_number INTEGER;

-- Add expires_at to child_monthly_plans (90-day safety net)
ALTER TABLE public.child_monthly_plans 
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Create plan_set_tracking table
CREATE TABLE public.plan_set_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.child_monthly_plans(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  total_stars INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE(plan_id, child_id, set_number)
);

ALTER TABLE public.plan_set_tracking ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can view tracking for their children
CREATE POLICY "Parents can view set tracking"
  ON public.plan_set_tracking
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = (SELECT parent_id FROM public.children WHERE id = plan_set_tracking.child_id)
  );

-- RLS: Parents can insert tracking for their children
CREATE POLICY "Parents can insert set tracking"
  ON public.plan_set_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = (SELECT parent_id FROM public.children WHERE id = plan_set_tracking.child_id)
  );

-- RLS: Parents can update tracking for their children
CREATE POLICY "Parents can update set tracking"
  ON public.plan_set_tracking
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = (SELECT parent_id FROM public.children WHERE id = plan_set_tracking.child_id)
  );

-- RLS: Logopedists can view set tracking
CREATE POLICY "Logopedists can view set tracking"
  ON public.plan_set_tracking
  FOR SELECT
  TO authenticated
  USING (
    is_logopedist(auth.uid()) OR is_internal_logopedist(auth.uid())
  );
