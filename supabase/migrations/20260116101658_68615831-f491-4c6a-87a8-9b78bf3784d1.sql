-- 1. Izbriši sirotne logopedist_profiles zapise (kjer user_id ne obstaja v auth.users)
DELETE FROM public.logopedist_profiles
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- 2. Dodaj foreign key constraint z CASCADE DELETE
-- Najprej odstrani obstoječi constraint če obstaja
ALTER TABLE public.logopedist_profiles
DROP CONSTRAINT IF EXISTS logopedist_profiles_user_id_fkey;

-- Dodaj nov constraint z ON DELETE CASCADE
ALTER TABLE public.logopedist_profiles
ADD CONSTRAINT logopedist_profiles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;