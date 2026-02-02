
# Načrt: Popravek sistema za nadaljevanje seje

## Ugotovljeni problemi

### Problem 1: Dvojno inkrementiranje indeksa besede

Trenutna logika ima napako v štetju:

```
Ko uporabnik izgovori ROŽA (indeks 57) in pritisne NAPREJ:
1. handleNext() izračuna nextIndex = 57 + 1 = 58
2. handleNext() pokliče onSaveProgress(childId, sessionNumber, 58)
3. updateProgress(58) shrani current_word_index = 58 + 1 = 59  ❌ NAPAKA

Rezultat: V bazi je shranjeno 59 (SIR), čeprav bi moralo biti 58 (URA)
```

**Vzrok:** Funkcija `updateProgress` doda +1, ampak prejme že inkrementirano vrednost.

### Problem 2: Dialog prikaže napačno besedo

Dialog prikaže besedo na indeksu `current_word_index` iz baze. Ker je tam 59, se prikaže SIR (60/60) namesto URA.

**Pravilna logika:**
- `current_word_index` naj pomeni "naslednja beseda za izgovorjavo" (ne "že izgovorjena beseda + 1")
- Dialog naj prikaže "Zadnja izgovorjena beseda" = beseda na indeksu `current_word_index - 1`

### Problem 3: Gumb "Začni znova" ne briše seje

Trenutno `handleStartOver` samo zapre dialog in pokaže info dialog, ampak seje v bazi ne ponastavi.

---

## Rešitev

### Sprememba 1: Popravek `updateProgress` v `useLogopedistSessionManager.ts`

Odstraniti podvajanje +1:

```typescript
// PREJ (narobe):
.update({ current_word_index: wordIndex + 1 })

// POTEM (pravilno):
.update({ current_word_index: wordIndex })
```

**Zakaj:** `handleNext` že pošlje `nextIndex` ki je inkrementirano. Ni potrebe za še eno inkrementiranje.

### Sprememba 2: Popravek dialoga v `AdminArtikulacijskiTest.tsx`

Dialog mora prikazati **zadnjo izgovorjeno besedo**, ne naslednjo:

```typescript
// PREJ:
setResumeWordIndex(existingSession.startIndex);

// POTEM:
// startIndex je "naslednja beseda za izgovorjavo"
// Za prikaz "zadnje izgovorjene" uporabimo startIndex - 1
const lastSpokenWordIndex = existingSession.startIndex > 0 
  ? existingSession.startIndex - 1 
  : 0;
setResumeWordIndex(lastSpokenWordIndex);
```

### Sprememba 3: Poenostavitev dialoga `ArticulationResumeDialog.tsx`

Po zahtevi uporabnika odstraniti:
- Ikono 📍 in ⏱️
- Tekst "(60/60)"
- Tekst "Shranjeno: prejšnja seja"

Nova vsebina:

```
🔄 Nadaljevanje preverjanja

Zaznali smo nedokončano preverjanje. Ali želite nadaljevati?

Zadnja izgovorjena beseda je bila: [BESEDA]

[Začni znova]  [Nadaljuj]
```

### Sprememba 4: Implementacija "Začni znova" v `useLogopedistSessionManager.ts`

Dodati novo funkcijo `resetSession` za ponastavitev seje:

```typescript
const resetSession = useCallback(async (childId: string): Promise<SessionInfo | null> => {
  if (!sessionInfo) return null;
  
  // Izbriši trenutno nedokončano sejo
  await supabase
    .from('articulation_test_sessions')
    .delete()
    .eq('id', sessionInfo.sessionId);
  
  // Ustvari novo sejo od začetka
  setSessionInfo(null);
  return initializeSession(childId, sessionInfo.totalWords);
}, [sessionInfo, initializeSession]);
```

### Sprememba 5: Povezava "Začni znova" v `AdminArtikulacijskiTest.tsx`

```typescript
const handleStartOver = async () => {
  if (childId) {
    // Ponastavi sejo v bazi in začni od začetka
    await resetSession(childId);
  }
  setShowResumeDialog(false);
  setShowInfoDialog(true);
};
```

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useLogopedistSessionManager.ts` | Odstrani +1 v `updateProgress`, dodaj `resetSession` funkcijo |
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Popravi izračun `resumeWordIndex`, uporabi `resetSession` za "Začni znova" |
| `src/components/articulation/ArticulationResumeDialog.tsx` | Poenostavi prikaz - odstrani ikone, (X/Y), "Shranjeno" tekst |

---

## Končni rezultat

Po popravku:
1. **Pravilno shranjevanje:** Če izgovoriš ROŽA in greš na URA, se v bazo shrani `current_word_index = 58` (URA)
2. **Pravilno nadaljevanje:** Dialog prikaže "Zadnja izgovorjena beseda je bila: ROŽA" in test nadaljuje od URA
3. **Pravilno resetiranje:** Gumb "Začni znova" pobriše sejo in začne od prve besede
4. **Enostavnejši dialog:** Brez odvečnih informacij, samo bistvo
