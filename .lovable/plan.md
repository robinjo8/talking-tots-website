

## Problem

Edge function `generate-monthly-plan` crashes with **`ReferenceError: sets is not defined`** (visible in logs). Three variables are missing between the summary generation (line 480) and the insert (line 489):

1. **`sets`** — `generateSetBasedPlan()` is defined but never called
2. **`now`**, **`startDateStr`**, **`expiresAt`** — never declared

The previous edit that added position-aware descriptions likely removed or never included these critical lines.

## Fix

Add the missing code between line 480 (after `summary`) and line 482 (before archive):

```typescript
// Build game combinations and generate sets
const combinations = buildGameCombinations(letterPositions, ageGroup);
const sets = generateSetBasedPlan(TOTAL_SETS, combinations, motorikaConfig);

const now = new Date();
const startDateStr = formatDate(now);
const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
```

### File: `supabase/functions/generate-monthly-plan/index.ts`
- Insert 6 lines after line 480 (after `summary` const, before the archive block)
- Redeploy the edge function
- Re-generate the plan for Testni otrok to verify it works

This is a single insertion of missing variable declarations — no other changes needed.

