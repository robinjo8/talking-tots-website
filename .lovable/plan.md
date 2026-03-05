

# Plan: Vizualni prikaz ustnic — nova kartica + nova stran

## 1. Dodaj kartico na /govorno-jezikovne-vaje

**Datoteka:** `src/pages/GovornojezicovneVaje.tsx`

Dodaj nov objekt v `exerciseTypes` array:
- id: `"vizualni-prikaz-ustnic"`
- title: `"VIZUALNI PRIKAZ USTNIC"`
- description: (podano besedilo o glasovih C, Č, R, L, K, S, Š, Z, Ž)
- path: `/govorno-jezikovne-vaje/vizualni-prikaz-ustnic`
- Primeren gradient in barva (npr. `text-app-pink`, `from-pink-100 to-red-100` ali podobno)

## 2. Ustvari novo stran VizualniPrikazUstnic

**Nova datoteka:** `src/pages/VizualniPrikazUstnic.tsx`

Stran s Header, BreadcrumbNavigation, naslovom in 5 karticami v gridu:

| Kartica | Glasovi | Slika (bucket `slike-ostalo`) |
|---------|---------|-------------------------------|
| Glas K | K | Glas_K.png |
| Glas L | L | Glas_L.png |
| Glas R | R | Glas_R.png |
| Glasovi Č, Š, Ž | Č, Š, Ž | Glas_ShZhCh.png |
| Glasovi C, S, Z | C, S, Z | Glas_SZC.png |

Vsaka kartica:
- Prikaže naslov glasu (npr. "Glas K" ali "Glasovi C, S, Z")
- Ob kliku odpre Dialog/modal s povečano sliko
- Vsebuje gumb za zvočna navodila (disabled/placeholder z napisom "Kmalu" ali ikono zvočnika, ki še ne dela) — pripravljen za kasnejšo implementacijo z audio URL-jem
- Slika URL: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/{filename}`

Oblikovanje enako kot ostale podobne strani (kartice z gradientom, shadow, hover efekt).

## 3. Dodaj route

**Datoteka:** `src/config/routes.tsx`
- Lazy import nove strani
- Dodaj protected route: `/govorno-jezikovne-vaje/vizualni-prikaz-ustnic`

## Povzetek
- 1 nova datoteka (`VizualniPrikazUstnic.tsx`)
- 2 obstoječi datoteki za urejanje (`GovornojezicovneVaje.tsx`, `routes.tsx`)
- Gumb za zvočna navodila bo pripravljen (disabled), audio se doda naknadno

