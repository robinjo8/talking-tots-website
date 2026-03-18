

## Problem Analysis

The bug: when "Dodatno preverjanje" loads, the word text shows correctly (e.g., "BRADA") but the image shows "Pajek" (spider) — the first word from the standard articulation test.

**Root cause**: In `useArticulationTestNew.ts`, the image-fetching `useEffect` (line ~111) only depends on `currentWordIndex`. When the component first mounts:

1. `customWordData` is `undefined` (words are still loading from DB)
2. The hook falls back to standard `articulationData` → first word is "Pajek"
3. Image for "Pajek" is fetched and displayed
4. When `customWordData` arrives, `sortedArticulationData` updates, word text updates (re-render)
5. But `currentWordIndex` is still `0`, so the image `useEffect` does NOT re-run
6. Result: correct word text, wrong image

## Fix

**File: `src/hooks/useArticulationTestNew.ts`**

Add `sortedArticulationData` to the dependency array of the image-fetching `useEffect` (around line 111). This ensures the image re-fetches when the word data source changes.

Change:
```ts
}, [currentWordIndex]);
```
To:
```ts
}, [currentWordIndex, sortedArticulationData]);
```

Similarly, the auto-play audio `useEffect` (around line 130) should also depend on `sortedArticulationData` to ensure correct audio plays.

This is a one-line fix in the dependency array that resolves the stale image/audio when custom word data loads asynchronously.

