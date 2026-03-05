

# Odstranitev scrollbarja

## Problem
Stran ima `min-h-screen` na zunanjem divu IN na section elementu, plus `FooterSection` na dnu — skupaj presegajo višino zaslona in povzročijo scrollbar.

## Popravek v `src/pages/VizualniPrikazUstnic.tsx`

1. Zunanji div: `min-h-screen` → `h-screen overflow-hidden` — stran zapolni natanko en zaslon brez scrolla
2. Section: odstrani `min-h-screen`, uporabi `flex-1` da zapolni preostali prostor
3. Odstrani `<FooterSection />` — ni potreben, ker mora biti vse na eni strani
4. Uporabi flex column layout na zunanjem divu za pravilno razporeditev

Struktura:
```
div (h-screen overflow-hidden flex flex-col)
  ├── Header
  ├── section (flex-1, brez min-h-screen)
  │   ├── Carousel + pike (mobilno)
  │   └── Grid (desktop)
  └── Floating back button (fixed, ni del flowa)
```

### Datoteke
- `src/pages/VizualniPrikazUstnic.tsx`

