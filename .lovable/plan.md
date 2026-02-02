
# Načrt: Popravek shranjevanja napredka ob snemanju

## Ugotovljen problem

### Trenutni tok (napačen)

```text
1. Uporabnik izgovori ROŽA (indeks 57) ✓ 
2. Transkripcija uspe ✓
3. Uporabnik klikne "NAPREJ"
4. handleNext() se izvede:
   - setCurrentWordIndex(58)  → premik na URA
   - onSaveProgress(58)       → shrani 58 v bazo   ← NAPAKA!
5. Uporabnik vidi URA, a je NE izgovori
6. Uporabnik zapusti test
7. V bazi: current_word_index = 58 (URA)
8. Ob vrnitvi: Dialog prikaže "Zadnja izgovorjena: URA" ← NAROBE!
```

**Problem:** Napredek se shrani ob kliku na "Naprej", ne ob uspešnem snemanju. Zato se v bazo shrani naslednja beseda (ki še ni bila izgovorjena), namesto zadnje izgovorjene.

### Pravilen tok (željen)

```text
1. Uporabnik izgovori ROŽA (indeks 57) ✓
2. Transkripcija uspe ✓
3. onSaveProgress(57) → shrani 57 v bazo   ← TAKOJ po uspešnem snemanju!
4. Uporabnik klikne "NAPREJ"
5. handleNext() se izvede:
   - setCurrentWordIndex(58) → premik na URA
   - (NE shrani napredka tukaj)
6. Uporabnik vidi URA, a je NE izgovori
7. Uporabnik zapusti test
8. V bazi: current_word_index = 57 (ROŽA)
9. Ob vrnitvi: 
   - Dialog prikaže "Zadnja izgovorjena: ROŽA" ✓
   - Test nadaljuje od besede 58 (URA) ✓
```

---

## Rešitev

### Sprememba 1: Shrani napredek ob uspešnem snemanju, ne ob kliku na "Naprej"

V `useArticulationTestNew.ts`:

```typescript
// PREJ (v handleNext):
const handleNext = () => {
  if (currentWordIndex < totalWords - 1) {
    const nextIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextIndex);
    // ... 
    if (childId && sessionNumber && onSaveProgress) {
      onSaveProgress(childId, sessionNumber, nextIndex);  // ← NAROBE
    }
  }
};

// POTEM (v handleRecordingComplete):
const handleRecordingComplete = async (audioBase64: string) => {
  // ... transkripcija ...
  
  if (result && result.accepted) {
    // Uspešno snemanje - shrani napredek TAKOJ
    if (childId && sessionNumber && onSaveProgress) {
      onSaveProgress(childId, sessionNumber, currentWordIndex);  // ← PRAVILNO
    }
  }
  
  setHasRecorded(true);
};

// V handleNext odstranimo shranjevanje:
const handleNext = () => {
  if (currentWordIndex < totalWords - 1) {
    const nextIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextIndex);
    setHasRecorded(false);
    // NE shranjujemo več tukaj!
  }
};
```

### Sprememba 2: Sprememba pomena `current_word_index`

Prej: `current_word_index` = "naslednja beseda za izgovorjavo"  
Potem: `current_word_index` = "zadnja uspešno izgovorjena beseda"

To pomeni, da se ob vrnitvi test nadaljuje od `current_word_index + 1`.

### Sprememba 3: Popravek logike nadaljevanja v `AdminArtikulacijskiTest.tsx`

```typescript
// Ob preverjanju obstoječe seje:
if (existingSession && existingSession.isResume && existingSession.startIndex > 0) {
  // startIndex je "zadnja izgovorjena beseda"
  // Za prikaz dialoga uporabimo direktno startIndex
  setResumeWordIndex(existingSession.startIndex);  // ← Zadnja izgovorjena
  
  // Za nadaljevanje testa moramo začeti od startIndex + 1
  // To bo potrebno popraviti v useArticulationTestNew
}
```

### Sprememba 4: Popravek `startIndex` za hook

V `useLogopedistSessionManager.ts` - `initializeSession`:

```typescript
// Če nadaljujemo sejo, startIndex naj bo current_word_index + 1
// (ker current_word_index zdaj pomeni "zadnja izgovorjena", ne "naslednja za izgovorjavo")
return {
  sessionId: existingSession.id,
  sessionNumber: existingSession.session_number ?? 1,
  startIndex: (existingSession.current_word_index ?? 0) + 1,  // +1 za nadaljevanje
  lastSpokenIndex: existingSession.current_word_index ?? 0,   // Za prikaz dialoga
  isResume: (existingSession.current_word_index ?? 0) > 0,
  totalWords: existingSession.total_words ?? totalWords,
};
```

### Sprememba 5: Dodaj `lastSpokenIndex` v `SessionInfo`

```typescript
interface SessionInfo {
  sessionId: string;
  sessionNumber: number;
  startIndex: number;        // Naslednja beseda za izgovorjavo
  lastSpokenIndex: number;   // NOVO: Zadnja izgovorjena beseda (za dialog)
  isResume: boolean;
  totalWords: number;
}
```

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `useArticulationTestNew.ts` | Premakni `onSaveProgress` iz `handleNext` v `handleRecordingComplete` |
| `useLogopedistSessionManager.ts` | Dodaj `lastSpokenIndex` v SessionInfo, nastavi `startIndex = current_word_index + 1` |
| `AdminArtikulacijskiTest.tsx` | Uporabi `lastSpokenIndex` za prikaz dialoga |

---

## Končni rezultat

1. **Uporabnik izgovori ROŽA** → `current_word_index = 57` (shrani se takoj ob uspešnem snemanju)
2. **Uporabnik klikne Naprej** → UI se premakne na URA (indeks 58), baza se NE posodobi
3. **Uporabnik zapusti test brez izgovorjave URA**
4. **Ob vrnitvi:**
   - Dialog: "Zadnja izgovorjena beseda je bila: ROŽA" ✓
   - Test nadaljuje od URA (indeks 58) ✓
   - V ozadju je slika URA ✓
