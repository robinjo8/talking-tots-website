-- Delete word results for sessions 4 and 5
DELETE FROM articulation_word_results WHERE session_id IN ('8fbb7783-19c1-428e-9c9a-0d1061da45b7', 'fb55b850-4854-4750-8c76-cc5a7d59b3ae');

-- Delete evaluations for sessions 4 and 5
DELETE FROM articulation_evaluations WHERE session_id IN ('8fbb7783-19c1-428e-9c9a-0d1061da45b7', 'fb55b850-4854-4750-8c76-cc5a7d59b3ae');

-- Delete reports for sessions 4 and 5
DELETE FROM logopedist_reports WHERE session_id IN ('8fbb7783-19c1-428e-9c9a-0d1061da45b7', 'fb55b850-4854-4750-8c76-cc5a7d59b3ae');

-- Delete sessions 4 and 5
DELETE FROM articulation_test_sessions WHERE id IN ('8fbb7783-19c1-428e-9c9a-0d1061da45b7', 'fb55b850-4854-4750-8c76-cc5a7d59b3ae');

-- Delete bad test results (tests 4 and 5 with dates 2027-02-13 and 2027-05-08)
DELETE FROM articulation_test_results WHERE id IN ('a3e37b5a-2827-442c-90a6-4d4ceb86d006', '107d81d1-3ec6-4a80-886a-3ee39f500224');