-- Fix current subscription status for user qjavec@gmail.com
UPDATE public.user_subscriptions 
SET status = 'trialing', plan_id = 'pro', updated_at = NOW()
WHERE user_id = '4ccbfac0-fa7b-41cd-a195-0037673c600f';