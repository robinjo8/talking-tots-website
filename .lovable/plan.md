

# Popravek: Igre na admin strani ne upoštevajo starosti otroka

## Problem
Na admin strani vseh 4 iger z različicami po starosti (Sestavljanke, Drsna sestavljanka, Zaporedja, Igra ujemanja) navigirajo na URL brez starostnega sufiksa (npr. `/s` namesto `/s56`). To pomeni, da vsi otroci dobijo različico za starost 3-4 let, ne glede na dejansko starost.

Na uporabniškem portalu te igre pravilno dodajo sufiks glede na starost otroka: `/s` (3-4), `/s56` (5-6), `/s78` (7-8), `/s910` (9-10).

## Katere igre so prizadete
Samo 4 igre imajo starostne različice:
1. **Sestavljanke** (`AdminSestavljankeGames.tsx`)
2. **Drsna sestavljanka** (`AdminDrsnaSestavljankaGames.tsx`)
3. **Zaporedja** (`AdminZaporedjaGames.tsx`)
4. **Igra ujemanja** (`AdminIgraUjemanjaGames.tsx`)

Preostalih 7 iger (Spomin, Bingo, Kolo besed, Labirint, Met kocke, Ponovi poved, Kače) **nima** starostnih različic in ne potrebujejo sprememb.

## Rešitev
V vsakem od 4 prizadetih admin game selection komponent:

1. Uvozimo `useLogopedistChild` hook za pridobitev starosti otroka iz baze
2. Uvozimo `getAgeGroup` za pretvorbo starosti v starostno skupino
3. V `handleLetterClick` dodamo ustrezen sufiks glede na starostno skupino

### Logika sufiksa
```text
Starost 3-4 → brez sufiksa (npr. /s)
Starost 5-6 → sufiks "56" (npr. /s56)
Starost 7-8 → sufiks "78" (npr. /s78)
Starost 9-10 → sufiks "910" (npr. /s910)
```

## Spremembe (4 datoteke)

### 1. `src/pages/admin/games/AdminSestavljankeGames.tsx`
- Uvoz `useLogopedistChild` in `getAgeGroup`
- Pridobi otrokovo starost prek `useLogopedistChild(childId)`
- V `handleLetterClick`: izračunaj sufiks in ga dodaj na URL

### 2. `src/pages/admin/games/AdminDrsnaSestavljankaGames.tsx`
- Enaka sprememba kot zgoraj

### 3. `src/pages/admin/games/AdminZaporedjaGames.tsx`
- Enaka sprememba kot zgoraj

### 4. `src/pages/admin/games/AdminIgraUjemanjaGames.tsx`
- Enaka sprememba kot zgoraj

### Primer spremembe (enak vzorec za vse 4)
```typescript
import { useLogopedistChild } from "@/hooks/useLogopedistChildren";
import { getAgeGroup } from "@/utils/ageUtils";

// V komponenti:
const { data: child } = useLogopedistChild(childId);

const getAgeSuffix = (): string => {
  if (!child?.age) return '';
  const ageGroup = getAgeGroup(child.age);
  const suffixMap: Record<string, string> = {
    '3-4': '', '5-6': '56', '7-8': '78', '9-10': '910'
  };
  return suffixMap[ageGroup] || '';
};

const handleLetterClick = (letterId: string) => {
  const suffix = getAgeSuffix();
  navigate(`/admin/children/${childId}/games/[game-type]/${letterId}${suffix}`);
};
```

Nobenih sprememb baze, routerjev ali game komponent ni potrebnih — admin routerji že pravilno obravnavajo URL-je s sufiksi.

