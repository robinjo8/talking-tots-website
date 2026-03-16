

# Preoblikovanje kartic na strani Govorne vaje

## Cilj
Kartice na `/govorno-jezikovne-vaje` preoblikujemo po vzoru kartic na `/govorne-igre` (GamesList) — z veliko sliko zgoraj, naslovom in opisom spodaj, belo ozadje.

## Spremembe (1 datoteka: `src/pages/GovornojezicovneVaje.tsx`)

### 1. Dodaj slike zmajčkov v podatke kartic
Vsaki kartici dodamo `image` in `imageScale` polje:
- **VAJE MOTORIKE GOVORIL**: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_vaje govoril.webp`
- **MOJI PRVI GLASOVI**: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajce_prvi glasovi.webp`
- **VIZUALNI PRIKAZ USTNIC**: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_ustnice.webp`
- **VIDEO NAVODILA**: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_video navodila.webp`

Dodamo tudi `customBackground` z radialnim gradientom (enako kot v GamesList).

### 2. Preoblikuj kartico po vzoru GamesList
Zamenjamo trenutni layout (gradient header + expand/collapse opis) z:
- **Slika zgoraj**: `aspect-square` na mobilnem, `aspect-video` na desktopu, z `customBackground` gradientom in sliko zmajčka znotraj
- **Vsebina spodaj**: Naslov + opis vedno prikazan (brez expand/collapse na mobilnem)
- **Grid**: Na mobilnem `grid-cols-2 gap-4`, na desktopu `grid-cols-2 gap-8`
- **Belo ozadje**: `bg-white` na kartici

### 3. Odstrani neuporabljeno stanje
Odstranimo `expandedId` state in `ChevronDown` import, ker opisi ne bodo več zložljivi.

### 4. Mobilna prilagoditev
Na mobilnem: manjši padding (`p-3`), manjši tekst (`text-base` naslov, `text-xs` opis), centriran tekst, `line-clamp-2` za opis — identično kot GamesList.

