

# Zeleno ozadje na mobilni verziji video strani

## Problem
Na mobilni verziji so vidni črni pasovi (zgoraj/spodaj od videa) in belo ozadje med njimi. Uporabnik želi, da se celoten zaslon (od vrha do dna) zapolni z zeleno barvo namesto črne/bele.

## Rešitev

### `GenericVideoNavodila.tsx`
- Na mobilni verziji spremeni `bg-background` (belo) v zeleno ozadje: `bg-[#2D7A3A]` (ali podoben odtenek zelene iz slike — temnejša zelena kot v logotipu)
- Uporabi pogojni class: `${isMobile ? 'bg-[#2D7A3A]' : 'bg-background'}`

### `VideoPlayer.tsx`
- Na mobilni verziji spremeni video ozadje iz privzetega (črno) v zeleno, da se pasovi zgoraj/spodaj (letterbox) ujemajo z ozadjem strani
- Dodaj `style={{ backgroundColor: '#2D7A3A' }}` na video wrapper div za mobilno verzijo
- Alternativno: uporabi CSS class na video elementu za zeleno ozadje namesto črnega

### Datoteke
1. `src/components/games/GenericVideoNavodila.tsx` — zeleno ozadje containerja na mobilni
2. `src/components/video/VideoPlayer.tsx` — zeleno ozadje video wrapperja na mobilni

