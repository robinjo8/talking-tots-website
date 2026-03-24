

## Plan: Page picker popup on mobile

### What
Make the page counter ("1 / 30") clickable. On tap, open a Dialog with a 3-column grid of page numbers (1–N). Tapping a number jumps to that page and closes the dialog.

### Changes in `src/components/album/AlbumBook.tsx`

1. Add `useState<boolean>` for `showPagePicker`
2. Make the page counter a `<button>` that sets `showPagePicker(true)`
3. Add a `Dialog` (from `@/components/ui/dialog`) below the counter:
   - Title: "IZBERI STRAN"
   - Content: 3-column grid (`grid grid-cols-3 gap-2`) with buttons numbered 1 to `totalSpreads`
   - Current page highlighted (e.g., `bg-amber-500 text-white`, others `bg-muted`)
   - On click: `setDirection(...)`, `setCurrentSpread(i)`, `setShowPagePicker(false)`
4. Style the counter button with underline/dashed border to hint it's tappable

