## Plan Generation - Robustified (implemented 2026-03-23)

### Changes made

1. **Edge function `generate-monthly-plan`**: 
   - Added `mode` parameter: `report_update` (default) preserves progress, `renewal` creates fresh plan
   - Orphan recovery: reactivates archived plans that have existing progress
   - In-place update: when plan exists, merges new sets while keeping tracked sets intact
   - No more archive-first pattern — existing plan stays active until new one is confirmed

2. **Admin frontend** (`AdminUserDetail`, `AdminLogopedistChildDetail`):
   - Changed from fire-and-forget to `await` with proper success/error toasts
   - Passes `mode: 'report_update'` explicitly

3. **`MojiIzzivi.tsx`**: Passes `mode: 'renewal'` for auto-renewal after 30/30

4. **`GeneratePlanButton`**: Uses exact `pdf_url` match instead of fuzzy `ilike`, accepts optional `reportId` prop

5. **Testni otrok fix**: Orphaned archived plan `b9aaa254` reactivated with preserved progress
