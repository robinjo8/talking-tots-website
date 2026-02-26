

# Popravek postavitve strani Klepet -- fiksni elementi in scrollanje

## Problem
Trenutno se ob scrollanju premikajo vsi elementi (zeleni header, sporočila, vnosno polje). Uporabnik želi:
- **Fiksen zeleni header** ("Klepet - Tomi") na vrhu
- **Fiksno vnosno polje** na dnu
- **Scrollanje samo sporočil** v sredini
- Na mobilni verziji naj klepet zapolni celoten zaslon pod glavnim headerjem

## Spremembe

### 1. Klepet.tsx -- celozaslonska postavitev
- Uporabi `h-screen` in `flex flex-col` za celotno stran
- Header aplikacije ostane fiksen na vrhu
- Klepet container zapolni preostali prostor z `flex-1 overflow-hidden`
- Odstrani `min-h-[60vh]` in nepotrebne wrapper-je
- Na mobilni verziji odstrani padding in border/shadow za pravi messenger občutek

### 2. ChatInterface.tsx -- pravilna flex struktura
- Messages area: `flex-1 overflow-y-auto` (samo ta del se scrolla)
- Input area: ostane na dnu brez scrollanja (že ima `border-t`)
- Disclaimer: ostane fiksen pod vnosnim poljem
- Zamenjaj `ScrollArea` komponento z navadnim `overflow-y-auto` div-om za bolj zanesljivo scrollanje

## Tehnicne podrobnosti

### Klepet.tsx -- nova struktura:
```text
div (h-screen, flex flex-col)
  Header (fiksni app header)
  div (flex-1, overflow-hidden, flex flex-col)  <-- zapolni preostali prostor
    div (zeleni header -- fiksen)
    ChatInterface (flex-1, overflow-hidden)
```

### ChatInterface.tsx -- nova struktura:
```text
div (flex flex-col, h-full)
  div (flex-1, overflow-y-auto)  <-- SAMO ta del scrolla
    sporočila...
  div (border-t, bg-background)  <-- fiksno na dnu
    input form
  div (disclaimer)  <-- fiksno na dnu
```

### Datoteke za urejanje:
1. `src/pages/Klepet.tsx` -- celozaslonska postavitev
2. `src/components/chat/ChatInterface.tsx` -- zamenjaj ScrollArea z overflow-y-auto

