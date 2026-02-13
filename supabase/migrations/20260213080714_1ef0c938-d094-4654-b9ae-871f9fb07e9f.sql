
-- Add individual basic license for Špela Kastelic, same as Janez Novak
INSERT INTO public.logopedist_licenses (
  logopedist_id,
  license_tier_id,
  status,
  current_period_start,
  current_period_end
) VALUES (
  '7c06e37c-e459-4f14-8905-a7e39b19048b',  -- Špela's logopedist_id
  '6b82aaae-ff05-4dbc-8158-5c71214541de',  -- basic tier (same as Janez)
  'active',
  now(),
  now() + interval '1 year'
);
