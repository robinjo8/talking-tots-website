
## Spremembe v igri Kače in Lestve

### Pregled potrebnih sprememb

Zahtevane spremembe so v 3 datotekah:
1. `src/data/kaceLestveConfig.ts` — preoštevilčenje polj in popravek puščic
2. `src/components/games/KaceLestveBoard.tsx` — postavitev figuric in nova postavitev kocke/indikatorja
3. `src/components/games/KaceLestveGame.tsx` — dizajn gumba Hiška, gumba Nova igra, postavitev kocke/indikatorja pod ploščo

---

### 1. `src/data/kaceLestveConfig.ts` — Preoštevilčenje

Trenutno stanje: rumeno polje (start) zavzema mesti 1 in 2, zelena polja so 3–40, oranžno (cilj) je 41–42. Prikaz na zaslonu kaže 3 kot prvo zeleno polje.

Po spremembi: zelena polja so oštevilčena 1–38, oranžno (cilj) je pri fizičnih pozicijah 39–40 (tj. staro 41–42). Rumeno start polje ostane neoštevilčeno. `BOARD_SIZE` se zmanjša na 40. Meja za start/end v `getCellColor` in `getCellTextColor` se ustrezno posodobi.

```
BOARD_SIZE: 42 → 40
isStart: pos <= 2        (ostane enako — fizični celici 1+2)
isEnd:   pos >= 41 → pos >= 39   (fizični celici 39+40)
getCellColor: START = pos <= 2, END = pos >= 39, zelena 3–38
getCellTextColor: enako
```

**Puščice — vse vrednosti -2:**

| Staro | Novo |
|-------|------|
| LADDERS 3→11 | 1→9 |
| LADDERS 6→18 | 4→16 |
| LADDERS 15→27 | 13→25 |
| LADDERS 26→38 | 24→36 |
| SNAKES 40→34 | 38→32 |
| SNAKES 21→9 | 19→7 |
| SNAKES 24→14 | 22→12 |
| SNAKES 31→19 | 29→17 |

**SQUARES_NEAR_END** ostane 6 (zadnjih 6 polj pred 40 = polja 33–38).

---

### 2. `src/components/games/KaceLestveBoard.tsx` — Puščice in figurice

#### A) ARROW_OFFSETS — posodobljeni ključi

Vsi ključi se zmanjšajo za 2. Posebni odmiki se ohranijo pri puščicah z enakim relativnim položajem:

```typescript
const ARROW_OFFSETS: Record<string, ArrowOffsets> = {
  // Ladders (blue, up)
  "1-9":   { endX: 0.32, endY: -0.33 },   // konec desno-sredina od 9 (was 3-11)
  "13-25": {},                              // konec spodaj-sredina od 25 (was 15-27)
  // Snakes (red, down)
  "22-12": { endX: -0.32, endY: 0.33 },   // konec levo-sredina od 12 (was 24-14)
  "38-32": { startX: -0.32, startY: -0.33 }, // začetek levo-sredina od 38 (was 40-34)
};
```

#### B) curveSide logika — posodobljeni ključi

```tsx
// Ladders: from === 13 ? -1 (was 15 ? -1)
curveSide={(from === 13 ? -1 : i % 2 === 0 ? 1 : -1) as 1 | -1}

// Snakes: from === 38 ? 1 (was 40 ? 1)
curveSide={(from === 38 ? 1 : i % 2 === 0 ? -1 : 1) as 1 | -1}
```

#### C) isStart / isEnd meje v prikazu celic

Fizično polje 39 = `isEndLabel`, polje 40 = `isEndBlank` (s sliko Cilj.webp). Koda:

```tsx
const isStart = pos <= 2;    // ostane
const isEnd = pos >= 39;     // was >= 41
const isStartLabel = cell.isStart && cell.pos === 1;   // ostane
const isStartBlank = cell.isStart && cell.pos === 2;   // ostane
const isEndLabel = cell.isEnd && cell.pos === 39;      // was 41
const isEndBlank = cell.isEnd && cell.pos === 40;      // was 42
```

#### D) Figurice — centriranje na sredino polja

Trenutno: `x = targetCol * cellW + cellW/2 + offsetX - cellW*0.2` (offset -0.2 pomakne figurico levo od sredine).

Novo: brez tega odmika `-cellW*0.2`, figurica bo na sredini celice (minus pol širine figurice):

```typescript
const offsetX = idx === 0 ? -cellW * 0.15 : cellW * 0.15;
const x = targetCol * cellW + cellW / 2 + offsetX - size / 2;
const y = targetRow * cellH + cellH / 2 - size / 2;
```

