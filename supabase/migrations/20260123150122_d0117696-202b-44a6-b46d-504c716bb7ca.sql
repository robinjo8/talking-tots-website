-- Politika ki omogoča vsem internim logopedistom ogled neprevzetih (pending) sej
-- Ta politika že obstaja v "Assigned logopedists can view sessions", 
-- vendar jo moramo razširiti, da omogoča tudi UPDATE za prevzem seje

-- Najprej preverimo ali politika za INSERT že obstaja za logopediste
-- Dodamo politiko ki omogoča logopedistom da posodobijo neprevzete seje (za prevzem)
DO $$
BEGIN
  -- Preverimo ali že obstaja politika za internal logopediste
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'articulation_test_sessions' 
    AND policyname = 'Internal logopedists can claim pending sessions'
  ) THEN
    -- Ustvarimo politiko ki omogoča prevzem neprevzetih sej
    EXECUTE 'CREATE POLICY "Internal logopedists can claim pending sessions"
    ON public.articulation_test_sessions FOR UPDATE
    TO authenticated
    USING (
      status = ''pending'' 
      AND assigned_to IS NULL 
      AND is_internal_logopedist(auth.uid())
    )
    WITH CHECK (
      is_internal_logopedist(auth.uid())
    )';
  END IF;
END $$;