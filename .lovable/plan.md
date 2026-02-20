
## Spremembe: "ZABAVNA POT", kartice za vse glasove, breadcrumb

### Kaj bo narejeno

**1. `src/components/games/GamesList.tsx`** — preimenovanje kartice
- `title`: `"KAČE IN LESTVE"` → `"ZABAVNA POT"`
- `description`: posodobiti ustrezno

**2. `src/pages/KaceLestveGames.tsx`** — nova stran z vsemi 9 karticami zmajčkov
Trenutno ima ta stran samo eno kartico (glas C). Dodat je treba še preostalih 8 kartic, ki bodo videti **popolnoma enako** kot na `/govorne-igre/labirint` (Labirint.tsx):
- Enaka struktura kartic: zmajček slika z `mixBlendMode: multiply`, gradient ozadje, naslov `Glas X`
- Enak vrstni red: **S, Z, C, Š, Ž, Č, K, L, R** (kot v memory specifikaciji)
- Enake slike zmajčkov iz bucketa `zmajcki`: `zmajcek_crka_S.png`, `zmajcek_crka_Z.png`, `zmajcek_crka_C.png`, `zmajcek_crka_SH.png`, `zmajcek_crka_ZH.png`, `zmajcek_crka_CH.png`, `zmajcek_crka_K.png`, `zmajcek_crka_L.png`, `zmajcek_crka_R.png`
- Enaka gradientna ozadja kot pri Labirint straneh
- Poti: `/govorne-igre/kace/s`, `/govorne-igre/kace/z`, `/govorne-igre/kace/c`, itd.
- Naslov strani: `"Zabavna pot"`, podnaslov: `"Izberi glas in igraj!"`

**3. `src/components/BreadcrumbNavigation.tsx`** — breadcrumb popravki
- Dodati vnos za `/govorne-igre/kace` z oznako `"Zabavna pot"` in parent `"/govorne-igre"`
- Dodati vnose za posamezne glasove (npr. `/govorne-igre/kace/c` → `"C"`, parent `/govorne-igre/kace`)

**4. `src/pages/KaceLestveGames.tsx`** — popravek naslova strani
- h1: `"Kače in lestve"` → `"Zabavna pot"`

### Glasovi v KaceLestveGames.tsx

| Glas | URL ključ | Slika zmajčka | Gradient |
|---|---|---|---|
| S | s | zmajcek_crka_S.png | dragon-green/20 → app-teal/20 |
| Z | z | zmajcek_crka_Z.png | app-teal/20 → dragon-green/20 |
| C | c | zmajcek_crka_C.png | dragon-green/20 → dragon-green/20 |
| Š | sh | zmajcek_crka_SH.png | app-blue/20 → app-purple/20 |
| Ž | zh | zmajcek_crka_ZH.png | app-purple/20 → app-blue/20 |
| Č | ch | zmajcek_crka_CH.png | app-blue/20 → app-teal/20 |
| K | k | zmajcek_crka_K.png | app-orange/20 → app-yellow/20 |
| L | l | zmajcek_crka_L.png | app-purple/20 → app-blue/20 |
| R | r | zmajcek_crka_R.png | app-purple/20 → app-teal/20 |

Opomba: Kartice za glasove S, Z, Š, Ž, Č, K, L, R bodo vidne na strani, ampak ker igra za te glasove še ne obstaja, bo klik za zdaj preusmerjen na `/govorne-igre/kace` (placeholders). Glas C je edini, ki ima pravo igro.

### Datoteke za spremembo

| Datoteka | Sprememba |
|---|---|
| `src/components/games/GamesList.tsx` | KAČE IN LESTVE → ZABAVNA POT |
| `src/pages/KaceLestveGames.tsx` | Dodati 8 novih kartic, naslov ZABAVNA POT, posodobiti navigacijo |
| `src/components/BreadcrumbNavigation.tsx` | Dodati breadcrumb vnose za /govorne-igre/kace in podstrani |
