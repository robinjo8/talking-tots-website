
-- Pobriši vse osirotele storage objekte za uporabnika d1575af8
DELETE FROM storage.objects 
WHERE bucket_id = 'uporabniski-profili' 
AND name LIKE 'd1575af8-e022-4b06-872f-7932ea3480d4%';

-- Pobriši vse osirotele storage objekte za uporabnika 2c6bad02 (če obstajajo)
DELETE FROM storage.objects 
WHERE bucket_id = 'uporabniski-profili' 
AND name LIKE '2c6bad02-9f57-40ab-b763-fb2d778459ca%';
