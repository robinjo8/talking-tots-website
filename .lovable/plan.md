

# Belo ozadje na mobilni verziji video strani

## Problem
Na mobilni verziji so vidni črni pasovi (letterboxing) in zeleno ozadje. Uporabnik želi, da je vse belo.

## Spremembe

### `GenericVideoNavodila.tsx`
- Spremeni mobilno ozadje iz `bg-[hsl(135,45%,33%)]` v `bg-white`

### `VideoPlayer.tsx`
- Spremeni mobilno ozadje video wrapperja iz `bg-[hsl(135,45%,33%)]` v `bg-white`

### Datoteke
1. `src/components/games/GenericVideoNavodila.tsx`
2. `src/components/video/VideoPlayer.tsx`

