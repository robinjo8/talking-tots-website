

## Problem

`getWordCountOverride` reads from localStorage but is a plain function (not reactive state). When the user selects "20 besed" in the settings dialog and confirms, `setWordCountOverride` writes to localStorage, but the component doesn't re-render because nothing triggers a state update. The `wordCountOverride` variable on both pages is computed once and stays stale.

This affects both the admin page (`AdminArtikulacijskiTest.tsx`) and the user page (`ArtikuacijskiTest.tsx`) identically.

## Fix

### File: `src/hooks/useArticulationSettings.ts`

Convert word count override from a read-from-localStorage function to reactive state:

1. Add a `wordCountOverrides` state (`Record<string, WordCount>`) initialized from localStorage on mount (alongside difficulty/recordingDuration loading).
2. Replace `getWordCountOverride` with a function that reads from this state instead of localStorage.
3. Update `setWordCountOverride` to both update the state AND write to localStorage, ensuring the component re-renders.

### Files: `src/pages/admin/AdminArtikulacijskiTest.tsx` + `src/pages/ArtikuacijskiTest.tsx`

No changes needed — they already call `getWordCountOverride(childId)` which will now be reactive.

### Summary

One file changed (`useArticulationSettings.ts`), fixing the bug on both admin and user portals simultaneously. The settings dialog UI already works correctly (confirm dialogs, visual selection) — only the state propagation back to the parent component is broken.

