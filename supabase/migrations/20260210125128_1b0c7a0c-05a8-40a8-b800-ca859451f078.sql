
-- Fix: media_files INSERT policy allows any authenticated user to insert
-- Replace with admin-only insert
DROP POLICY IF EXISTS "Authenticated users can create media files" ON public.media_files;

CREATE POLICY "Only admins can create media files"
ON public.media_files
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
