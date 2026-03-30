

## Plan: Prikaži vedno 90 kot cilj v osebnem načrtu

### Problem
Sistem pravilno ustvarja načrte (3× po 30 sklopov), ampak **prikaz** na `/moji-izzivi` kaže samo `totalSets + setOffset` kot denominator. Ko je uporabnik na planu 2 (setOffset=30), vidi "30/60" namesto "30/90". Uporabnik pričakuje, da je cilj vedno 90 sklopov.

Logika v ozadju NI pokvarjena — načrti se pravilno ustvarjajo in obnavljajo. Gre zgolj za UI prikaz.

### Spremembe

**`src/pages/MojiIzzivi.tsx`**

Zamenjaj denominator `totalSets + setOffset` z `MAX_CYCLE_SETS = 90` (ali `3 * totalSets`) na vseh mestih:

1. **Vrstica 279** — `progressPercent`: uporabi `90` kot denominator
2. **Vrstica 311** — prikaz "X/90 sklopov" namesto "X/60 sklopov"
3. **Vrstica 336, 352** — čestitke tekst: "Vseh 90 sklopov"
4. **Vrstica 359** — `PlanSetCard` totalSets prop: `90`

Dodaj konstanto na vrhu:
```ts
const MAX_CYCLE_SETS = 90; // 3 × 30 sets per assessment cycle
```

Numerator ostane enak: `completedSetsCount + setOffset`.

**`src/pages/admin/AdminOsebniNacrt.tsx`** — ista sprememba za admin pregled (vrstica 17, 54)

### Obseg
- 2 datoteki, ~10 vrstic spremenjenih
- Brez sprememb v logiki načrtov ali edge funkcijah

