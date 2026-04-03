

## Plan: Dodaj safeRequestFullscreen v Album za skritje sistemskih gumbov na tablici

### Problem
Na tablici sistemska navigacijska vrstica (nazaj, domov, meni) ostane vidna in prekriva "1/15" navigacijo albuma. Igra Labirint to reši s klicem `safeRequestFullscreen()`, ki skrije sistemske gumbe — Album tega klica nima.

### Popravek

**1 datoteka: `src/pages/Album.tsx`**

- Dodam touch device detekcijo (enak vzorec kot v Labirintu: `ontouchstart + screen <= 900`)
- Dodam `useEffect`, ki na touch napravah pokliče `safeRequestFullscreen()` iz `@/utils/appleDetection`
- Ob unmount pokliče `safeExitFullscreen()` (ko uporabnik zapusti album)
- Brez landscape locka — album deluje v obeh orientacijah

Koda bo enaka kot v Labirintu (vrstice 121-135), le brez `safeLockLandscape`.

### Obseg
- 1 datoteka, ~15 vrstic dodanih
- Brez sprememb vizualnega izgleda ali logike

