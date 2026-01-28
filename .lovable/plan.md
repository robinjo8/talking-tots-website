
# Načrt: Popravek mobilne postavitve - pravilno centriranje in poravnava

## Težave identificirane na sliki

1. **Grid ni centriran** - kamni so premaknjeni v levo
2. **Manjka srednji spodnji zeleni kamen** - spodaj bi morali biti 3 kamni v liniji (SIV, ZELEN, SIV)
3. **Zgornji 3 kamni niso poravnani** - manjka pravilna poravnava
4. **Premalo prostora med stolpcema** - gumb je preblizu kamnov

---

## 1. Posodobitev STONE_POSITIONS_MOBILE

Dodaj vizualni srednji zeleni kamen spodaj (y=0, x=1). Ta kamen **ni del poti** zmajčka, ampak je samo vizualni element za simetrijo:

```typescript
// Dodatni vizualni kamni za simetrijo (niso del poti)
const MOBILE_DECORATIVE_STONES: StonePosition[] = [
  { x: 1, y: 0, type: 'green', isRest: false }, // Spodnji srednji
];
```

---

## 2. Popravek calculatedSizes za mobilno verzijo

Glavna težava je v izračunu `offsetX` in `gapX`. Potrebujemo:

```typescript
// MOBILE: 3-column layout, properly centered
const columns = 3;
const rows = 8;

// Izračunaj razpoložljivo višino (med karticami besed in gumbom)
const topCardHeight = 130; // Prostor za kartice besed zgoraj
const bottomButtonSpace = 110; // Prostor za gumb spodaj
const availableHeight = containerSize.height - topCardHeight - bottomButtonSpace;
const availableWidth = containerSize.width - 60; // Padding levo/desno

// Izračunaj velikost kamnov glede na višino
const maxStoneHeight = Math.floor(availableHeight / rows * 0.85);
const stoneHeight = Math.min(maxStoneHeight, 45); // Max 45px višine
const stoneWidth = Math.floor(stoneHeight * 1.4); // Razmerje 1.4:1

// Razmik med kamni
const gapY = Math.floor((availableHeight - stoneHeight * rows) / (rows - 1));

// Horizontalni razmik - trije stolpci, razporejeni enakomerno
// Levi stolpec (x=0), sredina (x=1), desni stolpec (x=2)
const gapX = Math.floor(availableWidth / 2); // Polovica širine med stolpci

// Izračunaj offset za centriranje celotnega grida
const totalGridWidth = 2 * gapX; // Od x=0 do x=2
const offsetX = (containerSize.width - totalGridWidth) / 2;

// Vertikalni offset - centriranje z upoštevanjem gumba
const totalGridHeight = (rows - 1) * gapY + stoneHeight * rows;
const offsetY = bottomButtonSpace + (availableHeight - totalGridHeight) / 2 + stoneHeight;
```

---

## 3. Popravek getStonePixelPosition za pravilno centriranje

```typescript
// MOBILE: Properly centered columns
return {
  left: offsetX + stone.x * gapX - stoneWidth / 2, // Center each stone
  bottom: offsetY + stone.y * gapY,
};
```

---

## 4. Renderiranje dodatnih dekorativnih kamnov

V JSX del za mobilno verzijo dodaj:

```tsx
{/* Dekorativni srednji zeleni kamen spodaj */}
{isMobile && (
  <div
    className="absolute"
    style={{
      left: offsetX + 1 * gapX - stoneWidth / 2,
      bottom: offsetY,
      width: stoneWidth,
      height: stoneHeight,
    }}
  >
    <img
      src={STONE_IMAGES.green}
      alt="Dekorativni kamen"
      className="w-full h-full object-contain drop-shadow-lg opacity-60"
    />
  </div>
)}
```

---

## 5. Vizualizacija končnega rezultata

```text
+----------------------------------+
|     +------------------------+   |
|     | [KOZA] [RIŠE] [KROG]  |   |  ← Kartice besed (zgoraj)
|     +------------------------+   |
|                                  |
|  [RUMEN]   [SIV]     [RUMEN]    |  ← y=7 (zgornji 3 v liniji)
|                                  |
|  [RDEČ]              [RDEČ]     |  ← y=6
|                                  |
|  [SIV]                [SIV]     |  ← y=5
|                                  |
|  [ZELEN]            [ZELEN]     |  ← y=4 (rest)
|                                  |
|  [RUMEN]            [RUMEN]     |  ← y=3
|                                  |
|  [RDEČ]              [RDEČ]     |  ← y=2
|                                  |
|  [SIV]               [SIV]      |  ← y=1
|                                  |
|🐉[SIV]    [ZELEN]    [SIV]      |  ← y=0 (spodnji 3 v liniji)
|                                  |
|           +------+               |
|           |  ↑   |               |  ← Gumb (sredina)
|           +------+               |
| [HOME]                           |
+----------------------------------+
```

---

## 6. Tehnični povzetek sprememb

| Komponenta | Sprememba |
|------------|-----------|
| `calculatedSizes` | Nov izračun offsetX, gapX za pravilno centriranje 3 stolpcev |
| `getStonePixelPosition` | Centriranje posameznega kamna s `- stoneWidth/2` |
| JSX | Dodaten dekorativni zeleni kamen na sredini spodaj |
| Desktop | **BREZ SPREMEMB** |

---

## Ključne točke popravkov

1. **Pravilno centriranje** - `offsetX` izračunan tako, da je grid horizontalno sredinan
2. **Trije stolpci enakomerno razporejeni** - `gapX` je polovica razpoložljive širine
3. **Spodnja vrstica 3 kamni** - dodan dekorativni zeleni kamen na (x=1, y=0)
4. **Zgornja vrstica 3 kamni** - že obstajajo v definiciji (y=7, x=0,1,2)
5. **Grid nad gumbom** - `offsetY` pravilno izračunan z upoštevanjem prostora za gumb
6. **Odziven dizajn** - vsi izračuni relativni na `containerSize`
