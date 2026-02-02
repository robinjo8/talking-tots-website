-- Popravek podatkov za uporabnika kujavec.robert@gmail.com
-- Izbriši testno sejo od 23.1.2026 in ohrani session_number=2 za pravo sejo od 28.1.2026

-- Korak 1: Izbriši morebitne ocene povezane s testno sejo
DELETE FROM articulation_evaluations 
WHERE session_id = 'd3742796-ad32-4880-90b3-f89767dfdb33';

-- Korak 2: Izbriši testno sejo od 23.1.2026
DELETE FROM articulation_test_sessions 
WHERE id = 'd3742796-ad32-4880-90b3-f89767dfdb33';

-- Korak 3: Potrdi da ima prava seja session_number=2 (da se ujema s Seja-2 mapo)
UPDATE articulation_test_sessions 
SET session_number = 2
WHERE id = 'fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03';