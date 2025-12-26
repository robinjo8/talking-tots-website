-- Create memory_cards_r table for R letter images
CREATE TABLE IF NOT EXISTS public.memory_cards_r (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_cards_r ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (game data should be accessible)
CREATE POLICY "Allow public read access to memory_cards_r"
ON public.memory_cards_r
FOR SELECT
USING (true);

-- Insert R images
INSERT INTO public.memory_cards_r (word, image_url) VALUES
('Raca', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/raca.png'),
('Rak', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/rak.png'),
('Raketa', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/raketa.png'),
('Ravnilo', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/ravnilo.png'),
('Rep', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/rep.png'),
('Repa', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/repa.png'),
('Riba', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/riba.png'),
('Ribez', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/ribez.png'),
('Ribič', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/ribic.png'),
('Ris', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/ris.png'),
('Riž', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/riz.png'),
('Robot', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/robot.png'),
('Roka', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/roka.png'),
('Rokometaš', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/rokometas.png'),
('Rolka', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/rolka.png'),
('Ropotuljica', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/ropotuljica.png'),
('Roža', 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zaporedja/r/roza.png');