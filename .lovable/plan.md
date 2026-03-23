

## Problem

Set 1 was started on March 21, expired after 24h, and `expired_at` is `2026-03-23` (today). The function `hasCompletedSetToday()` (line 314-321 in `usePlanProgress.ts`) treats **any** non-active entry dated today as "done" — including **expired** sets. This causes:

1. User visits `/moji-izzivi` → set 1 is auto-expired (24h passed)
2. `hasCompletedSetToday()` returns `true` because `expired_at` is today
3. UI shows "Odlično opravljeno! Danes si že opravil sklop." even though the user never completed it
4. User is blocked from starting set 2 until tomorrow

The archive page also shows "Čas je potekel — 1 zvezdic zbranih" which is technically correct but the main page messaging is wrong.

## Root Cause

```typescript
// Current — treats expired as "done today"
export function hasCompletedSetToday(trackingEntries: SetTracking[]): boolean {
  const todayStr = getTodayDateStr();
  return trackingEntries.some(entry => {
    if (entry.status === "active") return false;  // skips active, but NOT expired
    const dateStr = entry.completed_at || entry.expired_at || entry.started_at;
    return dateStr.startsWith(todayStr);
  });
}
```

An expired set means the user **didn't finish** — they should be allowed to start the next set immediately, not be blocked until tomorrow.

## Fix

### 1. `src/hooks/usePlanProgress.ts` — `hasCompletedSetToday()`

Change to only count **completed** entries (not expired):

```typescript
export function hasCompletedSetToday(trackingEntries: SetTracking[]): boolean {
  const todayStr = getTodayDateStr();
  return trackingEntries.some(entry => {
    if (entry.status !== "completed") return false;
    const dateStr = entry.completed_at || entry.started_at;
    return dateStr.startsWith(todayStr);
  });
}
```

This single change fixes both issues:
- Expired sets no longer block the user from starting the next set
- "Odlično opravljeno" only shows when a set was actually completed with 10 stars today

No other files need changes. The archive page display is correct as-is (it correctly shows expired sets with partial stars).

