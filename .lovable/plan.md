

# Problem: Header prazen med 1024px in 1536px

## Vzrok
MobileMenu komponenta ima `lg:hidden` (skrije se pri 1024px+), DesktopNavigation pa `hidden 2xl:flex` (prikaže se pri 1536px+). Med 1024px in 1536px se ne prikaže nobeden layout - ne hamburger meni, ne desktop gumbi.

## Rešitev
Zamenjaj `lg:hidden` z `2xl:hidden` v MobileMenu.tsx, da se hamburger meni prikazuje vse do 1536px, kjer prevzame desktop navigacija.

## Spremembe

### `src/components/header/MobileMenu.tsx`
- Vrstica 37: `lg:hidden` → `2xl:hidden` (logopedist blok)
- Vrstica 118: `lg:hidden` → `2xl:hidden` (glavni return)

To je sprememba dveh CSS razredov ki popolnoma zapre luknjo med breakpointi.

