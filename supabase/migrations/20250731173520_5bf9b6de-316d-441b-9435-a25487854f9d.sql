-- Create storage policy to allow authenticated users to upload recordings
CREATE POLICY "Authenticated users can upload recordings" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'audio-besede' AND (storage.foldername(name))[1] = 'recordings');