-- Drop the existing policy that requires authentication
DROP POLICY IF EXISTS "Organizations are viewable by authenticated users" ON public.organizations;

-- Create a new policy that allows public read access to active organizations
CREATE POLICY "Organizations are publicly viewable"
ON public.organizations FOR SELECT
TO anon, authenticated
USING (is_active = true);