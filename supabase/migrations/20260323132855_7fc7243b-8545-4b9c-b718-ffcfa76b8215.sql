-- Create enums for album
CREATE TYPE public.sticker_world AS ENUM (
  'tomijev_gozd', 'carobni_grad', 'vesolje', 'dzungla', 'pod_morjem', 'dino_svet', 'super_junaki'
);

CREATE TYPE public.sticker_rarity AS ENUM (
  'common', 'special', 'rare', 'legendary'
);

-- Album stickers definition table (100 stickers)
CREATE TABLE public.album_stickers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world sticker_world NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  rarity sticker_rarity NOT NULL DEFAULT 'common',
  sort_order integer NOT NULL DEFAULT 0,
  is_golden boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Child stickers (which stickers a child owns)
CREATE TABLE public.child_stickers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  sticker_id uuid NOT NULL REFERENCES public.album_stickers(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  earned_reason text NOT NULL,
  is_golden_version boolean NOT NULL DEFAULT false,
  UNIQUE(child_id, sticker_id)
);

-- Child album stats (aggregated)
CREATE TABLE public.child_album_stats (
  child_id uuid PRIMARY KEY REFERENCES public.children(id) ON DELETE CASCADE,
  total_stickers integer NOT NULL DEFAULT 0,
  total_golden integer NOT NULL DEFAULT 0,
  last_sticker_at timestamptz
);

-- RLS
ALTER TABLE public.album_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_album_stats ENABLE ROW LEVEL SECURITY;

-- album_stickers: everyone can read
CREATE POLICY "Anyone can read album stickers" ON public.album_stickers FOR SELECT USING (true);

-- child_stickers: parents can read/insert their own children's stickers
CREATE POLICY "Parents can view their children stickers" ON public.child_stickers
  FOR SELECT TO authenticated
  USING (child_id IN (SELECT id FROM public.children WHERE parent_id = auth.uid()));

CREATE POLICY "Parents can insert their children stickers" ON public.child_stickers
  FOR INSERT TO authenticated
  WITH CHECK (child_id IN (SELECT id FROM public.children WHERE parent_id = auth.uid()));

-- child_album_stats: parents can read/upsert their own children's stats
CREATE POLICY "Parents can view their children album stats" ON public.child_album_stats
  FOR SELECT TO authenticated
  USING (child_id IN (SELECT id FROM public.children WHERE parent_id = auth.uid()));

CREATE POLICY "Parents can upsert their children album stats" ON public.child_album_stats
  FOR INSERT TO authenticated
  WITH CHECK (child_id IN (SELECT id FROM public.children WHERE parent_id = auth.uid()));

CREATE POLICY "Parents can update their children album stats" ON public.child_album_stats
  FOR UPDATE TO authenticated
  USING (child_id IN (SELECT id FROM public.children WHERE parent_id = auth.uid()));

