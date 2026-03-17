

# Fix: Vizualni prikaz ustnic - mobile layout

## Problems
1. Title + letter buttons are vertically centered with the card instead of being pinned to the top
2. Card size changes when flipping between front (letter badge) and back (image)

## Solution in `src/pages/VizualniPrikazUstnic.tsx`

### 1. Move title & buttons to top
Change mobile container from `flex-1 flex flex-col justify-center` to `flex-1 flex flex-col pt-20 pb-24`. The title and buttons stay at the top, the carousel area gets `flex-1 flex items-center` to center just the card.

### 2. Fixed card height on mobile
Set a fixed height (e.g. `h-[420px]`) on the mobile card container instead of `min-h-[360px]`. Both front and back content will fill this fixed container, preventing