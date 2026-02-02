-- Faza 1: Razširitev tabele articulation_test_sessions za podporo logopedist otrok

-- 1. Dodaj nove stolpce
ALTER TABLE public.articulation_test_sessions 
ADD COLUMN IF NOT EXISTS logopedist_child_id UUID REFERENCES public.logopedist_children(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id),
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'parent' CHECK (source_type IN ('parent', 'logopedist'));

-- 2. Ustvari indeks za hitrejše filtriranje
CREATE INDEX IF NOT EXISTS idx_articulation_sessions_organization ON public.articulation_test_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_articulation_sessions_source_type ON public.articulation_test_sessions(source_type);
CREATE INDEX IF NOT EXISTS idx_articulation_sessions_logopedist_child ON public.articulation_test_sessions(logopedist_child_id);

-- 3. Migriraj obstoječe podatke - nastavi organization_id za TomiTalk (internal) seje
-- Najprej poišči internal organizacijo
UPDATE public.articulation_test_sessions ats
SET organization_id = (
  SELECT o.id FROM public.organizations o WHERE o.type = 'internal' LIMIT 1
),
source_type = 'parent'
WHERE ats.organization_id IS NULL AND ats.child_id IS NOT NULL;

-- 4. Posodobi RLS politike za podporo organizacij

-- Odstrani obstoječe politike ki jih bomo zamenjali
DROP POLICY IF EXISTS "Internal logopedists can claim pending sessions" ON public.articulation_test_sessions;
DROP POLICY IF EXISTS "Logopedists can view assigned sessions" ON public.articulation_test_sessions;
DROP POLICY IF EXISTS "logopedists_see_own_org_sessions" ON public.articulation_test_sessions;
DROP POLICY IF EXISTS "logopedists_claim_own_org_pending" ON public.articulation_test_sessions;
DROP POLICY IF EXISTS "logopedists_update_assigned_sessions" ON public.articulation_test_sessions;

-- 5. Nova politika: Logopedisti vidijo seje svoje organizacije
CREATE POLICY "Logopedists see own organization sessions"
ON public.articulation_test_sessions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.organization_id = articulation_test_sessions.organization_id
  )
);

-- 6. Nova politika: Logopedisti lahko prevzamejo pending seje svoje organizacije
CREATE POLICY "Logopedists claim pending sessions in own org"
ON public.articulation_test_sessions
FOR UPDATE
TO authenticated
USING (
  status = 'pending'
  AND assigned_to IS NULL
  AND EXISTS (
    SELECT 1 FROM public.logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.organization_id = articulation_test_sessions.organization_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.organization_id = articulation_test_sessions.organization_id
  )
);

-- 7. Nova politika: Logopedisti lahko posodabljajo seje dodeljene njim
CREATE POLICY "Logopedists update their assigned sessions"
ON public.articulation_test_sessions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.id = articulation_test_sessions.assigned_to
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.logopedist_profiles lp
    WHERE lp.user_id = auth.uid()
    AND lp.id = articulation_test_sessions.assigned_to
  )
);

-- 8. Nova politika: Logopedisti lahko ustvarijo seje za otroke svoje organizacije
CREATE POLICY "Logopedists insert sessions for own org children"
ON public.articulation_test_sessions
FOR INSERT
TO authenticated
WITH CHECK (
  -- Za logopedist otroke
  (
    source_type = 'logopedist' 
    AND logopedist_child_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.logopedist_children lc
      JOIN public.logopedist_profiles lp ON lc.logopedist_id = lp.id
      WHERE lc.id = logopedist_child_id
      AND lp.user_id = auth.uid()
    )
  )
  OR
  -- Za parent otroke (obstoječa logika)
  (
    source_type = 'parent'
    AND child_id IS NOT NULL
    AND parent_id = auth.uid()
  )
);