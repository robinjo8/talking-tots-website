-- =============================================
-- MODUL "MOJI OTROCI" ZA LOGOPEDE
-- Licenčni sistem in upravljanje otrok
-- =============================================

-- 1. Licenčni paketi
CREATE TABLE public.license_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'basic', 'standard', 'premium'
  display_name TEXT NOT NULL, -- 'Osnovni', 'Standardni', 'Premium'
  max_children INTEGER NOT NULL,
  price_eur INTEGER NOT NULL, -- v centih
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vstavi privzete licenčne pakete
INSERT INTO public.license_tiers (name, display_name, max_children, price_eur, features) VALUES
  ('basic', 'Osnovni', 10, 50000, '{"reports": true, "exercises": true}'),
  ('standard', 'Standardni', 25, 100000, '{"reports": true, "exercises": true, "analytics": true}'),
  ('premium', 'Premium', 50, 175000, '{"reports": true, "exercises": true, "analytics": true, "priority_support": true}');

-- RLS za license_tiers (vsi lahko berejo, nihče ne more spreminjati)
ALTER TABLE public.license_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "License tiers are publicly readable" 
ON public.license_tiers FOR SELECT 
TO authenticated USING (true);

-- 2. Licence logopedov
CREATE TABLE public.logopedist_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logopedist_id UUID NOT NULL REFERENCES public.logopedist_profiles(id) ON DELETE CASCADE,
  license_tier_id UUID NOT NULL REFERENCES public.license_tiers(id),
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'expired', 'canceled')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(logopedist_id) -- Vsak logoped ima lahko samo eno aktivno licenco
);

-- RLS za logopedist_licenses
ALTER TABLE public.logopedist_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logopedists can view own license" 
ON public.logopedist_licenses FOR SELECT 
TO authenticated
USING (
  logopedist_id IN (
    SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
  )
);

-- 3. Otroci logopeda (ločeno od children tabele za starše)
CREATE TABLE public.logopedist_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logopedist_id UUID NOT NULL REFERENCES public.logopedist_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 18),
  gender TEXT CHECK (gender IN ('male', 'female')),
  avatar_url TEXT,
  birth_date DATE,
  speech_difficulties TEXT[],
  speech_difficulties_description TEXT,
  speech_development JSONB,
  notes TEXT, -- Interni zapiski logopeda
  external_id TEXT, -- ID iz logopedove prakse
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS za logopedist_children
ALTER TABLE public.logopedist_children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logopedists can manage own children" 
ON public.logopedist_children FOR ALL 
TO authenticated
USING (
  logopedist_id IN (
    SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  logopedist_id IN (
    SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
  )
);

-- Indeks za hitro iskanje
CREATE INDEX idx_logopedist_children_logopedist ON public.logopedist_children(logopedist_id) WHERE is_active = true;

-- 4. Razširitev tabele progress za otroke logopedov
ALTER TABLE public.progress 
ADD COLUMN logopedist_child_id UUID REFERENCES public.logopedist_children(id) ON DELETE CASCADE;

-- Indeks za iskanje napredka otrok logopeda
CREATE INDEX idx_progress_logopedist_child ON public.progress(logopedist_child_id) WHERE logopedist_child_id IS NOT NULL;

-- Dodaj RLS politiko za napredek otrok logopeda
CREATE POLICY "Logopedists can manage own children progress" 
ON public.progress FOR ALL 
TO authenticated
USING (
  logopedist_child_id IS NULL -- Dovoli starševske podatke (obstoječa logika)
  OR logopedist_child_id IN (
    SELECT lc.id FROM public.logopedist_children lc
    JOIN public.logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
)
WITH CHECK (
  logopedist_child_id IS NULL
  OR logopedist_child_id IN (
    SELECT lc.id FROM public.logopedist_children lc
    JOIN public.logopedist_profiles lp ON lc.logopedist_id = lp.id
    WHERE lp.user_id = auth.uid()
  )
);

-- 5. Funkcija za preverjanje omejitve otrok glede na licenco
CREATE OR REPLACE FUNCTION public.check_logopedist_child_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Pridobi trenutno število aktivnih otrok
  SELECT COUNT(*) INTO current_count
  FROM public.logopedist_children
  WHERE logopedist_id = NEW.logopedist_id AND is_active = true;
  
  -- Pridobi omejitev iz aktivne licence
  SELECT lt.max_children INTO max_allowed
  FROM public.logopedist_licenses ll
  JOIN public.license_tiers lt ON ll.license_tier_id = lt.id
  WHERE ll.logopedist_id = NEW.logopedist_id
    AND ll.status IN ('active', 'trialing')
    AND (ll.current_period_end IS NULL OR ll.current_period_end > now());
  
  -- Če ni licence, vrni napako
  IF max_allowed IS NULL THEN
    RAISE EXCEPTION 'Ni aktivne licence. Prosimo, aktivirajte licenco za dodajanje otrok.';
  END IF;
  
  -- Če je omejitev dosežena, vrni napako
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Dosežena omejitev otrok (%). Nadgradite licenco za več mest.', max_allowed;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger za preverjanje omejitve ob dodajanju otroka
CREATE TRIGGER enforce_child_limit
  BEFORE INSERT ON public.logopedist_children
  FOR EACH ROW
  EXECUTE FUNCTION public.check_logopedist_child_limit();

-- 6. Funkcija za pridobitev statistike licence
CREATE OR REPLACE FUNCTION public.get_logopedist_license_stats(p_user_id UUID)
RETURNS TABLE (
  license_name TEXT,
  max_children INTEGER,
  used_slots INTEGER,
  available_slots INTEGER,
  expires_at TIMESTAMPTZ,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lt.display_name,
    lt.max_children,
    COALESCE((
      SELECT COUNT(*)::INTEGER 
      FROM public.logopedist_children lc 
      WHERE lc.logopedist_id = lp.id AND lc.is_active = true
    ), 0) as used_slots,
    lt.max_children - COALESCE((
      SELECT COUNT(*)::INTEGER 
      FROM public.logopedist_children lc 
      WHERE lc.logopedist_id = lp.id AND lc.is_active = true
    ), 0) as available_slots,
    ll.current_period_end,
    ll.status
  FROM public.logopedist_profiles lp
  JOIN public.logopedist_licenses ll ON ll.logopedist_id = lp.id
  JOIN public.license_tiers lt ON ll.license_tier_id = lt.id
  WHERE lp.user_id = p_user_id
    AND ll.status IN ('active', 'trialing');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 7. Updated_at trigger za nove tabele
CREATE TRIGGER update_logopedist_children_updated_at
  BEFORE UPDATE ON public.logopedist_children
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_logopedist_licenses_updated_at
  BEFORE UPDATE ON public.logopedist_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();