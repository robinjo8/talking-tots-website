

## Popravek nadaljevanja preverjanja izgovorjave

### Ugotovljen korenski vzrok

Po uspesnem snemanju besede se v bazo shrani `current_word_index` kot indeks pravkar izgovorjene besede. Problem: ko je izgovorjena PRVA beseda (PAJEK, index 0), je shranjena vrednost `0`, ki je enaka zacetni vrednosti "nobena beseda izgovorjena". Sistem ne more lociti teh dveh stanj.

Moj zadnji popravek (`startIndex: lastSpoken > 0 ? lastSpoken + 1 : 0`) je ta problem se poglobil -- zdaj se po izgovorjeni prvi besedi test NE nadalje in resume dialog se NE prikaze.

### Resitev

Sprememba pomena polja `current_word_index`: namesto "zadnja izgovorjena beseda" bo pomenilo **"naslednja beseda za izgovorjavo"** (tj. shrani se `wordIndex + 1`).

S tem:
- Zacetna vrednost `0` = "zacni pri besedi 0" (nobena beseda se ni izgovorjena)
- Po izgovorjeni besedi 0 (PAJEK): shrani se `1` = "nadaljuj pri besedi 1 (KAPA)"
- Po izgovorjeni besedi 5: shrani se `6`
- Ni vec dvoumnosti

### Spremembe po datotekah

**1. `src/pages/ArtikuacijskiTest.tsx`** (vrstica ~177)
Sprememba `handleSaveProgress`: namesto `updateProgress(wordIndex)` klice `updateProgress(wordIndex + 1)`, da se shrani naslednji indeks.

```typescript
const handleSaveProgress = useCallback(async (
  _childId: string | undefined, 
  _sessionNumber: number, 
  wordIndex: number
) => {
  await updateProgress(wordIndex + 1);  // Shrani NASLEDNJI indeks
}, [updateProgress]);
```

**2. `src/pages/admin/AdminArtikulacijskiTest.tsx`** (isti popravek)
Enak popravek za admin portal:
```typescript
await updateProgress(wordIndex + 1);  // Shrani NASLEDNJI indeks
```

**3. `src/hooks/useUserSessionManager.ts`** (vrstice 76-84)
Poenostavitev logike nadaljevanja -- `current_word_index` je zdaj ze "naslednja beseda":

```typescript
const lastSpoken = existingSession.current_word_index ?? 0;
const info: SessionInfo = {
  sessionId: existingSession.id,
  sessionNumber: existingSession.session_number ?? 1,
  startIndex: lastSpoken,                            // Direktno, brez +1
  lastSpokenIndex: lastSpoken > 0 ? lastSpoken - 1 : -1,  // Za prikaz v dialogu
  isResume: lastSpoken > 0,
  totalWords: existingSession.total_words ?? totalWords,
};
```

**4. `src/hooks/useLogopedistSessionManager.ts`** (vrstice 76-84)
Isti popravek kot zgoraj za admin portal.

### Kaj se bo zgodilo po popravku

1. Ko izgovorite PAJEK (index 0), se v bazo shrani `current_word_index = 1`
2. Ko se vrnete v test, sistem najde `current_word_index = 1`:
   - `isResume = true` => prikaze se resume dialog z besedilom "Zadnja izgovorjena beseda: PAJEK"
   - `startIndex = 1` => test nadaljuje pri KAPA
3. Resume dialog deluje pravilno za vse besede, vkljucno s prvo

### Obstojecih sej v bazi

Obstojecega zapisa v bazi (`current_word_index = 0`, beseda PAJEK ze posneta) ni treba rocno popravljati. Sistem bo to obravnaval kot "zacni od zacetka" -- uporabnik bo preprosto se enkrat izgovoril PAJEK, kar ni problematicno.

