

# Zmanjšanje praznega prostora nad karticami na mobilni verziji

## Problem
Na mobilni verziji je med hero sekcijo (zelena) in karticami preveč belega prostora. Vzrok:
1. Bela sekcija ima `py-12` (3rem zgoraj + 3rem spodaj)
2. Breadcrumb wrapper `<div className="mb-8">` ostane v DOM-u čeprav BreadcrumbNavigation vrne `null`
3. Grid ima `mb-12` pod karticami

## Rešitev
Na vseh 15 straneh z vzorcem `py-12 bg-white min-h-screen` spremenimo padding na mobilni verziji:
- `py-12` → `py-4 md:py-12` (manjši padding na mobilni)
- `mb-8` na breadcrumb wrapperju → `md:mb-8` (skrij na mobilni, ker je breadcrumb že skrit)
- `mb-12` na grid wrapperju → `mb-4 md:mb-12`

## Datoteke za spremembo (15 strani)
`GovorneIgre.tsx`, `MojeAplikacije.tsx`, `GovornojezicovneVaje.tsx`, `Zaporedja.tsx`, `SpominGames.tsx`, `BingoGames.tsx`, `KoloSreceGames.tsx`, `MetKockeGames.tsx`, `KaceLestveGames.tsx`, `IgraUjemanja.tsx`, `DrsnaSestavljanka.tsx`, `PonoviPoved.tsx`, `Labirint.tsx`, `SestavljankeGames.tsx`, `ArtikulacijaVaje.tsx`

Spremembe so minimalne — samo CSS razredi, brez strukturnih sprememb.

