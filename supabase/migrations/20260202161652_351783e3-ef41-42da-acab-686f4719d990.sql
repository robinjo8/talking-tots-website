-- RLS politike za storage pot logopedist-children/
-- Omogoča logopedom dostop do datotek njihovih otrok

-- 1. Logopedi lahko nalagajo v svojo mapo logopedist-children
CREATE POLICY "Logopedists can upload to own logopedist-children folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- 2. Logopedi lahko berejo iz svoje mape logopedist-children
CREATE POLICY "Logopedists can view own logopedist-children folder"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- 3. Logopedi lahko posodabljajo v svoji mapi
CREATE POLICY "Logopedists can update own logopedist-children folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);

-- 4. Logopedi lahko brišejo iz svoje mape
CREATE POLICY "Logopedists can delete own logopedist-children folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[1] = 'logopedist-children'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM public.logopedist_profiles 
    WHERE user_id = auth.uid()
  )
);