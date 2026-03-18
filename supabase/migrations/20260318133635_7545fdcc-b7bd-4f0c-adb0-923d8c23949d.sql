
-- 1. Extend notification_type enum
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'additional_test_completed';

-- 2. Create additional_test_assignments table
CREATE TABLE public.additional_test_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'assigned',
  session_id uuid,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- 3. Create additional_test_words table
CREATE TABLE public.additional_test_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.additional_test_assignments(id) ON DELETE CASCADE,
  word text NOT NULL,
  image text NOT NULL,
  audio text,
  letter text,
  sort_order integer DEFAULT 0
);

-- 4. Add additional_assignment_id to articulation_test_sessions
ALTER TABLE public.articulation_test_sessions
  ADD COLUMN additional_assignment_id uuid REFERENCES public.additional_test_assignments(id);

-- 5. Enable RLS on new tables
ALTER TABLE public.additional_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.additional_test_words ENABLE ROW LEVEL SECURITY;

-- 6. RLS for additional_test_assignments

-- Logopedists can insert assignments
CREATE POLICY "Logopedists can insert assignments"
  ON public.additional_test_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    assigned_by IN (
      SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
    )
  );

-- Logopedists can view assignments they created
CREATE POLICY "Logopedists can view own assignments"
  ON public.additional_test_assignments FOR SELECT
  TO authenticated
  USING (
    assigned_by IN (
      SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
    )
  );

-- Internal logopedists can view all parent-child assignments
CREATE POLICY "Internal logopedists can view assignments"
  ON public.additional_test_assignments FOR SELECT
  TO authenticated
  USING (
    is_internal_logopedist(auth.uid())
  );

-- Parents can view assignments for their children
CREATE POLICY "Parents can view child assignments"
  ON public.additional_test_assignments FOR SELECT
  TO authenticated
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE parent_id = auth.uid()
    )
  );

-- Parents can update assignment status (in_progress, completed)
CREATE POLICY "Parents can update child assignments"
  ON public.additional_test_assignments FOR UPDATE
  TO authenticated
  USING (
    child_id IN (
      SELECT id FROM public.children WHERE parent_id = auth.uid()
    )
  )
  WITH CHECK (
    child_id IN (
      SELECT id FROM public.children WHERE parent_id = auth.uid()
    )
  );

-- 7. RLS for additional_test_words

-- Logopedists can insert words for their assignments
CREATE POLICY "Logopedists can insert assignment words"
  ON public.additional_test_words FOR INSERT
  TO authenticated
  WITH CHECK (
    assignment_id IN (
      SELECT id FROM public.additional_test_assignments
      WHERE assigned_by IN (
        SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Logopedists can view words for their assignments
CREATE POLICY "Logopedists can view assignment words"
  ON public.additional_test_words FOR SELECT
  TO authenticated
  USING (
    assignment_id IN (
      SELECT id FROM public.additional_test_assignments
      WHERE assigned_by IN (
        SELECT id FROM public.logopedist_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Internal logopedists can view all assignment words
CREATE POLICY "Internal logopedists can view all assignment words"
  ON public.additional_test_words FOR SELECT
  TO authenticated
  USING (
    is_internal_logopedist(auth.uid())
  );

-- Parents can view words for their children's assignments
CREATE POLICY "Parents can view child assignment words"
  ON public.additional_test_words FOR SELECT
  TO authenticated
  USING (
    assignment_id IN (
      SELECT id FROM public.additional_test_assignments
      WHERE child_id IN (
        SELECT id FROM public.children WHERE parent_id = auth.uid()
      )
    )
  );
