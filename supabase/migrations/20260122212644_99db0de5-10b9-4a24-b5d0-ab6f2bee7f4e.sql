-- A) Arhivski bucket za datoteke
INSERT INTO storage.buckets (id, name, public)
VALUES ('uporabniski-profili-arhiv', 'uporabniski-profili-arhiv', false)
ON CONFLICT (id) DO NOTHING;

-- B) Arhivska tabela za uporabnike
CREATE TABLE IF NOT EXISTS public.archived_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_user_id UUID NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  archived_at TIMESTAMPTZ DEFAULT now(),
  scheduled_deletion_at TIMESTAMPTZ DEFAULT (now() + interval '90 days'),
  archived_by UUID NOT NULL,
  deletion_reason TEXT
);

-- C) Arhivska tabela za otroke
CREATE TABLE IF NOT EXISTS public.archived_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_id UUID REFERENCES archived_users(id) ON DELETE CASCADE,
  original_child_id UUID NOT NULL,
  name TEXT,
  age INTEGER,
  gender TEXT,
  birth_date DATE,
  speech_difficulties TEXT[],
  speech_development JSONB,
  speech_difficulties_description TEXT
);

-- D) Arhivska tabela za teste
CREATE TABLE IF NOT EXISTS public.archived_test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_id UUID REFERENCES archived_users(id) ON DELETE CASCADE,
  original_session_id UUID NOT NULL,
  original_child_id UUID,
  child_name TEXT,
  status TEXT,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to UUID,
  test_data JSONB
);

-- E) RLS politike (samo super admin lahko vidi arhiv)
ALTER TABLE archived_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_test_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage archives" ON archived_users
  FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admin can manage child archives" ON archived_children
  FOR ALL USING (EXISTS (
    SELECT 1 FROM archived_users WHERE id = archive_id 
    AND is_super_admin(auth.uid())
  ));

CREATE POLICY "Super admin can manage test archives" ON archived_test_sessions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM archived_users WHERE id = archive_id 
    AND is_super_admin(auth.uid())
  ));

-- F) Storage RLS za arhivski bucket (samo service role)
CREATE POLICY "Service role access to archive bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'uporabniski-profili-arhiv');

-- G) Indeksi za hitrejše iskanje
CREATE INDEX IF NOT EXISTS idx_archived_users_original_id ON archived_users(original_user_id);
CREATE INDEX IF NOT EXISTS idx_archived_users_scheduled_deletion ON archived_users(scheduled_deletion_at);
CREATE INDEX IF NOT EXISTS idx_archived_children_archive_id ON archived_children(archive_id);
CREATE INDEX IF NOT EXISTS idx_archived_test_sessions_archive_id ON archived_test_sessions(archive_id);