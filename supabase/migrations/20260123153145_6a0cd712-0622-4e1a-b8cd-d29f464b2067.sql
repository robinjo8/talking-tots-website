-- Insert missing session for Žak (test completed before session tracking was implemented)
INSERT INTO articulation_test_sessions (
  child_id,
  parent_id,
  status,
  submitted_at
) VALUES (
  '0e054bde-ab83-4728-b55d-e02134e6d35b',
  '1a8e5513-a13f-4a8f-b34a-f48ed4992825',
  'pending',
  '2026-01-23T14:00:45.577Z'
);