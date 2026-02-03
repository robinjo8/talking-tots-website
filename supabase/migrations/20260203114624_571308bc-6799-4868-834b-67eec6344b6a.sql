-- Omogoči null vrednost za child_id
-- To omogoča shranjevanje napredka za logopedistove otroke
ALTER TABLE public.progress 
ALTER COLUMN child_id DROP NOT NULL;

-- Dodaj constraint, ki zagotavlja, da ima vsak zapis 
-- vsaj child_id ALI logopedist_child_id
ALTER TABLE public.progress
ADD CONSTRAINT progress_child_check 
CHECK (
  child_id IS NOT NULL OR logopedist_child_id IS NOT NULL
);