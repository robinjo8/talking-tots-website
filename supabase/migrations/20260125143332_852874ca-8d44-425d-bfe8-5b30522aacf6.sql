-- Spremeni session_id da dovoli NULL vrednosti
ALTER TABLE public.logopedist_reports 
ALTER COLUMN session_id DROP NOT NULL;