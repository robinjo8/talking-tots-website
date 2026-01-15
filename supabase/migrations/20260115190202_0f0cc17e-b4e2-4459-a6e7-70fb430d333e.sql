-- Dodaj SELECT politiko za logopediste na children tabeli
CREATE POLICY "children_logopedist_view" 
ON public.children 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Dodaj SELECT politiko za logopediste na profiles tabeli (za prikaz emailov staršev)
CREATE POLICY "profiles_logopedist_view" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);