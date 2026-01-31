

# Plan: Popravek shranjevanja zvezdic pri igri Ponovi Poved

## Analiza problema

Po pregledu kode sem odkril **tri kritične težave**:

### Problem 1: Dvojno shranjevanje napredka
Napredek se trenutno shranjuje **dvakrat**:
- Prvič: V funkciji `recordProgress()` ko se odštevanje konča (vrstica 527)
- Drugič: V `onClick` handlerju gumba "VZEMI ZVEZDICO" (vrstica 1124)

### Problem 2: Ni invalidacije cache-a
Po shranjevanju napredka se ne invalidira `enhancedProgress` cache, zato se stran `/moja-stran` ne osveži takoj. Uporabnik mora osvežiti stran ročno.

### Problem 3: Ni preverjanja pokala
Funkcija `checkForNewTrophy()` se ne kliče, zato se pokal ne prikaže ob doseženih 100 zvezdicah.

### Dokaz problema
V bazi ni nobenega zapisa za igro "ponovi-poved", kar pomeni da se koda za shranjevanje ne izvaja pravilno ali pa igra še ni bila testirana do konca.

## Rešitev

Poenoviti igro Ponovi Poved z drugimi igrami - uporabiti `useEnhancedProgress` hook in slediti vzorcu drugih iger.

## Tehnične spremembe

### Sprememba 1: Dodaj import in uporabi useEnhancedProgress

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`

**Lokacija:** Vrstica ~12 (med importi)

```tsx
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
```

**Lokacija:** Vrstica ~232 (med hooki)

```tsx
const { selectedChild } = useAuth();
const { recordExerciseCompletion } = useEnhancedProgress();
const { checkForNewTrophy } = useTrophyContext();
```

### Sprememba 2: Odstrani lokalno funkcijo recordProgress

**Lokacija:** Vrstice 649-678

Celotno funkcijo `recordProgress` je potrebno odstraniti, saj bo zamenjana z `recordExerciseCompletion`.

### Sprememba 3: Posodobi handleRepeat - SAMO zapri dialog, NE shranjuj

**Lokacija:** Vrstice 504-538

Funkcija `handleRepeat` naj samo zapre dialog in ne shranjuje napredka. Napredek naj se shrani šele ob kliku na "VZEMI ZVEZDICO".

```tsx
const handleRepeat = useCallback(() => {
  setIsRecording(true);
  setCountdown(5);
  
  const interval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setIsRecording(false);
        
        // Samodejno zapri dialog
        setShowSentenceDialog(false);
        setCollectedWords([]);
        setRepeatCompleted(false);
        
        // Preveri če je bila to zadnja poved
        if (currentSentenceForDialog === 3) {
          setPhase("complete");
          setIsGameCompleted(true);
          setShowSuccessDialog(true); // Odpri success dialog BREZ shranjevanja
        }
        
        return 5;
      }
      return prev - 1;
    });
  }, 1000);
}, [currentSentenceForDialog]);
```

### Sprememba 4: Posodobi gumb "VZEMI ZVEZDICO" - uporabi useEnhancedProgress

**Lokacija:** Vrstice 1119-1145

```tsx
<Button
  onClick={async () => {
    // Shrani napredek s poenotenim sistemom
    recordExerciseCompletion(`ponovi-poved-${config.letter}`);
    
    // Preveri za nov pokal
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
    
    // Zapri dialog
    setShowSuccessDialog(false);
  }}
  className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 uppercase font-bold px-8"
>
  ⭐ VZEMI ZVEZDICO
</Button>
```

### Sprememba 5: Odstrani odvečno completionCalledRef logiko

Ker se shranjevanje zdaj izvaja samo ob kliku na gumb, `completionCalledRef` ni več potreben za preprečevanje dvojnega shranjevanja.

## Diagram toka

```text
PRED POPRAVKOM:
┌────────────────────────────────────────────────┐
│ Odštevanje končano → recordProgress() [1x]     │
│                    ↓                           │
│ VZEMI ZVEZDICO → supabase.insert() [2x]        │
│                    ↓                           │
│ Napredek shranjen DVAKRAT                      │
│ NI invalidacije cache                          │
│ NI preverjanja pokala                          │
└────────────────────────────────────────────────┘

PO POPRAVKU:
┌────────────────────────────────────────────────┐
│ Odštevanje končano → showSuccessDialog(true)   │
│                    ↓                           │
│ VZEMI ZVEZDICO → recordExerciseCompletion()    │
│                    ↓                           │
│ Napredek shranjen 1x                           │
│ Cache invalidiran avtomatsko                   │
│ checkForNewTrophy() kliče za pokal            │
└────────────────────────────────────────────────┘
```

## Testiranje

1. Odpri igro `/govorne-igre/ponovi-poved/c`
2. Dokončaj vse 4 povedi (skoči čez vse kamne)
3. Preveri, da se ob koncu prikaže "BRAVO!" dialog
4. Klikni "VZEMI ZVEZDICO"
5. Pojdi na `/moja-stran`
6. Preveri, da se je število zvezdic povečalo za 1
7. Preveri v bazi: `SELECT * FROM progress WHERE activity_subtype LIKE 'ponovi-poved%'`

## Prizadete datoteke

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/PonoviPovedGame.tsx` | Poenotenje z useEnhancedProgress |

