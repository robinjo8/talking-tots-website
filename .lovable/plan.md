

# Header prekrivanje na tablicah — popravek breakpointa

## Problem
Trenutno se desktop navigacija prikaže pri `xl` (1280px), mobilna pa pri `xl:hidden`. Tablice in naprave kot Lenovo Yoga imajo pogosto resolucijo 1280-1366px, kar pomeni da se desktop layout komaj prikaže in se gumbi prekrivajo.

## Rešitev
Dvignemo breakpoint iz `xl` (1280px) na `2xl` (1536px). To pomeni:
- Naprave do 1536px (tablice, Yoga, manjši prenosniki) dobijo **mobilni** layout s hamburger menijem
- Samo večji zasloni (1536px+) dobijo polno desktop navigacijo

## Spremembe

### `src/components/header/DesktopNavigation.tsx`
- `hidden xl:flex` → `hidden 2xl:flex` (vrstica ~82 in logopedist blok ~33)

### `src/components/Header.tsx`  
- `xl:hidden` → `2xl:hidden` (vrstica ~58)
- `hidden xl:flex` → `hidden 2xl:flex` (gumbi za prijavo, če obstajajo)

### `src/hooks/use-mobile.tsx`
- Ni sprememb — ta hook ostane pri 768px za pravo mobilno detekcijo

To je minimalna sprememba (zamenjava 4-5 class name-ov) ki reši problem brez kakršnegakoli vpliva na ostale komponente.

