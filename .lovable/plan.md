

# Načrt: Odstranitev zapisa "Govorne težave" in testni način za OŠ Test

## 1. Problem

### 1.1 Zapis "Govorne težave" na karticah otrok
Na strani `/admin/children` se pri vsakem otroku prikazuje zapis "📝 Govorne težave." pod osnovnimi podatki. Ta informacija ni potrebna v tem pogledu.

### 1.2 Testni način za organizacijo OŠ Test
Za namen testiranja je potrebno, da uporabniki iz organizacije "OŠ Test" pri preverjanju izgovorjave izgovarjajo samo zadnjo črko (R), kar pomeni 3 besede namesto vseh 60.

---

## 2. Rešitev

### 2.1 Odstranitev prikaza "Govorne težave"

V datoteki `src/pages/admin/AdminChildren.tsx` bom **odstranil** celoten blok, ki prikazuje `child.notes`:

```typescript
// ODSTRANI TE VRSTICE (252-258):
{child.notes && (
  <div className="mt-3 pt-3 border-t">
    <p className="text-sm text-muted-foreground line-clamp-2">
      📝 {child.notes}
    </p>
  </div>
)}
```

### 2.2 Testni način za OŠ Test (samo zadnja črka R)

V datoteki `src/pages/admin/AdminArtikulacijskiTest.tsx` bom dodal pogojno logiko, ki preveri organizacijo logopeda:

```typescript
// Preveri, ali je logoped iz organizacije "OŠ Test"
const isTestOrganization = profile?.organization_name === "OŠ Test";

// Izračunaj začetni index za zadnjo črko R (besede 57, 58, 59)
const testModeStartIndex = isTestOrganization ? 57 : 0;
```

Nato bo ta `startIndex` posredovan v hook `useArticulationTestNew`, skupaj z ustrezno omejitvijo `totalWords`.

Za to moram posodobiti hook `useArticulationTestNew.ts`, da bo sprejel opcijski parameter `endAtLetter`, ki omeji test na eno črko.

**Logika:**
- Če je `organization_name === "OŠ Test"`:
  - Test se začne pri indeksu 57 (prva beseda črke R: ROŽA)
  - Test se konča po 3 besedah (ROŽA, URA, SIR)
  - Progress grid prikazuje samo črko R

---

## 3. Spremembe datotek

| Datoteka | Sprememba |
|----------|-----------|
| `src/pages/admin/AdminChildren.tsx` | Odstrani blok s prikazom `child.notes` (vrstice 251-258) |
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Dodaj pogoj za organizacijo "OŠ Test" - nastavi startIndex in endIndex |
| `src/hooks/useArticulationTestNew.ts` | Dodaj opcijski parameter `maxWords` za omejitev števila besed v testu |

---

## 4. Tehnična implementacija

### 4.1 Sprememba useArticulationTestNew.ts

Dodaj parameter `maxWords`, ki omeji število besed v testu:

```typescript
export const useArticulationTestNew = (
  childId?: string, 
  userId?: string, 
  fixedSessionNumber?: number, 
  startIndex: number = 0,
  difficulty: string = "srednja",
  onSaveProgress?: (...) => void,
  logopedistId?: string,
  maxWords?: number  // NOVO - opcijska omejitev
) => {
  // ...
  
  // Uporabi maxWords če je podano, sicer vseh 60 besed
  const effectiveTotalWords = maxWords ? Math.min(startIndex + maxWords, totalWords) : totalWords;
  
  // Prilagodi handleNext za končanje ob effectiveTotalWords
  const handleNext = () => {
    if (currentWordIndex < effectiveTotalWords - 1) {
      // ...
    } else {
      setIsTestComplete(true);
    }
  };
}
```

### 4.2 Sprememba AdminArtikulacijskiTest.tsx

```typescript
// Preverba organizacije
const isTestOrganization = profile?.organization_name === "OŠ Test";

// Če je OŠ Test, začni pri R (index 57) in testiraj le 3 besede
const effectiveStartIndex = isTestOrganization ? 57 : startIndex;
const testMaxWords = isTestOrganization ? 3 : undefined;

// Posreduj v hook
const { ... } = useArticulationTestNew(
  childId, 
  undefined, 
  fixedSessionNumber, 
  effectiveStartIndex, 
  difficulty, 
  saveProgress, 
  profile?.id,
  testMaxWords  // NOVO
);
```

---

## 5. Rezultat

### Po implementaciji:
- ✅ Kartice otrok na `/admin/children` ne bodo več prikazovale "📝 Govorne težave."
- ✅ Logopedi iz organizacije "OŠ Test" bodo pri preverjanju izgovorjave testirali samo 3 besede (črka R: ROŽA, URA, SIR)
- ✅ Druga organizacije bodo imele polni test z vsemi 60 besedami

### Opomba za kasnejšo odstranitev:
Ko bo testiranje zaključeno, bo potrebno odstraniti pogoje za "OŠ Test" iz obeh datotek.

