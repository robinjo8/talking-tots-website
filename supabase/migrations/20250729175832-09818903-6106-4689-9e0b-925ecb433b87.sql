-- Create memory card tables for letters C, Č, Z, Ž, and L
CREATE TABLE public.memory_cards_C (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.memory_cards_Č (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.memory_cards_Z (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.memory_cards_Ž (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.memory_cards_L (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert memory cards for letter C
INSERT INTO public.memory_cards_C (word, image_url, audio_url) VALUES
  ('CEDILO', 'storage/memory-game/cedilo.png', 'memory-game-voices/test.m4a'),
  ('CEKIN', 'storage/memory-game/cekin.png', 'memory-game-voices/test.m4a'),
  ('CERKEV', 'storage/memory-game/cerkev.png', 'memory-game-voices/test.m4a'),
  ('CESTA', 'storage/memory-game/cesta.png', 'memory-game-voices/test.m4a'),
  ('CEV', 'storage/memory-game/cev.png', 'memory-game-voices/test.m4a'),
  ('CIRKUS', 'storage/memory-game/cirkus.png', 'memory-game-voices/test.m4a'),
  ('CISTERNA', 'storage/memory-game/cisterna.png', 'memory-game-voices/test.m4a'),
  ('ČOKLA', 'storage/memory-game/cokla.png', 'memory-game-voices/test.m4a'),
  ('COPAT', 'storage/memory-game/copat.png', 'memory-game-voices/test.m4a'),
  ('CVET', 'storage/memory-game/cvet.png', 'memory-game-voices/test.m4a');

-- Insert memory cards for letter Č
INSERT INTO public.memory_cards_Č (word, image_url, audio_url) VALUES
  ('ČAJ', 'storage/memory-game/caj.png', 'memory-game-voices/test.m4a'),
  ('ČASOPIS', 'storage/memory-game/casopis.png', 'memory-game-voices/test.m4a'),
  ('ČEBELA', 'storage/memory-game/cebela.png', 'memory-game-voices/test.m4a'),
  ('ČEBULA', 'storage/memory-game/cebula.png', 'memory-game-voices/test.m4a'),
  ('ČESEN', 'storage/memory-game/cesen.png', 'memory-game-voices/test.m4a'),
  ('ČEVLJI', 'storage/memory-game/cevlji.png', 'memory-game-voices/test.m4a'),
  ('ČOKOLADA', 'storage/memory-game/cokolada.png', 'memory-game-voices/test.m4a'),
  ('ČOLN', 'storage/memory-game/coln.png', 'memory-game-voices/test.m4a'),
  ('ČOPIČ', 'storage/memory-game/copic.png', 'memory-game-voices/test.m4a'),
  ('ČRKE', 'storage/memory-game/crke.png', 'memory-game-voices/test.m4a');

-- Insert memory cards for letter Z
INSERT INTO public.memory_cards_Z (word, image_url, audio_url) VALUES
  ('ZAJEC', 'storage/memory-game/zajec.png', 'memory-game-voices/test.m4a'),
  ('ZASLON', 'storage/memory-game/zaslon.png', 'memory-game-voices/test.m4a'),
  ('ZAVESA', 'storage/memory-game/zavesa.png', 'memory-game-voices/test.m4a'),
  ('ZEBRA', 'storage/memory-game/zebra.png', 'memory-game-voices/test.m4a'),
  ('ZLATO', 'storage/memory-game/zlato.png', 'memory-game-voices/test.m4a'),
  ('ZMAJ', 'storage/memory-game/zmaj.png', 'memory-game-voices/test.m4a'),
  ('ZOB', 'storage/memory-game/zob.png', 'memory-game-voices/test.m4a'),
  ('ZOBOTREBEC', 'storage/memory-game/zobotrebec.png', 'memory-game-voices/test.m4a'),
  ('ZVEZDA', 'storage/memory-game/zvezda.png', 'memory-game-voices/test.m4a'),
  ('ZVOČNIK', 'storage/memory-game/zvocnik.png', 'memory-game-voices/test.m4a');

-- Insert memory cards for letter Ž
INSERT INTO public.memory_cards_Ž (word, image_url, audio_url) VALUES
  ('ŽABA', 'storage/memory-game/zaba.png', 'memory-game-voices/test.m4a'),
  ('ŽAGA', 'storage/memory-game/zaga.png', 'memory-game-voices/test.m4a'),
  ('ŽARNICA', 'storage/memory-game/zarnica.png', 'memory-game-voices/test.m4a'),
  ('ŽEBELJ', 'storage/memory-game/zebelj.png', 'memory-game-voices/test.m4a'),
  ('ŽELVA', 'storage/memory-game/zelva.png', 'memory-game-voices/test.m4a'),
  ('ŽERJAV', 'storage/memory-game/zerjav.png', 'memory-game-voices/test.m4a'),
  ('ŽIRAFA', 'storage/memory-game/zirafa.png', 'memory-game-voices/test.m4a'),
  ('ŽLICA', 'storage/memory-game/zlica.png', 'memory-game-voices/test.m4a'),
  ('ŽOGA', 'storage/memory-game/zoga.png', 'memory-game-voices/test.m4a'),
  ('ŽOLNA', 'storage/memory-game/zolna.png', 'memory-game-voices/test.m4a');

-- Insert memory cards for letter L
INSERT INTO public.memory_cards_L (word, image_url, audio_url) VALUES
  ('LED', 'storage/memory-game/led.png', 'memory-game-voices/test.m4a'),
  ('LETALO', 'storage/memory-game/letalo.png', 'memory-game-voices/test.m4a'),
  ('LEV', 'storage/memory-game/lev.png', 'memory-game-voices/test.m4a'),
  ('LIST', 'storage/memory-game/list.png', 'memory-game-voices/test.m4a'),
  ('LIZIKA', 'storage/memory-game/lizika.png', 'memory-game-voices/test.m4a'),
  ('LONEC', 'storage/memory-game/lonec.png', 'memory-game-voices/test.m4a'),
  ('LOPAR', 'storage/memory-game/lopar.png', 'memory-game-voices/test.m4a'),
  ('LUBENICA', 'storage/memory-game/lubenica.png', 'memory-game-voices/test.m4a'),
  ('LUČ', 'storage/memory-game/luc.png', 'memory-game-voices/test.m4a');

-- Enable RLS on all new tables
ALTER TABLE public.memory_cards_C ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_cards_Č ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_cards_Z ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_cards_Ž ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_cards_L ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (memory games should be accessible to all users)
CREATE POLICY "Memory cards C are publicly readable" ON public.memory_cards_C FOR SELECT USING (true);
CREATE POLICY "Memory cards Č are publicly readable" ON public.memory_cards_Č FOR SELECT USING (true);
CREATE POLICY "Memory cards Z are publicly readable" ON public.memory_cards_Z FOR SELECT USING (true);
CREATE POLICY "Memory cards Ž are publicly readable" ON public.memory_cards_Ž FOR SELECT USING (true);
CREATE POLICY "Memory cards L are publicly readable" ON public.memory_cards_L FOR SELECT USING (true);