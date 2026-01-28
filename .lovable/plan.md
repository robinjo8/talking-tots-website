

# Načrt: 7 vrstic namesto 8 (y od 0 do 6)

## Trenutno stanje

**Napaka:** Grid ima 8 vrstic (y = 0, 1, 2, 3, 4, 5, 6, 7)

**Struktura zdaj:**
```text
y=7:  [RUM]   [SIV]   [ZEL]   ← zgornji trije kamni
y=6:  [RDEČ]          [RUM]
y=5:  [SIV]           [SIV]
y=4:  [ZEL]           [ZEL]   ← zmajček se obrne
y=3:  [RUM]           [RUM]
y=2:  [RDEČ]          [RDEČ]
y=1:  [SIV]           [SIV]
y=0:  [SIV]  [ZEL]    [SIV]   ← spodnji trije kamni
```

To je **8 vrstic** (y od 0 do 7) = napačno!

---

## Zahtevano stanje

**7 vrstic:** y = 0, 1, 2, 3, 4, 5, 6

```text
y=6:  [RUM]   [SIV]   [ZEL]   ← zgornji trije (levi zgoraj, sredina, desni zgoraj)
y=5:  [RDEČ]          [RUM]
y=4:  [SIV]           [SIV]
y=3:  [ZEL]           [ZEL]   ← zmajček se obrne (sredina višine)
y=2:  [RUM]           [RUM]
y=1:  [RDEČ]          [RDEČ]
y=0:  [SIV]  [ZEL]    [SIV]   ← spodnji trije (levi spodaj, sredina START, desni CILJ)
            ↑
         START
```

Skupaj: **18 kamnov** (enako kot prej):
- Levi stolpec (x=0): 7 kamnov (y=0 do y=6)
- Desni stolpec (x=2): 7 kamnov (y=6 do y=0)
- Sredina spodaj (x=1, y=0): 1 kamen (zeleni START)
- Sredina zgoraj (x=1, y=6): 1 kamen (sivi prehod)

**Skupaj:** 7 + 7 + 1 + 1 = 16... Počakaj, to ne štima.

Pravzaprav levi in desni stolpec si delita po en kamen na vrhu in dnu:
- y=0: 3 kamni (levi, sredina, desni)
- y=1 do y=5: po 2 kamna (levi, desni) = 5 × 2 = 10 kamnov
- y=6: 3 kamni (levi, sredina, desni)

Skupaj: 3 + 10 + 3 = 16 kamnov

Ampak imamo 4 povedi × 4 kamne = 16 + 2 (start + cilj na sredini)... Moram preveriti logiko.

---

## Spremembe

### 1. Posodobitev `STONE_POSITIONS_MOBILE`

Vse y=7 vrednosti → y=6
Vse y=6 vrednosti → y=5
Vse y=5 vrednosti → y=4
Vse y=4 vrednosti → y=3
Vse y=3 vrednosti → y=2
Vse y=2 vrednosti → y=1
y=1 in y=0 ostaneta enako

**Pravzaprav enostavneje:** Zmanjšaj vse y vrednosti za 1 (razen y=0 in y=1)

Preverimo pot:
1. START (0,0) siv
2. Poved 1: (0,1), (0,2), (0,3), (0,4) siv - počitek
3. Poved 2: (0,5), (0,6), (1,6) siv - počitek zgoraj
4. Poved 3: (2,6), (2,5), (2,4), (2,3) siv - počitek
5. Poved 4: (2,2), (2,1), (2,0) siv - CILJ

Skupaj: 1 + 4 + 3 + 4 + 4 = 16 kamnov? Ne...

Preverim še enkrat s 3 besedami na poved + 1 siv:
- 4 povedi × (3 barvni + 1 sivi) = 16 kamnov
- Plus 1 začetni sivi = 17 kamnov? 

Ne, začetni sivi (0,0) je vključen. Preštejmo trenutne pozicije:
1. (0,0) siv START
2-5. Poved 1: rdeč, rumen, zelen, siv
6-9. Poved 2: rdeč, rumen, zelen, siv
10-13. Poved 3: zelen, rumen, rdeč, siv
14-17. Poved 4: zelen, rumen, rdeč, siv CILJ

