CREATE POLICY "Logopedists can view activity completions"
ON public.plan_activity_completions
FOR SELECT
TO authenticated
USING (is_logopedist(auth.uid()) OR is_internal_logopedist(auth.uid()));