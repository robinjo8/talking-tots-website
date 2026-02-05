-- =====================================================
-- ORGANIZACIJSKE LICENCE - Nova arhitektura
-- =====================================================

-- 1. Dodaj nov tier za šole (100 otrok)
INSERT INTO license_tiers (name, display_name, max_children, price_eur, features, is_active) 
VALUES ('school_basic', 'Šolski paket', 100, 200000, '{"reports": true, "exercises": true, "organization_wide": true}'::jsonb, true)
ON CONFLICT DO NOTHING;

-- 2. Ustvari tabelo za organizacijske licence
CREATE TABLE IF NOT EXISTS public.organization_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  license_tier_id UUID NOT NULL REFERENCES license_tiers(id),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id)
);

-- 3. Omogoči RLS na novi tabeli
ALTER TABLE public.organization_licenses ENABLE ROW LEVEL SECURITY;

-- 4. RLS politike za organization_licenses
CREATE POLICY "Org members can view their org license"
ON public.organization_licenses FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM logopedist_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Super admin can manage all org licenses"
ON public.organization_licenses FOR ALL
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- 5. Nova funkcija za preverjanje organizacijske kvote
CREATE OR REPLACE FUNCTION check_organization_child_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_max_children INTEGER;
  v_current_count INTEGER;
  v_has_org_license BOOLEAN;
BEGIN
  -- Pridobi organization_id logopeda
  SELECT lp.organization_id INTO v_org_id
  FROM logopedist_profiles lp
  WHERE lp.id = NEW.logopedist_id;

  -- Najprej preveri organizacijsko licenco
  SELECT EXISTS(
    SELECT 1 FROM organization_licenses ol
    JOIN license_tiers lt ON ol.license_tier_id = lt.id
    WHERE ol.organization_id = v_org_id
    AND ol.status = 'active'
  ) INTO v_has_org_license;

  IF v_has_org_license THEN
    -- Uporabi organizacijsko licenco
    SELECT lt.max_children INTO v_max_children
    FROM organization_licenses ol
    JOIN license_tiers lt ON ol.license_tier_id = lt.id
    WHERE ol.organization_id = v_org_id
    AND ol.status = 'active';

    -- Preštej VSE otroke v organizaciji (ne samo tega logopeda)
    SELECT COUNT(*) INTO v_current_count
    FROM logopedist_children lc
    JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.organization_id = v_org_id
    AND lc.is_active = true;
  ELSE
    -- Fallback na individualno licenco
    SELECT lt.max_children INTO v_max_children
    FROM logopedist_licenses ll
    JOIN license_tiers lt ON ll.license_tier_id = lt.id
    WHERE ll.logopedist_id = NEW.logopedist_id
    AND ll.status = 'active';

    IF v_max_children IS NULL THEN
      RAISE EXCEPTION 'Ni aktivne licence. Prosimo, aktivirajte licenco.';
    END IF;

    -- Preštej samo otroke tega logopeda
    SELECT COUNT(*) INTO v_current_count
    FROM logopedist_children
    WHERE logopedist_id = NEW.logopedist_id
    AND is_active = true;
  END IF;

  IF v_current_count >= v_max_children THEN
    RAISE EXCEPTION 'Dosežena omejitev otrok (%). Nadgradite licenco za več mest.', v_max_children;
  END IF;

  RETURN NEW;
END;
$$;

-- 6. Posodobi trigger (zamenjaj obstoječega če obstaja)
DROP TRIGGER IF EXISTS check_child_limit_trigger ON logopedist_children;
CREATE TRIGGER check_child_limit_trigger
  BEFORE INSERT ON logopedist_children
  FOR EACH ROW
  EXECUTE FUNCTION check_organization_child_limit();

