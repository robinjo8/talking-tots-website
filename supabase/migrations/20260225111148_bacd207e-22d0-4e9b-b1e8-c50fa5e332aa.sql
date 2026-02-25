
-- Create memory_cards_r_zacetek table for R beginning exercises (Spomin and Zaporedja games)
CREATE TABLE public.memory_cards_r_zacetek (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_cards_r_zacetek ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Memory cards R zacetek are publicly readable"
  ON public.memory_cards_r_zacetek
  FOR SELECT
  USING (true);

-- Insert 18 words
INSERT INTO public.memory_cards_r_zacetek (word, image_url, audio_url) VALUES
  ('Drevo', 'drevo1.webp', 'drevo.m4a'),
  ('Trobenta', 'trobenta1.webp', 'trobenta.m4a'),
  ('Tri', 'tri1.webp', 'tri.m4a'),
  ('Trikotnik', 'trikotnik1.webp', 'trikotnik.m4a'),
  ('Trava', 'trava1.webp', 'trava.m4a'),
  ('Trak', 'trak1.webp', 'trak.m4a'),
  ('Brisača', 'brisaca1.webp', 'brisaca.m4a'),
  ('Briketi', 'briketi1.webp', 'briketi.m4a'),
  ('Breskev', 'breskev1.webp', 'breskev.m4a'),
  ('Brada', 'brada1.webp', 'brada.m4a'),
  ('Brokoli', 'brokoli1.webp', 'brokoli.m4a'),
  ('Brusnice', 'brusnice1.webp', 'brusnice.m4a'),
  ('Breza', 'breza1.webp', 'breza.m4a'),
  ('Dres', 'dres1.webp', 'dres.m4a'),
  ('Dragulj', 'dragulj1.webp', 'dragulj.m4a'),
  ('Dron', 'dron1.webp', 'dron.m4a'),
  ('Princ', 'princ1.webp', 'princ.m4a'),
  ('Presta', 'presta1.webp', 'presta.m4a');
