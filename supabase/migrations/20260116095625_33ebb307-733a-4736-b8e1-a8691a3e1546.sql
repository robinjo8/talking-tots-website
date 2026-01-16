-- Dodaj super_admin vlogo za robert.kujavec@gmail.com
INSERT INTO public.admin_permissions (user_id, role, granted_by, is_active)
VALUES (
  '1ba88ef8-d1b5-48b0-9d82-e79d7862dd8a',
  'super_admin',
  '1ba88ef8-d1b5-48b0-9d82-e79d7862dd8a',
  true
)
ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;

-- Ustvari funkcijo za preverjanje super admin statusa
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = _user_id 
    AND role = 'super_admin'
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- RLS politike za admin_permissions
DROP POLICY IF EXISTS "Super admin can view all permissions" ON public.admin_permissions;
CREATE POLICY "Super admin can view all permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can view own permissions" ON public.admin_permissions;
CREATE POLICY "Users can view own permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Super admin lahko posodablja is_verified v logopedist_profiles
DROP POLICY IF EXISTS "Super admin can update logopedist verification" ON public.logopedist_profiles;
CREATE POLICY "Super admin can update logopedist verification"
ON public.logopedist_profiles
FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Super admin lahko vidi vse logopedist profiles
DROP POLICY IF EXISTS "Super admin can view all logopedist profiles" ON public.logopedist_profiles;
CREATE POLICY "Super admin can view all logopedist profiles"
ON public.logopedist_profiles
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- Super admin lahko briše logopedist profile (za zavrnitev)
DROP POLICY IF EXISTS "Super admin can delete logopedist profiles" ON public.logopedist_profiles;
CREATE POLICY "Super admin can delete logopedist profiles"
ON public.logopedist_profiles
FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid()));