
## Popravki: puščica 33→27 in zakrivitev 15→29 v levo

### Spremembe v 2 datotekah

---

### 1. `src/data/kaceLestveConfig.ts`

V SNAKES objektu zamenjamo `34: 28` z `33: 27`:

```typescript
export const SNAKES: Record<number, number> = {
  40: 34,
  21: 5,
  24: 14,
  33: 27,   // <-- was 34: 28
};
```

---

### 2. `src/components/games/KaceLestveBoard.tsx`

#### A) ARROW_OFFSETS — posodobi ključ in vrednosti za 33→27

Stari ključ `"34-28"` zamenjamo z `"33-27"`.

Zahteva: začne se **spodaj pod 33** (na sredini spodnje strani), konča se **zgoraj nad 27** (na sredini zgornje strani).

- Privzeto za kačo: start ima `+edgeOffset` (pod centrom) ✓ — to je točno kar hočemo, ni Y popravka
- Privzeto za kačo: end ima `-edgeOffset` (nad centrom) ✓ — to je točno kar hočemo, ni Y popravka
- X odmika ni (sredina polja)

Torej: `"33-27": {}` — brez posebnih odmikov, privzeto deluje pravilno.

Izbrišemo tudi stari `"34-28"` vnos.

```typescript
const ARROW_OFFSETS: Record<string, ArrowOffsets> = {
  // Ladders (blue, up)
  "3-11":  { endX: 0.32, endY: -0.33 },      // end right-center of 11
  "15-29": { startX: 0.32 },                  // start right of 15
  // Snakes (red, down)
  "24-14": { endX: -0.32, endY: 0.33 },       // end left-center of 14
  "40-34": { startX: -0.32, startY: -0.33 },  // start left-center of 40
  // "33-27" nima posebnih odmikov — privzeto spodaj/zgoraj je pravilno
};
```

#### B) curveSide za 15→29 — leva stran

Trenutno: `from === 15 ? 1 : ...` → `curveSide = 1` (desna stran).
Spremenimo na: `from === 15 ? -1 : ...` → `curveSide = -1` (leva stran).

```tsx
curveSide={(from === 15 ? -1 : i % 2 === 0 ? 1 : -1) as 1 | -1}
```

---

### Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | SNAKES: `34: 28` → `33: 27` |
| `src/components/games/KaceLestveBoard.tsx` | (1) ARROW_OFFSETS: briši `"34-28"`, dodaj `"33-27"` brez odmikov, (2) curveSide za `15`: `1` → `-1` |
