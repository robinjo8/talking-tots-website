

## Plan: Dodaj sekcijo "Album zmajčka Tomija" na /moja-stran

### Kaj se naredi

Na strani `/moja-stran`, pod obstoječo sekcijo "IGRE IN VAJE" (ki je del `ProgressSection` → `UnifiedProgressDisplay`), dodamo novo vizualno sekcijo z naslovom **"Album zmajčka Tomija"**, ki služi kot vstopna točka do `/album`.

### Spremembe

**1. `src/components/progress/AlbumSection.tsx`** (nova datoteka)
- Komponenta z naslovom "ALBUM ZMAJČKA TOMIJA"
- Naslovna slika iz bucketa: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_album_naslovna.webp`
- Kratka opisna vrstica (npr. "Zbiraj sličice s Tomijem po čarobnih svetovih!")
- Prikaže mini statistiko iz `useAlbumData` (npr. "12 / 100 sličic")
- Gumb "Odpri album" ki navigira na `/album`
- Vizualni stil skladen z obstoječimi karticami (Card, gradient ozadje, motion animacija)

**2. `src/pages/MojaStran.tsx`**
- Uvozi `AlbumSection` in ga doda pod `<ProgressSection />`, pred `<TipSection />`

### Vizualni stil
- Card z gradient ozadjem (zeleno/oranžno, v tematiki TomiTalk)
- Naslovna slika albuma prikazana kot velik vizualni element
- Animiran vstop (framer-motion, kot ostale sekcije)
- Na mobilnem prikazu responsivno urejena

