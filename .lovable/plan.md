

# Načrt: Popravki mobilne postavitve za igro "Ponovi Poved"

## Pregled zahtev

Uporabnik želi naslednje popravke za mobilno verzijo:
1. Vse skupaj centrirati vertikalno in horizontalno
2. Povečati in raztegniti navzgor in v širino
3. Spodnji trije kamni v isti liniji
4. Zgornji trije kamni v isti liniji
5. Zmajček začne v levem spodnjem kotu (SIV kamen)
6. Slike se prikazujejo samo za 1., 2. in 3. besedo - nato pop-up
7. Gumb na sredini

---

## 1. Nova struktura mobilne poti

Glede na sliko, potrebujemo enostavnejšo strukturo:

```text
Zgornja vrstica (3 kamni v liniji):
+-------+    +-------+    +-------+
| RUMEN |    | ZELEN |    | RUMEN |
+-------+    +-------+    +-------+
   (y=7)       (y=7)        (y=7)
   x=0         x=1          x=2

Levi stolpec (y=0-6):    Desni stolpec (y=0-6):
   RUMEN  y=6               RUMEN  y=6
   RDEČ   y=5               RDEČ   y=5
   SIV    y=4               SIV    y=4  ← zmajček se obrne
   ZELEN  y=3               ZELEN  y=3
   RUMEN  y=2               RUMEN  y=2
   RDEČ   y=1               RDEČ   y=1
🐉 SIV    y=0 (START)       SIV    y=0  (CILJ)

Spodnja vrstica (3 kamni v liniji):
+-------+    +-------+    +-------+
|  SIV  |    | ZELEN |    |  SIV  |
+-------+    +-------+    +-------+
   (y=0)       (y=0)        (y=0)
   x=0         x=1          x=2
```

### Nova definicija poti:

```typescript
const STONE_POSITIONS_MOBILE: StonePosition[] = [
  // START - levi spodnji siv kamen (zmajček začne tukaj)
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Sentence 1: Levi stolpec navzgor (3 besede + 1 rest)
  { x: 0, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 0, y: 2, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 0, y: 3, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 0, y: 4, type: 'gray', isRest: true, sentenceIndex: 0 },  // Pop-up za poved 1
  
  // Sentence 2: Nadaljuj navzgor in prečkaj na vrhu (3 besede + 1 rest)
  { x: 0, y: 5, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 0, y: 6, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 0, y: 7, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },  // Zgornji levi
  { x: 1, y: 7, type: 'gray', isRest: true, sentenceIndex: 1 },  // Zgornji srednji - Pop-up za poved 2
  
  // Sentence 3: Desna stran navzdol (3 besede + 1 rest)
  { x: 2, y: 7, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 0 },  // Zgornji desni
  { x: 2, y: 6, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 2, y: 5, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 2, y: 4, type: 'gray', isRest: true, sentenceIndex: 2 },  // Zmajček se obrne - Pop-up za poved 3
  
  // Sentence 4: Nadaljuj navzdol (3 besede + cilj)
  { x: 2, y: 3, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 2, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 2, y: 1, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  { x: 2, y: 0, type: 'gray', isRest: true, sentenceIndex: 3 },  // CILJ - Pop-up za poved 4
];
```

---

## 2. Posodobitev calculatedSizes za mobilno verzijo

```typescript
// MOBILE: Improved U-shaped layout (3 columns x 8 rows)
const columns = 3;
const rows = 8; // y from 0 to 7

const availableWidth = containerSize.width - 40; // padding
const availableHeight = containerSize.height - 180; // space for word cards + button

// Calculate stone size - larger for better visibility
const sizeByWidth = Math.floor(availableWidth / columns / 1.3);
const sizeByHeight = Math.floor(availableHeight / rows / 1.1);

const stoneWidth = Math.min(sizeByWidth, sizeByHeight, 55); // Slightly larger
const stoneHeight = Math.floor(stoneWidth * 0.75);

// Gaps - adjusted for proper centering
const totalStoneWidth = stoneWidth * 3;
const gapX = Math.floor((availableWidth - totalStoneWidth) / 2);
const gapY = Math.floor((availableHeight - stoneHeight * rows) / (rows - 1));

const dragonSize = Math.floor(stoneWidth * 0.9);

// Center the grid both horizontally and vertically
const totalGridWidth = stoneWidth * 3 + gapX * 2;
const totalGridHeight = stoneHeight * rows + gapY * (rows - 1);

const offsetX = Math.floor((containerSize.width - totalGridWidth) / 2) + stoneWidth / 2;
const offsetY = Math.floor((containerSize.height - totalGridHeight) / 2) - 40; // Button space
```

