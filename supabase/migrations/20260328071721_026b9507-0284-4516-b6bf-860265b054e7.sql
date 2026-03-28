-- Internal logopedists (TomiTalk) can update any child in their org
CREATE POLICY "Internal logopedists can update org children"
ON public.logopedist_children
FOR UPDATE
TO authenticated
USING (is_internal_logopedist(auth.uid()))
WITH CHECK (is_internal_logopedist(auth.uid()));

-- Internal logopedists (TomiTalk) can delete any child in their org
CREATE POLICY "Internal logopedists can delete org children"
ON public.logopedist_children
FOR DELETE
TO authenticated
USING (is_internal_logopedist(auth.uid()));