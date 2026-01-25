-- Ustvari enum za tipe obvestil
CREATE TYPE public.notification_type AS ENUM ('new_test', 'assigned', 'reminder', 'completed_report', 'system');

-- Ustvari tabelo za obvestila
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  related_session_id UUID REFERENCES public.articulation_test_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ustvari tabelo za sledenje prebranosti (per-user)
CREATE TABLE public.notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(notification_id, user_id)
);

-- Omogoči RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Security definer funkcija za pridobitev organization_id uporabnika
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.logopedist_profiles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS politike za notifications
CREATE POLICY "Logopedists can view own org notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (
  organization_id = public.get_user_organization_id(auth.uid())
  AND (recipient_id IS NULL OR recipient_id = auth.uid())
);

-- RLS politike za notification_reads
CREATE POLICY "Users can view own reads"
ON public.notification_reads FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own reads"
ON public.notification_reads FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reads"
ON public.notification_reads FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Funkcija za kreiranje obvestila ob novem preverjanju
CREATE OR REPLACE FUNCTION public.create_new_test_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  child_name TEXT;
  child_age INT;
BEGIN
  -- Samo če je status 'pending' (novo preverjanje)
  IF NEW.status = 'pending' THEN
    -- Pridobi ime in starost otroka
    SELECT c.name, c.age INTO child_name, child_age
    FROM public.children c
    WHERE c.id = NEW.child_id;
    
    -- Ustvari obvestilo za vse organizacije tipa 'internal' (TomiTalk logopedi)
    INSERT INTO public.notifications (organization_id, type, title, message, link, related_session_id)
    SELECT 
      o.id,
      'new_test'::notification_type,
      'Novo preverjanje izgovorjave',
      COALESCE(child_name, 'Neznano') || ', ' || COALESCE(child_age::TEXT, '?') || ' let',
      '/admin/pending',
      NEW.id
    FROM public.organizations o
    WHERE o.type = 'internal' AND o.is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger za novo preverjanje
CREATE TRIGGER on_new_test_session
  AFTER INSERT ON public.articulation_test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.create_new_test_notification();

-- Funkcija za kreiranje obvestila ob dodelitvi primera
CREATE OR REPLACE FUNCTION public.create_assigned_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  child_name TEXT;
  child_age INT;
  logopedist_user_id UUID;
  logopedist_org_id UUID;
BEGIN
  -- Samo če se assigned_to spremeni iz NULL v vrednost
  IF OLD.assigned_to IS NULL AND NEW.assigned_to IS NOT NULL THEN
    -- Pridobi ime in starost otroka
    SELECT c.name, c.age INTO child_name, child_age
    FROM public.children c
    WHERE c.id = NEW.child_id;
    
    -- Pridobi user_id in organization_id logopeda
    SELECT lp.user_id, lp.organization_id INTO logopedist_user_id, logopedist_org_id
    FROM public.logopedist_profiles lp
    WHERE lp.id = NEW.assigned_to;
    
    -- Ustvari osebno obvestilo za dodeljenega logopeda
    INSERT INTO public.notifications (organization_id, recipient_id, type, title, message, link, related_session_id)
    VALUES (
      logopedist_org_id,
      logopedist_user_id,
      'assigned'::notification_type,
      'Nov primer dodeljen',
      COALESCE(child_name, 'Neznano') || ', ' || COALESCE(child_age::TEXT, '?') || ' let',
      '/admin/reviews',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger za dodelitev primera
CREATE TRIGGER on_session_assigned
  AFTER UPDATE ON public.articulation_test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.create_assigned_notification();

-- Indeksi za hitrejše poizvedbe
CREATE INDEX idx_notifications_org_id ON public.notifications(organization_id);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notification_reads_notification_id ON public.notification_reads(notification_id);
CREATE INDEX idx_notification_reads_user_id ON public.notification_reads(user_id);

-- Omogoči realtime za notifications tabelo
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;