
# Načrt: Ločitev težavnosti in časa snemanja v nastavitvah preverjanja

## Trenutno stanje

Trenutno so nastavitve združene v eno izbiro:
- Nizka = nižji Levenshtein pragi + 5 sekund
- Srednja = srednji pragi + 4 sekunde  
- Visoka = višji pragi + 3 sekunde

Uporabnik ne more izbrati npr. srednje težavnosti z 5 sekundami snemanja.

## Rešitev

Ločiti nastavitve v dva neodvisna stolpca:

```text
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Nastavitve preverjanja                                      │
│  Izberite zahtevnost preverjanja glede na sposobnosti otroka.  │
├─────────────────────────────┬───────────────────────────────────┤
│  ZAHTEVNOST PREVERJANJA     │  ČAS SNEMANJA                     │
│  ─────────────────────────  │  ─────────────────────────        │
│  ○ Nizka                    │  ○ 3 sekunde                      │
│    Lažje preverjanje        │    Za hitrejše otroke             │
│                             │                                   │
│  ● Srednja (priporočeno)    │  ● 4 sekunde (priporočeno)        │
│    Za večino otrok          │    Za večino otrok                │
│                             │                                   │
│  ○ Visoka                   │  ○ 5 sekund                       │
│    Strožje preverjanje      │    Za otroke z večjimi težavami   │
├─────────────────────────────┴───────────────────────────────────┤
│                                              [Shrani]           │
└─────────────────────────────────────────────────────────────────┘
```

## Tehnične spremembe

### 1. Posodobitev useArticulationSettings.ts

Dodati nov tip in stanje za čas snemanja:

```typescript
export type DifficultyLevel = "nizka" | "srednja" | "visoka";
export type RecordingDuration = 3 | 4 | 5;  // NOVO

interface ArticulationSettings {
  difficulty: DifficultyLevel;
  recordingDuration: RecordingDuration;  // NOVO - ločeno od težavnosti
}

// Odstrani povezavo med difficulty in duration
const useArticulationSettings = () => {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>("srednja");
  const [recordingDuration, setRecordingDurationState] = useState<RecordingDuration>(4);  // NOVO
  
  // Shranjevanje obeh vrednosti v localStorage
  const setDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficultyState(newDifficulty);
    saveSettings({ difficulty: newDifficulty, recordingDuration });
  }, [recordingDuration]);
  
  const setRecordingDuration = useCallback((newDuration: RecordingDuration) => {  // NOVO
    setRecordingDurationState(newDuration);
    saveSettings({ difficulty, recordingDuration: newDuration });
  }, [difficulty]);
  
  return {
    difficulty,
    setDifficulty,
    recordingDuration,
    setRecordingDuration,  // NOVO
    getThresholdForWordLength,
    // ...
  };
};
```

### 2. Posodobitev ArticulationSettingsDialog.tsx

Spremeniti layout v dva stolpca z ločenimi RadioGroup komponentami:

```typescript
interface ArticulationSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (value: DifficultyLevel) => void;
  recordingDuration: RecordingDuration;  // NOVO
  onRecordingDurationChange: (value: RecordingDuration) => void;  // NOVO
}

// Ločene opcije za težavnost
const difficultyOptions = [
  { value: "nizka", label: "Nizka", description: "Lažje preverjanje" },
  { value: "srednja", label: "Srednja (priporočeno)", description: "Za večino otrok" },
  { value: "visoka", label: "Visoka", description: "Strožje preverjanje" },
];

// Ločene opcije za čas snemanja
const durationOptions = [
  { value: 3, label: "3 sekunde", description: "Za hitrejše otroke" },
  { value: 4, label: "4 sekunde (priporočeno)", description: "Za večino otrok" },
  { value: 5, label: "5 sekund", description: "Za otroke z večjimi težavami" },
];

// Layout v dva stolpca
<div className="grid grid-cols-2 gap-6 py-4">
  <div>
    <h3 className="font-medium mb-3">Zahtevnost preverjanja</h3>
    <RadioGroup value={difficulty} onValueChange={onDifficultyChange}>
      {difficultyOptions.map(...)}
    </RadioGroup>
  </div>
  <div>
    <h3 className="font-medium mb-3">Čas snemanja</h3>
    <RadioGroup value={recordingDuration} onValueChange={onRecordingDurationChange}>
      {durationOptions.map(...)}
    </RadioGroup>
  </div>
</div>
```

### 3. Posodobitev AdminArtikulacijskiTest.tsx

Dodati nove props za dialog:

```typescript
const { 
  difficulty, 
  setDifficulty, 
  recordingDuration,
  setRecordingDuration  // NOVO
} = useArticulationSettings();

<ArticulationSettingsDialog
  open={showSettingsDialog}
  onClose={() => setShowSettingsDialog(false)}
  difficulty={difficulty}
  onDifficultyChange={setDifficulty}
  recordingDuration={recordingDuration}  // NOVO
  onRecordingDurationChange={setRecordingDuration}  // NOVO
/>
```

### 4. Posodobitev ArtikuacijskiTest.tsx (uporabniški portal)

Enake spremembe kot za admin portal.

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/hooks/useArticulationSettings.ts` | Dodaj `RecordingDuration` tip, loči stanje in shranjevanje |
| `src/components/articulation/ArticulationSettingsDialog.tsx` | Preoblikuj v dva stolpca z ločenimi RadioGroup |
| `src/pages/admin/AdminArtikulacijskiTest.tsx` | Dodaj nove props za dialog |
| `src/pages/ArtikuacijskiTest.tsx` | Dodaj nove props za dialog |

## Rezultat

Pred:
- Uporabnik izbere en paket (težavnost + čas skupaj)
- Ni možnosti kombinacij

Po:
- Uporabnik neodvisno izbere zahtevnost preverjanja (Levenshtein pragi)
- Uporabnik neodvisno izbere čas snemanja (3/4/5 sekund)
- Vsaka kombinacija je mogoča (npr. srednja zahtevnost + 5 sekund)
