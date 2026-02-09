UPDATE user_subscriptions SET
  stripe_subscription_id = 'sub_1SysPLGncjlOci0ko4MoGoFG',
  stripe_product_id = 'prod_TwXXpvPhSYVzvN',
  plan_id = 'pro',
  status = 'active',
  current_period_start = '2026-02-09T20:33:33Z',
  current_period_end = '2027-02-09T20:33:33Z',
  cancel_at_period_end = false,
  updated_at = now()
WHERE user_id = 'b204074c-58a6-4c85-9791-ff8bfe4de6fe';