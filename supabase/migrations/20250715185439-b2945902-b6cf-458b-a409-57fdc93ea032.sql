-- First delete all objects in the bucket
DELETE FROM storage.objects WHERE bucket_id = 'slike-vaje-motorike-govoril';

-- Then delete the bucket
DELETE FROM storage.buckets WHERE id = 'slike-vaje-motorike-govoril';