

## Plan: Dodaj F, G, H, V v igri Zabavna pot in Bingo

### Problem
Igri Zabavna pot (`/govorne-igre/kace`) in Bingo (`/govorne-igre/bingo`) nimata kartic in podatkov za glasove F, G, H, V. Potrebno je dodati besede (sredina/konec), kartice za izbiro in routing za vse štiri črke.

### Besede za posamezne glasove (iz uporabnikovega seznama)

**F (14 besed):** COF, DELFIN, FEFERON, HARFA, KROF, MAFIN, POMFRIT, SEMAFOR, ŠKAF, ŠOFER, TELEFON, VAFELJ, ŽIRAFA, FRNIKOLA

**G (15 besed):** ANGEL, DRAGULJ, FIGA, JAGODA, JOGURT, KNJIGA, MOŽGANI, NOGA, NOGAVICE, NOGOMETAŠ, OGENJ, OGRAJA, PAPIGA, ŽAGA, ŽOGA

**H (15 besed):** DUH, GRAH, JUHA, KAHLA, KRUH, KUHAR, MAH, MEHURČKI, MUHA, OREH, POLH, ŠAH, STREHA, UHAN, UHO

**V (27 besed):** AVOKADO, BARVICA, BOROVNICE, CVET, DINOZAVER, DREVO, GLAVA, KAVA, KIVI, KLAVIR, KRAVA, LIZIKA, LOVEC, MEDVED, NOGAVICE, ROKAVICE, SOVA, SVETILKA, SVINČNIK, TELEVIZIJA, TRAVA, VEVERICA, ZAVESA, ŽELVA, ZVEZDA, ZVEZEK, ZVOČNIK

### Spremembe po datotekah

**1. `src/data/kaceLestveConfig.ts`**
- Dodaj `KACE_WORDS_F` (14 besed), `KACE_WORDS_G` (15), `KACE_WORDS_H` (15), `KACE_WORDS_V` (27) — z `acceptedVariants` po enakem vzorcu kot obstoječe (beseda + skloni + brez šumnikov)
- Dodaj `case 'f'`, `case 'g'`, `case 'h'`, `case 'v'` v `getKaceWordList()`

**2. `src/data/artikulacijaVajeConfig.ts`**
- Dodaj `bingoDataFSredinaKonec` (14 besed), `bingoDataGSredinaKonec` (15), `bingoDataHSredinaKonec` (15), `bingoDataVSredinaKonec` (27) — format `BingoWordData[]`
- Dodaj 4 nove vnose v `artikulacijaConfigs`: `'f-sredina-konec'`, `'g-sredina-konec'`, `'h-sredina-konec'`, `'v-sredina-konec'`

**3. `src/pages/KaceLestveGames.tsx`** (uporabniški portal — izbira glasu za Zabavno pot)
- Dodaj 4 kartice za F, G, H, V (slike `zmajcek_crka_F.webp` itd.) v pravilnem abecednem vrstnem redu (C, Č, **F, G, H,** K, L, R-zacetek, R, S, Š, **V,** Z, Ž)

**4. `src/pages/BingoGames.tsx`** (uporabniški portal — izbira glasu za Bingo)
- Dodaj 4 kartice za F, G, H, V v enakem abecednem vrstnem redu

**5. `src/pages/admin/games/AdminKaceLestveGames.tsx`** (admin portal)
- Dodaj 4 kartice za F, G, H, V v abecednem vrstnem redu

**6. `src/pages/admin/games/AdminBingoGames.tsx`** (admin portal)
- Dodaj 4 kartice za F, G, H, V v abecednem vrstnem redu

**7. `src/components/routing/KaceLestveRouter.tsx`** (uporabniški router)
- Dodaj `"f"`, `"g"`, `"h"`, `"v"` v `VALID_LETTERS`

**8. `src/components/routing/admin/AdminKaceLestveRouter.tsx`** (admin router)
- Dodaj `"f"`, `"g"`, `"h"`, `"v"` v `VALID_LETTERS`

**9. `src/components/BreadcrumbNavigation.tsx`**
- Dodaj breadcrumb vnose za `/govorne-igre/kace/f`, `/g`, `/h`, `/v` in `/govorne-igre/bingo/f`, `/g`, `/h`, `/v`

### Zvočni posnetki — posebnost
Beseda POMFRIT ima zvok `Pomfri.mp3` (ne `Pomfrit.mp3`). Vse ostale sledijo standardnemu vzorcu.

### Obseg
- 9 datotek
- ~350 vrstic dodanih (večinoma podatki za besede)
- Brez sprememb logike ali obstoječega delovanja

