-- Popravek RLS politik na tabeli progress za organizacijsko vidnost
-- Logopedi v isti organizaciji bodo lahko videli napredek otrok kolegov

-- 1. Odstrani staro ALL politiko
DROP POLICY IF EXISTS "Logopedists can manage own children progress" ON public.progress;

-- 2. Nova SELECT politika z organizacijsko vidnostjo
CREATE POLICY "Logopedists can view org children progress"
ON public.progress FOR SELECT
USING (
  -- Dovoli če je logopedist_child_id NULL (parent progress - te bodo ujeli parent politike)
  logopedist_child_id IS NULL
  OR
  -- ALI če je logopedist lastnik otroka
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
  OR
  -- ALI če je logopedist v isti organizaciji z aktivno licenco
  logopedist_child_id IN (
    SELECT lc.id
    FROM logopedist_children lc
    JOIN logopedist_profiles owner_lp ON lc.logopedist_id = owner_lp.id
    JOIN logopedist_profiles my_lp ON my_lp.user_id = auth.uid()
    JOIN organization_licenses ol ON ol.organization_id = my_lp.organization_id
    WHERE owner_lp.organization_id = my_lp.organization_id
      AND ol.status = 'active'
  )
);

-- 3. INSERT politika: samo za lastne otroke
CREATE POLICY "Logopedists can insert own children progress"
ON public.progress FOR INSERT
WITH CHECK (
  logopedist_child_id IS NULL
  OR
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- 4. UPDATE politika: samo za lastne otroke
CREATE POLICY "Logopedists can update own children progress"
ON public.progress FOR UPDATE
USING (
  logopedist_child_id IS NULL
  OR
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- 5. DELETE politika: samo za lastne otroke
CREATE POLICY "Logopedists can delete own children progress"
ON public.progress FOR DELETE
USING (
  logopedist_child_id IS NULL
  OR
  logopedist_child_id IN (
    SELECT lc.id 
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);