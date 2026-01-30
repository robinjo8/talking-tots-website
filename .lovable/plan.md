
# Plan: Podaljšanje prikaza končne številke na kocki

## Problem
Ko kocka konča vrtenje, se prehitro skrije (po samo 400ms). Uporabnik nima dovolj časa videti, katera številka je padla, preden se kocka umakne in označi slika v stolpcu.

## Rešitev
Podaljšati čas med končno rotacijo kocke in njenim skrivanjem, da uporabnik jasno vidi rezultat.

## Tehnični detajli

### 1. DiceRoller.tsx - podaljšaj timeout pred klicem onRollComplete
**Datoteka:** `src/components/dice/DiceRoller.tsx`

Trenutno (vrstica 92-94):
```tsx
setTimeout(() => {
  onRollComplete(finalResult);
}, 400);
```

Sprememba na **1200ms** (1.2 sekunde), da ima uporabnik dovolj časa videti številko:
```tsx
setTimeout(() => {
  onRollComplete(finalResult);
}, 1200);
```

## Zakaj 1200ms?
- 400ms je bilo prekratko - kocka je izginila, preden je uporabnik sploh opazil številko
- 1200ms omogoča:
  - 800ms za gladko animacijo rotacije do končne pozicije
  - 400ms dodatnega časa za uporabnika, da jasno vidi rezultat
- Skupaj z animacijo vrtenja (60ms × 8-13 = ~500-780ms) bo celoten met trajal približno 1.7-2 sekundi

## Rezultat
Uporabnik bo jasno videl:
1. Kocka se vrti
2. Kocka se ustavi na številki (npr. 4)
3. Številka je vidna 1.2 sekunde
4. Kocka izgine in slika se označi
