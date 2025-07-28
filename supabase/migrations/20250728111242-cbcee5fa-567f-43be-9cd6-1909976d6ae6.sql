-- Fix foreign key constraint to allow user deletion
-- Drop the existing foreign key constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Recreate the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.users 
ADD CONSTRAINT users_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;