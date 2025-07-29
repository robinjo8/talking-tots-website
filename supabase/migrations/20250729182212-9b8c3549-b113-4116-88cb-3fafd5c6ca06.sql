-- Fix audio URLs to use full Supabase storage URLs
UPDATE public.memory_cards_c SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/' || audio_url WHERE audio_url NOT LIKE 'https://%';

UPDATE public.memory_cards_Č SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/' || audio_url WHERE audio_url NOT LIKE 'https://%';

UPDATE public.memory_cards_z SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/' || audio_url WHERE audio_url NOT LIKE 'https://%';

UPDATE public.memory_cards_Ž SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/' || audio_url WHERE audio_url NOT LIKE 'https://%';

UPDATE public.memory_cards_l SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/' || audio_url WHERE audio_url NOT LIKE 'https://%';

-- Clean up incorrect progress entries - delete all Ž memory game entries that seem incorrectly aggregated
DELETE FROM public.progress WHERE activity_type = 'memory_game' AND activity_subtype = 'Ž';