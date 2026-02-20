
## Popravek logike in animacij igre Kače in Lestve

### Ugotovljene težave

#### 1. Logika pozicij — razumevanje sistema

Igra shranjuje "fizične pozicije" (0–42):
- 0 = START (pred ploščo)
- 1–2 = rumeni START kvadratki (brez številk)
- 3–40 = zelena polja (prikazana kot 1–38, tj. fizično − 2)
- 41–42 = oranžno END območje

Ko igralec stoji na poziciji 0 in vrže 6, koda naredi `0 + 6 = 6` (fizično), kar sprožI lestev `6 → 18` (prikaz 4 → 16). To je **pravilna logika**, le prikaz je zavajajoč, ker uporabnik vidi "18" na zaslonu in pričakuje da to pomeni polje 18, a dejansko je to fizično 18 = prikaz 16.

**Primer ki ga je uporabnik opisal**: "vrgel 6, premaknilo na polje 18" — to pomeni da je igra prikazala fizično 18 (= prikaz 16) in to je pravilno obnašanje za lestev 4→16. Ni bug v matematiki, je bug v **takojšnjem prikazu dialoga** brez čakanja na animacijo.

#### 2. Glavna napaka: Dialog se pojavi PRED animacijo

`applyMove` v `KaceLestveGame.tsx` takoj pokliče `setPhase("word_challenge")` ali `setPhase("snake_challenge")`, ki odpre dialog. Zmajček pa se premika z `framer-motion` spring animacijo (~500ms). Posledica: dialog se odpre **preden zmajček pride na cilj**.

#### 3. Ni vmesne animacije za skoke (lestve/kače)

Ko zmajček pristane na lestvi ali kači, se takoj premakne na destinacijo (en setState klic). Ni vizualnega vmesnega koraka: zmajček bi moral najprej stopiti na polje lestve/kače, nato se premakniti na destinacijo.

#### 4. Skok po poljih korak za korakom (ni implementirano)

Trenutno: zmajček "teleportira" direktno na ciljno polje z eno smooth animacijo. Pravilno: animacija korak po korak (polje za poljem) bi bila boljša UX, ampak ker framer-motion to podpira z zaporednimi stanji, bo dovolj da:
- Najprej zmajček pride na prvotno polje (po kocki)
- Počaka se na konec animacije
- Nato se zmajček premakne na destinacijo (lestev/kača)
- Počaka se na konec animacije
- Šele nato se odpre dialog

---

### Rešitev

#### Arhitektura: animacijski callback sistem

`KaceLestveBoard` mora podpirati callback `onAnimationComplete` ki se sproži ko je animacija zaključena. To bomo dosegli z:

1. **`KaceLestveBoard`**: dobi nov prop `onAvatarLanded?: () => void` — pokliče se ko framer-motion `onAnimationComplete` na vsakem zmajčku sproži.

2. **`KaceLestveGame`**: uvede nov stanje za animacijo:
   - `animatingTo: number | null` — vmesna pozicija (po kocki, pred lestev/kačo)
   - `finalPosition: number | null` — končna pozicija (po lestvi/kači)
   - `pendingDialogPhase: 'word_challenge' | 'snake_challenge' | 'success' | null`

   Zaporedje:
   ```
   1. Kocka vrže X
   2. Izračunaj vmesno pozicijo (currentPos + X)
   3. Premakni zmajčka na vmesno pozicijo (setState positions)
   4. Počakaj na onAvatarLanded callback
   5. Če je lestev/kača: premakni na destinacijo, počakaj na onAvatarLanded
   6. Šele zdaj odpri dialog ali naslednji obrat
   ```

#### Konkretne spremembe

**`src/components/games/KaceLestveBoard.tsx`**:
- Doda prop `onAvatarLanded?: (playerIdx: number) => void`
- Na `motion.div` za vsakega zmajčka doda `onAnimationComplete={() => onAvatarLanded?.(idx)}`
- Ko sta dva zmajčka, callback za aktivnega (currentPlayerIdx) zadostuje

**`src/data/kaceLestveConfig.ts`**:
- Doda export `NEAR_END_START = 3` — fizična pozicija od kje se začne "near end" logika (fizično 37 = prikaz 35)
- Brez večjih sprememb na LADDERS/SNAKES ker so fizične pozicije pravilne

**`src/components/games/KaceLestveGame.tsx`**:
- Doda state: `animationStep: 'idle' | 'moving_to_dice' | 'moving_to_final'`
- Doda state: `intermediatePosition: number | null`
- Doda callback `handleAvatarLanded(playerIdx)`
- Refaktorira `applyMove` v dvofazni sistem:

```
Phase 1 (moving_to_dice):
  - Nastavi position na vmesno polje (currentPos + diceVal)
  - Nastavi animationStep = 'moving_to_dice'

handleAvatarLanded():
  if animationStep === 'moving_to_dice':
    if LADDER[pos]: nastavi position na LADDER[pos], animationStep = 'moving_to_final'
    elif SNAKE[pos]: nastavi position na pos (ostane), animationStep = 'moving_to_final'
    else: odpri dialog

Phase 2 (moving_to_final):
  - Ko se animacija zaključi: odpri dialog
```

- Zameni `setTimeout(() => applyMove(...), 300)` z direktnim klicem

#### Logika bližine konca (SQUARES_NEAR_END)

Trenutno: `BOARD_SIZE - currentPos <= SQUARES_NEAR_END`. `BOARD_SIZE = 42`, `SQUARES_NEAR_END = 6`.
Fizični konec je pri 41/42. Prikaz konca je pri prikazu 36–38. To ostane nespremenjeno.

---

### Pregled sprememb po datotekah

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/KaceLestveBoard.tsx` | Doda `onAvatarLanded` prop, `onAnimationComplete` na motion.div |
| `src/components/games/KaceLestveGame.tsx` | Dvofazni animacijski sistem, zamenjava setTimeout s callback sistemom, dialog se odpre šele po animaciji |
| `src/data/kaceLestveConfig.ts` | Manjša čistila (opcionalno) |

### Vizualni tok (po spremembi)

```text
Kocka vrže 4
    ↓
Zmajček se premika na polje 4 (animacija ~500ms)
    ↓ [onAnimationComplete]
Polje 4 ima lestev → skočimo na polje 16
    ↓
Zmajček se premika na polje 16 (animacija ~500ms)
    ↓ [onAnimationComplete]
Dialog se odpre: "Izgovori besedo!"
```

```text
Kocka vrže 3
    ↓
Zmajček se premika na polje 3 (animacija ~500ms)
    ↓ [onAnimationComplete]
Polje 3 nima lestve/kače
    ↓
Dialog se odpre takoj po pristanku
```
