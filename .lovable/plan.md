

## Implementacija nastavitev za preverjanje izgovorjave

### Povzetek sprememb

Dodajamo sistem nastavitev s tremi stopnjami zahtevnosti (nizka, srednja, visoka), ki prilagaja:
1. Čas snemanja (5s, 4s, 3s)
2. Levenshtein prag glede na dolžino besede
3. Avtomatsko shranjevanje napredka za nadaljevanje testa

---

### Stopnje zahtevnosti

| Zahtevnost | Čas snemanja | 3 črke | 4 črke | 5 črk | 6 črk |
|------------|--------------|--------|--------|-------|-------|
| **Nizka**  | 5 sekund     | ≥33%   | ≥25%   | ≥35%  | ≥30%  |
| **Srednja** (privzeto) | 4 sekunde | ≥65% | ≥50% | ≥50% | ≥50% |
| **Visoka** | 3 sekunde    | ≥65%   | ≥70%   | ≥75%  | ≥65%  |

---

### Datoteke za ustvarjanje

#### 1. `src/hooks/useArticulationSettings.ts`
Nov hook za upravljanje nastavitev:
- Shranjuje izbrano zahtevnost v localStorage
- Privzeta vrednost: "srednja"
- Vrača: trajanje snemanja, pragove za Levenshtein

```text
useArticulationSettings()
├── difficulty: "nizka" | "srednja" | "visoka"
├── setDifficulty(value)
├── recordingDuration: 5 | 4 | 3
└── getThresholdForWordLength(length): number
```

#### 2. `src/components/articulation/ArticulationSettingsDialog.tsx`
Dialog za izbiro zahtevnosti:
- Radio group z 3 opcijami
- Razlaga za vsako stopnjo
- Gumb "Shrani"

```text
┌─────────────────────────────────────────────────┐
│  ⚙️  Nastavitve preverjanja                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Izberite zahtevnost preverjanja:               │
│                                                 │
│  ○ Nizka                                        │
│    Za otroke z večjimi govornimi težavami       │
│    Čas snemanja: 5 sekund                       │
│                                                 │
│  ● Srednja (priporočeno)                        │
│    Za večino otrok                              │
│    Čas snemanja: 4 sekunde                      │
│                                                 │
│  ○ Visoka                                       │
│    Za otroke brez večjih težav                  │
│    Čas snemanja: 3 sekunde                      │
│                                                 │
│            ┌────────────┐                       │
│            │   Shrani   │                       │
│            └────────────┘                       │
└─────────────────────────────────────────────────┘
```

#### 3. `src/components/articulation/ArticulationResumeDialog.tsx`
Dialog za nadaljevanje testa:
- Prikaže se ob vstopu če obstaja shranjen napredek
- Gumba "Nadaljuj" in "Začni znova"

```text
┌─────────────────────────────────────────────────┐
│        🔄 Nadaljevanje preverjanja              │
│                                                 │
│   Zaznali smo nedokončano preverjanje.          │
│   Ali želite nadaljevati?                       │
│                                                 │
│   📍 Zadnja beseda: OBLAK (2/60)                │
│   ⏱️  Shranjeno: pred 2 urama                    │
│                                                 │
│   ┌──────────────┐  ┌─────────────────┐         │
│   │  Nadaljuj    │  │  Začni znova    │         │
│   └──────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────┘
```

---

### Datoteke za posodobitev

#### 4. `src/pages/ArtikuacijskiTest.tsx`
- Uvoz novih komponent in hookov
- Dodaj state za `showSettingsDialog` in `showResumeDialog`
- Dodaj gumb "Nastavitve" v dropdown menu (za "Navodila")
- Integracija z `useArticulationSettings` hook
- Prikaz `ArticulationResumeDialog` ob zagonu

```typescript
// Dodaj v dropdown menu:
<button onClick={() => setShowSettingsDialog(true)}>
  <span>⚙️</span><span>Nastavitve</span>
</button>
```

#### 5. `src/hooks/useArticulationTestNew.ts`
- Shranjevanje napredka v localStorage po vsaki besedi
- Nalaganje shranjenega napredka ob inicializaciji
- Brisanje napredka ob zaključku testa
- Nova funkcija `loadSavedProgress()` in `clearProgress()`

```typescript
// localStorage struktura:
{
  childId: string,
  sessionNumber: number,
  currentWordIndex: number,
  timestamp: number, // za preverjanje veljavnosti (max 7 dni)
  difficulty: "nizka" | "srednja" | "visoka"
}
```

