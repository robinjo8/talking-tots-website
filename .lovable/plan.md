
## Spremembe puščic, START polja in KONEC slike

### 1. `src/data/kaceLestveConfig.ts` — nova postavitev puščic

**LADDERS** (modre):
- `3: 12` → `3: 11`
- `26: 37` → `26: 38`
- `6: 18` in `15: 30` ostaneta

**SNAKES** (rdeče):
- `40: 31` → `40: 34`
- `24: 10` → `24: 14`
- `21: 5` ostane
- Nova puščica: `34: 28` (rdeča kača)

---

### 2. `src/components/games/KaceLestveBoard.tsx` — 4 popravki

#### A) Posodobi `ARROW_OFFSETS` ključe

Ker se cilji puščic spremenijo, moramo posodobiti ključe v `ARROW_OFFSETS`:

```typescript
const ARROW_OFFSETS: Record<string, ArrowOffsets> = {
  // Ladders (blue, up)
  "3-11":  { endX: 0.32 },    // end right of 11 (was 3-12)
  "15-30": { startX: 0.32 },  // start right of 15 (nespremenjen)
  // Snakes (red, down)
  "24-14": { endX: -0.32 },   // end left of 14 (was 24-10)
  "40-34": { endX: -0.32 },   // end left of 34 (was 40-31)
  "34-28": { endX: -0.32 },   // end left of 28 (nova)
};
```

#### B) START polje — odstrani raketo in modro "1"

V `isStartLabel` bloku:
- Odstrani `🚀` emoji iz teksta
- Številka 1 se prikaže samo za navadna polja (`!cell.isStart && !cell.isEnd`), torej je START polje že pokrito — razlog zakaj se vidi "1" je ker `isStartLabel` je samo za `pos === 1` ampak `isStartBlank` je za `pos === 2`. Številka se prikaže ker `!cell.isStart` je false za obe — torej se ne prikaže. 

Preverim: blok za "Regular cell number" ima pogoj `{!cell.isStart && !cell.isEnd && ...}` — torej se `1` NE prikaže za START polje. 

Toda v `isStartLabel` bloku je tekst `🚀 ZAČETEK` — samo to je vidno. Torej: **raketa 🚀 je v tekstu samem**. Enostavno odstranimo emoji:

```tsx
// Prej:
🚀 ZAČETEK
// Potem:
ZAČETEK
```

#### C) KONEC slika — popravi bucket URL

Trenutno: `${SUPABASE_URL}/slike/Cilj.webp`  
Pravilno: `${SUPABASE_URL}/slike-ostalo/Cilj.webp`

```tsx
<img
  src={`${SUPABASE_URL}/slike-ostalo/Cilj.webp`}
  alt="Cilj"
  className="w-full h-full object-contain"
  style={{ padding: '4px' }}
/>
```

#### D) Dodaj novo rdečo puščico 34→28 v SVG render

Nova kača `34: 28` bo samodejno prikazana ker se renderira iz `SNAKES` objekta prek `snakeEntries`. Ni potrebno posebej dodajati — samo posodobiti `SNAKES` v config datoteki zadošča.

`curveSide` logika za kače: `from === 40 ? 1 : i % 2 === 0 ? -1 : 1` — nova puščica bo dobila `curveSide` glede na njen index v polju. Ker bo `34: 28` 4. kača (index 3), bo `i % 2 === 1 → curveSide = 1`.

---

### Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | LADDERS: `3→11`, `26→38`. SNAKES: `40→34`, `24→14`, nova `34→28` |
| `src/components/games/KaceLestveBoard.tsx` | (1) ARROW_OFFSETS ključi posodobljeni, (2) Odstrani 🚀 iz ZAČETEK, (3) URL slike Cilj: `/slike-ostalo/` |
