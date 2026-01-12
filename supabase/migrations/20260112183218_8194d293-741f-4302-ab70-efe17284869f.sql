-- Najprej počisti osirotele zapise v children_access_log
DELETE FROM public.children_access_log
WHERE child_id NOT IN (SELECT id FROM public.children);

-- Zdaj dodaj foreign key s CASCADE
ALTER TABLE public.children_access_log
ADD CONSTRAINT children_access_log_child_id_fkey
FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;