-- Seed 100 placeholder stickers
INSERT INTO public.album_stickers (world, name, rarity, sort_order, is_golden) VALUES
('tomijev_gozd', 'Zajec', 'common', 1, false),
('tomijev_gozd', 'Lisica', 'common', 2, false),
('tomijev_gozd', 'Jelen', 'common', 3, false),
('tomijev_gozd', 'Veverica', 'common', 4, false),
('tomijev_gozd', 'Sova', 'common', 5, false),
('tomijev_gozd', 'Medved', 'common', 6, false),
('tomijev_gozd', 'Jež', 'common', 7, false),
('tomijev_gozd', 'Srna', 'common', 8, false),
('tomijev_gozd', 'Volk', 'common', 9, false),
('tomijev_gozd', 'Gozdna vila', 'special', 10, false),
('tomijev_gozd', 'Čarobno drevo', 'special', 11, false),
('tomijev_gozd', 'Gozdni škrat', 'special', 12, false),
('tomijev_gozd', 'Svetleči hrošč', 'special', 13, false),
('tomijev_gozd', 'Zlati jelen', 'rare', 14, false),
('tomijev_gozd', 'Tomi v gozdu', 'legendary', 15, true),
('carobni_grad', 'Vitez', 'common', 1, false),
('carobni_grad', 'Princesa', 'common', 2, false),
('carobni_grad', 'Ščit', 'common', 3, false),
('carobni_grad', 'Meč', 'common', 4, false),
('carobni_grad', 'Konj', 'common', 5, false),
('carobni_grad', 'Stolp', 'common', 6, false),
('carobni_grad', 'Zastava', 'common', 7, false),
('carobni_grad', 'Krona', 'common', 8, false),
('carobni_grad', 'Čarobna palica', 'common', 9, false),
('carobni_grad', 'Čarodej', 'special', 10, false),
('carobni_grad', 'Zmaj stražar', 'special', 11, false),
('carobni_grad', 'Leteči grad', 'special', 12, false),
('carobni_grad', 'Nevidni plašč', 'special', 13, false),
('carobni_grad', 'Zlata krona', 'rare', 14, false),
('carobni_grad', 'Tomi kralj', 'legendary', 15, true),
('vesolje', 'Raketa', 'common', 1, false),
('vesolje', 'Luna', 'common', 2, false),
('vesolje', 'Zvezda', 'common', 3, false),
('vesolje', 'Planet', 'common', 4, false),
('vesolje', 'Asteroid', 'common', 5, false),
('vesolje', 'Satelit', 'common', 6, false),
('vesolje', 'Vesoljec', 'common', 7, false),
('vesolje', 'Komet', 'common', 8, false),
('vesolje', 'Sonce', 'common', 9, false),
('vesolje', 'Vesoljska postaja', 'special', 10, false),
('vesolje', 'Črna luknja', 'special', 11, false),
('vesolje', 'Galaksija', 'special', 12, false),
('vesolje', 'Nebula', 'special', 13, false),
('vesolje', 'Zlata zvezda', 'rare', 14, false),
('vesolje', 'Tomi astronavt', 'legendary', 15, true),
('dzungla', 'Papiga', 'common', 1, false),
('dzungla', 'Opica', 'common', 2, false),
('dzungla', 'Kameleon', 'common', 3, false),
('dzungla', 'Tukan', 'common', 4, false),
('dzungla', 'Jaguar', 'common', 5, false),
('dzungla', 'Kača', 'common', 6, false),
('dzungla', 'Žaba', 'common', 7, false),
('dzungla', 'Metulj', 'common', 8, false),
('dzungla', 'Slap', 'common', 9, false),
('dzungla', 'Zlati hrib', 'special', 10, false),
('dzungla', 'Skrivnostni tempel', 'special', 11, false),
('dzungla', 'Gorila', 'special', 12, false),
('dzungla', 'Leteča riba', 'special', 13, false),
('dzungla', 'Zlata žaba', 'rare', 14, false),
('dzungla', 'Tomi raziskovalec', 'legendary', 15, true),
('pod_morjem', 'Riba', 'common', 1, false),
('pod_morjem', 'Morski konjiček', 'common', 2, false),
('pod_morjem', 'Meduza', 'common', 3, false),
('pod_morjem', 'Hobotnica', 'common', 4, false),
('pod_morjem', 'Morska zvezda', 'common', 5, false),
('pod_morjem', 'Želva', 'common', 6, false),
('pod_morjem', 'Kit', 'common', 7, false),
('pod_morjem', 'Školjka', 'common', 8, false),
('pod_morjem', 'Koral', 'common', 9, false),
('pod_morjem', 'Pirat', 'special', 10, false),
('pod_morjem', 'Potopljena ladja', 'special', 11, false),
('pod_morjem', 'Morska deklica', 'special', 12, false),
('pod_morjem', 'Svetilnik', 'special', 13, false),
('pod_morjem', 'Zlata školjka', 'rare', 14, false),
('pod_morjem', 'Tomi potapljač', 'legendary', 15, true),
('dino_svet', 'T-Rex', 'common', 1, false),
('dino_svet', 'Triceratops', 'common', 2, false),
('dino_svet', 'Stegosaver', 'common', 3, false),
('dino_svet', 'Pterodaktil', 'common', 4, false),
('dino_svet', 'Brontosaver', 'common', 5, false),
('dino_svet', 'Velociraptor', 'common', 6, false),
('dino_svet', 'Dino jajce', 'common', 7, false),
('dino_svet', 'Vulkan', 'common', 8, false),
('dino_svet', 'Fosil', 'common', 9, false),
('dino_svet', 'Dino jezdec', 'special', 10, false),
('dino_svet', 'Krilatec', 'special', 11, false),
('dino_svet', 'Ledeni dino', 'special', 12, false),
('dino_svet', 'Ognjeviti dino', 'special', 13, false),
('dino_svet', 'Zlati fosil', 'rare', 14, false),
('dino_svet', 'Tomi dino lovec', 'legendary', 15, true),
('super_junaki', 'Letač', 'common', 1, false),
('super_junaki', 'Silak', 'common', 2, false),
('super_junaki', 'Bliskovit', 'common', 3, false),
('super_junaki', 'Ogenj', 'common', 4, false),
('super_junaki', 'Ledeni', 'common', 5, false),
('super_junaki', 'Nevidna', 'common', 6, false),
('super_junaki', 'Teleport', 'special', 7, false),
('super_junaki', 'Časovnik', 'special', 8, false),
('super_junaki', 'Zlati ščit', 'rare', 9, false),
('super_junaki', 'Super Tomi', 'legendary', 10, true);

-- Function to update album stats after sticker insert
CREATE OR REPLACE FUNCTION public.update_album_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.child_album_stats (child_id, total_stickers, total_golden, last_sticker_at)
  VALUES (NEW.child_id, 1, CASE WHEN NEW.is_golden_version THEN 1 ELSE 0 END, NEW.earned_at)
  ON CONFLICT (child_id) DO UPDATE SET
    total_stickers = child_album_stats.total_stickers + 1,
    total_golden = child_album_stats.total_golden + CASE WHEN NEW.is_golden_version THEN 1 ELSE 0 END,
    last_sticker_at = NEW.earned_at;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_album_stats_trigger
  AFTER INSERT ON public.child_stickers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_album_stats();