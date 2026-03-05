

# Plan: Mobilne prilagoditve za dve strani

## 1. `/govorno-jezikovne-vaje` — Skrčene kartice na mobilni verziji

V `src/pages/GovornojezicovneVaje.tsx`:
- Uvozim `useIsMobile` hook in `useState`
- Na mobilni verziji opisi kartic (`exercise.description`) privzeto skrijejo se — prikaže se le naslov kartice z gradient headerjem
- Dodam razširitveni gumb (chevron/puščica ali "Več") pod vsako kartico, ki ob kliku razširi/skrije opis
- Na namizni verziji ostane vse kot je zdaj (vedno razširjeno)
- Uporabim Radix `Collapsible` ali preprosto `useState` z `expandedId`

## 2. `/govorno-jezikovne-vaje/vizualni-prikaz-ustnic` — Slide kartice na mobilni

V `src/pages/VizualniPrikazUstnic.tsx`:
- Uvozim `useIsMobile` in Embla carousel komponente (`Carousel`, `CarouselContent`, `CarouselItem`)
- Na mobilni verziji zamenjam grid (`grid-cols-1`) s horizontalnim carouselom
- Vsaka kartica je en slide — uporabnik podrsne levo/desno
- Dodam pagination pike pod carouselom (uporabim obstoječo `CarouselPagination` komponento)
- Na namizni verziji ostane grid layout nespremenjen
- Flip animacija ostane funkcionalna znotraj carousel slide-a

### Datoteke
- `src/pages/GovornojezicovneVaje.tsx`
- `src/pages/VizualniPrikazUstnic.tsx`

