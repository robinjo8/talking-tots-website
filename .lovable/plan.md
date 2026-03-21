

## Problem

The `targetLetters` array on line 441 is built from all letter-position pairs, so if a child has R at 3 positions (start, middle-end, initial-exercises), it produces `[R, R, R]`, resulting in the nonsensical "glasove R, R in R".

## Solution

Replace the simple letter listing with a descriptive summary that includes **what positions** each letter needs practice at -- mirroring what the logoped marked in the report.

### Changes in `supabase/functions/generate-monthly-plan/index.ts`

**1. Deduplicate `targetLetters` (line 441):**
```typescript
const targetLetters = [...new Set(letterPositions.map(lp => lp.letter))];
```

**2. Replace the summary generation (lines 460-469) with position-aware text:**

Build a human-readable description per letter, e.g.:
- R with positions start, middle-end, initial-exercises → "glas R (na začetku, na sredini in koncu besed ter začetne vaje)"
- S with position start → "glas S (na začetku besed)"
- L with position middle-end → "glas L (na sredini in koncu besed)"

Position labels:
- `start` → "na začetku besed"
- `middle-end` → "na sredini in koncu besed"  
- `initial-exercises` → "začetne vaje"

Example output: *"Hej Testni Otrok! Pripravili smo ti zabaven načrt vaj in iger, s katerimi boš vadil glas R (na začetku, na sredini in koncu besed ter začetne vaje). Vsak dan te čakajo..."*

With multiple letters: *"...s katerimi boš vadila glasova S (na začetku besed) in R (na sredini in koncu besed)."*

**3. Redeploy the edge function.**

**4. Re-generate the plan for Testni otrok** to get the corrected summary.

