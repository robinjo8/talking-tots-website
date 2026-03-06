

# Desktop: carousel namesto grida

## Problem
Desktop verzija prikazuje 2x2 grid kartic, ki se ne prilegajo na en zaslon (h-screen). Uporabnik ne more scrollati ker je `overflow-hidden`.

## Rešitev
Na desktopu zamenjam grid z Embla carousel (isti kot na mobilni verziji), ki prikazuje eno kartico naenkrat s pikicami za navigacijo. Mobilna verzija ostane nedotaknjena.

## Spremembe v `src/pages/VizualniPrikazUstnic.tsx`

### Desktop del (vrstice 186-218)
- Zamenjam `grid` z drugim `Carousel` komponentom (potrebujem ločen API state za desktop: `desktopCarouselApi`, `desktopCurrentSlide`)
- Carousel prikaže eno kartico naenkrat (`basis-full`), centrirano, z `max-w-lg mx-auto` za primerno širino
- Pod carousel dodam pikice za navigacijo (enake kot mobilne, le z drugo barvo ali enako)

### State spremembe
- Preimenujem obstoječi `carouselApi` → ostane za mobilno
- Dodam `desktopCarouselApi` in `desktopCurrentSlide` state
- Dodam `onDesktopSelect` callback in useEffect za desktop carousel

### Struktura desktop dela
```
Carousel (setApi={desktopCarouselApi}, max-w-lg mx-auto)
  CarouselContent
    CarouselItem (basis-full) × 5 kartic
  Pikice za navigacijo
```

### Datoteke
- `src/pages/VizualniPrikazUstnic.tsx`

