
## Analiza in popravek igre Kače in Lestve

### Ugotovljene težave

#### Težava 1: Napačno pozicioniranje (koreninski vzrok)

START pozicija v `gameState.positions` je `0`. Koda v `KaceLestveBoard.tsx` za position <= 0 postavi zmajčka na fizično polje `[row: ROWS-1, col: 0]` — to je fizično polje 1 (levo spodnji kot, rumeno).

Ko igralec vrže 4: `0 + 4 = 4` (fizično), kar `getGridCell(4)` pretvori v display 2. Ampak pri LADDERS/SNAKES je `LADDERS[6] = 18` (display 4→16), torej fizična 4 nima lestve.

**Rešitev**: START pozicija mora biti `2` (fizično), kar pomeni "tik pred prvim zelenim poljem". Ko vrže 4, bo `2 + 4 = 6` (fizično = display 4), kar pravilno sproži lestev 4→16.

Spremembe:
- `gameState.positions` inicializacija: `[2, 2]` namesto `[0, 0]`  
- `BOARD_SIZE`: ohrani 42 (fizično)  
- `SQUARES_NEAR_END` logika: `BOARD_SIZE - currentPos <= SQUARES_NEAR_END` bo pravilna ko je max pos 40 (display 38)  
- `KaceLestveBoard` za `position <= 2`: zmajček ostane na START poziciji (levo spodaj)

Preveritev: START = fizično 2, vrže 4 → 2+4 = 6 (fizično) = display 4 → LADDERS[6] = 18 (fizično) = display 16 ✓

#### Težava 2: Animacija — hop po poljih

Trenutno framer-motion animira direktno od A do B. Potrebujemo zaporedje premikov polje za poljem z bounce efektom.

**Rešitev**: Namesto enega motion animate klic, bomo dodali `intermediatePositions` array, ki vsebuje vsak korak posebej. Implementiramo sequence animacijo z `useAnimate` iz framer-motion ali z `setTimeout` zaporedjem setState za vsak korak.

Konkretno: Pri metu 4 od pozicije 2, bo zmajček:
1. Skok na 3 (50ms zamuda)
2. Skok na 4 (100ms)
3. Skok na 5 (150ms)
4. Skok na 6 (200ms)
5. Pristane → onAvatarLanded po zadnjem skoku

Vsak "skok" bo imel kratek bounce transition v framer-motion.

#### Težava 3: Zamuda 1,5 sekunde pred dialogom

V `handleAvatarLanded` pred `setPhase('word_challenge')` dodamo `setTimeout(..., 1500)`.

#### Težava 4: Dialog redesign po vzoru ArticulationRecordButton

Popolnoma predelamo `KaceLestveWordDialog.tsx` da bo vizualno enak artikulacijskemu testu:
- Teal gumb "Izgovori besedo" z mikrofonovo ikono (enak kot v ArticulationRecordButton)
- Animirani progress bar med snemanjem (rdeč fill od leve proti desni)
- "Zvok ni bil zaznan" + oranžen gumb "Poskusi znova" ob tišini
- Zelena potrditev "BRAVO!" z gumbom "NADALJUJ" ob uspehu
- Rdeča napaka z "Poskusi znova" ob neuspehu

---

### Tehnični načrt sprememb

#### 1. `src/data/kaceLestveConfig.ts`

Izvozi konstanto `START_POSITION = 2` za jasnost.

#### 2. `src/components/games/KaceLestveGame.tsx`

- Inicializacija: `positions: [2, 2]` namesto `[0, 0]`
- Po `handleSnakeChallengeResult(accepted=false)` premakni na rep
- Zamuda 1,5s pred odprtjem kateregakoli dialoga (word_challenge, snake_challenge, success) v `handleAvatarLanded`
- Doda state `hoppingPositions: number[] | null` — seznam vmesnih pozicij za hop animacijo
- Ko kocka vrže X: izračuna array `[currentPos+1, currentPos+2, ..., newPos]` in shrani v `hoppingPositions`

#### 3. `src/components/games/KaceLestveBoard.tsx`

- Doda prop `hoppingPositions?: number[]` — seznam pozicij za sekvenčno animacijo
- Ko `hoppingPositions` je nastavljen, useEffect zaporedoma nastavi lokalni `displayPosition` z `setTimeout` zamudami
- Ko se zadnja hop animacija zaključi, pokliče `onAvatarLanded`
- Vsak skok: `transition: { type: 'spring', stiffness: 400, damping: 15, mass: 0.5 }` za bounce efekt
- Brez `hoppingPositions`: normalna animacija (za kačo/lestev premik ki ga ne kontroliramo korak za korakom)

#### 4. `src/components/games/KaceLestveWordDialog.tsx`

Popolnoma predelan po vzoru `ArticulationRecordButton`:

```
Faze:
- idle: teal "Izgovori besedo" gumb (w-[220px] h-14, rounded-full)
- recording: animirani rdeč progress bar z odštevanjem
- transcribing: spinning loader
- result (success): ✅ + "BRAVO!" + zelen "NADALJUJ" gumb  
- result (fail + silence): "Zvok ni bil zaznan" + oranžen "Poskusi znova"
- result (fail + wrong word): "Slišano: X" + oranžen "Poskusi znova"
- result (fail): rdeč ❌ + "Poskusi znova" oranžen gumb
```

Gumbi za rezultat:
- Uspeh: zelen "NADALJUJ" → `onResult(true)`
- Neuspeh po 2 poskusih ali klik "Nadaljuj": `onResult(false)` (ali pusti snemati znova)

Logika: Dovoli neskončno ponavljanje dokler ni uspeh. Šele "NADALJUJ" gumb zaključi dialog.

---

### Sekvenca premikov (hop animacija)

```
Met kocke: 4, pozicija: 2 (START)
→ hoppingPositions = [3, 4, 5, 6]
→ Board prikazuje: zmajček skoči na 3, nato 4, nato 5, nato 6
→ Vsak skok: 180ms zamuda, spring bounce
→ Ko pristane na 6 (display 4): onAvatarLanded
→ LADDERS[6] = 18 → zmajček skoči na 18 (display 16)
→ Po pristanku na 18: čakaj 1,5s → odpri word dialog
```

---

### Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/data/kaceLestveConfig.ts` | Dodaj `START_POSITION = 2` |
| `src/components/games/KaceLestveGame.tsx` | Inicializacija positions na [2,2], hop animacija state, 1,5s zamuda pred dialogom |
| `src/components/games/KaceLestveBoard.tsx` | Hop animacija: sekvenčni setState, bounce spring efekt |
| `src/components/games/KaceLestveWordDialog.tsx` | Cel redesign po vzoru ArticulationRecordButton |
