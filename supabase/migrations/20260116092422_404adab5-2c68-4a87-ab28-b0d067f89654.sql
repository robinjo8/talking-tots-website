-- 1. Politika za branje datotek (logopedi) - lahko berejo vse datoteke v bucketu
CREATE POLICY "Logopedists can view all files in uporabniski-profili"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uporabniski-profili' 
  AND public.is_logopedist(auth.uid())
);

-- 2. Politika za nalaganje poročil (logopedi) - lahko nalagajo v mapo Porocila
CREATE POLICY "Logopedists can upload reports to Porocila folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[3] = 'Porocila'
);

-- 3. Politika za posodabljanje poročil (logopedi)
CREATE POLICY "Logopedists can update reports in Porocila folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[3] = 'Porocila'
);