

# Načrt: Popravek mobilne postavitve - 4 konkretne spremembe

## Tvoje zahteve

1. **Igra bolj na sredini zaslona** - vertikalno centriranje
2. **Kamni se začnejo nad gumbom** - spodnji kamni tik nad gumbom
3. **Simetrično od leve in desne** - enako `edgeMargin` na obeh straneh
4. **Razmak med kamni v višino = 30px** - fiksna vrednost namesto dinamične

---

## Trenutno stanje vs. zahteve

| Element | Trenutno | Zahtevano |
|---------|----------|-----------|
| `gapY` | Dinamičen (~14-20px) | Fiksnih **30px** |
| Vertikalno | Stisnjen spodaj | **Centrirano** |
| Horizontalno | edgeMargin = 35px obojestransko | Ostane enako (OK) |
| Začetek | `offsetY = bottomButtonSpace` (100px) | **Nad gumbom** |

---

## Popravki v `calculatedSizes`

```typescript
// MOBILE: U-shaped layout (3 columns x 8 rows)
const rows = 8;

// ZAHTEVA 4: Fiksni razmak med kamni v višino
const gapY = 30; // FIKSNO 30px

// Izračunaj velikost kamnov glede na razpoložljiv prostor
// Celotna višina grida = 8 kamnov + 7 razmakov (7 × 30px = 210px)
const bottomButtonSpace = 110; // Prostor za gumb
const topCardHeight = 100; // Prostor za kartice besed
const availableHeight = containerSize.height - topCardHeight - bottomButtonSpace;

// Višina kamnov se izračuna iz preostalega prostora
// totalGridHeight = stoneHeight × 8 + gapY × 7
// totalGridHeight = stoneHeight × 8 + 210
// Želimo da je grid centriran, torej:
const totalGapsHeight = gapY * (rows - 1); // 7 × 30 = 210px
const remainingForStones = availableHeight - totalGapsHeight;
const stoneHeight = Math.floor(remainingForStones / rows);
const stoneWidth = Math.floor(stoneHeight * 1.4);

// Celotna višina grida
const totalGridHeight = stoneHeight * rows + totalGapsHeight;

// ZAHTEVA 1 & 2: Vertikalno centriranje + začetek nad gumbom
// offsetY = prostor od spodaj do prvega kamna
const verticalPadding = (availableHeight - totalGridHeight) / 2;
const offsetY = bottomButtonSpace + verticalPadding;

// ZAHTEVA 3: Simetrično od leve in desne (že OK)
const edgeMargin = 35;
const leftColumnCenter = edgeMargin + stoneWidth / 2;
const rightColumnCenter = containerSize.width - edgeMargin - stoneWidth / 2;
const centerColumnCenter = containerSize.width / 2;

const dragonSize = Math.floor(stoneWidth * 1.2);
```

---

## Vizualizacija končnega rezultata

```text
+----------------------------------+
|     +------------------------+   |
|     |   Zbrane besede...    |   |  ← topCardHeight (100px)
|     +------------------------+   |
|                                  |
|         ↑ verticalPadding ↑      |  ← CENTRIRANJE
|                                  |
|    [RUMEN]   [SIV]   [RUMEN]    |  ← y=7 (zgornji 3)
|              ↑ 30px ↑            |
|    [RDEČ]           [RDEČ]      |  ← y=6
|              ↑ 30px ↑            |
|    [SIV]             [SIV]      |  ← y=5
|              ↑ 30px ↑            |
|    [ZELEN]         [ZELEN]      |  ← y=4
|              ↑ 30px ↑            |
|    [RUMEN]         [RUMEN]      |  ← y=3
|              ↑ 30px ↑            |
|    [RDEČ]           [RDEČ]      |  ← y=2
|              ↑ 30px ↑            |
|    [SIV]             [SIV]      |  ← y=1
|              ↑ 30px ↑            |
| 🐉 [SIV]   [ZELEN]   [SIV]      |  ← y=0 (spodnji 3)
|                                  |
|         ↓ verticalPadding ↓      |  ← CENTRIRANJE
|                                  |
|           +------+               |
|           |  ↑   |               |  ← Gumb (bottomButtonSpace)
|           +------+               |
| [HOME]                           |
+----------------------------------+
     ↑                        ↑
  edgeMargin=35         edgeMargin=35
```

---

## Tehnični povzetek sprememb

| Sprememba | Vrednost |
|-----------|----------|
| `gapY` | Fiksnih **30px** (namesto dinamičen) |
| `stoneHeight` | Izračunan iz preostalega prostora |
| `offsetY` | `bottomButtonSpace + verticalPadding` (CENTRIRANJE) |
| `edgeMargin` | 35px (enako na obeh straneh - že OK) |
| `dragonSize` | 120% velikosti kamna |

---

## Datoteka za spremembo

`src/components/games/PonoviPovedGame.tsx` - samo `calculatedSizes` useMemo hook (vrstice ~313-360)

