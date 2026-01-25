-- Odstrani staro politiko če obstaja
DROP POLICY IF EXISTS "Logopedists can view own reports" ON public.logopedist_reports;
DROP POLICY IF EXISTS "Logopedists can view organization reports" ON public.logopedist_reports;
DROP POLICY IF EXISTS "Logopedists can insert own reports" ON public.logopedist_reports;
DROP POLICY IF EXISTS "Logopedists can update own reports" ON public.logopedist_reports;
DROP POLICY IF EXISTS "Logopedists can delete own reports" ON public.logopedist_reports;

-- Nova politika: logoped vidi vsa poročila v svoji organizaciji
CREATE POLICY "Logopedists can view organization reports"
  ON public.logopedist_reports FOR SELECT
  USING (
    logopedist_id IN (
      SELECT lp.id 
      FROM public.logopedist_profiles lp
      WHERE lp.organization_id = public.get_user_organization_id(auth.uid())
    )
  );

-- Politika za vstavljanje lastnih poročil
CREATE POLICY "Logopedists can insert own reports"
  ON public.logopedist_reports FOR INSERT
  WITH CHECK (
    logopedist_id IN (
      SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
    )
  );

-- Politika za posodabljanje lastnih poročil
CREATE POLICY "Logopedists can update own reports"
  ON public.logopedist_reports FOR UPDATE
  USING (
    logopedist_id IN (
      SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
    )
  );

-- Politika za brisanje lastnih poročil
CREATE POLICY "Logopedists can delete own reports"
  ON public.logopedist_reports FOR DELETE
  USING (
    logopedist_id IN (
      SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
    )
  );