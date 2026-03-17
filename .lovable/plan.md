

# Fix: Center video card on mobile (like Vizualni prikaz ustnic)

## Problem
On mobile, the video card expands to fill all available space (`flex-1`) instead of being centered with a natural size.

## Solution in `src/components/games/GenericVideoNavodila.tsx`

### Changes to mobile layout:
1. **Container**: Change from `flex-1 flex flex-col overflow-hidden pt-20 pb-2` to `flex-1 flex flex-col pt-20 pb-24` (matching VizualniPrikazUstnic)
2. **Card wrapper**: Wrap the video card in a `flex-1 flex items-center` div on mobile to vertically center it
3. **Card itself**: Remove `flex-1` from the card so it doesn't expand — use natural height with `w-full max-w-sm mx-auto`
4. **Overflow**: Change outer container from `overflow-hidden` to `overflow-auto` to allow scrolling if needed

This mirrors the pattern from VizualniPrikazUstnic: title pinned at top, card centered in remaining vertical space.

