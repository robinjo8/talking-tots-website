-- Dodaj politiko da uporabniki lahko vidijo svoje lastne admin permissions
DROP POLICY IF EXISTS "Users can view own permissions" ON public.admin_permissions;
CREATE POLICY "Users can view own admin permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());