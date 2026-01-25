-- Pretvori vse obstoječe 'draft' zapise v 'submitted'
UPDATE public.logopedist_reports 
SET status = 'submitted' 
WHERE status = 'draft';