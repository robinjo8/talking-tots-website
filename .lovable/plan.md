

## Problem Summary

Three issues identified:

1. **Admin "Moji pregledi" page doesn't distinguish between regular and additional tests** — the `useMyReviews` hook doesn't fetch `additional_assignment_id`, so both session types show identically as "Preverjanje izgovorjave 60 besed".

2. **Audio playback broken on child detail page (AdditionalTestSection)** — the component uses `supabase.storage.from('posnetki').getPublicUrl(audioPath)` but recordings are stored in the `uporabniski-profili` bucket (private). It needs signed URLs from the correct bucket.

3. **Session review page doesn't handle additional test sessions** — the `useSessionReview` hook builds storage paths using `Preverjanje-izgovorjave/Seja-{n}` and maps words via `PHONETIC_ORDER` with 3 words per letter. Additional test sessions have different word counts and the review page doesn't adapt.

---

## Plan

### 1. Add `additional_assignment_id` to `useMyReviews` hook

**File: `src/hooks/useMyReviews.ts`**
- Add `additional_assignment_id: string | null` to the `MyReviewSession` interface.
- Add `additional_assignment_id` to the `.select()` query on line 41.
- Map it through to the result objects.

### 2. Show test type label on "Moji pregledi" page

**File: `src/pages/admin/AdminMyReviews.tsx`**
- In both the desktop table and mobile card, display a label distinguishing:
  - `additional_assignment_id` is set → "Dodatno preverjanje" (with a distinct badge)
  - Otherwise → "Preverjanje izgovorjave"
- Add a column or inline badge showing the test type.

### 3. Fix audio playback in AdditionalTestSection

**File: `src/components/admin/AdditionalTestSection.tsx`**
- Change `getAudioUrl` from using `supabase.storage.from('posnetki').getPublicUrl(audioPath)` to using `supabase.storage.from('uporabniski-profili').createSignedUrl(audioPath, 3600)`.
- The `audio_url` field in `articulation_word_results` stores the full storage path within `uporabniski-profili` — use that directly.
- Since `createSignedUrl` is async, refactor recording display to pre-fetch signed URLs or use a state/effect pattern.

### 4. Handle additional test sessions in session review

**File: `src/hooks/useSessionReview.ts`**
- When the session has `additional_assignment_id`, fetch the assigned words from `additional_test_words` to build correct letter/word mapping instead of using `PHONETIC_ORDER`.
- Set `wordsPerLetter` dynamically based on the additional test's word structure.
- The storage path remains the same (`Preverjanje-izgovorjave/Seja-{n}`) since `transcribe-articulation` uses the same path structure.

### 5. Add `additional_assignment_id` to `useAdminTests` hook

**File: `src/hooks/useAdminTests.ts`**
- Add `additional_assignment_id` to the select query and `TestSessionData` interface.
- This ensures the "Vsa preverjanja" page can also distinguish test types.

