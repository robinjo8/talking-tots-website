
# Plan: Popravki sistema "Vzemi zvezdico" za Kolo besed, Smešne povedi in Vaje motorike govoril

## Povzetek analize

Po pregledu kode sem ugotovil naslednje:

### Igre, ki PRAVILNO shranjujejo zvezdice:
| Igra | Komponenta | Klic za shranjevanje |
|------|-----------|---------------------|
| Spomin | `useMemoryGame*.tsx` | `recordGameCompletion('memory', letter)` |
| Sestavljanka | `GenericSestavljankaGame.tsx` | `recordGameCompletion()` |
| Drsna sestavljanka | `GenericDrsnaSestavljankaGame.tsx` | `recordGameCompletion('sliding_puzzle', ...)` |
| Labirint | `GenericLabirintGame.tsx` | `recordGameCompletion('maze', ...)` |
| Zaporedja | `GenericZaporedjaGame.tsx` | `recordGameCompletion('memory', ...)` |
| Igra ujemanja | `GenericIgraUjemanjaGame.tsx` | `recordGameCompletion('matching', ...)` |
| Bingo | `GenericBingoGame.tsx` | `recordExerciseCompletion()` |
| Ponovi poved | `PonoviPovedGame.tsx` | Direkten insert v `progress` tabelo |
| Vaje motorike govoril | `useExerciseProgress.ts` | `recordExerciseCompletion('vaje_motorike_govoril')` - **DELUJE, ampak dodeli 1 zvezdico** |

### Igre z NAPAKO - NE shranjujejo zvezdic:

#### 1. KOLO BESED (`GenericWheelGame.tsx`)
**Problem:** Funkcija `handleStarClaimed` (vrstice 49-55) NE kliče `recordExerciseCompletion`. Hook `useWordProgress` shranjuje samo v `localStorage`, ne v Supabase.

#### 2. SMEŠNE POVEDI (`GenericMetKockeGame.tsx`)
**Problem:** Funkcija `handleClaimStar` (vrstice 128-137) uporablja `incrementProgress` iz `useWordProgress`, ki shranjuje samo v `localStorage`.

#### 3. POVEZI PARE - tole je ločena igra od "Igra ujemanja"!
**Problem:** Funkcija `handleStarClaimed` (vrstica 104-106) samo nastavi gumb za novo igro, brez klica za shranjevanje v bazo.

### Posebna zahteva: Vaje motorike govoril
Trenutno ta vaja pri zaključku vseh 27 kartic dodeli **1 zvezdico**. Uporabnik želi, da dodeli **3 zvezdice**.

---

## Tehnične spremembe

### 1. Kolo besed - `GenericWheelGame.tsx`

Dodati import in uporabo `useEnhancedProgress`:

```tsx
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

// V komponenti:
const { recordExerciseCompletion } = useEnhancedProgress();

// Popraviti handleStarClaimed:
const handleStarClaimed = async () => { 
  recordExerciseCompletion(`kolo-besed-${letter}`);  // DODANO
  if (selectedWord) resetWordProgress(selectedWord.word); 
  closeResult(); 
  await new Promise(resolve => setTimeout(resolve, 500));
  await checkForNewTrophy();
};
```

---

### 2. Smešne povedi - `GenericMetKockeGame.tsx`

Dodati import in uporabo `useEnhancedProgress`:

```tsx
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

// V komponenti:
const { recordExerciseCompletion } = useEnhancedProgress();

// Popraviti handleClaimStar:
const handleClaimStar = useCallback(async () => {
  recordExerciseCompletion(`smesne-povedi-${letter}`);  // DODANO
  if (selectedBitje !== null) {
    incrementProgress(bitje[selectedBitje].word);
  }
  closeStarDialog();
  setShowNewGameButton(true);
  await new Promise(resolve => setTimeout(resolve, 500));
  await checkForNewTrophy();
}, [recordExerciseCompletion, letter, selectedBitje, bitje, incrementProgress, closeStarDialog, checkForNewTrophy]);
```

---

### 3. Povezi pare - `GenericPoveziPareGame.tsx`

Dodati import in uporabo `useEnhancedProgress` ter `useTrophyContext`:

```tsx
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";

// V komponenti:
const { recordGameCompletion } = useEnhancedProgress();
const { checkForNewTrophy } = useTrophyContext();

// Popraviti handleStarClaimed:
const handleStarClaimed = async () => {
  recordGameCompletion('matching', config.trackingId);  // DODANO
  setShowNewGameButton(true);
  await new Promise(resolve => setTimeout(resolve, 500));
  await checkForNewTrophy();  // DODANO
};
```

---

### 4. Vaje motorike govoril - 3 zvezdice namesto 1

**Datoteka:** `src/hooks/useExerciseProgress.ts`

Spremeniti klic `recordExerciseCompletion` tako, da pošlje 3 zvezdice:

```tsx
// Trenutno (vrstica 67):
recordExerciseCompletion('vaje_motorike_govoril');

// Potrebno spremeniti v triple klic ALI spremeniti useEnhancedProgress
```

**MOŽNOST A:** Klicati 3x zapored:
```tsx
recordExerciseCompletion('vaje_motorike_govoril');
recordExerciseCompletion('vaje_motorike_govoril');
recordExerciseCompletion('vaje_motorike_govoril');
```

**MOŽNOST B (boljša):** Dodati parameter za število zvezdic v `useEnhancedProgress`:

V `useEnhancedProgress.ts` spremeniti funkcijo:
```tsx
const recordExerciseCompletion = (exerciseType: string = 'vaje_motorike_govoril', starsCount: number = 1) => {
  recordProgressMutation.mutate({
    activityType: 'exercise',
    activitySubtype: exerciseType,
    starsEarned: starsCount,  // Uporabi parameter
    sessionMetadata: { exerciseType, starsCount }
  });
};
```

Nato v `useExerciseProgress.ts`:
```tsx
recordExerciseCompletion('vaje_motorike_govoril', 3);  // Dodeli 3 zvezdice
```

---

## Diagram popravkov

```text
┌─────────────────────────────────────────────────────────────────┐
│                      KOLO BESED                                  │
│  handleStarClaimed() ──► recordExerciseCompletion()  ──► DB    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SMEŠNE POVEDI                                 │
│  handleClaimStar() ──► recordExerciseCompletion()  ──► DB      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    POVEZI PARE                                   │
│  handleStarClaimed() ──► recordGameCompletion()  ──► DB        │
│                      ──► checkForNewTrophy()                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               VAJE MOTORIKE GOVORIL                              │
│  completeCard(27) ──► recordExerciseCompletion(*, 3)  ──► DB   │
│                        ⭐⭐⭐ 3 zvezdice                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Vrstni red implementacije

1. **useEnhancedProgress.ts** - dodati parameter `starsCount` v `recordExerciseCompletion`
2. **GenericWheelGame.tsx** (Kolo besed) - dodati klic za shranjevanje
3. **GenericMetKockeGame.tsx** (Smešne povedi) - dodati klic za shranjevanje
4. **GenericPoveziPareGame.tsx** (Povezi pare) - dodati klic za shranjevanje + checkForNewTrophy
5. **useExerciseProgress.ts** (Vaje motorike govoril) - spremeniti na 3 zvezdice

---

## Testiranje

Po implementaciji je potrebno preveriti:
1. Odigrati vsako igro/vajo do konca
2. Klikniti "VZEMI ZVEZDICO"
3. Odpreti `/moja-stran` in preveriti, da se zvezdica prikaže
4. Posebej preveriti, da Vaje motorike govoril doda 3 zvezdice
