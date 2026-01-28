
# Načrt: Nova mobilna postavitev U-oblike za igro "Ponovi Poved"

## Pregled sprememb

Potrebno je popolnoma spremeniti mobilno postavitev kamnov iz sedanje cik-cak oblike v U-obliko, kot je prikazano na referenčni sliki. Desktop verzija ostane nespremenjena.

---

## 1. Nova struktura poti kamnov (U-oblika)

Pot gre po naslednjih korakih (17 kamnov skupaj + START):

```text
                    Zgoraj sredina
                   +-----------+
                   |   ZELEN   |
                   +-----------+
                   /             \
  LEVA STRAN      /               \      DESNA STRAN
  (od spodaj gor)                       (od zgoraj dol)
  
  RUMEN  y=6                              y=6  RUMEN
  RDEČ   y=5                              y=5  RDEČ  
  SIV    y=4  <-- zmajček se obrne        y=4  SIV
  ZELEN  y=3                              y=3  ZELEN
  RUMEN  y=2                              y=2  RUMEN
  RDEČ   y=1                              y=1  RDEČ
  SIV    y=0 (START🐉)                    y=0  SIV
                   \             /
                   +-----------+
                   |   ZELEN   |  <- spodaj sredina
                   +-----------+
                  (gumb na sredini)
```

### Koordinatni sistem (x, y):
- **Levi stolpec (x=0)**: y od 0 do 6 (7 kamnov)
- **Sredina zgoraj (x=1, y=7)**: 1 zelen kamen
- **Desni stolpec (x=2)**: y od 6 do 0 (7 kamnov, navzdol)
- **Sredina spodaj (x=1, y=-1)**: 1 zelen kamen (START pozicija)

---

## 2. Definicija nove STONE_POSITIONS_MOBILE

```typescript
// MOBILE: U-shaped path - left column UP, across top, right column DOWN
const STONE_POSITIONS_MOBILE: StonePosition[] = [
  // START - bottom center green stone
  { x: 1, y: -1, type: 'green', isRest: false },
  
  // Sentence 1: Left column - going UP (3 word stones + 1 rest)
  { x: 0, y: 0, type: 'gray', isRest: false, sentenceIndex: 0, wordIndex: 0 },   // 1st word
  { x: 0, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },    // 2nd word
  { x: 0, y: 2, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 2 }, // 3rd word
  { x: 0, y: 3, type: 'green', isRest: true, sentenceIndex: 0 },                 // Repeat sentence 1
  
  // Sentence 2: Continue left column UP + cross to top (3 word stones + 1 rest)
  { x: 0, y: 4, type: 'gray', isRest: false, sentenceIndex: 1, wordIndex: 0 },   // 1st word
  { x: 0, y: 5, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 1 },    // 2nd word
  { x: 0, y: 6, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 2 }, // 3rd word
  { x: 1, y: 7, type: 'green', isRest: true, sentenceIndex: 1 },                 // Top center - Repeat sentence 2
  
  // Sentence 3: Right column - going DOWN (3 word stones + 1 rest)
  { x: 2, y: 6, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 0 }, // 1st word
  { x: 2, y: 5, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 1 },    // 2nd word
  { x: 2, y: 4, type: 'gray', isRest: true, sentenceIndex: 2 },                  // Repeat sentence 3 (zmajček se obrne)
  
  // Sentence 4: Continue right column DOWN (3 word stones + finish)
  { x: 2, y: 3, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 0 },  // 1st word
  { x: 2, y: 2, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 1 }, // 2nd word
  { x: 2, y: 1, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 2 },    // 3rd word
  { x: 2, y: 0, type: 'gray', isRest: true, sentenceIndex: 3 },                  // GOAL - Repeat sentence 4
];
```

---

## 3. Prilagoditev izračuna velikosti za mobilno verzijo

```typescript
// MOBILE: U-shaped layout (3 columns x 9 rows including top/bottom center)
const columns = 3;
const rows = 9; // y from -1 to 7

const availableWidth = containerSize.width - 40; // padding
const availableHeight = containerSize.height - 200; // space for word cards at top + button at bottom

// Calculate stone size to fit the grid
const sizeByWidth = Math.floor(availableWidth / columns / 1.4);
const sizeByHeight = Math.floor(availableHeight / rows / 1.2);

const stoneWidth = Math.min(sizeByWidth, sizeByHeight, 70);
const stoneHeight = Math.floor(stoneWidth * 0.75);

// Gaps between stones
const gapX = Math.floor((availableWidth - stoneWidth * 3) / 2); // horizontal gap
const gapY = Math.floor(stoneHeight * 1.1); // vertical gap

// Offsets to center the grid
const offsetX = Math.floor((containerSize.width - (2 * gapX + stoneWidth * 3)) / 2);
const offsetY = Math.floor(stoneHeight * 1.5); // space at bottom for button
```

