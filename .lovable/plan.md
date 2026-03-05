

# Plan: Popravi kartice na strani Vizualni prikaz ustnic

## Spremembe

### 1. Spodnji beli del sprednje strani: "Glas K" → "Odpri"
Zamenjam `{card.title}` v spodnjem belem delu z besedilom **"Odpri"** pri vseh karticah.

### 2. Velikost kartic — prilagoditev za zadnjo stran
Problem: kartice imajo `aspect-ratio: 1/1` v CSS in `minHeight: 320px`, kar je premalo za zadnjo stran (naslov + slika + gumb). Rešitev:

- V CSS odstranim `aspect-ratio: 1/1` iz `.flip-card` (ali ga preglasim)
- Na kartici nastavim `minHeight: 420px` namesto 320px
- Na zadnji strani omejim velikost slike (`max-h-[250px] object-contain`) da ostane prostor za naslov in gumb
- Zadnja stran dobi `justify-between` da se naslov, slika in gumb enakomerno razporedijo

### Datoteke
- `src/pages/VizualniPrikazUstnic.tsx` — "Odpri" tekst + višji minHeight + layout zadnje strani
- `src/index.css` — odstrani `aspect-ratio: 1/1` iz `.flip-card`

