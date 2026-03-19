

## Problem

After the info/consent dialog, the settings dialog should automatically open for first-time setup. Additionally, the "word count" (20/60) option should ONLY be visible during this initial pre-test setup — not when the user opens settings later during the test via the menu.

Currently:
- After consent, the test starts immediately (no settings shown)
- Word count is always visible in settings (for age 5+)
- User can change word count mid-test, which shouldn't be allowed

## Plan

### 1. Add `isInitialSetup` prop to `ArticulationSettingsDialog`

**File: `src/components/articulation/ArticulationSettingsDialog.tsx`**
- Add `isInitialSetup?: boolean` prop
- Word count section visibility: `showWordCount && isInitialSetup` — only show during initial setup
- When `isInitialSetup` is true, change title to something like "Nastavitve pred začetkom preverjanja" and make the dialog non-dismissable (no close on overlay click)

### 2. Auto-open settings after consent dialog (User portal)

**File: `src/pages/ArtikuacijskiTest.tsx`**
- Add state `showInitialSettings` (boolean, default false)
- In the `ArticulationTestInfoDialog` `onClose` handler: instead of immediately initializing the session, set `showInitialSettings = true`
- When initial settings dialog closes: THEN call `initializeSession()`, `setTestStarted(true)`
- Pass `isInitialSetup={true}` to the settings dialog when opened this way
- The existing menu-triggered settings dialog stays as-is with `isInitialSetup={false}` (or omitted)

### 3. Same change for Admin portal

**File: `src/pages/admin/AdminArtikulacijskiTest.tsx`**
- Identical logic: consent → initial settings → then start test
- Pass `isInitialSetup` accordingly

### 4. Handle resume scenario

When a user resumes an existing session (resume dialog appears), the initial settings should NOT show again — word count is already locked from the first time. Only the consent dialog and resume dialog flow applies.

**Implementation detail**: Track whether to show initial settings with a simple flag. If resuming (`showResumeDialog` becomes true), skip the initial settings step entirely.

### Summary

- 3 files changed
- `ArticulationSettingsDialog.tsx`: add `isInitialSetup` prop, conditionally hide word count
- `ArtikuacijskiTest.tsx`: chain consent → settings → start
- `AdminArtikulacijskiTest.tsx`: same chain

