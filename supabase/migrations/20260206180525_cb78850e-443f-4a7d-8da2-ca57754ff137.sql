-- Dodaj recommended_letters stolpec v logopedist_reports
ALTER TABLE public.logopedist_reports 
ADD COLUMN recommended_letters text[] DEFAULT NULL;

-- Komentar za dokumentacijo
COMMENT ON COLUMN public.logopedist_reports.recommended_letters IS 'Seznam priporočenih črk za igre in vaje, ki jih je logopedinja izbrala v poročilu (npr. {R,L,K})';