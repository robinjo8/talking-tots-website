

# Nacrt: Zamenjava "Crka" z "Glas" na vseh straneh

## Povzetek

Zamenjati je potrebno vse pojave "Crka X" z "Glas X" (npr. "Crka C" -> "Glas C") za vse crke: C, C, K, L, R, S, S, Z, Z.

## Ugotovitve iz raziskave

Nasli smo **359 pojavov** besede "Crka" v **39 datotekah**. Spremembe so razdeljene na dve vrsti:

### Tip 1: Staticni naslovi v konfiguracijah (title: "Crka X")
Te datoteke vsebujejo hardkodane naslove v data arrayih:

| Datoteka | Stevilo zamenjav |
|----------|------------------|
| `src/pages/KoloSreceGames.tsx` | 9x |
| `src/pages/BingoGames.tsx` | 9x |
| `src/pages/admin/games/AdminKoloSreceGames.tsx` | 9x |
| `src/pages/admin/games/AdminBingoGames.tsx` | 9x |
| `src/data/metKockeConfig.ts` | 9x |

### Tip 2: Dinamicni napisi z template literali
Te datoteke uporabljajo obliko `` `Crka ${letter}` `` ali "Crka {game.letter}":

| Datoteka | Lokacija |
|----------|----------|
| `src/pages/SpominGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/games/AdminSpominGames.tsx` | h3 naslov + alt atribut |
| `src/pages/VideoNavodila.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/AdminVideoNavodila.tsx` | h3 naslov + alt atribut |
| `src/pages/Zaporedja.tsx` | h3 naslov + alt atribut |
| `src/pages/SestavljankeGames.tsx` | h3 naslov + alt atribut |
| `src/pages/DrsnaSestavljanka.tsx` | h3 naslov + alt atribut |
| `src/pages/IgraUjemanja.tsx` | h3 naslov + alt atribut |
| `src/pages/MetKockeGames.tsx` | alt atribut |
| `src/pages/PonoviPoved.tsx` | h3 naslov + alt atribut |
| `src/pages/ArtikulacijaVaje.tsx` | alt atribut |
| `src/pages/admin/games/AdminSestavljankeGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/games/AdminLabirintGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/games/AdminZaporedjaGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/games/AdminPonoviPovedGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/games/AdminIgraUjemanjaGames.tsx` | h3 naslov + alt atribut |
| `src/pages/admin/exercises/AdminArtikulacijaVaje.tsx` | h3 naslov + alt atribut |
| `src/data/poveziPareConfig.ts` | fallback description |

### Datoteke BREZ sprememb
Te vsebujejo kontekstualne omembe (npr. navodila, komentarji) in ne bodo spremenjene:
- `src/components/articulation/ArticulationTestInstructionsDialog.tsx` - navodila za test
- `src/components/CookieSettingsDialog.tsx` - tehnicni opis
- `src/components/admin/LetterAccordion.tsx` - uporablja "CRKA" (druga oblika)
- `src/hooks/useSessionReview.ts` - komentar v kodi

## Seznam sprememb po datotekah

### Uporabniski portal (8 datotek)

1. **`src/pages/SpominGames.tsx`**
   - Vrstica 140: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`
   - Vrstica 150: `Crka {game.letter}` -> `Glas {game.letter}`

2. **`src/pages/KoloSreceGames.tsx`**
   - Vrstice 18-26: `title: "Crka X"` -> `title: "Glas X"` (9x za vse crke)

3. **`src/pages/BingoGames.tsx`**
   - Vrstice 17-25: `title: "Crka X"` -> `title: "Glas X"` (9x za vse crke)

4. **`src/pages/VideoNavodila.tsx`**
   - Vrstica 92: `alt={`Crka ${letter.letter}`}` -> `alt={`Glas ${letter.letter}`}`
   - Vrstica 105: `Crka {letter.letter}` -> `Glas {letter.letter}`

5. **`src/pages/Zaporedja.tsx`**
   - Vrstica 161: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`
   - Vrstica 171: `Crka {game.letter}` -> `Glas {game.letter}`

6. **`src/pages/SestavljankeGames.tsx`**
   - Vrstica 167: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`
   - Vrstica 177: `Crka {game.letter}` -> `Glas {game.letter}`

7. **`src/pages/DrsnaSestavljanka.tsx`**
   - Vrstica 161: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`
   - Vrstica 171: `Crka {game.letter}` -> `Glas {game.letter}`

