
-- Create child_monthly_plans table
CREATE TABLE public.child_monthly_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  report_id uuid REFERENCES public.logopedist_reports(id) ON DELETE SET NULL,
  plan_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  focus_letters text[] DEFAULT '{}',
  month integer NOT NULL,
  year integer NOT NULL,
  status text NOT NULL DEFAULT 'generating',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add constraint for status values
ALTER TABLE public.child_monthly_plans
  ADD CONSTRAINT child_monthly_plans_status_check
  CHECK (status IN ('generating', 'active', 'archived'));

-- Create indexes
CREATE INDEX idx_child_monthly_plans_child_id ON public.child_monthly_plans(child_id);
CREATE INDEX idx_child_monthly_plans_status ON public.child_monthly_plans(status);
CREATE INDEX idx_child_monthly_plans_child_status ON public.child_monthly_plans(child_id, status);

-- Enable RLS
ALTER TABLE public.child_monthly_plans ENABLE ROW LEVEL SECURITY;

-- RLS: Parents can view their child's plans
CREATE POLICY "Parents can view their child plans"
ON public.child_monthly_plans
FOR SELECT
TO authenticated
USING (
  auth.uid() = (SELECT parent_id FROM public.children WHERE id = child_id)
);

-- RLS: Logopedists can view plans
CREATE POLICY "Logopedists can view plans"
ON public.child_monthly_plans
FOR SELECT
TO authenticated
USING (
  public.is_logopedist(auth.uid()) OR public.is_internal_logopedist(auth.uid())
);

-- RLS: Service role handles INSERT/UPDATE (no user-facing write policies needed)
-- Edge function uses service_role_key which bypasses RLS

-- Trigger for updated_at
CREATE TRIGGER update_child_monthly_plans_updated_at
BEFORE UPDATE ON public.child_monthly_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
