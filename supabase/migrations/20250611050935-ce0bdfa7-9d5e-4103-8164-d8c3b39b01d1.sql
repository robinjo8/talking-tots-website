
-- Enable RLS on all user data tables
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own children" ON public.children;
DROP POLICY IF EXISTS "Users can create their own children" ON public.children;
DROP POLICY IF EXISTS "Users can update their own children" ON public.children;
DROP POLICY IF EXISTS "Users can delete their own children" ON public.children;

DROP POLICY IF EXISTS "Users can view their children's progress" ON public.progress;
DROP POLICY IF EXISTS "Users can create progress for their children" ON public.progress;
DROP POLICY IF EXISTS "Users can update their children's progress" ON public.progress;
DROP POLICY IF EXISTS "Users can delete their children's progress" ON public.progress;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view accessible media files" ON public.media_files;
DROP POLICY IF EXISTS "Admins can manage all media files" ON public.media_files;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Children table policies
CREATE POLICY "Users can view their own children"
  ON public.children
  FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can create their own children"
  ON public.children
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update their own children"
  ON public.children
  FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can delete their own children"
  ON public.children
  FOR DELETE
  USING (auth.uid() = parent_id);

-- Progress table policies (users can access progress for their children)
CREATE POLICY "Users can view their children's progress"
  ON public.progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = progress.child_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can create progress for their children"
  ON public.progress
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = progress.child_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their children's progress"
  ON public.progress
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = progress.child_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their children's progress"
  ON public.progress
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = progress.child_id 
      AND children.parent_id = auth.uid()
    )
  );

-- Profiles table policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Media files policies (allow public read access for educational content)
CREATE POLICY "Public can view media files"
  ON public.media_files
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create media files"
  ON public.media_files
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can have roles assigned"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for user roles (admins can manage all roles)
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Keep test data tables open for public access (artikulacijski_test, memory_cards, etc.)
-- These contain educational content that should be accessible to all authenticated users

-- Add indexes for better performance on RLS queries
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON public.children(parent_id);
CREATE INDEX IF NOT EXISTS idx_progress_child_id ON public.progress(child_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
