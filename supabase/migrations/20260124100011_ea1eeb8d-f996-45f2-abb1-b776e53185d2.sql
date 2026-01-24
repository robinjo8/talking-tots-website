-- Tabela za sledenje poročil po logopedu
CREATE TABLE IF NOT EXISTS public.logopedist_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logopedist_id UUID NOT NULL REFERENCES public.logopedist_profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL,
  session_id UUID REFERENCES public.articulation_test_sessions(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  report_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS politika: logoped vidi samo svoja poročila
ALTER TABLE public.logopedist_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logopedists can view own reports"
  ON public.logopedist_reports FOR SELECT
  USING (logopedist_id IN (
    SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Logopedists can insert own reports"
  ON public.logopedist_reports FOR INSERT
  WITH CHECK (logopedist_id IN (
    SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Logopedists can delete own reports"
  ON public.logopedist_reports FOR DELETE
  USING (logopedist_id IN (
    SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
  ));