---

### 3. `src/components/games/KaceLestveGame.tsx` — UI spremembe

#### A) Postavitev kocke in indikatorja POD ploščo (kot na referenčni sliki)

Trenutno: kocka je `fixed bottom-4 right-4`, indikator `fixed bottom-4 left-24`. Oba sta čez ploščo.

Novo: oba elementa postavimo v flexbox pod ploščo znotraj `<div className="h-full flex flex-col">`. Plošča dobi `flex-1`, spodaj pa je `<div className="flex items-center justify-between">` z indikatorjem levo in kocko desno.

```tsx
<div className="h-full flex flex-col items-center justify-center p-2 gap-2">
  {/* Plošča */}
  <div style={{ aspectRatio: '6/7', flex: '1 1 0', maxWidth: '...' }}>
    <KaceLestveBoard players={playerData} />
  </div>
  
  {/* Spodnja vrstica: indikator + kocka */}
  {phase !== "settings" && (
    <div className="flex items-center justify-between w-full px-2" style={{ maxWidth: ... }}>
      {/* NA VRSTI indikator */}
      <div className="flex items-center gap-2 bg-black/40 rounded-full px-3 py-2">
        <img ... />
        <span>NA VRSTI: {currentPlayerName}</span>
      </div>
      {/* Kocka */}
      <DiceRoller ... />
    </div>
  )}
</div>
```

DiceRoller ne bo več `fixed`, ampak `relative` znotraj layouta. Preveriti je treba, ali DiceRoller podpira ne-fixed pozicioniranje.

#### B) Gumb Hiška — enak dizajn kot GenericWheelGame

Referenca iz GenericWheelGame:
- Gumb: `w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500` z ikono Home
- Meni: `bg-white/95 border-2 border-orange-200 shadow-xl`
- Vnosi: `🏠 Nazaj`, `🔄 Nova igra`, `📖 Navodila` z `px-4 py-3 font-medium` (ne bold, ne uppercase)
- Meni nima gumba "Nastavitve" v referenci

Trenutni KaceLestveGame ima:
- `border-white/50 hover:scale-105` — OK
- Barve: `#F59E0B, #EF4444` → spremenimo v `from-amber-400 to-orange-500`
- Vnosi: `font-bold text-gray-800` → `font-medium text-gray-800`
- Emoji ikone namesto komponent: `🏠`, `🔄`, `📖`

#### C) Gumb "Nova igra" — direktna ponastavitev brez ConfirmDialog

Trenutno: Nova igra odpre `showNewGameDialog`. Novo: direktno kliče `resetGame()`.

```tsx
<button onClick={() => { setMenuOpen(false); resetGame(); }}>
  🔄 Nova igra
</button>
```

#### D) Navodila — InstructionsModal type="kaceLestve"

Navodila že používajo `InstructionsModal` z `type="kaceLestve"`. Format (krepki naslovi, besedilo) je enak kot pri drugih igrah. Obstoječe navodilo za `kaceLestve` je pravilno strukturirano. Gumb "RAZUMEM" ni prisoten v InstructionsModal — to je pravilno.

#### E) DiceRoller — preveritev pozicioniranja

Treba je preveriti `DiceRoller` komponento, da razumemo, ali ima `fixed` pozicioniranje vgrajeno ali ga kliče nadrejena komponenta.

---

### Tehnično ozadje: zakaj BOARD_SIZE = 40

Fizična mreža ima 42 celic. 2 sta rumeni (start, neoštevilčeni), 2 sta oranžni (cilj, neoštevilčeni), 38 je zelenih (oštevilčene 1–38). Zmaga je pri fizičnem polju 40 (staro 42). BOARD_SIZE v logiki igre = 40.

`getGridCell` in `getBoardPosition` funkcije delujeta s fizičnimi pozicijami (1–42), zato se ne spremenita. Logika igre (premik figurice, lestve, kače) bo zdaj delovala s pozicijami 1–40 namesto 1–42.

### Povzetek vseh sprememb

| Datoteka | Spremembe |
|----------|-----------|
| `kaceLestveConfig.ts` | BOARD_SIZE 42→40, LADDERS/SNAKES -2, getCellColor/TextColor meje posodobiti |
| `KaceLestveBoard.tsx` | ARROW_OFFSETS ključi -2, curveSide logika -2, isEnd meje 41→39, figurice centrirane |
| `KaceLestveGame.tsx` | Kocka + indikator pod ploščo, Home gumb dizajn, Nova igra direktna, DropdownMenu state |
