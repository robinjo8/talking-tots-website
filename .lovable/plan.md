
## Spremembe: Kača vedno premakne + počasnejša elegantna animacija

### Kaj se bo spremenilo

#### 1. Logika kače — vedno premik na rep + nova beseda tam

**Trenutno**: Dialog na glavi kače → pravilno = ostaneš, napačno = rep.

**Novo**: 
1. Zmajček pristane na glavi (npr. display 19 = fizična 21)
2. Počakaš 1,5s → odpre se dialog: izgovori besedo
3. Ko klikneš karkoli (ne glede na rezultat) → zapre se dialog, zmajček se elegantno premakne na rep (npr. display 7 = fizična 9)
4. Po pristanku na repu počakaš 1,5s → odpre se NOV dialog z novo besedo
5. Ko zaključiš → nextPlayer()

Preslikava (display → display):
- **19 → 7** (fizična 21 → 9)
- **22 → 12** (fizična 24 → 14)
- **29 → 17** (fizična 31 → 19)
- **38 → 32** (fizična 40 → 34)

**Implementacija v `KaceLestveGame.tsx`**:

Dodamo nov boolean state `snakeTailPending`:
```tsx
const [snakeTailPending, setSnakeTailPending] = useState(false);
```

Spremenimo `handleSnakeChallengeResult` — vedno premakne na rep:
```tsx
const handleSnakeChallengeResult = useCallback((_accepted: boolean) => {
  if (pendingMove !== null && SNAKES[pendingMove] !== undefined) {
    const tailPos = SNAKES[pendingMove]!;
    const newPositions = [...gameState.positions];
    newPositions[gameState.currentPlayer] = tailPos;
    setGameState(prev => ({ ...prev, positions: newPositions }));
    setSnakeTailPending(true);
    setAnimStep('moving_to_final');
    setPendingDialogPhase(null);
    setPhase('rolling'); // zapri dialog med animacijo
  } else {
    nextPlayer();
  }
}, [gameState, pendingMove, nextPlayer]);
```

Spremenimo `handleAvatarLanded` — ko `snakeTailPending` je true, odpri word_challenge:
```tsx
} else if (animStep === 'moving_to_final') {
  setAnimStep('idle');
  if (snakeTailPending) {
    setSnakeTailPending(false);
    const { word, index } = getRandomWord(gameState.usedWordIndices);
    setCurrentWord(word);
    setGameState(prev => ({ ...prev, usedWordIndices: [...prev.usedWordIndices.slice(-8), index] }));
    setPendingMove(gameState.positions[gameState.currentPlayer]);
    setTimeout(() => setPhase('word_challenge'), 1500);
  } else if (pendingDialogPhase) {
    ...
  } else {
    nextPlayer();
  }
}
```

Resetamo `snakeTailPending` tudi v `resetGame`, `handleStart`, `nextPlayer`.

#### 2. Počasnejša, elegantnejša animacija premikov

**Hop animacija** (premik po poljih po kocki): upočasnimo za polovico.
- `HOP_INTERVAL_MS`: `150` → `300` ms
- Trajanje posameznega koraka: `0.13s` → `0.26s`

**Animacija lestve/kače** (daljši skok): eleganten, počasen premik.
- Trajanje: `0.5s` → `1.8s`
- Ease: `[0.4, 0, 0.2, 1]` (začne hitro, konča nežno)

Sprememba v `KaceLestveBoard.tsx`:
```tsx
// Prej:
transition={
  isHopping
    ? { type: 'tween', duration: 0.13, ease: 'easeInOut' }
    : { type: 'tween', duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
}

// Potem:
transition={
  isHopping
    ? { type: 'tween', duration: 0.26, ease: 'easeInOut' }
    : { type: 'tween', duration: 1.8, ease: [0.4, 0, 0.2, 1] }
}
```

#### 3. Sekvenca za kačo (po spremembi)

```
Met kocke: 6, pozicija: START
→ Zmajček hopa polje za poljem do display 19 (fizična 21)
→ Čaka 1,5s
→ Dialog: "Izgovori besedo" (display 19 = glava kače)
→ Klik kateregakoli gumba
→ Dialog se zapre
→ Zmajček elegantno drsi v 1,8s do display 7 (fizična 9 = rep kače)
→ Po pristanku čaka 1,5s
→ Nov dialog: "Izgovori novo besedo" (display 7 = rep kače)
→ Ko zaključiš → naslednji igralec
```

### Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveGame.tsx` | Nov `snakeTailPending` state, vedno premik na rep v `handleSnakeChallengeResult`, nova beseda na repu v `handleAvatarLanded` |
| `src/components/games/KaceLestveBoard.tsx` | `HOP_INTERVAL_MS: 150→300`, hop duration `0.13→0.26s`, skok duration `0.5→1.8s` |
