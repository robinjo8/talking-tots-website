-- Reset plan_activity_completions for today (2026-02-07) for the active plan
DELETE FROM plan_activity_completions 
WHERE plan_id = 'a578f427-6be4-4484-9747-2a9fb0f619aa' 
  AND day_date = '2026-02-07';

-- Also clean up old plan completions for today
DELETE FROM plan_activity_completions 
WHERE child_id = '0e054bde-ab83-4728-b55d-e02134e6d35b' 
  AND day_date = '2026-02-07';