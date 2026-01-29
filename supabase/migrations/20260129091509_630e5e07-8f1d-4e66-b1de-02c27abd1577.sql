-- Popravek URL-jev za slike s šumniki v tabeli memory_cards_r
UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/ribic1.webp' 
WHERE word = 'Ribič';

UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/riz1.webp' 
WHERE word = 'Riž';

UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/rokometas1.webp' 
WHERE word = 'Rokometaš';

UPDATE memory_cards_r 
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/roza1.webp' 
WHERE word = 'Roža';