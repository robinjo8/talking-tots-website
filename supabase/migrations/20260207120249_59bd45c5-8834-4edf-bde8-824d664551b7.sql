-- Reset progress entries for today (2026-02-07) for child Žak to start fresh testing
DELETE FROM progress 
WHERE child_id = '0e054bde-ab83-4728-b55d-e02134e6d35b' 
  AND completed_at::date = '2026-02-07';