---

## 3. Posodobitev getStonePixelPosition za mobilno verzijo

```typescript
// MOBILE: Simple column layout - y from 0 to 7
return {
  left: offsetX + stone.x * gapX,
  bottom: offsetY + stone.y * gapY,
};
```

Odstrani `adjustedY = stone.y + 1` ker zdaj nimamo negativnih y vrednosti.

---

## 4. Posodobitev getDragonImage za zmajčka

```typescript
// MOBILE: U-shaped path logic
// Levi stolpec (x=0): gre NAVZGOR → gleda desno
if (stone.x === 0) return DRAGON_RIGHT;

// Zgornja sredina (x=1, y=7): prečka → gleda desno
if (stone.x === 1 && stone.y === 7) return DRAGON_RIGHT;

// Desni stolpec (x=2): 
// - Na zgornjem desnem (y=7): še gleda desno (ravnokar prečkal)
// - Na sivem rest kamnu (y=4) se obrne in gleda levo
// - Vse pod y=4: gleda levo
if (stone.x === 2) {
  if (stone.y === 7) return DRAGON_RIGHT; // Ravnokar prečkal
  return DRAGON_LEFT; // Gre navzdol, gleda levo
}

return DRAGON_RIGHT;
```

---

## 5. Logika prikaza slik (že deluje pravilno)

Preveril sem kodo in logika je pravilna:
- Slike se prikazujejo ko `nextStone.wordIndex !== undefined` (besede 0, 1, 2)
- Ko zmajček pride na `isRest: true` kamen, se prikaže pop-up dialog

Ta logika je v `handleNext` funkciji (vrstica 554-564) in ostane nespremenjena.

---

## 6. Vizualizacija končnega rezultata

```text
+----------------------------------+
|     +------------------------+   |
|     | [KOZA] [RIŠE] [KROG]  |   |  ← Slike besed
|     +------------------------+   |
|                                  |
|  [RUMEN]   [ZELEN]   [RUMEN]    |  ← y=7 (zgornja vrstica)
|                                  |
|  [RDEČ]              [RDEČ]     |  ← y=6
|                                  |
|  [SIV]                [SIV]     |  ← y=5
|                                  |
|  [ZELEN]            [ZELEN]     |  ← y=4 (rest stones)
|                                  |
|  [RUMEN]            [RUMEN]     |  ← y=3
|                                  |
|  [RDEČ]              [RDEČ]     |  ← y=2
|                                  |
|  [SIV]               [SIV]      |  ← y=1
|                                  |
|🐉[SIV]    [ZELEN]    [SIV]      |  ← y=0 (spodnja vrstica)
|                                  |
|           +------+               |
|           |  ↑   |               |  ← Gumb na sredini
|           +------+               |
|                                  |
| [HOME]                           |
+----------------------------------+
```

---

## 7. Tehnični povzetek sprememb

| Komponenta | Sprememba |
|------------|-----------|
| `STONE_POSITIONS_MOBILE` | Nova pot brez negativnih y, začetek na (0,0) |
| `calculatedSizes` (mobile) | Boljše centriranje, 3 stolpci x 8 vrstic |
| `getStonePixelPosition` | Odstranjen `adjustedY`, enostavna formula |
| `getDragonImage` | Zmajček se obrne na desnem sivem kamnu (x=2, y=4) |
| Desktop verzija | **BREZ SPREMEMB** |

---

## 8. Popravek srednje vrstice

Ker želimo spodnje in zgornje tri kamne v isti liniji, rabimo dodati še srednji zelen kamen spodaj:

```typescript
// V STONE_POSITIONS_MOBILE dodaj na konec:
// Spodnji srednji zelen kamen ni del poti, je samo vizualni element
// Lahko ga narišemo posebej ali pa preskočimo

// ALTERNATIVA: Lahko prilagodimo pot tako, da je spodnji srednji kamen del poti
// Na primer kot finalni kamen po 4. povedi
```

Glede na sliko bom dodal spodnji srednji zelen kamen kot vizualni element, ki ni del poti zmajčka.

