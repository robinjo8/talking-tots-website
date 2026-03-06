

# Desktop carousel: puščice, večje kartice, centriranje

## Problem
1. Kartica ni centrirana — vidi se rob naslednje kartice na desni. Vzrok: `CarouselContent` ima `-ml-4` in vsak `CarouselItem` ima `pl-4` (privzeti Embla padding). Ta offset povzroči, da kartica ni povsem na sredini.
2. Manjkajo puščice za navigacijo levo/desno.
3. Kartice so premajhne — povečati za 25%.

## Spremembe v `src/pages/VizualniPrikazUstnic.tsx`

### 1. Centriranje
- Na `CarouselContent` dodaj `className="-ml-0"` da preglasiš privzeti `-ml-4`
- Na `CarouselItem` dodaj `className="pl-0 basis-full"` da odstraniš `pl-4` offset
- To bo kartico postavilo na pravo sredino

### 2. Puščice
- Dodaj `CarouselPrevious` in `CarouselNext` iz UI carousel komponent zraven desktop `Carousel`
- Uporabim obstoječe komponente iz `carousel.tsx` (že imajo pozicioniranje)

### 3. Povečanje kartic za 25%
- `max-w-lg` (512px) → `max-w-xl` (576px) na containerju — to je ~12.5% povečanje containerja
- `minHeight: '420px'` → `minHeight: '525px'` (420 * 1.25)
- `max-h-[250px]` na sliki → `max-h-[312px]`

### Datoteke
- `src/pages/VizualniPrikazUstnic.tsx`

