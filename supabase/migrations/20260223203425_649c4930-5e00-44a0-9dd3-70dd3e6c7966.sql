-- INSERT za organizacijske logopede
CREATE POLICY "Org logopedists can create evaluations for org sessions"
ON articulation_evaluations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    JOIN logopedist_profiles lp ON lp.organization_id = s.organization_id
    WHERE s.id = articulation_evaluations.session_id
    AND lp.user_id = auth.uid()
  )
);

-- UPDATE za organizacijske logopede
CREATE POLICY "Org logopedists can update evaluations for org sessions"
ON articulation_evaluations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    JOIN logopedist_profiles lp ON lp.organization_id = s.organization_id
    WHERE s.id = articulation_evaluations.session_id
    AND lp.user_id = auth.uid()
  )
);

-- SELECT za organizacijske logopede
CREATE POLICY "Org logopedists can view evaluations for org sessions"
ON articulation_evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    JOIN logopedist_profiles lp ON lp.organization_id = s.organization_id
    WHERE s.id = articulation_evaluations.session_id
    AND lp.user_id = auth.uid()
  )
);

-- INSERT za interne logopede (Ema)
CREATE POLICY "Internal logopedists can create all evaluations"
ON articulation_evaluations FOR INSERT
WITH CHECK (is_internal_logopedist(auth.uid()));

-- UPDATE za interne logopede (Ema)
CREATE POLICY "Internal logopedists can update all evaluations"
ON articulation_evaluations FOR UPDATE
USING (is_internal_logopedist(auth.uid()));