-- Delete evaluations for session 4
DELETE FROM articulation_evaluations 
WHERE session_id = '6dae81b1-1d47-4860-9fe1-60d8aad77d05';

-- Delete monthly plan linked to report from session 4
DELETE FROM child_monthly_plans 
WHERE id = 'cc84d308-a0c6-4804-a5e3-d177f6d289f6';

-- Delete logopedist report for session 4
DELETE FROM logopedist_reports 
WHERE id = 'bb1823a1-8d1e-41b7-be62-a28ef4809d10';

-- Delete session 4
DELETE FROM articulation_test_sessions 
WHERE id = '6dae81b1-1d47-4860-9fe1-60d8aad77d05';

-- Delete test result with date 2026-12-25
DELETE FROM articulation_test_results 
WHERE id = 'e86d9136-d5f1-4cae-87f2-b9b2c7193444';