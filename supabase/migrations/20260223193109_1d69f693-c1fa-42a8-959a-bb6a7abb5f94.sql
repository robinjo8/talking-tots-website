-- Čiščenje osirotenih testnih podatkov (uporabnik ne obstaja v auth.users)
DELETE FROM articulation_test_sessions WHERE parent_id = 'a1000000-0000-0000-0000-000000000002';
DELETE FROM children WHERE parent_id = 'a1000000-0000-0000-0000-000000000002';
DELETE FROM profiles WHERE id = 'a1000000-0000-0000-0000-000000000002';