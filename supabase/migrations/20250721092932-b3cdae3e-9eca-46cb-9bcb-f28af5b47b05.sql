-- Make povezi-pare-r bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'povezi-pare-r';