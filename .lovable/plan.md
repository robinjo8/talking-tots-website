
## Popravek puščic: tanjše, ne prekrivajo številk, zavijejo mimo

### Problem
SVG overlay je na `zIndex: 5`, board grid pa na `zIndex: 2` — puščice so NAD mrežo in prekrivajo številke. Poleg tega se puščice začnejo/končajo točno na sredini celice (kjer je številka).

### Rešitev v dveh delih

---

### Del 1: Premik start/end točke puščic stran od središča

**Modre puščice (lestve, navzgor):**
- Začetek (nižje polje): točka se premakne **nad** center celice za `cellH * 0.3` (puščica se začne nad številko)
- Konec (višje polje): točka se premakne **pod** center celice za `cellH * 0.3` (puščica se konča pod številko)

**Rdeče puščice (kače, navzdol):**
- Začetek (višje polje): točka se premakne **pod** center celice za `cellH * 0.3`
- Konec (nižje polje): točka se premakne **nad** center celice za `cellH * 0.3`

Tako puščica vizualno "teče med" številkami, ne čez njih.

```
MODRA (navzgor):
  [12] —— konec TUKAJ (pod številko 12)
    ↑
  [3]  —— začetek TUKAJ (nad številko 3)

RDEČA (navzdol):
  [40] —— začetek TUKAJ (pod številko 40)
    ↓
  [31] —— konec TUKAJ (nad številko 31)
```

---

### Del 2: SVG pod gridom (zIndex) + grid z prozornim ozadjem

**Ključna sprememba**: SVG gre na `zIndex: 1`, grid ostane na `zIndex: 2` — in celice postanejo **prozorne** (background-color ostane, ampak cell `<div>` nima background-color sam od sebe, samo colored children imajo).

Pravzaprav — celice že imajo `backgroundColor: cell.color` na celotnem `<div>`. Ker je CSS `background-color` neprozoren, bo grid polje pokrilo puščice pod njim. To je **pravilno obnašanje** — puščice tečejo "za" celicami.

**Ampak problem je bil**: puščice morajo biti vidne čez polja. Rešitev je:

**SVG ostane nad gridom (zIndex: 5), toda celice dobijo `mix-blend-mode` ali pa puščice tečejo skozi "luknje"** — to je kompleksno.

**Boljša rešitev**: Celice ostanejo na `zIndex: 2`. Puščice so na `zIndex: 3` (nad celicami). Številke dobijo `zIndex: 10` relativno znotraj celice (že imajo to). Ampak ker so celice `position: relative` in nimajo `isolation: isolate`, se `z-index: 10` na `<span>` ne more prebiti nad parent SVG.

**Prava rešitev**: 
- SVG puščice ostanejo nad gridom (`zIndex: 5`)
- Puščice se ne začnejo/končajo na sredini celice (kjer je številka) → odmik `cellH * 0.35` od centra
- Puščica ki gre čez polje KONECke (40→31): posebna pot ki se zaokroži ob robu table stran od polja KONEC

---

### Del 3: Posebna pot za rdečo puščico 40→31

Polje 40 je polje tik ob KONEC (ki je 41+42). Puščica od 40 do 31 gre navzdol. Trenutno gre skozi področje KONEC polja.

Rešitev: za to specifično puščico nastavimo `curveSide` tako da zavije **stran od KONEC polja** (v levo/desno stran), ali pa dodamo dodatno kontrolno točko ki jo usmeri mimo.

Za puščico 40→31: polje 40 je v vrstici 5 (od dna: vrstica 1), desna stran. Polje 31 je v vrstici 4 (od dna: vrstica 2), desna stran. Torej gre navzdol na desni strani table. Puščica naj zavije v levo (stran od KONEC) — to se naredi z ustreznim `curveSide`.

---

### Del 4: Tanjše puščice — za polovico

Trenutno: `strokeW = Math.min(boardW, boardH) * 0.022`

Novo: `strokeW = Math.min(boardW, boardH) * 0.011` (polovica)

Konika puščice (arrowSize): `Math.min(boardW, boardH) * 0.045` → `Math.min(boardW, boardH) * 0.03`

---

### Del 5: Zelena polja — samo 2 odtenka

Spremenimo `getCellColor` v `kaceLestveConfig.ts` da vrne samo 2 odtenka:

```typescript
export const GREEN_DARK = '#2D6A4F';   // Temnejša
export const GREEN_LIGHT = '#52B788';  // Svetlejša

export function getCellColor(position: number): string {
  if (position <= 2) return START_COLOR;
  if (position >= 41) return END_COLOR;
  const hash = ((position * 31 + 7) * 13 + position * 5) % 2;
  return hash === 0 ? GREEN_DARK : GREEN_LIGHT;
}
```

Za 2 odtenka je potrebna `% 2` namesto `% 3`. Besedilo bo belo za oba odtenka.

---

### Tehnična implementacija `CurvedArrow`

Nova signatura z `isLadder` parametrom (true = modra navzgor, false = rdeča navzdol):

```typescript
function CurvedArrow({ from, to, color, outline, curveSide, boardW, boardH, isLadder }) {
  const cellH = boardH / ROWS;
  
  // Odmik start/end točke od centra celice
  const edgeOffset = cellH * 0.32;
  
  let startRaw = getPositionCenterPx(from, boardW, boardH);
  let endRaw = getPositionCenterPx(to, boardW, boardH);
  
  // Modra (lestev, navzgor): začne se nad centrom from, konča pod centrom to
  // Rdeča (kača, navzdol): začne se pod centrom from, konča nad centrom to
  const start = {
    x: startRaw.x,
    y: isLadder ? startRaw.y - edgeOffset : startRaw.y + edgeOffset
  };
  const end = {
    x: endRaw.x,
    y: isLadder ? endRaw.y + edgeOffset : endRaw.y - edgeOffset
  };
  
  // ... Bezier krivulja ostane enaka
}
```

---

### Spremembe samo v 1 datoteki (+ opcijsko kaceLestveConfig.ts za barve)

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveBoard.tsx` | (1) Odmik start/end točk od centra, (2) Tanjše puščice (×0.5), (3) Manjša konica puščice, (4) `isLadder` prop za pravilno smer odmika |
| `src/data/kaceLestveConfig.ts` | 2 odtenka zelene namesto 3 |

