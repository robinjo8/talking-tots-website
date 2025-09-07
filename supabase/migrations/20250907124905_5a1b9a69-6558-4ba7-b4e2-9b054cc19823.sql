-- Fix security issue: Consolidate overlapping RLS policies on users table
-- Drop duplicate and overlapping policies first
DROP POLICY IF EXISTS "Admin users can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own user record" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own user record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own user record" ON public.users;

-- Create consolidated, secure policies
-- 1. Users can only view their own data
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- 2. Users can only insert their own record
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. Users can only update their own record  
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Only verified admins can view all users
CREATE POLICY "admins_select_all" ON public.users
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );