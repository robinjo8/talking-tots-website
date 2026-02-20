
## Križec v dialogu + pavza igre

### Kaj se bo spremenilo

#### 1. Funkcionalen X gumb v word challenge dialogu

**Problem**: `onOpenChange={() => {}}` je prazen → X ne naredi ničesar. Poleg tega dialog preprečuje zapiranje z Escape.

**Rešitev**: Dodamo `onClose` prop klic v `onOpenChange` in odstranimo blokado Escape. Ker pa X ne sme prekiniti igre brez potrjevanja, ga spremenimo da sproži **pavzo**.

#### 2. Pavza — overlay čez igro

Ko uporabnik klikne X med izzivom besede:
- Dialog se zapre
- Čez igro se prikaže polprozoren overlay z dvema gumboma:
  - **NADALJUJ** — vrne se v isti dialog z isto besedo (ponastavi fazni state dialoga na "idle")
  - **KONČAJ** — ponastavi igro na začetek (resetGame)

**Implementacija**:

V `KaceLestveGame.tsx` dodamo:
```tsx
const [isPaused, setIsPaused] = useState(false);
const [pausedPhase, setPausedPhase] = useState<GamePhase | null>(null);
```

Ko X pokliče `onClose` → `setIsPaused(true)`, shranimo `pausedPhase = phase` (trenutna faza: `word_challenge` ali `snake_challenge`).

Overlay se prikaže ko `isPaused === true`:
```tsx
{isPaused && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
      <h2 className="text-2xl font-black">PAVZA</h2>
      <button onClick={handleResume}>NADALJUJ</button>
      <button onClick={handleEndGame}>KONČAJ</button>
    </div>
  </div>
)}
```

**NADALJUJ** (`handleResume`):
- `setIsPaused(false)`
- `setPhase(pausedPhase!)` — ponastavi fazo nazaj (dialog se znova odpre z isto besedo)
- Dialog ima `key` na `pausedPhase` da se ponastavi na "idle"

**KONČAJ** (`handleEndGame`):
- `setIsPaused(false)`
- `resetGame()` — ponastavi igro

#### 3. Spremembe v KaceLestveWordDialog.tsx

- `onOpenChange` → klic `onClose` namesto praznega callbacka
- Odstranimo blokado `onEscapeKeyDown`
- `onClose` prop se poveže s pavzo v parent komponenti

#### 4. Spremembe v KaceLestveGame.tsx

Nove spremenljivke:
```tsx
const [isPaused, setIsPaused] = useState(false);
const [pausedPhase, setPausedPhase] = useState<GamePhase | null>(null);
```

`handleWordDialogClose` (klic ob X):
```tsx
const handleWordDialogClose = useCallback(() => {
  setPausedPhase(phase); // shranimo word_challenge ali snake_challenge
  setIsPaused(true);
  setPhase('rolling'); // začasno zapremo dialog
}, [phase]);
```

`handleResume`:
```tsx
const handleResume = useCallback(() => {
  setIsPaused(false);
  if (pausedPhase) setPhase(pausedPhase); // dialog se znova odpre
}, [pausedPhase]);
```

`handleEndGame`:
```tsx
const handleEndGame = useCallback(() => {
  setIsPaused(false);
  setPausedPhase(null);
  resetGame();
}, [resetGame]);
```

Pavza overlay se doda direktno v JSX (ne kot inline komponenta, skladno z dialog-rendering-integrity-constraints).

#### 5. Sekvenca

```
Uporabnik je sredi izziva (word_challenge)
→ Klikne X
→ Dialog se zapre
→ Pavza overlay se pojavi čez igro (zamegljeno ozadje)
→ Opciji: NADALJUJ ali KONČAJ

NADALJUJ → Dialog se znova odpre z ISTO besedo, snemanje na "idle" (nova priložnost)
KONČAJ   → Igra se ponastavi na začetni zaslon z nastavitvami
```

#### 6. Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveWordDialog.tsx` | `onOpenChange` kliče `onClose`, odstrani blokado Escape |
| `src/components/games/KaceLestveGame.tsx` | Dodamo `isPaused`, `pausedPhase` state, pavza overlay z NADALJUJ/KONČAJ, `handleWordDialogClose`, `handleResume`, `handleEndGame` |
