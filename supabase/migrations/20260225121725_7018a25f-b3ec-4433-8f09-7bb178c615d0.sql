UPDATE memory_cards_r_zacetek
SET image_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/' || image_url
WHERE image_url NOT LIKE 'https://%';

UPDATE memory_cards_r_zacetek
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || audio_url
WHERE audio_url IS NOT NULL AND audio_url NOT LIKE 'https://%';