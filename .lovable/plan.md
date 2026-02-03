
# Načrt: Popravek shranjevanja napredka za logopedistove otroke v igrah

## Ugotovljen problem

Ob igranju igre **Sestavljanka** za otroka Tian (ID: `81135446-a352-4446-95ba-c899f2d252f5`), se napredek ni shranil v bazo. Razlog:

Komponente iger ne uporabljajo `useGameMode()` konteksta za pridobitev `logopedistChildId`. Zato kličejo:
```typescript
recordGameCompletion('puzzle', config.trackingId);
// Brez tretjega parametra logopedistChildId!
```

To povzroči, da se napredek shrani v `child_id` (uporabniški portal), ne pa v `logopedist_child_id` (admin portal).

---

## Prizadete komponente

| Komponenta | Igra | Status |
|------------|------|--------|
| `GenericSestavljankaGame.tsx` | Sestavljanke | ❌ Manjka |
| `GenericDrsnaSestavljankaGame.tsx` | Drsne sestavljanke | ❌ Manjka |
| `GenericLabirintGame.tsx` | Labirint | ❌ Manjka |
| `GenericIgraUjemanjaGame.tsx` | Povezi pare | ❌ Manjka |
| `GenericZaporedjaGame.tsx` | Zaporedja | ❌ Manjka |
| `useGenericMemoryGame.tsx` | Spomin | ✅ Pravilno |

---

## Rešitev

Za vsako prizadeto komponento dodaj:

1. **Import `useGameMode`** iz `GameModeContext`
2. **Pridobi kontekst** na začetku komponente
3. **Posreduj `logopedistChildId`** v `recordGameCompletion`
4. **Onemogočij pokal preverbo** za logopedist mode (pokali so samo za uporabniški portal)

### Vzorec spremembe (za vse igre enako)

```typescript
// Pred spremembo:
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";

// ...

const { recordGameCompletion } = useEnhancedProgress();
const { checkForNewTrophy } = useTrophyContext();

const handleStarClaimed = async () => {
  recordGameCompletion('puzzle', config.trackingId);
  await checkForNewTrophy();
};
```

```typescript
// Po spremembi:
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useTrophyContext } from "@/contexts/TrophyContext";
import { useGameMode } from "@/contexts/GameModeContext";

// ...

const gameMode = useGameMode();
const { recordGameCompletion } = useEnhancedProgress();
const { checkForNewTrophy } = useTrophyContext();

const handleStarClaimed = async () => {
  const logopedistChildId = gameMode.mode === 'logopedist' 
    ? gameMode.logopedistChildId 
    : undefined;
  
  recordGameCompletion('puzzle', config.trackingId, logopedistChildId);
  
  // Pokal samo za uporabniški portal
  if (gameMode.mode === 'user') {
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkForNewTrophy();
  }
};
```

---

## Seznam sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/GenericSestavljankaGame.tsx` | Dodaj `useGameMode`, posreduj `logopedistChildId` |
| `src/components/games/GenericDrsnaSestavljankaGame.tsx` | Dodaj `useGameMode`, posreduj `logopedistChildId` |
| `src/components/games/GenericLabirintGame.tsx` | Dodaj `useGameMode`, posreduj `logopedistChildId` |
| `src/components/games/GenericIgraUjemanjaGame.tsx` | Dodaj `useGameMode`, posreduj `logopedistChildId` |
| `src/components/games/GenericZaporedjaGame.tsx` | Dodaj `useGameMode`, posreduj `logopedistChildId` |

---

## Rezultat po popravku

Ko logoped igra igro Sestavljanka z otrokom Tian:
1. `useGameMode()` vrne `{ mode: 'logopedist', logopedistChildId: '81135446-...' }`
2. `recordGameCompletion('puzzle', 'puzzle_c_12', '81135446-...')` shrani v bazo
3. Progress tabela dobi zapis z `logopedist_child_id = '81135446-...'`
4. Stran `/admin/children/:id/progress` prikaže zvezdico

---

## Tehnični diagram

```text
AdminGameFullscreenWrapper
         │
         ├── GameModeProvider (mode: 'logopedist', logopedistChildId: 'xxx')
         │
         └── GenericSestavljankaGame
                    │
                    ├── useGameMode() → { mode: 'logopedist', logopedistChildId: 'xxx' }
                    │
                    └── recordGameCompletion('puzzle', 'tracking_id', 'xxx')
                                   │
                                   ▼
                        progress tabela
                        (logopedist_child_id = 'xxx')
```
