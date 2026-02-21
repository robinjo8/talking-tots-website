
-- 1. Brisanje word results
DELETE FROM articulation_word_results 
WHERE session_id = '508fdcdd-1d1e-4478-bb1b-97a7cc6cb1f7';

-- 2. Brisanje evaluations
DELETE FROM articulation_evaluations 
WHERE session_id = '508fdcdd-1d1e-4478-bb1b-97a7cc6cb1f7';

-- 3. Brisanje notifications
DELETE FROM notifications 
WHERE related_session_id = '508fdcdd-1d1e-4478-bb1b-97a7cc6cb1f7';

-- 4. Brisanje seje
DELETE FROM articulation_test_sessions 
WHERE id = '508fdcdd-1d1e-4478-bb1b-97a7cc6cb1f7';
