
## Vizualni popravki: puščice, tabla, kocka, zmajček

### Spremembe v 3 datotekah

---

### 1. `src/components/games/KaceLestveBoard.tsx`

#### A) Elegantnejše puščice z belo/svetlo črtico po sredini

Trenutno puščica nima svetle črtice po sredini. Dodamo tretji `<path>` element — tanka svetla linija po sredini telesa puščice:

- Rdeče puščice: svetlo rdeča sredinska linija (`#FF8A80`, opacity 0.8)
- Modre puščice: svetlo modra sredinska linija (`#82B1FF`, opacity 0.8)
- Debelina sredinske črtice: `strokeW * 0.35`

**Debelejše puščice** (×1.5 namesto ×0.5 od prejšnjega zmanjšanja):
- `strokeW = Math.min(boardW, boardH) * 0.016` (namesto 0.011)
- `arrowSize = Math.min(boardW, boardH) * 0.038`

#### B) Odprava "pike" na konici puščice

Problem: dva poligona (outline + fill) ustvarita videz pike ker sta oba narisana od točno iste točke. Rešitev: konico narišemo samo enkrat kot en poligon, brez dvojnega layeringa:

```svg
<!-- Outline poligon: malo večji -->
<polygon points="..." fill={outline} />
<!-- Fill poligon: malo manjši, od roba ne od vrha -->
<polygon points="..." fill={color} />
```

Pravi popravek: `p1` (konica) ostane enaka, ampak `p2` in `p3` (baza trikotnika) se premaknejo malce bližje konici, tako da outline dejansko obroblja fill namesto da se prekrivata na vrhu.

Konkretno: namesto `* 0.18` faktorja bomo odstranili fill polygon in pustili samo outline polygon z barvo fill + ločen outline. To eliminira pikico.

#### C) Specifični odmiki start/end točk po puščici

Sedaj vse puščice dobijo odmik samo v Y smeri (gor/dol od centra). Dodamo možnost za X odmik pri specifičnih puščicah:

Spremenimo signaturo `CurvedArrow` da sprejme `startOffset` in `endOffset` (`{x, y}` v deležih celice):

```typescript
interface ArrowOffsets {
  startX?: number; // fraction of cellW, default 0
  startY?: number; // fraction of cellH
  endX?: number;
  endY?: number;
}
```

**Konkretni odmiki po zahtevi:**

| Puščica | Začetek | Konec |
|---------|---------|-------|
| 3→12 (modra) | nad center (privzeto) | DESNO od 12 (endX: +0.3) |
| 6→18 (modra) | v redu | v redu |
| 15→30 (modra) | DESNO od 15 (startX: +0.3) | v redu |
| 26→37 (modra) | v redu | v redu |
| 24→10 (rdeča) | v redu | LEVO od 10 (endX: -0.3) |
| 21→5 (rdeča) | v redu | v redu |
| 40→31 (rdeča) | v redu | LEVO od 31 (endX: -0.3) |

#### D) ZAČETEK polje — besedilo na sredini

Trenutno je `🚀 ZAČETEK` poravnano levo-zgoraj. Spremenimo na center:

```tsx
{isStartLabel && (
  <div className="absolute inset-0 flex items-center justify-center"
       style={{ backgroundColor: '#FFD93D', zIndex: 10 }}>
    <span className="font-black text-yellow-900 text-center"
          style={{ fontSize: 'clamp(9px, 2vw, 16px)' }}>
      🚀 ZAČETEK
    </span>
  </div>
)}
```

#### E) KONEC polje — slika `Cilj.webp` na sredini

Namesto besedila pokažemo sliko iz Supabase storage:

```tsx
{isEndLabel && (
  <div className="absolute inset-0 flex items-center justify-center"
       style={{ backgroundColor: '#FF6B35', zIndex: 10 }}>
    <img
      src={`${SUPABASE_URL}/slike/Cilj.webp`}
      alt="Cilj"
      className="w-full h-full object-contain p-1"
    />
  </div>
)}
```

(Predpostavljamo da je `Cilj.webp` v mapi `slike/` v Supabase storage — pot je potrebno preveriti glede na obstoječe strukture URL-jev v projektu.)

---

### 2. `src/components/games/KaceLestveGame.tsx` — Kocka desno, zmajček levo

**Kocka** se trenutno upodablja prek `DiceRoller` ki ima `fixed inset-0 flex items-center justify-center` — torej je vedno na sredini ekrana. 

Za premik kocke na spodaj desno, moramo spremeniti pozicijo wrapping div-a v `DiceRoller.tsx` ali pa oviti `<DiceRoller>` v absolutno pozicioniran kontejner. Ker `DiceRoller` sam nadzira pozicioniranje (`fixed inset-0`), ga bomo morali spremeniti da sprejme prop za pozicijo, ali pa spremenimo wrapper.

**Najlažja rešitev**: spremenimo CSS v `DiceRoller.tsx` iz `flex items-center justify-center` v `flex items-end justify-end pb-4 pr-4`:

```tsx
// DiceRoller.tsx — wrapper div
<div className="fixed inset-0 z-40 flex items-end justify-end pb-6 pr-6 pointer-events-none">
```

**Zmajček na vrsti** — trenutno je `div` centered (`flex items-center justify-center`) pod tablo. Premaknemo ga na levo stran (`fixed bottom-6 left-24` oz. levo od kocke):

V `KaceLestveGame.tsx` spremenimo `div` s player indikatorjem:

```tsx
{/* Player indicator — fixed bottom-left (next to home button) */}
{phase !== "settings" && (
  <div className="fixed bottom-4 left-24 z-40 flex items-center gap-2 
                  bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
    <img src={...} className="w-9 h-9 object-contain" />
    <span className="text-white font-black text-sm">...</span>
  </div>
)}
```

---

### 3. `src/components/dice/DiceRoller.tsx` — Pozicija kocke

Spremenimo wrapper `div` iz:
```tsx
<div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
```
v:
```tsx
<div className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none">
```

S tem bo kocka vedno v spodnjem desnem kotu.

---

### Povzetek datotek

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveBoard.tsx` | (1) Svetla sredinska črtica na puščicah, (2) Debelejše puščice, (3) Odprava pike na konici, (4) X/Y odmiki po puščici, (5) ZAČETEK na sredini, (6) KONEC = slika Cilj.webp |
| `src/components/games/KaceLestveGame.tsx` | Zmajček na vrsti premakni na `fixed bottom-4 left-24` |
| `src/components/dice/DiceRoller.tsx` | Kocka premakni na `fixed bottom-4 right-4` |