Skupaj: **17 kamnov** (1 start + 4 povedi × 4 kamne)

Zdaj moramo to razporediti v 7 vrstic (y=0 do y=6):
- y=0: 3 pozicije (leva, sredina, desna)
- y=1 do y=5: 2 poziciji (leva, desna) = 5 × 2 = 10
- y=6: 3 pozicije (leva, sredina, desna)

Skupaj: 3 + 10 + 3 = 16 pozicij

Ampak imamo 17 kamnov... Torej potrebujemo še eno višino? Ne, počakaj - nekateri kamni so na isti poziciji? Ne...

OK, preverim še enkrat tvojo zahtevo:
- **7 kamnov na levi strani** (y=0 do y=6)
- **7 kamnov na desni strani** (y=6 do y=0)
- **1 kamen na sredini spodaj** (START)
- **1 kamen na sredini zgoraj** (prehod)

Ampak levi in desni stolpec si delita kamen na y=0 in y=6!
- Levi stolpec: y=0, 1, 2, 3, 4, 5, 6 = 7 kamnov
- Desni stolpec: y=6, 5, 4, 3, 2, 1, 0 = 7 kamnov
- Sredina y=0: 1 kamen
- Sredina y=6: 1 kamen

**Ampak to ne pomeni 7+7+1+1 = 16.** To pomeni:
- y=0: levi + sredina + desni = 3 pozicije
- y=6: levi + sredina + desni = 3 pozicije
- y=1 do y=5: levi + desni = 5 × 2 = 10 pozicij

Skupaj pozicij: 3 + 3 + 10 = 16

Torej moramo iz 17 kamnov narediti 16, ALI pa dodati eno vrstico. Ker hočeš 7 vrstic, bomo prilagodili pot.

---

## Nova pot (17 kamnov v 7 vrsticah)

```typescript
const STONE_POSITIONS_MOBILE: StonePosition[] = [
  // START - spodaj sredina zeleni kamen
  { x: 1, y: 0, type: 'green', isRest: false },
  
  // Poved 1: Levi stolpec gor (3 besede + 1 siv)
  { x: 0, y: 0, type: 'gray', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 0, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 0, y: 2, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 0, y: 3, type: 'gray', isRest: true, sentenceIndex: 0 },
  
  // Poved 2: Levi stolpec gor + prehod zgoraj (3 besede + 1 siv)
  { x: 0, y: 4, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 0, y: 5, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 0, y: 6, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 1, y: 6, type: 'gray', isRest: true, sentenceIndex: 1 },
  
  // Poved 3: Desni stolpec dol (3 besede + 1 siv)
  { x: 2, y: 6, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 2, y: 5, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 2, y: 4, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 2, y: 3, type: 'gray', isRest: true, sentenceIndex: 2 },
  
  // Poved 4: Desni stolpec dol do cilja (3 besede + 1 siv)
  { x: 2, y: 2, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 1, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 2, y: 0, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  // CILJ: zmajček se vrne na START (1, 0)
];
```

Počakaj, to ni prav. Preverim originalno logiko...

---

## Poenostavljena rešitev

**Bistveno:** Spremeni `rows = 8` na `rows = 7` in posodobi vse y vrednosti v `STONE_POSITIONS_MOBILE` tako da gredo od 0 do 6 namesto 0 do 7.

### Sprememba 1: `rows = 7`

```typescript
// PREJ:
const rows = 8;

// ZDAJ:
const rows = 7;
```

### Sprememba 2: Posodobi `STONE_POSITIONS_MOBILE`

Vse y vrednosti zmanjšaj za 1 (razen y=0 in y=1 ki ostaneta):
- y=7 → y=6
- y=6 → y=5  
- y=5 → y=4
- y=4 → y=3
- y=3 → y=2
- y=2, y=1, y=0 ostanejo enako

---

## Datoteke za spremembo

1. `src/components/games/PonoviPovedGame.tsx`:
   - Vrstica 314: `rows = 8` → `rows = 7`
   - Vrstice 126-153: Posodobi y koordinate v `STONE_POSITIONS_MOBILE`

