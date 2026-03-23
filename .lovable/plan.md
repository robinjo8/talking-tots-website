

## Plan: Popravi predvajanje zvoka prve besede po zaprtju dialoga

### Problem
Ko se zapre dialog "Nastavitve preverjanja", se `testStarted` nastavi na `true`, kar aktivira autoplay zvoka. Ker je slika že naložena (`loading = false`), se zvok predvaja samo 1 sekundo po zaprtju dialoga — to je premalo, saj animacija zapiranja dialoga traja ~300ms, plus potreben je čas za prikaz UI. Zvok se zato sliši odrezan ali delno predvajan.

### Rešitev
V `useArticulationTestNew.ts` dodaj ločen `useEffect`, ki ob **prvem** vklopu `autoPlayEnabled` (prehod false→true) počaka dlje (1.5s) pred predvajanjem. Za vse nadaljnje besede ostane 1s.

### Spremembe

**`src/hooks/useArticulationTestNew.ts`**
- Dodaj `useRef` za sledenje, ali je `autoPlayEnabled` pravkar postal `true` (prvi vklop)
- V autoplay `useEffect` uporabi 1500ms zamik, ko je `autoPlayEnabled` pravkar postal `true` (prva beseda po zaprtju dialoga), sicer 1000ms
- To zagotavlja, da se dialog popolnoma zapre preden se zvok začne predvajati

Konkretno:
```typescript
const wasAutoPlayDisabled = useRef(true);

useEffect(() => {
  if (!autoPlayEnabled || !currentData?.word.audio || loading || sortedArticulationData.length === 0) return;

  // First time autoplay is enabled (dialog just closed) — longer delay
  const isFirstPlay = wasAutoPlayDisabled.current;
  if (isFirstPlay) {
    wasAutoPlayDisabled.current = false;
  }

  const delay = isFirstPlay ? 1500 : 1000;
  const timer = setTimeout(() => {
    playWordAudio();
  }, delay);

  return () => clearTimeout(timer);
}, [currentWordIndex, loading, autoPlayEnabled, sortedArticulationData]);
```

