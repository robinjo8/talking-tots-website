-- Create the exercise record for "Vaje motorike govoril" with proper UUID
INSERT INTO public.exercises (
  id,
  title,
  description,
  category,
  age_range_min,
  age_range_max,
  difficulty_level
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Vaje motorike govoril',
  'Vaje za razvoj motorike govoril pri otrocih',
  'motorika_govoril',
  3,
  12,
  1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category;