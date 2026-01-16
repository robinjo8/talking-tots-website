-- Politika za brisanje datotek v Generirana-porocila mapo s strani logopedov
CREATE POLICY "Logopedists can delete from Generirana-porocila folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili' 
  AND is_logopedist(auth.uid()) 
  AND (storage.foldername(name))[3] = 'Generirana-porocila'
);