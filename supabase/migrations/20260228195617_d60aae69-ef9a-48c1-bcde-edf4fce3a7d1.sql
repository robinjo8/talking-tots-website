
-- ============================================
-- KORAK 1: articulation_test_sessions - omejitev internih logopedov
-- ============================================

-- DROP stare politike
DROP POLICY IF EXISTS "Assigned logopedists can view sessions" ON articulation_test_sessions;
DROP POLICY IF EXISTS "Assigned logopedists can update sessions" ON articulation_test_sessions;

-- NOVE politike: interni logopedi vidijo samo source_type='parent' + njim dodeljene
CREATE POLICY "Assigned logopedists can view sessions"
ON articulation_test_sessions FOR SELECT TO authenticated
USING (
  assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  OR (is_internal_logopedist(auth.uid()) AND source_type = 'parent')
);

CREATE POLICY "Assigned logopedists can update sessions"
ON articulation_test_sessions FOR UPDATE TO authenticated
USING (
  assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  OR (is_internal_logopedist(auth.uid()) AND source_type = 'parent')
);

-- ============================================
-- KORAK 2: articulation_evaluations - omejitev internih logopedov
-- ============================================

DROP POLICY IF EXISTS "Internal logopedists can create all evaluations" ON articulation_evaluations;
DROP POLICY IF EXISTS "Internal logopedists can update all evaluations" ON articulation_evaluations;
DROP POLICY IF EXISTS "Interni logopedi lahko berejo vse ocene" ON articulation_evaluations;

CREATE POLICY "Internal logopedists can create evaluations"
ON articulation_evaluations FOR INSERT TO authenticated
WITH CHECK (
  is_internal_logopedist(auth.uid())
  AND EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = articulation_evaluations.session_id
    AND (
      s.source_type = 'parent'
      OR s.assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
    )
  )
);

CREATE POLICY "Internal logopedists can update evaluations"
ON articulation_evaluations FOR UPDATE TO authenticated
USING (
  is_internal_logopedist(auth.uid())
  AND EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = articulation_evaluations.session_id
    AND (
      s.source_type = 'parent'
      OR s.assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
    )
  )
);

CREATE POLICY "Internal logopedists can read evaluations"
ON articulation_evaluations FOR SELECT TO authenticated
USING (
  is_internal_logopedist(auth.uid())
  AND EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = articulation_evaluations.session_id
    AND (
      s.source_type = 'parent'
      OR s.assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
    )
  )
);

-- ============================================
-- KORAK 3: articulation_word_results - omejitev internih logopedov
-- ============================================

DROP POLICY IF EXISTS "Logopedists can view assigned word results" ON articulation_word_results;
DROP POLICY IF EXISTS "Logopedists can update word results" ON articulation_word_results;

CREATE POLICY "Logopedists can view assigned word results"
ON articulation_word_results FOR SELECT TO authenticated
USING (
  session_id IN (
    SELECT id FROM articulation_test_sessions
    WHERE assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  )
  OR (
    is_internal_logopedist(auth.uid())
    AND session_id IN (
      SELECT id FROM articulation_test_sessions
      WHERE source_type = 'parent'
    )
  )
);

CREATE POLICY "Logopedists can update word results"
ON articulation_word_results FOR UPDATE TO authenticated
USING (
  session_id IN (
    SELECT id FROM articulation_test_sessions
    WHERE assigned_to IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  )
  OR (
    is_internal_logopedist(auth.uid())
    AND session_id IN (
      SELECT id FROM articulation_test_sessions
      WHERE source_type = 'parent'
    )
  )
);

-- ============================================
-- KORAK 7: RPC za zadnjo prijavo (za super admin)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_users_last_sign_in(user_ids uuid[])
RETURNS TABLE(user_id uuid, last_sign_in_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT au.id, au.last_sign_in_at
  FROM auth.users au
  WHERE au.id = ANY(user_ids)
    AND public.is_super_admin(auth.uid());
$$;