#### 6. `src/components/articulation/ArticulationRecordButton.tsx`
- Sprejme nov prop `recordingDuration` (namesto fiksnih 3 sekund)
- Posodobi `useAudioRecording` klic z dinamičnim trajanjem
- Posodobi progress bar izračun

```typescript
// Sprememba:
const { ... } = useAudioRecording(recordingDuration, onRecordingComplete);
const progressPercent = ((recordingDuration - countdown) / recordingDuration) * 100;
```

#### 7. `src/hooks/useTranscription.ts`
- Dodaj parameter `difficulty` v klic edge funkcije
- Pošlje zahtevnost skupaj z avdio podatki

```typescript
body: {
  audio: audioBase64,
  targetWord,
  acceptedVariants,
  difficulty, // NOVO
  ...
}
```

#### 8. `supabase/functions/transcribe-articulation/index.ts`
- Sprejme `difficulty` parameter iz requesta
- Nova funkcija `getThresholdForWord(wordLength, difficulty)`
- Uporabi dinamični prag namesto fiksnih 70%

```typescript
// Nova logika:
function getThresholdForWord(wordLength: number, difficulty: string): number {
  const thresholds = {
    nizka:   { 3: 0.33, 4: 0.25, 5: 0.35, 6: 0.30 },
    srednja: { 3: 0.65, 4: 0.50, 5: 0.50, 6: 0.50 },
    visoka:  { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 }
  };
  // Za besede krajše od 3 ali daljše od 6: uporabi najbližjo
  const len = Math.min(Math.max(wordLength, 3), 6);
  return thresholds[difficulty]?.[len] ?? thresholds.srednja[len];
}
```

---

### Diagram poteka

```text
┌─────────────────────────────────────────────────────────────────┐
│                    VSTOP NA STRAN                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Preveri localStorage za shranjen napredek                   │
│     │                                                           │
│     ├── Če obstaja in < 7 dni → Prikaži ResumeDialog            │
│     │   ├── [Nadaljuj] → Nastavi currentWordIndex               │
│     │   └── [Začni znova] → Počisti localStorage                │
│     │                                                           │
│     └── Če ne obstaja → Prikaži InfoDialog (kot doslej)         │
│                                                                 │
│  2. Med testom                                                  │
│     │                                                           │
│     ├── Snemanje: uporabi trajanje glede na zahtevnost          │
│     │                                                           │
│     ├── Transkripcija: pošlje zahtevnost v edge funkcijo        │
│     │                                                           │
│     ├── Validacija: dinamični Levenshtein prag                  │
│     │   └── getThresholdForWord(dolžina, zahtevnost)            │
│     │                                                           │
│     └── Po vsaki besedi: shrani napredek v localStorage         │
│                                                                 │
│  3. Ob zaključku                                                │
│     └── Počisti localStorage (napredek)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Zaporedje implementacije

| Korak | Opis | Odvisnosti |
|-------|------|------------|
| 1 | Ustvari `useArticulationSettings.ts` hook | - |
| 2 | Ustvari `ArticulationSettingsDialog.tsx` | Korak 1 |
| 3 | Ustvari `ArticulationResumeDialog.tsx` | - |
| 4 | Posodobi `ArticulationRecordButton.tsx` za dinamično trajanje | Korak 1 |
| 5 | Posodobi `useTranscription.ts` za pošiljanje zahtevnosti | Korak 1 |
| 6 | Posodobi edge funkcijo z dinamičnimi pragi | - |
| 7 | Posodobi `useArticulationTestNew.ts` za shranjevanje napredka | Korak 1 |
| 8 | Posodobi `ArtikuacijskiTest.tsx` z vsemi novimi komponentami | Koraki 1-7 |

---

### Tehnične podrobnosti

**localStorage ključi:**
- `articulation_settings` - shrani izbrano zahtevnost
- `articulation_progress` - shrani napredek testa

**Validacija napredka:**
- Max starost: 7 dni (604800000 ms)
- Preveri ujemanje `childId` s trenutnim otrokom
- Če ne ustreza, napredek ignorira

**Levenshtein tabela (max dovoljene napake):**

| Dolžina | Nizka | Srednja | Visoka |
|---------|-------|---------|--------|
| 3 črke  | d ≤ 2 | d ≤ 1   | d ≤ 1  |
| 4 črke  | d ≤ 3 | d ≤ 2   | d ≤ 1  |
| 5 črk   | d ≤ 3 | d ≤ 2   | d ≤ 1  |
| 6 črk   | d ≤ 4 | d ≤ 3   | d ≤ 2  |

