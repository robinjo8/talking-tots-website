-- CRITICAL SECURITY FIX: Consolidate and strengthen RLS policies for children table
-- This addresses potential data exposure of sensitive children's information

-- Drop overlapping and potentially conflicting policies
DROP POLICY IF EXISTS "Parents can modify their own children" ON public.children;
DROP POLICY IF EXISTS "Parents can view their own children" ON public.children;
DROP POLICY IF EXISTS "Users can create their own children" ON public.children;
DROP POLICY IF EXISTS "Users can delete their own children" ON public.children;
DROP POLICY IF EXISTS "Users can update their own children" ON public.children;
DROP POLICY IF EXISTS "Users can view their own children" ON public.children;

-- Create secure, non-overlapping policies with proper authentication checks
-- 1. Only authenticated users can view their own children
CREATE POLICY "children_select_own" ON public.children
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = parent_id);

-- 2. Only authenticated users can create children records for themselves
CREATE POLICY "children_insert_own" ON public.children
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = parent_id AND parent_id IS NOT NULL);

-- 3. Only authenticated users can update their own children's data
CREATE POLICY "children_update_own" ON public.children
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id AND parent_id IS NOT NULL);

-- 4. Only authenticated users can delete their own children records
CREATE POLICY "children_delete_own" ON public.children
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = parent_id);

-- 5. Add admin access for support purposes (only verified admins)
CREATE POLICY "children_admin_access" ON public.children
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );