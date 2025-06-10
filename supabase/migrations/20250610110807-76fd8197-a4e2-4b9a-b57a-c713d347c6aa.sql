
-- Create the artikulacijski_test table first
CREATE TABLE IF NOT EXISTS public.artikulacijski_test (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  letter TEXT NOT NULL,
  word TEXT NOT NULL,
  image_path TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the correct letter-word combinations as specified
INSERT INTO public.artikulacijski_test (letter, word, image_path, order_index) VALUES
-- P words
('P', 'PIPA', 'artikulacijski-test/p/pipa.jpg', 1),
('P', 'KAPA', 'artikulacijski-test/p/kapa.jpg', 2),
('P', 'KLOP', 'artikulacijski-test/p/klop.jpg', 3),

-- B words
('B', 'BALON', 'artikulacijski-test/b/balon.jpg', 1),
('B', 'RIBA', 'artikulacijski-test/b/riba.jpg', 2),
('B', 'ZOB', 'artikulacijski-test/b/zob.jpg', 3),

-- F words
('F', 'FANT', 'artikulacijski-test/f/fant.jpg', 1),
('F', 'TELEFON', 'artikulacijski-test/f/telefon.jpg', 2),
('F', 'KROF', 'artikulacijski-test/f/krof.jpg', 3),

-- V words
('V', 'VETERNICA', 'artikulacijski-test/v/veternica.jpg', 1),
('V', 'KRAVA', 'artikulacijski-test/v/krava.jpg', 2),
('V', 'LEV', 'artikulacijski-test/v/lev.jpg', 3),

-- T words
('T', 'TROBENTA', 'artikulacijski-test/t/trobenta.jpg', 1),
('T', 'AVTO', 'artikulacijski-test/t/avto.jpg', 2),
('T', 'LIST', 'artikulacijski-test/t/list.jpg', 3),

-- D words
('D', 'DREVO', 'artikulacijski-test/d/drevo.jpg', 1),
('D', 'DUDA', 'artikulacijski-test/d/duda.jpg', 2),
('D', 'LED', 'artikulacijski-test/d/led.jpg', 3),

-- Š words
('Š', 'ŠKARJE', 'artikulacijski-test/š/škarje.jpg', 1),
('Š', 'HRUŠKA', 'artikulacijski-test/š/hruška.jpg', 2),
('Š', 'KOKOŠ', 'artikulacijski-test/š/kokoš.jpg', 3),

-- S words
('S', 'SOVA', 'artikulacijski-test/s/sova.jpg', 1),
('S', 'KOST', 'artikulacijski-test/s/kost.jpg', 2),
('S', 'PAS', 'artikulacijski-test/s/pas.jpg', 3),

-- Ž words
('Ž', 'ŽABA', 'artikulacijski-test/ž/žaba.jpg', 1),
('Ž', 'ROŽA', 'artikulacijski-test/ž/roža.jpg', 2),
('Ž', 'POLŽ', 'artikulacijski-test/ž/polž.jpg', 3),

-- Z words
('Z', 'ZEBRA', 'artikulacijski-test/z/zebra.jpg', 1),
('Z', 'KOZA', 'artikulacijski-test/z/koza.jpg', 2),
('Z', 'OBRAZ', 'artikulacijski-test/z/obraz.jpg', 3),

-- Č words
('Č', 'ČEBELA', 'artikulacijski-test/č/čebela.jpg', 1),
('Č', 'OČALA', 'artikulacijski-test/č/očala.jpg', 2),
('Č', 'KLJUČ', 'artikulacijski-test/č/ključ.jpg', 3),

-- C words
('C', 'COPATI', 'artikulacijski-test/c/copati.jpg', 1),
('C', 'VILICE', 'artikulacijski-test/c/vilice.jpg', 2),
('C', 'LONEC', 'artikulacijski-test/c/lonec.jpg', 3),

-- K words
('K', 'KAČA', 'artikulacijski-test/k/kača.jpg', 1),
('K', 'ČRKE', 'artikulacijski-test/k/črke.jpg', 2),
('K', 'OBLAK', 'artikulacijski-test/k/oblak.jpg', 3),

-- G words
('G', 'GOBA', 'artikulacijski-test/g/goba.jpg', 1),
('G', 'NOGA', 'artikulacijski-test/g/noga.jpg', 2),
('G', 'KROG', 'artikulacijski-test/g/krog.jpg', 3),

-- H words
('H', 'HIŠA', 'artikulacijski-test/h/hiša.jpg', 1),
('H', 'MUHA', 'artikulacijski-test/h/muha.jpg', 2),
('H', 'KRUH', 'artikulacijski-test/h/kruh.jpg', 3),

-- M words
('M', 'METLA', 'artikulacijski-test/m/metla.jpg', 1),
('M', 'OMARA', 'artikulacijski-test/m/omara.jpg', 2),
('M', 'DIM', 'artikulacijski-test/m/dim.jpg', 3),

-- N words
('N', 'NOGAVICE', 'artikulacijski-test/n/nogavice.jpg', 1),
('N', 'BANANA', 'artikulacijski-test/n/banana.jpg', 2),
('N', 'SLON', 'artikulacijski-test/n/slon.jpg', 3),

-- L words
('L', 'LADJA', 'artikulacijski-test/l/ladja.jpg', 1),
('L', 'KOLO', 'artikulacijski-test/l/kolo.jpg', 2),
('L', 'ŠAL', 'artikulacijski-test/l/šal.jpg', 3),

-- R words
('R', 'ROKA', 'artikulacijski-test/r/roka.jpg', 1),
('R', 'URA', 'artikulacijski-test/r/ura.jpg', 2),
('R', 'SIR', 'artikulacijski-test/r/sir.jpg', 3),

-- J words
('J', 'JABOLKO', 'artikulacijski-test/j/jabolko.jpg', 1),
('J', 'JAJCE', 'artikulacijski-test/j/jajce.jpg', 2),
('J', 'ZMAJ', 'artikulacijski-test/j/zmaj.jpg', 3);

-- Create storage bucket for artikulacijski-test images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artikulacijski-test', 'artikulacijski-test', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'artikulacijski-test');
