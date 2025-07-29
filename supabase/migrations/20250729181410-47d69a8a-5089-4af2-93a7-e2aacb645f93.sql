-- Update image URLs to use full Supabase storage URLs like the working letter K
UPDATE public.memory_cards_c SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game/' || SUBSTRING(image_url FROM 'memory-game/(.*)');

UPDATE public.memory_cards_Č SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game/' || SUBSTRING(image_url FROM 'memory-game/(.*)');

UPDATE public.memory_cards_z SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game/' || SUBSTRING(image_url FROM 'memory-game/(.*)');

UPDATE public.memory_cards_Ž SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game/' || SUBSTRING(image_url FROM 'memory-game/(.*)');

UPDATE public.memory_cards_l SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game/' || SUBSTRING(image_url FROM 'memory-game/(.*)');