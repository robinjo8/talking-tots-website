-- Update audio URL for kokos (change from kokos.m4a to kokos_1.m4a)
UPDATE "memory_cards_K" 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/kokos_1.m4a' 
WHERE word = 'kokos';

-- Update audio URL for luc (change from test.m4a to luc.m4a)
UPDATE memory_cards_l 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/luc.m4a' 
WHERE word = 'LUČ';