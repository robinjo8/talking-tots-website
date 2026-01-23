
# Načrt: Popravek grupiranja posnetkov po črkah

## Problem

Posnetki za črke Č, Š, Ž se ne prikazujejo pravilno, ker:

1. Pri shranjevanju se imena datotek **sanitizirajo**: `Ž` → `Z`, `Š` → `S`, `Č` → `C`
2. Primer: `ŽOGA` se shrani kot `Z-57-ZOGA-...webm`
3. Pri parsanju se črka `Z` prebere iz imena datoteke
4. Posnetek se zato prikaže pod accordion za črko **Z** namesto **Ž**

## Rešitev

Uporabiti **wordIndex** iz imena datoteke za določitev pravilne črke, saj je wordIndex unikaten in zaporeden po fonetičnem vrstnem redu.

### Logika mapiranja

V `articulationTestData.ts` je 20 črk, vsaka s 3 besedami = 60 besed total.

Fonetični vrstni red: `P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č, R`

| Črka | Indeksi besed |
|------|---------------|
| P    | 0, 1, 2       |
| B    | 3, 4, 5       |
| M    | 6, 7, 8       |
| ...  | ...           |
| Š    | 48, 49, 50    |
| **Ž**| **51, 52, 53**|
| Č    | 54, 55, 56    |
| R    | 57, 58, 59    |

**Opomba**: Glede na sliko uporabnika ima Ž indekse 57, 58, 59 - kar pomeni, da je vrstni red v bazi drugačen. Moramo preveriti dejanski vrstni red.

---

## Datoteke za spremeniti

### 1. `src/data/evaluationOptions.ts`

Dodaj helper funkcijo za mapiranje wordIndex → prava črka:

```typescript
// Mapiranje wordIndex na pravilno črko (upošteva sanitizacijo imen datotek)
export function getLetterFromWordIndex(wordIndex: number): string {
  // Vsaka črka ima 3 besede
  const letterIndex = Math.floor(wordIndex / 3);
  return PHONETIC_ORDER[letterIndex] || 'X';
}
```

Posodobi `parseRecordingFilename`:

```typescript
export function parseRecordingFilename(filename: string): {
  letter: string;
  wordIndex: number;
  word: string;
} | null {
  const match = filename.match(/^([A-ZČŠŽ]+)-(\d+)-([A-ZČŠŽ]+)-/i);
  if (!match) return null;
  
  const wordIndex = parseInt(match[2], 10);
  
  // Uporabi wordIndex za določitev prave črke (obide sanitizacijo imen)
  const actualLetter = getLetterFromWordIndex(wordIndex);
  
  return {
    letter: actualLetter,
    wordIndex: wordIndex,
    word: match[3].toUpperCase(),
  };
}
```

---

## Vizualni rezultat

**Prej** (napačno):
- Črka Z: 6 posnetkov (3 za Z + 3 sanitizirane za Ž)
- Črka Ž: 0 posnetkov

**Potem** (pravilno):
- Črka Z: 3 posnetki (Z-ZORA, Z-KOZA, Z-OBRAZ)
- Črka Ž: 3 posnetki (Ž-ŽOGA, Ž-ROŽA, Ž-JEŽ)

---

## Preveritev vrstnega reda

Pred implementacijo moramo preveriti:
1. Kakšen je dejanski vrstni red črk v `articulationTestData.ts`
2. Kakšni so wordIndex-i za posamezne črke

Iz slike uporabnika:
- `Z-57-ZOGA` → wordIndex 57 za ŽOGA
- `Z-58-ROZA` → wordIndex 58 za ROŽA
- `Z-59-JEZ` → wordIndex 59 za JEŽ

To pomeni, da je Ž na poziciji 19 (indeksi 57-59), kar ustreza vrstnemu redu če je Ž na koncu.

**Dejanski fonetični vrstni red v kodi:**
`P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č, R`

- Ž je na indeksu 17 → besede bi morale imeti indekse 51, 52, 53
- Ampak datoteke imajo 57, 58, 59

To nakazuje, da `articulationTestData.ts` **NI sortiran po fonetičnem vrstnem redu** ampak je v drugačnem vrstnem redu (verjetno abecednem).

### Rešitev: Dinamično mapiranje

Namesto statičnega izračuna, preberi dejanske indekse iz `articulationTestData.ts`:

```typescript
import { articulationData } from '@/data/articulationTestData';

// Ustvari mapiranje wordIndex → črka iz dejanskih podatkov
const wordIndexToLetterMap = new Map<number, string>();

let currentIndex = 0;
articulationData.forEach(letterData => {
  letterData.words.forEach(() => {
    wordIndexToLetterMap.set(currentIndex, letterData.letter);
    currentIndex++;
  });
});

export function getLetterFromWordIndex(wordIndex: number): string {
  return wordIndexToLetterMap.get(wordIndex) || 'X';
}
```

---

## Povzetek sprememb

| Datoteka | Operacija |
|----------|-----------|
| `src/data/evaluationOptions.ts` | POSODOBI - dodaj dinamično mapiranje wordIndex → črka |

Ena datoteka za spremeniti, enostavna rešitev.
