-- Clean all data for "Testni otrok" (child_id: c3940422-e5ce-44b4-a2e4-f73c11323776)

-- 1. Plan data
DELETE FROM plan_activity_completions WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776';
DELETE FROM plan_set_tracking WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776';
DELETE FROM child_monthly_plans WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776';

-- 2. Additional test data
DELETE FROM additional_test_words WHERE assignment_id = '7934e1da-7f55-4a90-80ba-ec9b1df3c584';
DELETE FROM additional_test_assignments WHERE id = '7934e1da-7f55-4a90-80ba-ec9b1df3c584';

-- 3. Session and related data
DELETE FROM articulation_word_results WHERE session_id = '7c3aaa10-c762-431a-b42c-2645369ef6c4';
DELETE FROM articulation_evaluations WHERE session_id = '7c3aaa10-c762-431a-b42c-2645369ef6c4';
DELETE FROM articulation_test_sessions WHERE id = '7c3aaa10-c762-431a-b42c-2645369ef6c4';

-- 4. Any remaining sessions
DELETE FROM articulation_word_results WHERE session_id IN (SELECT id FROM articulation_test_sessions WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776');
DELETE FROM articulation_evaluations WHERE session_id IN (SELECT id FROM articulation_test_sessions WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776');
DELETE FROM articulation_test_sessions WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776';
DELETE FROM articulation_test_results WHERE child_id = 'c3940422-e5ce-44b4-a2e4-f73c11323776';