-- 7. Nova funkcija za pridobitev organizacijske statistike licence
CREATE OR REPLACE FUNCTION get_organization_license_stats(p_user_id UUID)
RETURNS TABLE(
  license_name TEXT,
  max_children INTEGER,
  used_slots BIGINT,
  available_slots INTEGER,
  expires_at TIMESTAMPTZ,
  status TEXT,
  is_organization_license BOOLEAN,
  organization_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
BEGIN
  -- Pridobi organization_id uporabnika
  SELECT lp.organization_id INTO v_org_id
  FROM logopedist_profiles lp
  WHERE lp.user_id = p_user_id;

  -- Najprej poskusi organizacijsko licenco
  RETURN QUERY
  SELECT 
    lt.display_name::TEXT,
    lt.max_children,
    (SELECT COUNT(*)::BIGINT 
     FROM logopedist_children lc
     JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
     WHERE lp.organization_id = v_org_id AND lc.is_active = true
    ) AS used_slots,
    (lt.max_children - (
      SELECT COUNT(*)::INTEGER 
      FROM logopedist_children lc
      JOIN logopedist_profiles lp ON lc.logopedist_id = lp.id
      WHERE lp.organization_id = v_org_id AND lc.is_active = true
    )) AS available_slots,
    ol.current_period_end,
    ol.status::TEXT,
    true AS is_organization_license,
    o.name::TEXT AS organization_name
  FROM organization_licenses ol
  JOIN license_tiers lt ON ol.license_tier_id = lt.id
  JOIN organizations o ON ol.organization_id = o.id
  WHERE ol.organization_id = v_org_id
  AND ol.status = 'active';

  -- Če ni organizacijske licence, vrni individualno
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      lt.display_name::TEXT,
      lt.max_children,
      (SELECT COUNT(*)::BIGINT 
       FROM logopedist_children lc
       WHERE lc.logopedist_id = lp.id AND lc.is_active = true
      ) AS used_slots,
      (lt.max_children - (
        SELECT COUNT(*)::INTEGER 
        FROM logopedist_children lc
        WHERE lc.logopedist_id = lp.id AND lc.is_active = true
      )) AS available_slots,
      ll.current_period_end,
      ll.status::TEXT,
      false AS is_organization_license,
      NULL::TEXT AS organization_name
    FROM logopedist_profiles lp
    JOIN logopedist_licenses ll ON ll.logopedist_id = lp.id
    JOIN license_tiers lt ON ll.license_tier_id = lt.id
    WHERE lp.user_id = p_user_id
    AND ll.status = 'active';
  END IF;
END;
$$;

-- 8. Posodobi RLS na logopedist_children za organizacijsko vidnost
-- Najprej odstrani obstoječo politiko
DROP POLICY IF EXISTS "Logopedists can manage own children" ON logopedist_children;

-- Nova politika: logopedi vidijo otroke cele organizacije (če ima org licenco)
CREATE POLICY "Logopedists can view org children"
ON logopedist_children FOR SELECT
USING (
  -- Vedno lahko vidi svoje otroke
  logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
  OR
  -- Če ima organizacija licenco, vidi vse otroke organizacije
  EXISTS (
    SELECT 1 FROM logopedist_profiles my_profile
    JOIN organization_licenses ol ON ol.organization_id = my_profile.organization_id
    WHERE my_profile.user_id = auth.uid()
    AND ol.status = 'active'
    AND logopedist_children.logopedist_id IN (
      SELECT id FROM logopedist_profiles WHERE organization_id = my_profile.organization_id
    )
  )
);

-- Urejanje in brisanje ostane samo za svoje otroke
CREATE POLICY "Logopedists can insert own children"
ON logopedist_children FOR INSERT
WITH CHECK (
  logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Logopedists can update own children"
ON logopedist_children FOR UPDATE
USING (
  logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
)
WITH CHECK (
  logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Logopedists can delete own children"
ON logopedist_children FOR DELETE
USING (
  logopedist_id IN (SELECT id FROM logopedist_profiles WHERE user_id = auth.uid())
);

-- 9. Dodeli organizacijsko licenco za OŠ Test (100 otrok)
INSERT INTO organization_licenses (organization_id, license_tier_id, status)
SELECT 
  o.id,
  lt.id,
  'active'
FROM organizations o
CROSS JOIN license_tiers lt
WHERE o.name = 'OŠ Test'
AND lt.name = 'school_basic'
ON CONFLICT (organization_id) DO UPDATE SET
  license_tier_id = EXCLUDED.license_tier_id,
  status = 'active',
  updated_at = now();