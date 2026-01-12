-- Create unified private bucket for user profiles
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uporabniski-profili', 
  'uporabniski-profili', 
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'text/plain', 'audio/webm', 'audio/mp4', 'audio/mpeg']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for uporabniski-profili bucket if they exist
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;

-- Create RLS policies for uporabniski-profili bucket
-- Users can only access their own folder (user_id is the first part of the path)
CREATE POLICY "Users can upload to uporabniski-profili" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'uporabniski-profili' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view uporabniski-profili files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'uporabniski-profili' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete uporabniski-profili files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'uporabniski-profili' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update uporabniski-profili files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'uporabniski-profili' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );