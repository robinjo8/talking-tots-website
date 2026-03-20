CREATE POLICY "Logopedists can delete reports in Porocila folder"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uporabniski-profili'
  AND public.is_logopedist(auth.uid())
  AND (storage.foldername(name))[3] = 'Porocila'
);