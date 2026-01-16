-- Politika za nalaganje v Generirana-porocila mapo
CREATE POLICY "Logopedists can upload to Generirana-porocila folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uporabniski-profili' 
  AND is_logopedist(auth.uid()) 
  AND (storage.foldername(name))[3] = 'Generirana-porocila'
);

-- Politika za posodabljanje v Generirana-porocila mapo
CREATE POLICY "Logopedists can update Generirana-porocila folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili' 
  AND is_logopedist(auth.uid()) 
  AND (storage.foldername(name))[3] = 'Generirana-porocila'
);