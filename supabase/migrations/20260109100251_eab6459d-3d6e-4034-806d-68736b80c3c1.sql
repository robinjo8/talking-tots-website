-- Create enum for organization types
CREATE TYPE organization_type AS ENUM ('internal', 'school', 'kindergarten', 'private');

-- Create enum for test session status
CREATE TYPE test_session_status AS ENUM ('pending', 'assigned', 'in_review', 'completed');

-- Create enum for word rating
CREATE TYPE word_rating AS ENUM ('correct', 'partial', 'incorrect', 'unrated');

-- Create enum for report status
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'revised');

-- Add logopedist to existing user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'logopedist';

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type organization_type NOT NULL DEFAULT 'private',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial TomiTalk organization
INSERT INTO public.organizations (name, type) VALUES ('TomiTalk logoped', 'internal');

-- Create logopedist_profiles table
CREATE TABLE public.logopedist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  organization_id UUID REFERENCES public.organizations(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articulation_test_sessions table
CREATE TABLE public.articulation_test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID NOT NULL,
  status test_session_status DEFAULT 'pending',
  assigned_to UUID REFERENCES public.logopedist_profiles(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  test_version TEXT DEFAULT 'v1',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articulation_word_results table
CREATE TABLE public.articulation_word_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.articulation_test_sessions(id) ON DELETE CASCADE NOT NULL,
  letter TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('začetek', 'sredina', 'konec')),
  target_word TEXT NOT NULL,
  transcribed_text TEXT,
  audio_url TEXT NOT NULL,
  ai_accepted BOOLEAN,
  ai_confidence DECIMAL(3,2),
  ai_match_type TEXT,
  logopedist_rating word_rating DEFAULT 'unrated',
  error_type TEXT,
  logopedist_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create logopedist_reports table
CREATE TABLE public.logopedist_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.articulation_test_sessions(id) ON DELETE CASCADE NOT NULL,
  logopedist_id UUID REFERENCES public.logopedist_profiles(id) NOT NULL,
  status report_status DEFAULT 'draft',
  summary TEXT,
  findings JSONB,
  recommendations TEXT,
  next_steps TEXT,
  pdf_url TEXT,
  version INTEGER DEFAULT 1,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('parent', 'logopedist', 'admin')),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logopedist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articulation_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articulation_word_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logopedist_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is logopedist
CREATE OR REPLACE FUNCTION public.is_logopedist(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.logopedist_profiles
    WHERE user_id = _user_id
  )
$$;

-- Create helper function to check if logopedist is internal (TomiTalk)
CREATE OR REPLACE FUNCTION public.is_internal_logopedist(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.logopedist_profiles lp
    JOIN public.organizations o ON lp.organization_id = o.id
    WHERE lp.user_id = _user_id AND o.type = 'internal'
  )
$$;

-- RLS Policies for organizations
CREATE POLICY "Organizations are viewable by authenticated users"
ON public.organizations FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS Policies for logopedist_profiles
CREATE POLICY "Logopedists can view their own profile"
ON public.logopedist_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Logopedists can update their own profile"
ON public.logopedist_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "New logopedists can create their profile"
ON public.logopedist_profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Internal logopedists can view all profiles"
ON public.logopedist_profiles FOR SELECT
TO authenticated
USING (is_internal_logopedist(auth.uid()));

-- RLS Policies for articulation_test_sessions
CREATE POLICY "Parents can view their children's sessions"
ON public.articulation_test_sessions FOR SELECT
TO authenticated
USING (parent_id = auth.uid());

CREATE POLICY "Parents can create sessions for their children"
ON public.articulation_test_sessions FOR INSERT
TO authenticated
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Assigned logopedists can view sessions"
ON public.articulation_test_sessions FOR SELECT
TO authenticated
USING (
  assigned_to IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
  OR is_internal_logopedist(auth.uid())
);

CREATE POLICY "Assigned logopedists can update sessions"
ON public.articulation_test_sessions FOR UPDATE
TO authenticated
USING (
  assigned_to IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
  OR is_internal_logopedist(auth.uid())
);

-- RLS Policies for articulation_word_results
CREATE POLICY "Parents can view their children's word results"
ON public.articulation_word_results FOR SELECT
TO authenticated
USING (
  session_id IN (
    SELECT id FROM public.articulation_test_sessions WHERE parent_id = auth.uid()
  )
);

CREATE POLICY "Parents can create word results"
ON public.articulation_word_results FOR INSERT
TO authenticated
WITH CHECK (
  session_id IN (
    SELECT id FROM public.articulation_test_sessions WHERE parent_id = auth.uid()
  )
);

CREATE POLICY "Logopedists can view assigned word results"
ON public.articulation_word_results FOR SELECT
TO authenticated
USING (
  session_id IN (
    SELECT id FROM public.articulation_test_sessions 
    WHERE assigned_to IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
  )
  OR is_internal_logopedist(auth.uid())
);

CREATE POLICY "Logopedists can update word results"
ON public.articulation_word_results FOR UPDATE
TO authenticated
USING (
  session_id IN (
    SELECT id FROM public.articulation_test_sessions 
    WHERE assigned_to IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
  )
  OR is_internal_logopedist(auth.uid())
);

-- RLS Policies for logopedist_reports
CREATE POLICY "Logopedists can view their own reports"
ON public.logopedist_reports FOR SELECT
TO authenticated
USING (
  logopedist_id IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Logopedists can create reports"
ON public.logopedist_reports FOR INSERT
TO authenticated
WITH CHECK (
  logopedist_id IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Logopedists can update their own reports"
ON public.logopedist_reports FOR UPDATE
TO authenticated
USING (
  logopedist_id IN (SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Parents can view reports for their children"
ON public.logopedist_reports FOR SELECT
TO authenticated
USING (
  session_id IN (
    SELECT id FROM public.articulation_test_sessions WHERE parent_id = auth.uid()
  )
);

-- RLS Policies for audit_logs
CREATE POLICY "Only internal logopedists can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (is_internal_logopedist(auth.uid()) OR actor_id = auth.uid());

CREATE POLICY "Authenticated users can create audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (actor_id = auth.uid());