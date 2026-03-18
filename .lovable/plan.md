

# Fix: Napredek se ne beleži pri nekaterih igrah v admin načinu + odstrani gumb "Začni delo" s strani progress

## Problem
Gumb "Začni delo" na obeh straneh (/admin/children in /admin/children/:id/progress) vodi na isto stran (workspace). Problem ni v navigaciji, ampak v tem, da **6 od 13 iger/vaj ne posreduje `logopedistChildId`** pri shranjevanju napredka. Te igre kličejo `recordExerciseCompletion(id)` ali `recordGameCompletion(type, subtype)` brez tretjega parametra, zato se napredek shrani brez `logopedist_child_id` in se ne prikaže na strani progress.

## Igre, ki jih je treba popraviti (6 komponent)

| Komponenta | Datoteka | Manjka |
|---|---|---|
| GenericBingoGame | `src/components/games/GenericBingoGame.tsx` | `useGameMode` + posredovanje `logopedistChildId` |
| GenericWheelGame | `src/components/games/GenericWheelGame.tsx` | isto |
| GenericMetKockeGame | `src/components/games/GenericMetKockeGame.tsx` | isto |
| TongueGymGame | `src/components/games/TongueGymGame.tsx` | isto |
| GenericPoveziPareGame | `src/components/games/GenericPoveziPareGame.tsx` | isto |
| PonoviPovedGame | `src/components/games/PonoviPovedGame.tsx` | isto |

## Spremembe

### 1. Pri vseh 6 komponentah dodaj isto logiko kot jo imajo delujoče igre:
```tsx
import { useGameMode } from "@/contexts/GameModeContext";
// ...
const gameMode = useGameMode();
// ...
const logopedistChildId = gameMode.mode === 'logopedist' 
  ? gameMode.logopedistChildId 
  : undefined;
recordExerciseCompletion(exerciseId, 1, logopedistChildId);
// ali
recordGameCompletion('matching', subtype, logopedistChildId);
```

### 2. Odstrani gumb "Začni delo" s strani progress
V `src/pages/admin/AdminChildProgress.tsx` odstrani celoten razdelek z gumbom "Začni delo z {child.name}" na dnu strani (vrstice ~170-178).

## Vpliv
- Obstoječe delujoče igre (7 komponent) ostanejo nespremenjene
- V uporabniškem načinu (parent) se `logopedistChildId` posreduje kot `undefined`, kar je enako kot sedanje obnašanje - brez vpliva
- Stran progress bo samo prikazovala napredek, brez gumba za začetek dela