---

## 4. Prilagoditev getStonePixelPosition za negativne y vrednosti

```typescript
const getStonePixelPosition = (index: number) => {
  const stone = STONE_POSITIONS[index];
  
  if (!isMobile) {
    // Desktop logic - unchanged
    let extraYOffset = 0;
    if (stone.y === 1) extraYOffset = gapY * 0.3;
    else if (stone.y === 2) extraYOffset = gapY * 0.5;
    
    return {
      left: offsetX + stone.x * gapX,
      bottom: offsetY + stone.y * gapY + extraYOffset,
    };
  }
  
  // MOBILE: Handle y from -1 to 7 (shift by +1 for bottom calculation)
  const adjustedY = stone.y + 1; // Shift so -1 becomes 0
  
  return {
    left: offsetX + stone.x * gapX,
    bottom: offsetY + adjustedY * gapY,
  };
};
```

---

## 5. Prilagoditev logike obračanja zmajčka

Zmajček se obrne na sivem kamnu desno zgoraj (x=2, y=4 - to je rest stone za sentence 3):

```typescript
const getDragonImage = useCallback(() => {
  const stone = STONE_POSITIONS[dragonPosition];
  if (!stone) return DRAGON_RIGHT;
  
  if (!isMobile) {
    // Desktop logic - unchanged
    // ...
  }
  
  // MOBILE: U-shaped path logic
  // Left column (x=0): going UP → facing right
  if (stone.x === 0) return DRAGON_RIGHT;
  
  // Top center (x=1, y=7): facing right (crossing to right side)
  if (stone.x === 1 && stone.y === 7) return DRAGON_RIGHT;
  
  // Right column (x=2): going DOWN → facing left
  // Dragon turns left at gray rest stone (y=4) and continues facing left
  if (stone.x === 2) return DRAGON_LEFT;
  
  // Bottom center (x=1, y=-1): START position → facing right
  if (stone.x === 1 && stone.y === -1) return DRAGON_RIGHT;
  
  return DRAGON_RIGHT;
}, [dragonPosition, isMobile, STONE_POSITIONS]);
```

---

## 6. Premik gumba na sredino

Gumb je že na sredini (`left-1/2 transform -translate-x-1/2`), samo je potrebno preveriti, da je pravilno pozicioniran glede na nov grid:

```tsx
{/* MOBILE: Center jump button */}
<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
  <JumpButton 
    onClick={handleNext} 
    disabled={isJumping || phase === "complete" || showSentenceDialog}
    size={80} // Slightly smaller for mobile
  />
</div>
```

---

## 7. Vizualizacija končnega rezultata (mobilna verzija)

```text
+----------------------------------+
|     +------------------------+   |
|     | [KOZA] [RIŠE] [KROG]  |   |  <- Word cards (unchanged)
|     +------------------------+   |
|                                  |
|  [RUMEN]            [RUMEN]     |  y=6
|                                  |
|  [RDEČ]              [RDEČ]     |  y=5
|                                  |
|  [SIV]  <-(obrne)    [SIV]      |  y=4  (rest stones)
|                                  |
|  [ZELEN]            [ZELEN]     |  y=3  (rest stones)
|                                  |
|  [RUMEN]            [RUMEN]     |  y=2
|                                  |
|  [RDEČ]              [RDEČ]     |  y=1
|                                  |
|  [SIV]               [SIV]      |  y=0
|                                  |
|         🐉[ZELEN]               |  y=-1 (START)
|                                  |
|           +------+               |
|           |  ↑   |               |  <- Jump button (center)
|           +------+               |
|                                  |
| [HOME]                           |
+----------------------------------+
```

---

## Tehnični povzetek sprememb

| Komponenta | Sprememba |
|------------|-----------|
| `STONE_POSITIONS_MOBILE` | Nova U-oblika z 16 kamni (3 stolpci, y od -1 do 7) |
| `calculatedSizes` (mobile) | Prilagojeno za 3 stolpce x 9 vrstic |
| `getStonePixelPosition` | Podpora za negativne y vrednosti |
| `getDragonImage` | Zmajček se obrne na desnem sivem kamnu (x=2, y=4) |
| Gumb | Ostane na sredini, morda manjši (80px) |
| Desktop verzija | **BREZ SPREMEMB** |

---

## Ključne točke

1. **Barve kamnov ustrezajo sliki** - levi/desni stolpec: siv-rdeč-rumen-zelen-siv-rdeč-rumen
2. **Zelen kamen na sredini spodaj** - START pozicija
3. **Zelen kamen na sredini zgoraj** - povezuje levi in desni stolpec
4. **Zmajček se obrne na desnem sivem kamnu** (y=4) - to je rest stone za sentence 3
5. **Gumb na sredini** - med levim in desnim stolpcem
6. **Odzivna postavitev** - prilagaja se vsem velikostim mobilnih zaslonov