8. **`src/pages/IgraUjemanja.tsx`**
   - Vrstica 160: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`
   - Vrstica 170: `Crka {game.letter}` -> `Glas {game.letter}`

9. **`src/pages/MetKockeGames.tsx`**
   - Vrstica 79: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`

10. **`src/pages/PonoviPoved.tsx`**
    - Vrstica 148: `alt={`Crka ${letter.letter}`}` -> `alt={`Glas ${letter.letter}`}`
    - Vrstica 158: `Crka {letter.letter}` -> `Glas {letter.letter}`

11. **`src/pages/ArtikulacijaVaje.tsx`**
    - Vrstica 55: `alt={`Crka ${letter.letter}`}` -> `alt={`Glas ${letter.letter}`}`

### Admin portal (9 datotek)

12. **`src/pages/admin/games/AdminSpominGames.tsx`**
    - Vrstica 97: `alt={`Crka ${game.letter}`}` -> `alt={`Glas ${game.letter}`}`
    - Vrstica 107: `Crka {game.letter}` -> `Glas {game.letter}`

13. **`src/pages/admin/games/AdminKoloSreceGames.tsx`**
    - Vrstice 6-14: `title: "Crka X"` -> `title: "Glas X"` (9x)

14. **`src/pages/admin/games/AdminBingoGames.tsx`**
    - Vrstice 6-14: `title: "Crka X"` -> `title: "Glas X"` (9x)

15. **`src/pages/admin/AdminVideoNavodila.tsx`**
    - Vrstica 86: `alt={`Crka ${letter.letter}`}` -> `alt={`Glas ${letter.letter}`}`
    - Vrstica 98: `Crka {letter.letter}` -> `Glas {letter.letter}`

16. **`src/pages/admin/games/AdminSestavljankeGames.tsx`**
    - Vrstica 48: `alt={`Crka ${item.letter}`}` -> `alt={`Glas ${item.letter}`}`
    - Vrstica 56: `Crka {item.letter}` -> `Glas {item.letter}`

17. **`src/pages/admin/games/AdminLabirintGames.tsx`**
    - Vrstica 48: `alt={`Crka ${item.letter}`}` -> `alt={`Glas ${item.letter}`}`
    - Vrstica 56: `Crka {item.letter}` -> `Glas {item.letter}`

18. **`src/pages/admin/games/AdminZaporedjaGames.tsx`**
    - Vrstica 48: `alt={`Crka ${item.letter}`}` -> `alt={`Glas ${item.letter}`}`
    - Vrstica 56: `Crka {item.letter}` -> `Glas {item.letter}`

19. **`src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx`**
    - Vrstica 48: `alt={`Crka ${item.letter}`}` -> `alt={`Glas ${item.letter}`}`
    - Vrstica 56: `Crka {item.letter}` -> `Glas {item.letter}`

20. **`src/pages/admin/games/AdminPonoviPovedGames.tsx`**
    - Vrstica 48: `alt={`Crka ${item.letter}`}` -> `alt={`Glas ${item.letter}`}`
    - Vrstica 56: `Crka {item.letter}` -> `Glas {item.letter}`

21. **`src/pages/admin/games/AdminIgraUjemanjaGames.tsx`**
    - Vrstica 48: `alt={`Crka ${item.letter}`}` -> `alt={`Glas ${item.letter}`}`

22. **`src/pages/admin/exercises/AdminArtikulacijaVaje.tsx`**
    - Vrstice 52, 60, 84: zamenjave alt in h3

### Konfiguracijske datoteke (2 datoteki)

23. **`src/data/metKockeConfig.ts`**
    - Vrstice 265-273: `title: "Crka X"` -> `title: "Glas X"` (9x)

24. **`src/data/poveziPareConfig.ts`**
    - Vrstice 132, 159: `description: ... `Crka ${letter}`` -> `description: ... `Glas ${letter}``

## Skupaj

| Kategorija | St. datotek | St. zamenjav |
|------------|-------------|--------------|
| Uporabniski portal | 11 | ~40 |
| Admin portal | 11 | ~40 |
| Konfiguracije | 2 | ~30 |
| **SKUPAJ** | **24** | **~110** |

## Vizualni rezultat

| Prej | Potem |
|------|-------|
| Crka C | Glas C |
| Crka C | Glas C |
| Crka K | Glas K |
| ... | ... |

