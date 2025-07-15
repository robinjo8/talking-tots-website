-- Clean corrupted user metadata
UPDATE auth.users 
SET raw_user_meta_data = '{}'::jsonb 
WHERE raw_user_meta_data IS NOT NULL;