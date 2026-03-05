

# Plan: Popravi dizajn kartic na strani Vizualni prikaz ustnic

## Problem
1. **Oranžna podlaga v ozadju** — CSS razred `.flip-card-front` (index.css, vrstica 180-187) ima trdo kodirano oranžno gradient ozadje (`linear-gradient #fb923c → #ea580c`) in oranžen `box-shadow`. Čeprav komponenta nastavi `style={{ background: 'white' }}`, oranžen `box-shadow` še vedno sveti skozi.
2. **Kartica ni na sredini** — na mobilni verziji carousel nima omejene širine in centriranja.

## Spremembe

### `src/index.css`
- `.flip-card-front`: Odstranim oranžen gradient in oranžen box-shadow. Nastavim `background: white` in nevtralen siv shadow za osenčen rob.
- `.flip-card-back`: Dodam močnejši siv shadow za osenčen rob.

### `src/pages/VizualniPrikazUstnic.tsx`
- Mobilni carousel wrapper: dodam `max-w-sm mx-auto` za centriranje kartice na zaslonu.
- Na kartici zamenjam `border-2 border-gray-100` z `border border-gray-200` in dodam `shadow-xl` za lepši osenčen rob.

### Datoteke
- `src/index.css`
- `src/pages/VizualniPrikazUstnic.tsx`

