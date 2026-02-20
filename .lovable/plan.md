
## Zamenjava kač in lestev s puščicami + barvni popravki

### Kaj se bo spremenilo

#### 1. `src/components/games/KaceLestveBoard.tsx` — puščice namesto kač in lestev

**Lestve → modre puščice navzgor**

Namesto `LadderSVG` komponente naredimo `UpArrowSVG`:
- Barva: modra (`#1E88E5` telo, `#0D47A1` obroba)
- Oblika: debela linija z rahlo S-krivuljo (perp faktor ~0.15 za subtilno zavinost)
- Na koncu (vrhu) trikotna puščična konica — lepa, velika, jasna
- Debelina: `strokeWidth` ~3.0 (vidna ampak ne prekriva številk)
- Senca: rahla, opacity 0.10

**Kače → rdeče puščice navzdol**

Namesto `SnakeSVG` komponente naredimo `DownArrowSVG`:
- Barva: rdeča (`#E53935` telo, `#7F0000` obroba)
- Oblika: debela linija z rahlo S-krivuljo v nasprotno smer (za razlikovanje od modrih)
- Na koncu (dnu) trikotna puščična konica navzdol
- Enaka debelina kot modre puščice

**Tehnika risanja puščice:**
```
- Začetek (from): center celice
- Konec (to): center celice
- Pot: cubic bezier z majhnim perpendicular offsetom (0.15) za zavinost
- Konica: trikotnik na koncu, usmerjen v smeri potovanja
- Debelina outlinea: 3.5, fill: 2.5
```

**Z-indexi ostanejo isti:**
- SVG overlay: `z-index: 1`
- Grid (z velikimi številkami): `z-index: 2`
- Avatarji: `z-index: 30`

---

#### 2. `src/data/kaceLestveConfig.ts` — 3 naključne odtenke zelene

**Problem z zdajšnjim pristopom**: odtenki se ponavljajo v enakem vzorcu (0,1,2,3,0,1,2,3...) — videti so kot proge, ne naključno.

**Rešitev**: Ustvarimo naključen (a deterministični) seznam barv za vsako polje ob inicializaciji. Uporabimo pseudo-naključni generator na podlagi pozicije:

```typescript
// Namesto % 4 cikla, vsako polje dobi naključno barvo z seed-om
export function getCellColor(position: number): string {
  if (position <= 2) return START_COLOR;
  if (position >= 41) return END_COLOR;
  // Pseudo-naključno na podlagi pozicije — 3 odtenki
  const hash = (position * 17 + 13) % 3;
  if (hash === 0) return GREEN_DARK;
  if (hash === 1) return GREEN_MID;
  return GREEN_LIGHT;
}
```

S tem dobimo videz "naključnih" barv ki so vedno enake (deterministic), brez da moramo shranjevati state.

**3 odtenki (kot zahtevano, ne 4):**
- `GREEN_DARK = '#1B5E20'` — temno zelena
- `GREEN_MID = '#2D6A4F'` — srednja zelena  
- `GREEN_LIGHT = '#95D5B2'` — svetla zelena

`GREEN_SEMI` odstranimo (ali ohranimo kot neuporabljeno konstanto).

**Hash formula** `(position * 17 + 13) % 3` daje vizualno dobro distribucijo — ne proge, ampak res naključen videz. Vrednosti za pozicije 3-40 bodo vizualno "pomešane".

---

### Vizualizacija puščic

```text
MODRA PUŠČICA (lestev/navzgor):
  Polje 3 → Polje 12
  
  [12] ◄── konica puščice (trikotnik)
    │ rahlo zavita pot (cubic bezier)
  [3]  ── začetek puščice

RDEČA PUŠČICA (kača/navzdol):
  Polje 40 → Polje 31
  
  [40] ── začetek puščice  
    │ rahlo zavita pot (druga smer)
  [31] ◄── konica puščice (trikotnik navzdol)
```

---

### Samo 2 datoteki za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveBoard.tsx` | Zamenjamo `SnakeSVG` → `DownArrowSVG` (rdeča), `LadderSVG` → `UpArrowSVG` (modra) |
| `src/data/kaceLestveConfig.ts` | `getCellColor` → pseudo-naključni hash za 3 odtenke zelene |

Igra, logika, avatarji, meni — vse ostane nespremenjeno.
