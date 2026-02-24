

## Popravek: Igra ujemanja - prilagoditev zaslonu (kot Labirint)

### Problem

Na racunalniku se igra ujemanja prikaze samo v zgornjem delu zaslona s fiksno velikimi karticami, namesto da bi se raztegnila cez cel zaslon. Labirint to dela pravilno, ker dinamicno izracuna velikost celic glede na velikost okna.

### Razlika med igrama

**Labirint** (deluje pravilno):
- Zunanji kontejner: `fixed inset-0` (zapolni cel zaslon)
- Velikost celic: dinamicno izracunana iz `window.innerWidth` in `window.innerHeight`
- Rezultat: igra se vedno prilagodi zaslonu

**Igra ujemanja** (ne deluje):
- Zunanji kontejner: `min-h-screen` z `h-full` (ni dejanske visine)
- Velikost kartic: fiksna (`w-24 h-24` do `xl:w-44 xl:h-44`)
- Rezultat: kartice ostanejo majhne, igra ne zapolni zaslona

### Resitev

Namesto fiksnih Tailwind razredov za velikost kartic, bomo uvedli **dinamicno skaliranje** podobno kot Labirint - izracunamo velikost kartic glede na razpolozljivo visino in sirino okna brskalnika.

### Tehnicne spremembe

#### 1. `src/components/games/GenericIgraUjemanjaGame.tsx`

- Spremeniti zunanji kontejner iz `min-h-screen` v `fixed inset-0` (enako kot Labirint desktop)
- Uporabiti `flex items-center justify-center` za centriranje igre na sredini zaslona

Zamenjava (vrstice 244-267):
```
// PREJ:
<div className="min-h-screen bg-background relative game-container">
  <div className="fixed inset-0 z-0" style={{backgroundImage: ...}} />
  ...
  <div className="h-full flex items-center justify-center relative z-10">
    {renderGame()}
  </div>

// POTEM:
<div className="fixed inset-0 bg-background relative game-container">
  <div className="fixed inset-0 z-0" style={{backgroundImage: ...}} />
  ...
  <div className="fixed inset-0 flex items-center justify-center z-10">
    {renderGame()}
  </div>
```

#### 2. `src/components/matching/MatchingGame.tsx`

Zamenjati fiksne Tailwind velikosti kartic z dinamicnim izracunom:

- Dodati `useState` za `windowSize` (width, height)
- Dodati `useEffect` z resize listenerjem
- Izracunati `tileSize` iz razpolozljivega prostora:
  - Na voljo: `windowHeight - paddingZgornjSpodaj`
  - `tileSize = Math.floor(razpolozljivaVisina / steviloVrstic) - razmik`
  - Omejiti z `Math.min(tileSize, maxTileSize)` da na velikih zaslonih ne postanejo prevelike
- Uporabiti inline `style={{ width: tileSize, height: tileSize }}` namesto fiksnih razredov

#### 3. `src/components/matching/ThreeColumnGame.tsx`

Enaka logika kot MatchingGame:

- Dodati dinamicni izracun velikosti kartic na osnovi visine okna
- 3 stolpci, 3 vrstice: `tileSize = Math.floor((viewportHeight - padding) / 3 - gap)`
- Zamenjati fiksne razrede z inline stili

#### 4. `src/components/matching/FourColumnGame.tsx`

Enaka logika:

- 4 stolpci, 4 vrstice: `tileSize = Math.floor((viewportHeight - padding) / 4 - gap)`
- Zamenjati fiksne razrede z inline stili

### Logika izracuna velikosti

```text
// Pseudokoda za izracun
viewportWidth = window.innerWidth
viewportHeight = window.innerHeight

// Koliko prostora imamo za kartice (odsejemo padding, progress bar)
availableHeight = viewportHeight - 120  // 120px za padding + progress bar
availableWidth = viewportWidth - 80     // 80px za stranski padding

// Izracunamo maksimalno velikost kartice iz obeh dimenzij
tileSizeByHeight = Math.floor(availableHeight / numRows) - gap
tileSizeByWidth = Math.floor(availableWidth / numColumns) - gap

// Vzamemo manjso (da ne gre cez rob)
tileSize = Math.min(tileSizeByHeight, tileSizeByWidth)

// Omejimo na max 180px (da na ogromnih zaslonih ni preveliko)
tileSize = Math.min(tileSize, 180)
```

### Kaj to pomeni za uporabnike

- **Na racunalniku**: Kartice se bodo povecale in zapolnile zaslon, tako kot Labirint
- **Na tablici**: Igra se bo prilagodila velikosti zaslona
- **Na telefonu (landscape)**: Brez sprememb - ze deluje s fiksnimi velikostmi za mobilne naprave (`isLandscape` logika ostane)
- **Ko se spremeni velikost okna**: Kartice se dinamicno prilagodijo (resize listener)

