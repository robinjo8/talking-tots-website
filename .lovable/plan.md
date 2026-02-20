
## Popravek: Odstranitev bonus premika in gladka animacija

### Težava 1: Bonus premik (DIFFICULTY_BONUS)

V `KaceLestveGame.tsx`, funkcija `handleWordResult` (vrstice 274–291):

```tsx
const handleWordResult = useCallback((accepted: boolean) => {
  const bonus = accepted ? DIFFICULTY_BONUS[difficulty] : 0;
  if (bonus > 0 && pendingMove !== null) {
    // premakne zmajčka za bonus polj naprej
    ...
  }
  nextPlayer();
}, ...);
```

`DIFFICULTY_BONUS` je definiran kot: `nizka: 2, srednja: 1, visoka: 0`. Torej pri nizki težavnosti zmajček skoči za 2 polji naprej, pri srednji za 1. To je potrebno popolnoma odstraniti.

**Rešitev**: Poenostavimo `handleWordResult` — ignoriramo bonus, vedno samo pokličemo `nextPlayer()`.

---

### Težava 2: Animacija — "skakanje v loku"

Trenutna koda za hop animacijo v `KaceLestveBoard.tsx`:

```tsx
transition={
  isHopping
    ? { type: 'spring', stiffness: 600, damping: 18, mass: 0.4 }  // ← preveč bounce
    : { type: 'spring', stiffness: 200, damping: 22, duration: 0.6 }
}
```

`spring` z nizkim `damping` povzroča, da se zmajček "odbija" na vsakem polju. Zamenjamo s `tween` za gladek premik:

**Rešitev za hop korake** (med vsakim poljem):
```tsx
{ type: 'tween', duration: 0.12, ease: 'easeInOut' }
```

**Rešitev za lestev/kačo skok** (daljši skok):
```tsx
{ type: 'tween', duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
```

Tudi `HOP_INTERVAL_MS` spremenimo iz `180` na `150` ms — hitrejši in bolj tekoč tok premika.

---

### Konkretne spremembe

#### `src/components/games/KaceLestveGame.tsx`

Vrstice 274–291 — poenostavitev `handleWordResult`:

```tsx
// PREJ:
const handleWordResult = useCallback((accepted: boolean) => {
  const { currentPlayer } = gameState;
  const bonus = accepted ? DIFFICULTY_BONUS[difficulty] : 0;

  if (bonus > 0 && pendingMove !== null) {
    const bonusPos = Math.min(pendingMove + bonus, BOARD_SIZE);
    const newPositions = [...gameState.positions];
    newPositions[currentPlayer] = bonusPos;
    if (bonusPos >= BOARD_SIZE) {
      setGameState(prev => ({ ...prev, positions: newPositions, gameOver: true, winner: currentPlayer }));
      setPhase("success");
      return;
    }
    setGameState(prev => ({ ...prev, positions: newPositions }));
  }
  nextPlayer();
}, [gameState, difficulty, pendingMove, nextPlayer]);

// POTEM:
const handleWordResult = useCallback((_accepted: boolean) => {
  nextPlayer();
}, [nextPlayer]);
```

Poleg tega odstranimo neuporabljene importe `DIFFICULTY_BONUS` iz `kaceLestveConfig`.

#### `src/components/games/KaceLestveBoard.tsx`

1. Spremenimo `HOP_INTERVAL_MS` iz `180` na `150` ms (vrstica 17).

2. Zamenjamo `transition` za `motion.div` (vrstice 456–459):

```tsx
// PREJ:
transition={
  isHopping
    ? { type: 'spring', stiffness: 600, damping: 18, mass: 0.4 }
    : { type: 'spring', stiffness: 200, damping: 22, duration: 0.6 }
}

// POTEM:
transition={
  isHopping
    ? { type: 'tween', duration: 0.13, ease: 'easeInOut' }
    : { type: 'tween', duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
}
```

`tween` z `easeInOut` da gladek, tekoč premik brez odbojev. Vsak korak traja 130ms, interval med koraki je 150ms — dovolj časa da se vsak korak vidi, a skupaj deluje kot tekoče drsenje po poljih.

---

### Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveGame.tsx` | Odstranitev bonus logike iz `handleWordResult`, odstranitev `difficulty` in `pendingMove` odvisnosti |
| `src/components/games/KaceLestveBoard.tsx` | `HOP_INTERVAL_MS: 180 → 150`, `spring` → `tween` za oba tipa premikov |
