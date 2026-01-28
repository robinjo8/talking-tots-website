
# Načrt: Popravek mobilne postavitve - pravilno centriranje in raztegnitev

## Natančna analiza težav na sliki

### Težava 1: Vertikalni razmak je PREMAJHEN
Kamni so stisnjeni v spodnjo polovico zaslona. Razlog:
- `stoneHeight` je omejen na max 58px
- 8 kamnov × 58px = 464px
- Če je zaslon visok 700px, ostane samo ~50px za 7 razmakov = ~7px na razmak

**Popravek:** Odstraniti omejitev `stoneHeight` in pustiti, da se kamni raztegnejo čez celotno razpoložljivo višino.

### Težava 2: Horizontalna ASIMETRIJA
Levi stolpec je bližje levemu robu kot desni stolpec desnemu.

**Problem v kodi:**
```typescript
// Levi stolpec uporablja: offsetX = edgeMargin + stoneWidth/2
// Desni stolpec uporablja: containerSize.width - 25 - stoneWidth/2
// NAPAKA: "25" je hardkodirano namesto da bi uporabil edgeMargin!
```

**Popravek:** Uporabiti isto `edgeMargin` vrednost za obe strani.

---

## Popravki v calculatedSizes

```typescript
// MOBILE: U-shaped layout (3 columns x 8 rows)
const rows = 8;

// Calculate available space
const topCardHeight = 100;
const bottomButtonSpace = 100;
const availableHeight = containerSize.height - topCardHeight - bottomButtonSpace;
const availableWidth = containerSize.width;

// POPRAVEK 1: Večji razmak od robov za simetrijo
const edgeMargin = 35; // Večji margin od robov

// POPRAVEK 2: Kamni se raztegnejo čez celotno višino
// Najprej izračunaj razpoložljiv prostor, nato velikost kamnov
const maxStoneHeight = Math.floor(availableHeight / (rows + 2)); // Manjši kamni = več prostora za gapY
const stoneHeight = Math.min(maxStoneHeight, 50);
const stoneWidth = Math.floor(stoneHeight * 1.4);

// POPRAVEK 3: gapY se izračuna tako da zapolni celotno višino
const totalStonesHeight = stoneHeight * rows;
const gapY = Math.floor((availableHeight - totalStonesHeight) / (rows - 1));

// POPRAVEK 4: Simetrična horizontalna postavitev
const leftColumnCenter = edgeMargin + stoneWidth / 2;
const rightColumnCenter = availableWidth - edgeMargin - stoneWidth / 2;
const centerColumnCenter = availableWidth / 2;
const gapX = (rightColumnCenter - leftColumnCenter) / 2;

const dragonSize = Math.floor(stoneWidth * 1.2);

// Shrani vse tri pozicije stolpcev za uporabo v getStonePixelPosition
const columnCenters = [leftColumnCenter, centerColumnCenter, rightColumnCenter];

// Vertical offset - začni nad gumbom
const offsetY = bottomButtonSpace;
```

---

## Popravki v getStonePixelPosition

```typescript
// MOBILE: Uporabi izračunane pozicije stolpcev
// Ne več hardkodirane vrednosti!
const columnCenters = [
  edgeMargin + stoneWidth / 2,  // Levi stolpec
  containerSize.width / 2,       // Srednji stolpec
  containerSize.width - edgeMargin - stoneWidth / 2,  // Desni stolpec (POPRAVEK!)
];

return {
  left: columnCenters[stone.x] - stoneWidth / 2,
  bottom: offsetY + stone.y * gapY,
};
```

---

## Vizualizacija končnega rezultata

```text
+----------------------------------+
|     +------------------------+   |
|     |   Zbrane besede...    |   |  ← topCardHeight (100px)
|     +------------------------+   |
|                                  |
|    [RUMEN]   [SIV]   [RUMEN]    |  ← y=7 (zgornji 3)
|          ↑ gapY ↑                |
|    [RDEČ]           [RDEČ]      |  ← y=6
|          ↑ gapY ↑                |
|    [SIV]             [SIV]      |  ← y=5
|          ↑ gapY ↑                |
|    [ZELEN]         [ZELEN]      |  ← y=4
|          ↑ gapY ↑                |
|    [RUMEN]         [RUMEN]      |  ← y=3
|          ↑ gapY ↑                |
|    [RDEČ]           [RDEČ]      |  ← y=2
|          ↑ gapY ↑                |
|    [SIV]             [SIV]      |  ← y=1
|          ↑ gapY ↑                |
| 🐉 [SIV]   [ZELEN]   [SIV]      |  ← y=0 (spodnji 3)
|  ↑                         ↑     |
|  edgeMargin=35    edgeMargin=35 |  ← SIMETRIČNO!
|           +------+               |
|           |  ↑   |               |  ← bottomButtonSpace (100px)
|           +------+               |
| [HOME]                           |
+----------------------------------+
```

---

## Tehnični povzetek sprememb

| Lokacija | Trenutno | Popravek |
|----------|----------|----------|
| `edgeMargin` | 25px | 35px (več prostora od robov) |
| `stoneHeight` max | 58px | 50px (manjši kamni = večji gapY) |
| Desni stolpec | Hardkodirano `25` | Uporabi `edgeMargin` |
| `gapY` formula | Pravilna | Ostane enako, bo deloval z manjšimi kamni |
| `dragonSize` | 110% | 120% za boljšo vidljivost |

---

## Ključne točke

1. **Simetrija** - Obe strani uporabljata isto `edgeMargin` vrednost
2. **Vertikalna raztegnitev** - Manjši kamni = več prostora za gapY = raztegnitev navzgor
3. **Večji zmajček** - 120% velikosti kamna za boljšo vidljivost
4. **Konsistentna logika** - Ni več hardkodiranih vrednosti za pozicioniranje
