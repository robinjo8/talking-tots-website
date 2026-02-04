

# Načrt: Sprememba vrstnega reda črk na S Z C Š Ž Č K L R

## Povzetek

Zamenjati je potrebno vrstni red črk v vseh izbirnikih za igre in video navodila:

| Trenutni vrstni red | Novi vrstni red |
|---------------------|-----------------|
| C, Č, K, L, R, S, Š, Z, Ž | **S, Z, C, Š, Ž, Č, K, L, R** |

## Prizadete datoteke

Spremembe se nanašajo na **20 datotek** (10 uporabniških + 9 admin + 1 konfiguracija):

### Uporabniški portal (10 datotek)

| Datoteka | Array za preureditev | Št. vrstic |
|----------|---------------------|-------------|
| `src/pages/KoloSreceGames.tsx` | `wheelLetters` | vrstice 17-27 |
| `src/pages/BingoGames.tsx` | `bingoLetters` | vrstice 16-26 |
| `src/pages/SpominGames.tsx` | `memoryGames` | vrstice 17-99 |
| `src/pages/VideoNavodila.tsx` | `videoLetters` | vrstice 7-53 |
| `src/pages/Zaporedja.tsx` | `sequenceGames` | vrstice 15-88 |
| `src/pages/SestavljankeGames.tsx` | `memoryGames` | vrstice 15-88 |
| `src/pages/DrsnaSestavljanka.tsx` | `memoryGames` | vrstice 16-89 |
| `src/pages/IgraUjemanja.tsx` | `matchingGames` | vrstice 16-89 |
| `src/pages/MetKockeGames.tsx` | uporablja `metKockeConfig.ts` | - |
| `src/pages/PonoviPoved.tsx` | `ponoviPovedLetters` | vrstice 15-97 |

### Admin portal (9 datotek)

| Datoteka | Array za preureditev |
|----------|---------------------|
| `src/pages/admin/games/AdminKoloSreceGames.tsx` | `wheelLetters` |
| `src/pages/admin/games/AdminBingoGames.tsx` | `bingoLetters` |
| `src/pages/admin/games/AdminSpominGames.tsx` | `memoryGames` |
| `src/pages/admin/AdminVideoNavodila.tsx` | `videoLetters` |
| `src/pages/admin/games/AdminSestavljankeGames.tsx` | `sestavljankeLetters` |
| `src/pages/admin/games/AdminLabirintGames.tsx` | `labirintLetters` |
| `src/pages/admin/games/AdminZaporedjaGames.tsx` | `zaporedjaLetters` |
| `src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx` | `drsnaSestavljankaLetters` |
| `src/pages/admin/games/AdminPonoviPovedGames.tsx` | `ponoviPovedLetters` |
| `src/pages/admin/games/AdminIgraUjemanjaGames.tsx` | `igraUjemanjaLetters` |

### Konfiguracijska datoteka (1 datoteka)

| Datoteka | Array za preureditev |
|----------|---------------------|
| `src/data/metKockeConfig.ts` | `metKockeLetters` (vrstice 264-274) |
| `src/data/poveziPareConfig.ts` | `lettersByAge` arraye |

## Primer spremembe

### Prej (KoloSreceGames.tsx):
```typescript
const wheelLetters = [
  { id: "c", letter: "C", ... },
  { id: "ch", letter: "Č", ... },
  { id: "k", letter: "K", ... },
  { id: "l", letter: "L", ... },
  { id: "r", letter: "R", ... },
  { id: "s", letter: "S", ... },
  { id: "sh", letter: "Š", ... },
  { id: "z", letter: "Z", ... },
  { id: "zh", letter: "Ž", ... },
];
```

### Potem:
```typescript
const wheelLetters = [
  { id: "s", letter: "S", ... },   // 1. S
  { id: "z", letter: "Z", ... },   // 2. Z
  { id: "c", letter: "C", ... },   // 3. C
  { id: "sh", letter: "Š", ... },  // 4. Š
  { id: "zh", letter: "Ž", ... },  // 5. Ž
  { id: "ch", letter: "Č", ... },  // 6. Č
  { id: "k", letter: "K", ... },   // 7. K
  { id: "l", letter: "L", ... },   // 8. L
  { id: "r", letter: "R", ... },   // 9. R
];
```

## Posebni primeri

### 1. poveziPareConfig.ts - Starostna skupina 3-4

Ta skupina ima samo 4 črke. Novi vrstni red bo:

| Trenutno | Novo |
|----------|------|
| C, Č, K, L | **C, Č, K, L** (brez sprememb - te črke niso v prvih 5 novega reda) |

Ker se črke S, Z, Š, Ž ne pojavljajo pri starostni skupini 3-4, bo vrstni red ostal:
- **C, Č, K, L** (iz novega reda vzamemo samo te, ki so na voljo)

### 2. metKockeConfig.ts

Ta datoteka vsebuje `metKockeLetters` array, ki ga uporablja MetKockeGames.tsx.

## Skupaj

| Kategorija | Št. datotek |
|------------|-------------|
| Uporabniški portal | 10 |
| Admin portal | 10 |
| Konfiguracije | 2 |
| **SKUPAJ** | **22** |

## Vizualni rezultat

Po spremembi bodo kartice na vseh straneh prikazane v tem vrstnem redu:

```text
┌───┐ ┌───┐ ┌───┐
│ S │ │ Z │ │ C │
└───┘ └───┘ └───┘
┌───┐ ┌───┐ ┌───┐
│ Š │ │ Ž │ │ Č │
└───┘ └───┘ └───┘
┌───┐ ┌───┐ ┌───┐
│ K │ │ L │ │ R │
└───┘ └───┘ └───┘
```

