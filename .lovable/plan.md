

## Plan: Popravi sliko za Zabavno pot + unikatna poročila

### Problem 1: Zabavna pot brez slike

`GameImageMap.ts` nima vnosa za `"kace"` (Zabavna pot). Ko `getGameImage("kace", "igra")` ne najde ujemanja, vrne prazen string → prikaže se generična ikona gamepad.

**Popravek**: Dodaj `"kace"` v `GAME_IMAGE_MAP`:
```ts
"kace": `${SUPABASE_URL}/slike-ostalo/zabavna_pot_1.webp`,
```

### Problem 2: Samo 1 poročilo v "Generirana poročila logopeda"

V `simulate-plan-lifecycle/index.ts` (vrstica 410) je ime datoteke `porocilo-2026-03-27.txt` — uporablja se samo datum (`YYYY-MM-DD`). Ker je `upsert: true`, se ob vsakem kliku na isti dan datoteka **prepiše**. Zato vidiš vedno samo 1 poročilo.

**Popravek**: Dodaj uro/minuto/sekundo v ime datoteke:
```ts
// Prej:
const timestamp = new Date().toISOString().split("T")[0];
// Potem:
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
// Rezultat: "2026-03-27T14-30-45" → unikatno ime datoteke
```

### Obseg
- 1 UI datoteka (`GameImageMap.ts`) — 1 vrstica dodana
- 1 Edge funkcija (`simulate-plan-lifecycle`) — 1 vrstica spremenjena

