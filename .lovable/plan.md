
## Vizualni popravki table + navigacija

### Spremembe v 3 datotekah

---

### 1. `src/components/games/KaceLestveBoard.tsx` — vizualni popravki

#### A) Kače — tanjše, brez jezika, kačja glava z nosom in usti

**Problem iz referenčne slike**: špice (artefakti) nastanejo na prehodnih točkah Bezier krivulje, ker se krivulja "prelomi" (kontrolne točke niso gladke). To popravimo z `smooth cubic Bezier (S ukaz)` namesto dveh ločenih `C` ukazov.

**Telo** — zmanjšamo `strokeWidth`:
- Oris: `4.5` → `3.2`
- Telo: `3.2` → `2.2`

**Glava** — kačja oblika (ne krog):
- Namesto kroga narišemo **oval/ellipso** podolgovato v smeri glave
- Headová elipsa: `rx = headR * 1.3` (daljša v smeri glave), `ry = headR`
- Nos: majhna temna polkrožna oblika na konici glave
- Usta: ukrivljena linija pod nosom (arc path)
- Odstranim jezik (`<path d=...stroke="#FF1744".../>`)

**Krivulja brez špic** — popravimo generiranje S-krivulje. Namesto:
```
M head C cp1 cp2 mid C cp3 cp4 tail
```
Uporabimo bolj gladek pristop s `cubic-bezier` kjer kontrolne točke zagotavljajo C1 kontinuiteto:
- `cp1` in `cp2` sta simetrični glede na `mid` točko → ni preloma

#### B) Številke — odstranimo mali overlay, ohranimo velike

Odstraniti moramo ta del (vrstice 347-373 v trenutnem KaceLestveBoard.tsx):
```tsx
{/* Overlay za številke — vedno nad kačami in lestvami */}
<div className="absolute inset-0 pointer-events-none" style={{ display: 'grid', ... zIndex: 10 }}>
  {cells.map(cell => <div key={`num-${cell.row}-${cell.col}`} ...>
    <span style={{ fontSize: 'clamp(8px, 1.8vw, 16px)' }}>{cell.pos}</span>
  </div>)}
</div>
```

Namesto tega **premaknemo SVG overlay za kače/lestve pod grid** — to pomeni da damo SVG overlay `zIndex: 1` in grid `zIndex: 2`:
- Grid celice že vsebujejo velike `<span>` z numeričnimi vrednostmi v sredini celice
- Ker je grid nad SVG, bodo te številke naravno vidne brez dodatnega overlaya
- Emoji ikone kač/lestev (🐍🪜) v kotih celic odstranimo prav tako (ker so redundantne)

**Struktura z-indexov po popravku:**
```
z-index: 1  → SVG overlay (kače + lestve)
z-index: 2  → Board grid (celice z velikimi številkami v sredini)
z-index: 30 → Player avatarji (obstoječe)
```

#### C) 4 odtenki zelene barve

Trenutno sta 3 odtenki (za pozicije 3-40):
```typescript
const shade = (position - 3) % 3;
```

Spremenimo v 4 odtenke:
```typescript
const shade = (position - 3) % 4;
```

Barve — dodam 4. odtenek med `GREEN_MID` in `GREEN_LIGHT`:
```typescript
export const GREEN_DARK = '#1B5E20';   // Temno zelena
export const GREEN_MID = '#2D6A4F';    // Srednja zelena
export const GREEN_SEMI = '#52B788';   // Svetlejša zelena  
export const GREEN_LIGHT = '#95D5B2';  // Najsvetlejša zelena
```

Sprememba `getCellColor` in `getCellTextColor` v `kaceLestveConfig.ts`.

#### D) Zmajček "na vrsti" pod igro

Dodamo indikator trenutnega igralca **pod tablo** (ne zgoraj). Trenutno je info v `fixed top-3` baru. Dodamo majhen prikaz pod tablo v `KaceLestveGame.tsx`:
```tsx
{/* Pod tablo: kdo je na vrsti */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
  <img src={avatarUrl} className="w-8 h-8" />
  <span className="text-white font-black text-sm">NA VRSTI</span>
</div>
```

---

### 2. `src/data/kaceLestveConfig.ts` — 4 odtenki zelene

Spremembe:
- Dodamo `GREEN_SEMI` konstanto
- `getCellColor` → `% 4` s 4 barvami
- `getCellTextColor` → `% 4` s pravilnimi tekstovnimi barvami

---

### 3. `src/components/games/KaceLestveGame.tsx` — Home gumb s dropdown menijem

**Trenutno stanje**: Ločen Home gumb + ločen Settings gumb (dva ločena okrogla gumba).

**Novo stanje**: En Home gumb (oranžen, kot na ostalih igrah), ki ob kliku odpre dropdown meni z možnostmi:
- 🏠 Nazaj
- 📖 Navodila
- ⚙️ Nastavitve

**Referenčni vzorec** (iz `GenericMetKockeGame.tsx`):
```tsx
<div className="fixed bottom-4 left-4 z-50">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ...">
        <Home className="h-7 w-7 text-white" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl" align="start" side="top" sideOffset={8}>
      <button onClick={() => setShowExitDialog(true)}>🏠 Nazaj</button>
      <button onClick={() => setShowInstructions(true)}>📖 Navodila</button>
      <button onClick={() => setShowSettingsInGame(true)}>⚙️ Nastavitve</button>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

**Navodila (InstructionsModal)** — ker ta igra nima lastnega `InstructionsModal`, ga dodamo inline v `KaceLestveGame.tsx`. Vsebina navodil:

> **PRAVILA IGRE**
> MET KOCKE IN PREMIK FIGURICE. PRISTANI NA POLJU S LESTVIJO — VZPNEŠ SE SKRIJ! ODGOVORI PRAVILNO IN DOBI BONUS POLJE. PRISTANI NA GLAVI KAČE — PAZI! ODGOVORI PRAVILNO IN OSTANEŠ ZGORAJ. ZA ZMAGO POTREBUJEŠ TOČEN MET NA CILJ.

Navodila prikažemo z obstoječim `InstructionsModal` komponentom.

**Zmajček na vrsti pod tablo** — v `KaceLestveGame.tsx` premestimo info iz `fixed top-3` baru in ga prikažemo pod tablo (absolutno, v kontekstu flex containera).

---

### Povzetek sprememb po datotekah

| Datoteka | Spremembe |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | Dodamo `GREEN_SEMI`, spremenimo `% 3` → `% 4`, posodobimo `getCellTextColor` |
| `src/components/games/KaceLestveBoard.tsx` | (1) Odstranim mali corner overlay z z-index 10, (2) SVG z-index 1 pod gridom (z-index 2), (3) Tanjše kače (2.2/3.2), (4) Kačja glava z elipso + nosom + usti, (5) Gladka krivulja brez špic |
| `src/components/games/KaceLestveGame.tsx` | (1) Home gumb → DropdownMenu z Nazaj/Navodila/Nastavitve, (2) Odstranim ločen Settings gumb, (3) Dodamo InstructionsModal, (4) Zmajček na vrsti prikazan pod tablo |
