

# Vizualne popravke na strani Vizualni prikaz ustnic

## Spremembe

### 1. Odstrani sivo senčenje na karticah (`src/index.css`)
Problem je `box-shadow` na `.flip-card-front` in `.flip-card-back` (vrstici 179 in 186) — to ustvari siv rob/senco. Odstranim `box-shadow` iz obeh.

### 2. Gumbi K, L, R, C-S-Z, Č-Š-Ž nazaj v črno (`src/pages/VizualniPrikazUstnic.tsx`)
Zamenjaj `border-dragon-green` / `bg-dragon-green` / `text-dragon-green` z `border-foreground` / `bg-foreground` / `text-foreground` na navigacijskih gumbih (vrstice 158-161, 174-177).

### 3. Puščici carousel nazaj v črno (`src/pages/VizualniPrikazUstnic.tsx`)
Vrstici 298-299: Zamenjaj `bg-dragon-green border-dragon-green hover:bg-dragon-green/80` z `bg-foreground border-foreground hover:bg-foreground/80`.

### 4. Pikice v črno (`src/pages/VizualniPrikazUstnic.tsx`)
Zamenjaj `bg-dragon-green` z `bg-foreground` na aktivnih pikicah (vrstici 245 in 312).

### 5. Rahlo sivo ozadje celotne strani (`src/pages/VizualniPrikazUstnic.tsx`)
Vrstica 129: Zamenjaj `bg-white` z `bg-gray-50` na glavnem `div`-u.

