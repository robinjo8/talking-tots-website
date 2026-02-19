
## Popravki igre Kače in lestve

### Pregled sprememb

Igra bo popolnoma prenovljena glede na sliki in navodila. Glavne spremembe:

1. **Novo polje**: 6 stolpcev × 7 vrstic = 42 polj (ne 8×8=64)
2. **Nove pozicije lestev in kač**
3. **Nov vizualni slog**: zelena barvna paleta, rumeni start, oranžni konec, velike številke
4. **Moderna kača in lestve**: barvite, cartoon, različne barve
5. **Kocka**: interaktivna 3D kocka v sredini zaslona (kot DiceRoller v smešnih povedih)
6. **Avatarji zmajčkov**: izbira zmajčka pred igro
7. **Nastavitve**: gumb pod hiško + ohranjanje nastavitev med igro
8. **Odprava stranske plošče** IGRALEC 1 START

---

### Nova konfiguracija polja (6×7 = 42 polj)

Po referenčni sliki:
```text
Vrstica 7 (vrh): 37  38  39  40  41  [KONEC=42]
Vrstica 6:       36  35  34  33  32  31
Vrstica 5:       25  26  27  28  29  30
Vrstica 4:       24  23  22  21  20  19
Vrstica 3:       13  14  15  16  17  18
Vrstica 2:       12  11  10   9   8   7
Vrstica 1 (dno):[ZAČETEK=1-2]  3   4   5   6
```

Gibanje: Levo→desno v lihi vrstici, desno→levo v sodi vrstici (boustrophedon).

**Posebnosti:**
- Polje 1+2 = ZAČETEK (rumeno, združeno)
- Polje 41+42 = KONEC (oranžno, združeno)
- `BOARD_SIZE = 42`
- `SQUARES_NEAR_END = 6`

**Lestve (novo):**
- 3 → 12
- 6 → 18
- 15 → 30
- 26 → 37

**Kače (novo):**
- 40 → 36
- 21 → 5
- 24 → 8

---

### Barve celic

Po zahtevah:
- **Začetek (1-2)**: rumeno `#FFD93D`
- **Konec (41-42)**: oranžno `#FF6B35`
- **Vsa ostala polja**: tri odtenki zelene, izmenično:
  - Temno zelena: `#2D6A4F`
  - Srednje zelena: `#52B788`
  - Svetlo zelena: `#95D5B2`

Vzorec po poziciji: `(position % 3)` → 0=temno, 1=srednja, 2=svetla

---

### Kocka - interaktivna 3D v sredini zaslona

Kocka bo delovala točno kot `DiceRoller.tsx` (ki ga že uporablja smešne povedi). Ko je faza `"playing"`:
- Prikaže se v sredini zaslona (fixed overlay, pointer-events-auto)
- Animira se ob kliku (3D rotacija)
- Ko se ustavi, sproži premik figurice

Kocka bo reintegrirana z uporabo obstoječega `DiceRoller` komponenta namesto lastnega `DiceFace`. Ker pa `DiceRoller` v smešnih povedih prevzame celoten zaslon, ga bomo v kačah prikazali le ko je faza "playing", postavljenega fiksno v sredino.

---

### Figurice - zmajčkovi avatarji

Pred igro (v nastavitvenem dialogu) vsak igralec izbere avatarja iz nabora zmajčkov:
- `Zmajcek_1.webp`, `Zmajcek_2.webp`, ..., `Zmajcek_9.webp` (9 možnosti)
- Avatarji so prikazani kot mali krogci z zmajčkovo sliko na polju

Zmajček se premika po poljih s `framer-motion` animacijo `animate` (absolutna pozicija se izračuna iz grid koordinat celice).

---

### Nastavitve

**Ob začetku igre** (modal):
- Število igralcev (1 ali 2)
- Vsak igralec izbere avatarja zmajčka
- Težavnost: Nizka (+2) / Srednja (+1) / Visoka (0)
- Čas snemanja: 3 / 4 / 5 sekund

**Med igro** (gumb pod hiško, odpre isti modal z možnostjo spremembe le težavnosti/časa):
- Gumb Nastavitve (ikona ⚙️, modra barva) pod gumbom Hiška

---

### UI postavitev

