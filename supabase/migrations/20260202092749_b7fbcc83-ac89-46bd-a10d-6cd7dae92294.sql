-- Dodaj session_number stolpec za sledenje številki seje
ALTER TABLE articulation_test_sessions 
ADD COLUMN session_number INTEGER DEFAULT 1;

-- Posodobi obstoječe seje glede na vrstni red ustvarjanja za vsakega otroka
UPDATE articulation_test_sessions ats
SET session_number = subq.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY child_id ORDER BY created_at) as rn
  FROM articulation_test_sessions
) subq
WHERE ats.id = subq.id;