-- Posodobi image_url v memory_cards_c tabeli
UPDATE memory_cards_c 
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(
    REPLACE(REPLACE(REPLACE(REPLACE(
      word, 
      'Č', 'c'), 'Š', 's'), 'Ž', 'z'), 'č', 'c')
  ),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_Č tabeli
UPDATE "memory_cards_Č"
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(
    REPLACE(REPLACE(REPLACE(REPLACE(
      word, 
      'Č', 'c'), 'Š', 's'), 'Ž', 'z'), 'č', 'c')
  ),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_K tabeli
UPDATE "memory_cards_K"
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(word),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_l tabeli
UPDATE memory_cards_l
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(
    REPLACE(REPLACE(REPLACE(
      word, 
      'Č', 'c'), 'Š', 's'), 'Ž', 'z')
  ),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_r tabeli  
UPDATE memory_cards_r
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(word),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_S tabeli
UPDATE "memory_cards_S"
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(word),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_Š_duplicate tabeli
UPDATE "memory_cards_Š_duplicate"
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(
    REPLACE(REPLACE(REPLACE(REPLACE(
      word, 
      'š', 's'), 'Š', 's'), 'č', 'c'), 'ž', 'z')
  ),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_z tabeli
UPDATE memory_cards_z
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(
    REPLACE(REPLACE(REPLACE(REPLACE(
      word, 
      'Č', 'c'), 'Š', 's'), 'Ž', 'z'), 'č', 'c')
  ),
  '1.webp'
)
WHERE image_url LIKE '%.png';

-- Posodobi image_url v memory_cards_Ž tabeli
UPDATE "memory_cards_Ž"
SET image_url = CONCAT(
  'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/',
  LOWER(
    REPLACE(REPLACE(REPLACE(REPLACE(
      word, 
      'Ž', 'z'), 'ž', 'z'), 'Š', 's'), 'š', 's')
  ),
  '1.webp'
)
WHERE image_url LIKE '%.png';