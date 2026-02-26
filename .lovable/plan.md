

# Popravek logike blizu cilja v igri Zabavna pot

## Problem
Cilj igre je fizicno polje 41 (prvo oranzno polje za stevilko 38), ne polje 42 (slika CILJ). Trenutno koda uporablja `BOARD_SIZE = 42` kot cilj, kar pomeni:
- Igralec na polju 35 (fizicno 37) ima `squaresToEnd = 42 - 37 = 5`
- Met 1 ni enak 5, zato se igralec NE premakne -- napaka!
- Pravilno bi moral met 1 igralca premakniti na polje 36

Poleg tega trenutna logika blokira VSE mete, ki niso tocno enaki razdalji do cilja, tudi tiste ki bi pristali PRED ciljem.

## Resitev

### Nova konstanta `GOAL_POSITION = 41`
Dodati v `kaceLestveConfig.ts`. `BOARD_SIZE` ostane 42 za namene risanja plosce.

### Popravljena logika v `handleDiceRollComplete`
- `squaresToEnd = GOAL_POSITION - currentPos` (namesto BOARD_SIZE)
- Ce `result <= squaresToEnd`: normalen premik (hopping). Ce `result == squaresToEnd`: zmaga.
- Ce `result > squaresToEnd`: prikazi toast "Vrgel si prevec!" in prestej ponesrecen poskus. Po 4 neuspelih poskusih (5. met) kocka prisilno pokaze tocno stevilko.
- Vstop v near-end zono (`squaresToEnd <= SQUARES_NEAR_END`) le doloci ali steje neuspele poskuse

### Prisilni met na 5. poskus
Trenutno `DiceRoller` ne podpira prisilnega rezultata. Dodati prop `forcedResult?: number`. Ko je podan, kocka po animaciji vrne to stevilko namesto nakljucne. V `KaceLestveGame` pred vsakim metom preveriti ali je `failedNearEndCount >= 4` in ce je, podati `forcedResult = squaresToEnd`.

### Toast sporocilo
Uporabiti `sonner` (ze namescen) za prikaz "Vrgel si prevec!" ko met preseze razdaljo do cilja.

### Preverjanje zmage
Zamenjati vse `pos >= BOARD_SIZE` z `pos >= GOAL_POSITION` in `LADDERS[pos]` min z `GOAL_POSITION`.

## Datoteke za urejanje

1. **`src/data/kaceLestveConfig.ts`** -- dodaj `GOAL_POSITION = 41`, exportiraj
2. **`src/components/dice/DiceRoller.tsx`** -- dodaj opcijski prop `forcedResult`
3. **`src/components/games/KaceLestveGame.tsx`** -- popravi vso near-end logiko:
   - Uvozi `GOAL_POSITION`
   - `squaresToEnd` racunaj z `GOAL_POSITION`
   - Dovoli premik ce `result <= squaresToEnd`
   - Prikazi toast ce `result > squaresToEnd`
   - Podaj `forcedResult` DiceRollerju ko `failedNearEndCount >= 4`
   - Zamenjaj `BOARD_SIZE` z `GOAL_POSITION` v vseh win-check mestih
4. **`src/components/games/KaceLestveBoard.tsx`** -- uvozi `GOAL_POSITION`, uporabi za pozicioniranje avatarja na cilju (namesto `BOARD_SIZE`)

