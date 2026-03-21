

## Problem

Ko najdeš zadnji par, se hkrati prikažeta **oba** dialoga:
1. `MemoryPairDialog` (za ponovitev besede)
2. `BRAVO!` dialog (za zvezdico)

To se zgodi ker `useEffect` na vrstici 130 sproži BRAVO dialog 500ms po `gameCompleted = true`, ne glede na to ali je pair dialog še odprt.

## Popravek

### `src/components/games/GenericSpominGame.tsx` (vrstica 130-136)

Dodaj pogoj `!showPairDialog` v useEffect, da se BRAVO dialog prikaže šele **po zaprtju pair dialoga**:

```typescript
useEffect(() => {
    if (gameCompleted && !showNewGameButton && !showPairDialog) {
      const timer = setTimeout(() => setShowBravoDialog(true), 500);
      return () => clearTimeout(timer);
    }
  }, [gameCompleted, showNewGameButton, showPairDialog]);
```

To zagotovi da uporabnik najprej ponovi besedo v pair dialogu, nato se ta zapre, in šele potem se prikaže BRAVO dialog z gumbom "VZEMI ZVEZDICO".

**1 datoteka, 1 vrstica spremenjena.**

