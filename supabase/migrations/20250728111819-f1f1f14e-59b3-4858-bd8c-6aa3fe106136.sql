-- Fix children table foreign key constraint to allow user deletion
-- Drop the existing foreign key constraint on children table
ALTER TABLE public.children DROP CONSTRAINT IF EXISTS children_parent_id_fkey;

-- Recreate the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.children 
ADD CONSTRAINT children_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES auth.users(id) ON DELETE CASCADE;