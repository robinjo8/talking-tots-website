
## Popravki postavitve puščic in slike Cilj

### Spremembe v 2 datotekah

---

### 1. `src/data/kaceLestveConfig.ts`

Spremenimo lestev `15: 30` → `15: 29`:

```typescript
export const LADDERS: Record<number, number> = {
  3: 11,
  6: 18,
  15: 29,   // <-- was 30
  26: 38,
};
```

---

### 2. `src/components/games/KaceLestveBoard.tsx`

#### A) Slika Cilj.webp — desni zgornji kot

Trenutno je slika centrirana v polju (flex items-center justify-center). Spremenimo na desni zgornji kot:

```tsx
{isEndLabel && (
  <div
    className="absolute inset-0 flex items-start justify-end"
    style={{ zIndex: 10, backgroundColor: '#FF6B35' }}
  >
    <img
      src={`${SUPABASE_URL}/slike-ostalo/Cilj.webp`}
      alt="Cilj"
      className="w-3/4 h-3/4 object-contain"
      style={{ padding: '2px' }}
    />
  </div>
)}
```

#### B) Posodobitev `ARROW_OFFSETS` — vsi ključi in vrednosti

Obstoječi sistem: `startY/endY` so frakcije `cellH`, ki se prištejejo **poleg** avtomatskega `edgeOffset = cellH * 0.33`. Da postavimo točko točno na vertikalno sredino celice (brez Y odmika), moramo `endY`/`startY` nastaviti na `±0.33` da se `edgeOffset` razveljavil.

**Nova tabela odmikov po puščici:**

| Puščica | Tip | Sprememba |
|---------|-----|-----------|
| `3-11` | modra | konec: desno od 11, na vertikalni sredini → `endX: +0.32, endY: -0.33` (razveljavimo edgeOffset ki bi šel pod center) |
| `15-29` | modra | začetek: desno od 15 (kot prej) → `startX: +0.32` |
| `24-14` | rdeča | konec: levo od 14, na vertikalni sredini → `endX: -0.32, endY: +0.33` (razveljavimo edgeOffset ki bi šel nad center) |
| `34-28` | rdeča | začetek: desno od 34, na vertikalni sredini → `startX: +0.32, startY: -0.33`; konec: nad 28 (privzeto za kačo = dobro) |
| `40-34` | rdeča | začetek: levo od 40, na vertikalni sredini → `startX: -0.32, startY: -0.33`; konec: nad 34 (privzeto za kačo = dobro) |

```typescript
const ARROW_OFFSETS: Record<string, ArrowOffsets> = {
  // Ladders (blue, up)
  "3-11":  { endX: 0.32, endY: -0.33 },   // end right-center of 11
  "15-29": { startX: 0.32 },               // start right of 15 (no Y change)
  // Snakes (red, down)
  "24-14": { endX: -0.32, endY: 0.33 },   // end left-center of 14
  "34-28": { startX: 0.32, startY: -0.33 }, // start right-center of 34
  "40-34": { startX: -0.32, startY: -0.33 }, // start left-center of 40
};
```

#### C) curveSide za puščico 15→29

Puščica 15→30 je bila zadnja lestev (index 3 v LADDERS objektu, `i % 2 === 1 → curveSide = -1`). Po zamenjavi na 15→29 ostane na istem mestu v objektu, torej bo curveSide enak. Ker pa jo želi uporabnik v drugo smer, ji eksplicitno priredimo `curveSide = 1` v render logiki:

```tsx
{ladderEntries.map(({ from, to }, i) => (
  <CurvedArrow
    key={`ladder-${from}`}
    from={from}
    to={to}
    ...
    curveSide={(from === 15 ? 1 : i % 2 === 0 ? 1 : -1) as 1 | -1}
    ...
  />
))}
```

#### D) curveSide za kačo 40→34

Ker puščica 40→34 zdaj začne levo od polja 40 (namesto desno), jo je smiselno zakriviti levo (stran od polja KONEC). Ohranimo `from === 40 ? 1 : ...` logiko.

---

### Tehnično ozadje sistema odmikov

```text
Dejanska pozicija točke:
  x = center_celice_x + (offsetX ?? 0) * cellW
  y = center_celice_y + (offsetY ?? 0) * cellH + edgeOffset_y

kjer je edgeOffset_y:
  - za start lestve: -cellH * 0.33  (nad centrom)
  - za konec lestve: +cellH * 0.33  (pod centrom)
  - za start kače:   +cellH * 0.33  (pod centrom)
  - za konec kače:   -cellH * 0.33  (nad centrom)

Da dobimo točko na VERTIKALNI SREDINI celice:
  - za konec lestve: endY = -0.33  (razveljavimo +edgeOffset)
  - za start kače:   startY = -0.33  (razveljavimo +edgeOffset)
  - za konec kače:   endY = +0.33  (razveljavimo -edgeOffset)
```

---

### Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | `LADDERS`: `15: 30` → `15: 29` |
| `src/components/games/KaceLestveBoard.tsx` | (1) Slika Cilj: desni zgornji kot, (2) ARROW_OFFSETS: posodobljeni ključi z Y korekcijami, (3) curveSide: 15→29 premaknemo v nasprotno smer |
