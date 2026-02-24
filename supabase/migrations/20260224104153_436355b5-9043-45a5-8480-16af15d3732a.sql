-- Fix jasna.kas@gmail.com: status inactive -> active, wrong period dates
UPDATE user_subscriptions
SET status = 'active',
    current_period_start = '2026-02-24T09:34:57Z',
    current_period_end = '2027-02-24T09:34:57Z',
    updated_at = now()
WHERE user_id = 'e5c6f750-7149-40c3-b607-afebf66dc1bb';

-- Fix kujavec.robert@gmail.com: period_end off by 1 year
UPDATE user_subscriptions
SET current_period_end = '2027-02-17T08:29:34Z', updated_at = now()
WHERE user_id = '629a649f-15fb-44f8-b6f1-6be93ceac221';

-- Fix lea.erzar@gmail.com: period_end off by 1 year
UPDATE user_subscriptions
SET current_period_end = '2027-02-10T21:26:05Z', updated_at = now()
WHERE user_id = '3d4f1163-fd09-4063-93d5-64c937af77c0';

-- Fix erzar.marija@gmail.com: period_end off by 1 year
UPDATE user_subscriptions
SET current_period_end = '2027-02-22T16:37:37Z', updated_at = now()
WHERE user_id = '767acee5-340f-49fb-9e3f-ac80a42b196a';

-- Fix selpyy@gmail.com: period_end off by 1 year
UPDATE user_subscriptions
SET current_period_end = '2027-02-16T21:01:08Z', updated_at = now()
WHERE user_id = '57af441e-fb66-42f4-8457-18a9578473d7';