```text
┌────────────────────────────────────────────┐
│          [Tabla 6×7 - zavzame večino]       │
│                                              │
│        Kocka se pojavi v sredini             │
│        (ko je čas na vrsti)                  │
│                                              │
│  [🏠]  [⚙️]            Na vrsti: ZMAJČEK 1  │
└────────────────────────────────────────────┘
```

Stranska plošča "IGRALEC 1 START" bo **odstranjena**. Informacija o trenutnem igralcu bo prikazana diskretno v spodnjem desnem kotu ali nad tablo.

---

### Kače - modern cartoon slog (referenčna slika)

Vsaka kača ima edinstveno barvo in debelejše telo z gradientom:
- Kača 1 (40→36): Modra `#4ECDC4` / `#2196F3`
- Kača 2 (21→5): Rdeča/oranžna `#FF6B6B` / `#FF8C00`
- Kača 3 (24→8): Zelena/rumena `#66BB6A` / `#FFEE58`

SVG kača bo imela:
- Debelejšo pot (strokeWidth ~5-6%)
- Gradient barvo
- Večjo glavo z izrazitimi očmi
- Nasmešek (prijazna kača)
- Rep s konico

---

### Lestve - modern cartoon slog

4 lestve z različnimi barvami:
- Lestev 1 (3→12): Rjava/zlata
- Lestev 2 (6→18): Vijolična/rožnata
- Lestev 3 (15→30): Modra/turkizna
- Lestev 4 (26→37): Zelena/oranžna

Lestve bodo imele:
- Debelejše tirnice
- Zaobljene prečke
- SVG gradient ali polna barva

---

### Datoteke za spremembo

| Datoteka | Spremembe |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | Nova konfiguracija: 6×7 polje, nove lestve/kače, nova funkcija `getBoardPosition` za 6-stolpčno polje, nove zelene barve |
| `src/components/games/KaceLestveBoard.tsx` | Nova tabla 6×7, zelene barve, rumeni start, oranžni konec, moderne kače in lestve v barvah, zmajček avatarji s framer-motion animacijo, velike številke |
| `src/components/games/KaceLestveGame.tsx` | Odstraniti stransko ploščo, dodati interaktivno 3D kocko v sredini (DiceRoller), dodati gumb nastavitve pod hiško, playerji imajo avatar url poleg barve |
| `src/components/games/KaceLestveSettingsModal.tsx` | Dodati izbiro avatarja za vsakega igralca, dodati čas snemanja, preurediti nastavitve kot na sliki |

---

### Tehnični detajli - nova `getBoardPosition` za 6×7

```typescript
// COLS = 6, ROWS = 7, BOARD_SIZE = 42
// Vrstica 0 (spodaj) = polja 1-6 (L→D)
// Vrstica 1 = polja 12-7 (D→L)
// Vrstica 2 = polja 13-18 (L→D)
// ...

export const COLS = 6;
export const ROWS = 7;
export const BOARD_SIZE = 42;

export function getBoardPosition(row: number, col: number): number {
  const rowFromBottom = (ROWS - 1) - row; // 0 = bottom
  const baseNum = rowFromBottom * COLS + 1;
  if (rowFromBottom % 2 === 0) {
    return baseNum + col; // L→D
  } else {
    return baseNum + (COLS - 1 - col); // D→L
  }
}
```

- Polje 1+2 = START (rumeno, vrstica 0, stolpca 0+1, združena)
- Polje 41+42 = KONEC (oranžno, vrstica 6, stolpca 4+5, združena)

**Aspect ratio table**: bo `6/7` (širina/višina) namesto `1/1`.

---

### Avatar zmajčki

V nastavitvenem modalnem oknu bo mreža zmajčkov (Zmajcek_1 do Zmajcek_9). Vsak igralec klikne na želenega. Izbrani zmajček dobi obrobo. Ko je igra aktivna, se zmajčkova slika prikaže na polju namesto barvnega kroga.

Za animacijo premika zmajčka na tabli: koordinate celice se izračunajo in zmajček se animira z `motion.img` (`framer-motion`), absolutno pozicioniran znotraj tablovsebnika.

---

### Povzetek sprememb

- **4 datoteke** se spremenijo (config, board, game, settings)
- Brez novih datotek
- `DiceRoller` se uvozi iz obstoječega `src/components/dice/DiceRoller.tsx`
