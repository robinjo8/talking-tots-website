
Cilj: odpraviti odrezovanje igre na telefonu (landscape), da je celotna igra vedno vidna brez scrollanja in brez izhoda iz zaslona, pri tem pa desktop ostane nespremenjen.

### Kaj sem preveril

Pregledal sem trenutno implementacijo:
- `src/hooks/useDynamicTileSize.ts`
- `src/components/games/GenericIgraUjemanjaGame.tsx`
- `src/components/matching/MatchingGame.tsx`
- `src/hooks/useMatchingGame.ts`
- `src/components/matching/ThreeColumnGame.tsx`
- `src/components/matching/FourColumnGame.tsx`
- `src/components/matching/ImageTile.tsx`

Pregledal sem tudi referenco za Labirint (`GenericLabirintGame.tsx`, `MazeGame.tsx`) in preveril PWA/SW setup (`vite.config.ts`, service worker registracija).

### Diagnoza (glavni vzrok)

**Do I know what the issue is?**  
Da.

Glavni problem ni cache, ampak napačen izračun števila vrstic v `MatchingGame.tsx` (2-stolpčna varianta, ruta `/govorne-igre/igra-ujemanja/s` za starost 3–4).

Trenutno je:
- `numRows = Math.ceil(images.length / numColumns)`

Ampak igra dejansko renderira:
- `numColumns` stolpcev, kjer ima **vsak stolpec vse slike** (`useMatchingGame` naredi `shuffledColumns.push(shuffleArray(images))` za vsak stolpec).

To pomeni:
- realno število vrstic = `images.length` (ne `images.length / 2`),
- hook zato izračuna prevelik `tileSize`,
- mreža postane previsoka in je odrezana zgoraj/spodaj.

To se popolnoma ujema s screenshotom (odrezan zgornji in spodnji del kartic).

### Odgovor na tvoje vprašanje o cache

Cache lahko včasih zadrži star build (ker je vključen service worker), **ampak v tem primeru je primarni problem v kodi** (napačen `numRows`), zato samo “clear cache” ne bo trajna rešitev.  
Po popravku kode bomo vseeno dodali preverbo osvežitve PWA, da se nova verzija zagotovo naloži.

### Predlagan popravek (minimalen, ciljan, brez sprememb desktop vedenja)

## 1) Popravek izračuna vrstic v MatchingGame
**Datoteka:** `src/components/matching/MatchingGame.tsx`

- Spremenim:
  - iz `Math.ceil(images.length / numColumns)`
  - v pravilno vrednost za ta game mode: `images.length` (fallback 3)
- S tem bo `useDynamicTileSize` dobil realne dimenzije mreže in bo izračunal pravilno velikost kartic na vseh telefonih.

## 2) Varnostni guard (da je robustno tudi med inicializacijo)
**Datoteka:** `src/components/matching/MatchingGame.tsx`

- Uporabim “effectiveRows” logiko, ki ne pade na napačno vrednost med prvim renderjem:
  - prednostno `gameState.shuffledColumns[0]?.length` če je na voljo,
  - sicer `images.length`.
- To prepreči “skok” velikosti ob inicializaciji.

## 3) Brez posega v desktop layout
- Ne spreminjam desktop branch v `GenericIgraUjemanjaGame`.
- Ne spreminjam logike `ThreeColumnGame` in `FourColumnGame` (tam je `numRows` že pravilen glede na render).

## 4) PWA/cache preverba po deployu (operativni korak)
- Po popravku preverimo še update tok:
  - enkratni hard refresh na telefonu,
  - če je app nameščen kot PWA: zapri/odpri app in potrdi update prompt.
- To je samo za zagotovitev, da je nova verzija naložena; ne rešuje osnovnega buga brez code fixa.

### Zakaj bo to delovalo na “vsakem telefonu”

- `useDynamicTileSize` že uporablja `visualViewport` + `resize/orientation` listenerje.
- Ko dobi **pravilen `numRows`**, formula začne pravilno skalirati višino mreže.
- Ker je bug v trenutno prenizko ocenjenem številu vrstic, je popravek neposredno na vzrok in ne na simptom.

### Verifikacija po implementaciji

1. Odpri `/govorne-igre/igra-ujemanja/s` na telefonu v landscape.
2. Potrdi:
   - ni scrollanja,
   - nič ni odrezano zgoraj/spodaj,
   - progress bar je viden.
3. Test na vsaj 2 različnih velikostih (manjši Android + večji telefon).
4. Hitri regresijski test:
   - `/s56`, `/s78`, `/s910` (da ostane vse OK),
   - desktop pogled ostane nespremenjen.

### Obseg sprememb

Predvidoma 1 datoteka (največ 2, če dodam dodatni guard/helper):
- `src/components/matching/MatchingGame.tsx`
(opcijsko nič drugega)

To je najkrajša in najvarnejša pot do stabilnega rezultata.
