-- Replace skorenj with skoljka
UPDATE "memory_cards_Š_duplicate" 
SET 
  word = 'skoljka',
  image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game//skoljka.png',
  audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/skoljka.m4a'
WHERE word = 'skorenj';

-- Replace sola with sopek
UPDATE "memory_cards_Š_duplicate" 
SET 
  word = 'sopek',
  image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/memory-game//sopek.png',
  audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/sopek.m4a'
WHERE word = 'sola';