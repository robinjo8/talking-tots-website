-- Insert the existing Stripe subscription for user qjavec@gmail.com
INSERT INTO public.user_subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_product_id,
  plan_id,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  created_at,
  updated_at
) VALUES (
  'd1575af8-e022-4b06-872f-7932ea3480d4',
  'cus_TmbpBrq19PDL2F',
  'sub_1Sp7m5GncjlOci0knODNI7om',
  'prod_TmbZ19RhCaSzrp',
  'pro',
  'active',
  '2026-01-20T00:00:00Z',
  '2027-01-20T00:00:00Z',
  false,
  now(),
  now()
);