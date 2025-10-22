-- Remove incorrect RLS policies that are blocking uploads
DROP POLICY IF EXISTS "Users can upload their own recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recordings" ON storage.objects;