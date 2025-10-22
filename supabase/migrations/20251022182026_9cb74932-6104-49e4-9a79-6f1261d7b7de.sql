-- Create RLS policies for audio-besede bucket
-- Allow users to insert their own recordings
CREATE POLICY "Users can upload their own recordings"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-besede' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to select their own recordings
CREATE POLICY "Users can view their own recordings"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'audio-besede' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own recordings
CREATE POLICY "Users can update their own recordings"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio-besede' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own recordings
CREATE POLICY "Users can delete their own recordings"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-besede' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);