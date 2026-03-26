-- Clean up orphaned plan_set_tracking for archived plans of Testni otrok
DELETE FROM plan_set_tracking
WHERE plan_id IN (
  SELECT cmp.id FROM child_monthly_plans cmp
  JOIN children c ON c.id = cmp.child_id
  WHERE c.name = 'Testni otrok' AND cmp.status = 'archived'
);

-- Clean up orphaned plan_activity_completions for archived plans
DELETE FROM plan_activity_completions
WHERE plan_id IN (
  SELECT cmp.id FROM child_monthly_plans cmp
  JOIN children c ON c.id = cmp.child_id
  WHERE c.name = 'Testni otrok' AND cmp.status = 'archived'
);

-- Delete archived plans themselves for Testni otrok
DELETE FROM child_monthly_plans
WHERE child_id IN (SELECT id FROM children WHERE name = 'Testni otrok')
AND status = 'archived';