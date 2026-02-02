
-- Dodaj aktivno licenco za robert.kujavec@outlook.com (10 otrok)
INSERT INTO public.logopedist_licenses (
  logopedist_id,
  license_tier_id,
  status,
  current_period_start,
  current_period_end
) VALUES (
  'e187a584-9c80-4515-8914-4cee5eff2548',
  '6b82aaae-ff05-4dbc-8158-5c71214541de',
  'active',
  now(),
  now() + interval '1 year'
);
