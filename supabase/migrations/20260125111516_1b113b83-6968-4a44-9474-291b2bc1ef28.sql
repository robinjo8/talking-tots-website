-- Popravek obstoječih sej: nastavi reviewed_at za že zaključene seje
UPDATE articulation_test_sessions 
SET reviewed_at = COALESCE(submitted_at, created_at, now())
WHERE status = 'completed' AND reviewed_at IS NULL;