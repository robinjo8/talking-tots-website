
# Načrt: Popravek prikaza slike in indikatorja ob nadaljevanju

## Ugotovljena problema

### Problem 1: Slika v ozadju prikazuje ROŽA namesto URA

**Vzrok:** Ko se komponenta `AdminArtikulacijskiTest` naloži, `sessionInfo` še ne obstaja. Hook `useArticulationTestNew` se inicializira z:
```typescript
const startIndex = sessionInfo?.isResume 
  ? sessionInfo.startIndex 
  : (isTestOrganization ? 57 : 0);  // → vrne 0, ker sessionInfo je undefined
```

Šele potem se izvede `checkExistingSession`, ki nastavi `sessionInfo`, ampak hook je že inicializiran z `currentWordIndex = 0`.

### Problem 2: Indikator črke R ni 1/3 obarvan z zeleno

**Vzrok:** Funkcija `getCompletedWords()` šteje besede do `currentWordIndex`:
```typescript
if (wordCount < currentWordIndex) {
  completed[letterIdx]++;
}
```

Če je `currentWordIndex = 57`, potem za črko R (indeksi 57, 58, 59) ni nobena beseda označena kot dokončana, ker `57 < 57` je false. Ob nadaljevanju pa bi morala biti ROŽA (57) že dokončana.

---

## Rešitev

### Sprememba 1: Uporabi `key` prop za ponoven render hooka

Ko se `sessionInfo` spremeni, moramo zagotoviti, da se hook `useArticulationTestNew` ponovno inicializira s pravilnim `startIndex`. To lahko dosežemo z React `key` propom.

V `AdminArtikulacijskiTest.tsx`:
```typescript
// Ustvari ključ, ki se spremeni ko se seja inicializira
const hookKey = sessionInfo?.sessionId ?? 'initial';

const {
  imageUrl,
  loading,
  // ...
} = useArticulationTestNew(
  // ... parametri ostanejo enaki
);
```

Ampak ker hook ni komponenta, moramo drugače pristopiti - uporabiti bomo morali **state za startIndex**, ki se posodobi ko se seja inicializira.

### Sprememba 2: Dinamična posodobitev startIndex v hooku

Namesto da hook prebere `startIndex` samo ob inicializaciji, bo imel `useEffect`, ki se sproži ob spremembi `startIndex` prop-a:

V `useArticulationTestNew.ts`:
```typescript
// Posodobi currentWordIndex ko se startIndex spremeni (npr. ob nadaljevanju seje)
useEffect(() => {
  setCurrentWordIndex(startIndex);
}, [startIndex]);
```

### Sprememba 3: Pravilno nastavi startIndex v AdminArtikulacijskiTest

Ko se seja inicializira, se mora `startIndex` posodobiti. Za to potrebujemo state:

```typescript
const [effectiveStartIndex, setEffectiveStartIndex] = useState<number>(0);

// Ko se seja inicializira, posodobi startIndex
useEffect(() => {
  if (sessionInfo?.isResume) {
    setEffectiveStartIndex(sessionInfo.startIndex);
  } else if (isTestOrganization) {
    setEffectiveStartIndex(57);
  } else {
    setEffectiveStartIndex(0);
  }
}, [sessionInfo, isTestOrganization]);
```

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `useArticulationTestNew.ts` | Dodaj `useEffect` za posodobitev `currentWordIndex` ob spremembi `startIndex` |
| `AdminArtikulacijskiTest.tsx` | Uporabi state `effectiveStartIndex` za pravilno posodobitev ob inicializaciji seje |

---

## Končni rezultat

1. **Slika:** Ko se seja naloži in `sessionInfo.startIndex = 58` (URA), se hook posodobi in prikaže pravilno sliko (URA)
2. **Indikator:** `completedWords` pravilno izračuna, da je za R dokončana 1 beseda (ROŽA), ker je `currentWordIndex = 58`, in `57 < 58` je true
3. **Dialog:** Ostane enak - prikaže "Zadnja izgovorjena beseda je bila: ROŽA"
