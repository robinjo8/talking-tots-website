UPDATE user_subscriptions 
SET 
  status = 'trialing',
  plan_id = 'pro',
  stripe_subscription_id = 'sub_1SrwFMGncjlOci0kKinSl0Xg',
  stripe_product_id = 'prod_TmbZ19RhCaSzrp',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '7 days',
  trial_end = NOW() + INTERVAL '7 days',
  updated_at = NOW()
WHERE user_id = '5edf078d-ea98-445e-8f10-80fc9e606b7b';