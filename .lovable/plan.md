

## Plan: Posodobitve albuma — naslovna stran, "?" gumb, mobilni prikaz

### Spremembe

**1. `src/components/album/AlbumBook.tsx` — Prva stran: naslovna + navodila**
- Spremenimo `buildPages` tako, da prva stran (`album_cover`) dobi tudi desno stran tipa `instructions`
- Na spreadu 0 prikažemo dve strani: levo naslovna slika, desno navodila za zbiranje sličic
- Navodila brez ikon, samo čist tekst v stilu albuma (pisava, barve albumskega papirja):
  - 7 dni zaporedne vadbe → 5 sličic + 1 zlata
  - Artikulacijski test → 2 sličici
  - 5 različnih iger na dan → 1 sličica
  - Vsakih 20 setov vaj → 5 sličic + 1 zlata
- Na mobilnem prikazu: spread 0 prikaže samo naslovno sliko, navodila gredo na naslednjo stran (ena stran na zaslon)

**2. `src/components/album/AlbumBook.tsx` — Mobilni prikaz: vedno ena stran**
- Na mobilnem (`md:` breakpoint) vsak spread prikaže samo eno stran naenkrat
- Spreade zgradimo drugače za mobilno: vsaka stran je svoj spread
- Uporabimo `useMediaQuery` ali CSS pristop: na `< md` prikažemo samo `currentPages[0]`, na `>= md` prikažemo obe strani

**3. `src/components/album/AlbumProgress.tsx` — "?" gumb namesto "Podrobnosti"**
- Zamenjamo info gumb ("Podrobnosti") z okroglim plavajočim gumbom v stilu `HomeMenuButton` (w-12 h-12, gradient amber→orange, border-white/50, shadow)
- Ikona: `HelpCircle` ali `?` (iz lucide `CircleHelp`)
- Gumb pozicioniran desno spodaj znotraj kartice
- V popup dialogu: imena svetov zapisana z VELIKIMI ČRKAMI (npr. "TOMIJEV GOZD", "ČAROBNI GRAD")

### Tehnični detajli

- Nov tip strani `type: 'instructions'` v `PageContent`
- `RenderPage` dobi nov case za `instructions` — renderira lepo oblikovan tekst na albumskem ozadju
- Za mobilni single-page prikaz: uporabimo React hook `useMediaQuery` ali `window.matchMedia` za zaznavo širine, in zgradimo spreade ustrezno
- Imena svetov v dialogu: `config.label.toUpperCase()`

