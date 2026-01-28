
# Načrt: Popravek vertikalnega centriranja - PRAVILNA FORMULA

## Analiza problema

Na sliki je jasno vidno, da je grid stisnjen v spodnjo polovico zaslona. Zgoraj je ogromno praznega prostora.

### Napaka v trenutni kodi

Trenutna logika v `calculatedSizes`:
```typescript
const totalGridHeight = stoneHeight * rows + totalGapsHeight;  // 8 kamnov + 7 razmakov
const verticalPadding = (availableHeight - totalGridHeight) / 2;
const offsetY = bottomButtonSpace + verticalPadding;
```

**Problem:** `verticalPadding` je skoraj 0, ker:
- `availableHeight` ≈ 700 - 100 - 110 = 490px
- `stoneHeight` = (490 - 210) / 8 = 35px
- `totalGridHeight` = 35 × 8 + 210 = 280 + 210 = 490px
- `verticalPadding` = (490 - 490) / 2 = 0px

**Rezultat:** `offsetY = 110 + 0 = 110px` - grid se začne tik nad gumbom in zasede samo spodnjo polovico zaslona.

### Zakaj ne zapolni celotnega prostora?

Formula `stone.y * gapY` z fiksnim `gapY = 30px` pomeni:
- y=0: bottom = 110px
- y=7: bottom = 110 + 210 = 320px

Zgornji kamen je na 320px od spodaj, kar je manj kot polovica zaslona (~350px).

---

## Rešitev: Dinamičen gapY namesto fiksnega

Namesto fiksnega `gapY = 30px` moramo izračunati `gapY` tako, da grid zapolni celotno razpoložljivo višino!

### Nova logika

```typescript
// MOBILE: U-shaped layout
const rows = 8;

// Prostor za UI elemente
const topCardHeight = 80;     // Zmanjšano - kartice besed
const bottomButtonSpace = 100; // Gumb + home menu
const availableHeight = containerSize.height - topCardHeight - bottomButtonSpace;

// Fiksna velikost kamnov (npr. 45px)
const stoneHeight = 45;
const stoneWidth = Math.floor(stoneHeight * 1.4); // 63px

// KLJUČNO: gapY se izračuna tako da zapolni celoten prostor
// Grid gre od y=0 do y=7, torej 7 razmakov
// availableHeight = stoneHeight + 7 * gapY (približno, odvisno od pozicioniranja)
// Pravilna formula: razpoložljiva višina za razmake = availableHeight - stoneHeight
const gapY = Math.floor((availableHeight - stoneHeight) / (rows - 1));

// offsetY = začetek grida tik nad gumbom
const offsetY = bottomButtonSpace;
```

### Primer izračuna

Za zaslon višine 700px:
- `availableHeight` = 700 - 80 - 100 = 520px
- `stoneHeight` = 45px
- `gapY` = (520 - 45) / 7 = 475 / 7 = **67px**

Pozicije kamnov:
- y=0: bottom = 100px
- y=1: bottom = 100 + 67 = 167px
- y=2: bottom = 100 + 134 = 234px
- ...
- y=7: bottom = 100 + 469 = 569px

Zgornji rob zgornjega kamna: 569 + 45 = 614px
To je blizu vrha zaslona (700 - 80 = 620px za kartice)!

---

## Vizualizacija končnega rezultata

```text
+----------------------------------+
|     +------------------------+   |  ← topCardHeight (80px)
|     |   Zbrane besede...    |   |
|     +------------------------+   |
|                                  |
|    [RUMEN]   [SIV]   [RUMEN]    |  ← y=7 (zgornji 3)
|              ↑ ~67px ↑           |  ← DINAMIČEN gapY
|    [RDEČ]           [RDEČ]      |  ← y=6
|              ↑ ~67px ↑           |
|    [SIV]             [SIV]      |  ← y=5
|              ↑ ~67px ↑           |
|    [ZELEN]         [ZELEN]      |  ← y=4
|              ↑ ~67px ↑           |
|    [RUMEN]         [RUMEN]      |  ← y=3
|              ↑ ~67px ↑           |
|    [RDEČ]           [RDEČ]      |  ← y=2
|              ↑ ~67px ↑           |
|    [SIV]             [SIV]      |  ← y=1
|              ↑ ~67px ↑           |
| 🐉 [SIV]   [ZELEN]   [SIV]      |  ← y=0 (spodnji 3)
|                                  |
|           +------+               |  ← bottomButtonSpace (100px)
|           |  ↑   |               |
|           +------+               |
| [HOME]                           |
+----------------------------------+
```

---

## Spremembe v kodi

### Datoteka: `src/components/games/PonoviPovedGame.tsx`

#### 1. Posodobitev `calculatedSizes` (vrstice ~313-360)

```typescript
// MOBILE: U-shaped layout (3 columns x 8 rows)
const rows = 8;

// Prostor za UI elemente
const topCardHeight = 80;
const bottomButtonSpace = 100;
const availableHeight = containerSize.height - topCardHeight - bottomButtonSpace;
const availableWidth = containerSize.width;

// Fiksna velikost kamnov
const stoneHeight = 45;
const stoneWidth = Math.floor(stoneHeight * 1.4);

// DINAMIČEN gapY - raztegne grid čez celoten razpoložljiv prostor
const gapY = Math.floor((availableHeight - stoneHeight) / (rows - 1));

// offsetY = tik nad gumbom
const offsetY = bottomButtonSpace;

// Simetrična horizontalna postavitev
const edgeMargin = 35;
const leftColumnCenter = edgeMargin + stoneWidth / 2;
const rightColumnCenter = availableWidth - edgeMargin - stoneWidth / 2;
const centerColumnCenter = availableWidth / 2;
const gapX = (rightColumnCenter - leftColumnCenter) / 2;

const dragonSize = Math.floor(stoneWidth * 1.2);
const offsetX = leftColumnCenter;
```

---

## Ključne spremembe

| Element | Prej | Zdaj |
|---------|------|------|
| `gapY` | Fiksno 30px | **Dinamičen** (~67px na 700px zaslonu) |
| `stoneHeight` | Dinamičen | **Fiksno 45px** |
| `offsetY` | Kompleksen izračun s `verticalPadding` | **Enostavno:** `bottomButtonSpace` |
| `topCardHeight` | 100px | **80px** (več prostora za grid) |

Grid bo zdaj zapolnil celoten prostor od gumba do kartic besed!
