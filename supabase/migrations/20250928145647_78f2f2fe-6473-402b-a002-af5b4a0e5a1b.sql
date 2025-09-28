-- Update memory_cards (R letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE memory_cards 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN word = 'raca' THEN 'raca.m4a'
    WHEN word = 'raketa' THEN 'raketa.m4a'
    WHEN word = 'ravnilo' THEN 'ravnilo.m4a'
    WHEN word = 'repa' THEN 'repa.m4a'
    WHEN word = 'riba' THEN 'riba.m4a'
    WHEN word = 'robot' THEN 'robot.m4a'
    WHEN word = 'roka' THEN 'roka.m4a'
    WHEN word = 'rolka' THEN 'rolka.m4a'
    WHEN word = 'ropotuljica' THEN 'ropotuljica.m4a'
    WHEN word = 'roza' THEN 'roza.m4a'
  END
WHERE word IN ('raca', 'raketa', 'ravnilo', 'repa', 'riba', 'robot', 'roka', 'rolka', 'ropotuljica', 'roza');

-- Update memory_cards_c (C letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE memory_cards_c 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'cedilo' THEN 'cedilo.m4a'
    WHEN LOWER(word) = 'cekin' THEN 'cekin.m4a'
    WHEN LOWER(word) = 'cerkev' THEN 'cerkev.m4a'
    WHEN LOWER(word) = 'cesta' THEN 'cesta.m4a'
    WHEN LOWER(word) = 'cev' THEN 'cev.m4a'
    WHEN LOWER(word) = 'cirkus' THEN 'cirkus.m4a'
    WHEN LOWER(word) = 'cisterna' THEN 'cisterna.m4a'
    WHEN LOWER(word) = 'copat' THEN 'copat.m4a'
    WHEN LOWER(word) = 'cvet' THEN 'cvet.m4a'
    WHEN LOWER(word) = 'cokla' THEN 'cokla.m4a'
  END
WHERE LOWER(word) IN ('cedilo', 'cekin', 'cerkev', 'cesta', 'cev', 'cirkus', 'cisterna', 'copat', 'cvet', 'cokla');

-- Update memory_cards_K (K letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE "memory_cards_K" 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'kapa' THEN 'kapa.m4a'
    WHEN LOWER(word) = 'klavir' THEN 'klavir.m4a'
    WHEN LOWER(word) = 'knjiga' THEN 'knjiga.m4a'
    WHEN LOWER(word) = 'kocka' THEN 'kocka.m4a'
    WHEN LOWER(word) = 'kokos' THEN 'kokos.m4a'
    WHEN LOWER(word) = 'kolo' THEN 'kolo.m4a'
    WHEN LOWER(word) = 'kosara' THEN 'kosara.m4a'
    WHEN LOWER(word) = 'kruh' THEN 'kruh.m4a'
    WHEN LOWER(word) = 'kumara' THEN 'kumara.m4a'
    WHEN LOWER(word) = 'kuza' THEN 'kuza.m4a'
  END
WHERE LOWER(word) IN ('kapa', 'klavir', 'knjiga', 'kocka', 'kokos', 'kolo', 'kosara', 'kruh', 'kumara', 'kuza');

-- Update memory_cards_l (L letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE memory_cards_l 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'led' THEN 'led.m4a'
    WHEN LOWER(word) = 'letalo' THEN 'letalo.m4a'
    WHEN LOWER(word) = 'lev' THEN 'lev.m4a'
    WHEN LOWER(word) = 'list' THEN 'list.m4a'
    WHEN LOWER(word) = 'lizika' THEN 'lizika.m4a'
    WHEN LOWER(word) = 'lonec' THEN 'lonec.m4a'
    WHEN LOWER(word) = 'lopar' THEN 'lopar.m4a'
    WHEN LOWER(word) = 'lubenica' THEN 'lubenica.m4a'
    WHEN LOWER(word) = 'luc' THEN 'luc.m4a'
    WHEN LOWER(word) = 'ladja' THEN 'ladja.m4a'
  END
WHERE LOWER(word) IN ('led', 'letalo', 'lev', 'list', 'lizika', 'lonec', 'lopar', 'lubenica', 'luc', 'ladja');

-- Update memory_cards_S (S letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE "memory_cards_S" 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'stol' THEN 'stol.m4a'
    WHEN LOWER(word) = 'sonce' THEN 'sonce.m4a'
    WHEN LOWER(word) = 'svincnik' THEN 'svincnik.m4a'
    WHEN LOWER(word) = 'slon' THEN 'slon.m4a'
    WHEN LOWER(word) = 'slika' THEN 'slika.m4a'
    WHEN LOWER(word) = 'snezak' THEN 'snezak.m4a'
    WHEN LOWER(word) = 'sladoled' THEN 'sladoled.m4a'
    WHEN LOWER(word) = 'svetilka' THEN 'svetilka.m4a'
    WHEN LOWER(word) = 'smreka' THEN 'smreka.m4a'
    WHEN LOWER(word) = 'sova' THEN 'sova.m4a'
  END
WHERE LOWER(word) IN ('stol', 'sonce', 'svincnik', 'slon', 'slika', 'snezak', 'sladoled', 'svetilka', 'smreka', 'sova');

-- Update memory_cards_z (Z letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE memory_cards_z 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'zajec' THEN 'zajec.m4a'
    WHEN LOWER(word) = 'zaslon' THEN 'zaslon.m4a'
    WHEN LOWER(word) = 'zavesa' THEN 'zavesa.m4a'
    WHEN LOWER(word) = 'zebra' THEN 'zebra.m4a'
    WHEN LOWER(word) = 'zlato' THEN 'zlato.m4a'
    WHEN LOWER(word) = 'zmaj' THEN 'zmaj.m4a'
    WHEN LOWER(word) = 'zob' THEN 'zob.m4a'
    WHEN LOWER(word) = 'zobotrebec' THEN 'zobotrebec.m4a'
    WHEN LOWER(word) = 'zvezda' THEN 'zvezda.m4a'
    WHEN LOWER(word) = 'zvocnik' THEN 'zvocnik.m4a'
  END
WHERE LOWER(word) IN ('zajec', 'zaslon', 'zavesa', 'zebra', 'zlato', 'zmaj', 'zob', 'zobotrebec', 'zvezda', 'zvocnik');

-- Update memory_cards_Č (Č letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE "memory_cards_Č" 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'caj' THEN 'caj.m4a'
    WHEN LOWER(word) = 'casopis' THEN 'casopis.m4a'
    WHEN LOWER(word) = 'cebela' THEN 'cebela.m4a'
    WHEN LOWER(word) = 'cebula' THEN 'cebula.m4a'
    WHEN LOWER(word) = 'cesen' THEN 'cesen.m4a'
    WHEN LOWER(word) = 'cevlji' THEN 'cevlji.m4a'
    WHEN LOWER(word) = 'cokolada' THEN 'cokolada.m4a'
    WHEN LOWER(word) = 'coln' THEN 'coln.m4a'
    WHEN LOWER(word) = 'copic' THEN 'copic.m4a'
    WHEN LOWER(word) = 'crke' THEN 'crke.m4a'
  END
WHERE LOWER(word) IN ('caj', 'casopis', 'cebela', 'cebula', 'cesen', 'cevlji', 'cokolada', 'coln', 'copic', 'crke');

-- Update memory_cards_Š_duplicate (Š letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE "memory_cards_Š_duplicate" 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'scetka' THEN 'scetka.m4a'
    WHEN LOWER(word) = 'sal' THEN 'sal.m4a'
    WHEN LOWER(word) = 'skatla' THEN 'skatla.m4a'
    WHEN LOWER(word) = 'stampiljka' THEN 'stampiljka.m4a'
    WHEN LOWER(word) = 'skorenj' THEN 'skorenj.m4a'
    WHEN LOWER(word) = 'sotor' THEN 'sotor.m4a'
    WHEN LOWER(word) = 'storklja' THEN 'storklja.m4a'
    WHEN LOWER(word) = 'sah' THEN 'sah.m4a'
    WHEN LOWER(word) = 'skarje' THEN 'skarje.m4a'
    WHEN LOWER(word) = 'sola' THEN 'sola.m4a'
  END
WHERE LOWER(word) IN ('scetka', 'sal', 'skatla', 'stampiljka', 'skorenj', 'sotor', 'storklja', 'sah', 'skarje', 'sola');

-- Update memory_cards_Ž (Ž letter) with correct audio URLs from zvocni-posnetki bucket
UPDATE "memory_cards_Ž" 
SET audio_url = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/' || 
  CASE 
    WHEN LOWER(word) = 'zaba' THEN 'zaba.m4a'
    WHEN LOWER(word) = 'zaga' THEN 'zaga.m4a'
    WHEN LOWER(word) = 'zarnica' THEN 'zarnica.m4a'
    WHEN LOWER(word) = 'zebelj' THEN 'zebelj.m4a'
    WHEN LOWER(word) = 'zelva' THEN 'zelva.m4a'
    WHEN LOWER(word) = 'zerjav' THEN 'zerjav.m4a'
    WHEN LOWER(word) = 'zirafa' THEN 'zirafa.m4a'
    WHEN LOWER(word) = 'zlica' THEN 'zlica.m4a'
    WHEN LOWER(word) = 'zoga' THEN 'zoga.m4a'
    WHEN LOWER(word) = 'zolna' THEN 'zolna.m4a'
  END
WHERE LOWER(word) IN ('zaba', 'zaga', 'zarnica', 'zebelj', 'zelva', 'zerjav', 'zirafa', 'zlica', 'zoga', 'zolna');