

# Preoblikovanje strani Artikulacija po vzoru Video navodila

## Spremembe v `src/pages/ArtikulacijaVaje.tsx`

### 1. Podatki o karticah
Napolni kartice z 9 črkami (C, Č, K, L, R, S, Š, Z, Ž) — enake slike zmajčkov kot na `/video-navodila`. Vsaka kartica vodi na `/govorno-jezikovne-vaje/artikulacija/{urlKey}` (npr. `c`, `ch`, `k`, `l`, `r`, `s`, `sh`, `z`, `zh`).

### 2. Layout — kopija VideoNavodila
- Zunanji container: `fixed inset-0 overflow-hidden flex flex-col` (mobile) / `min-h-screen` (desktop)
- `<Header />` na vrhu
- Naslov "Artikulacija" s rumeno črto pod njim
- Breadcrumb samo na desktopu
- Kartice: `grid-cols-3 gap-2` (mobile) / `grid-cols-3 gap-8` (desktop)

### 3. Kartice — kopija LetterCard iz VideoNavodila
- Radial gradient ozadje (zlato-oranžno)
- `aspect-[4/3]` (mobile) / `aspect-video` (desktop)
- Tekst "Glas {letter}" pod sliko
- Opis samo na desktopu

### 4. Odstranitve
- Zelena hero sekcija, DailyStarsBar, FooterSection, embla carousel, signOut logika — vse odstrani
- Oranžni back gumb ostane enak

### 5. Datoteka
- `src/pages/ArtikulacijaVaje.tsx` — edina sprememba

