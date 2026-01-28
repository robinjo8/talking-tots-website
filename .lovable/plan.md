
# Načrt: Popravek pozicije spodnjega kamna nad gumbom

## Analiza problema

**Trenutno stanje:**
- Gumb: `bottom: 24px` (bottom-6), višina ~80px → vrh gumba je na **~104px** od spodaj
- Kamni y=0: `bottom: offsetY = 90px` → spodnji rob kamna je na **90px** od spodaj
- Rezultat: **Kamni so NIŽJE od vrha gumba** (90px < 104px)

**Zahteve:**
1. Zeleni sredinski kamen (in vsi kamni y=0) morajo biti **v celoti vidni NAD gumbom**
2. Grid ima 8 vrstic (y od 0 do 7) - to je pravilno in ostane enako

## Vizualizacija problema

```text
                    Trenutno                      Zahtevano
              +------------------+          +------------------+
              |                  |          |                  |
              |     Kamni       |          |     Kamni       |
              |     y=0         |          |     y=0         |
    90px →    |  ┌─────────┐    |          |  ┌─────────┐    | ← 130px
              |  │ KAMEN   │    |          |  │ KAMEN   │    |
    45px →    |  └─────────┘    |          |  └─────────┘    | ← 85px
              |                  |          |                  |
   104px →    |  ─ ─ ─ ─ ─ ─ ─ |          |  ─ ─ ─ ─ ─ ─ ─ | ← vrh gumba (104px)
              |  ┌─────────┐    |          |  ┌─────────┐    |
              |  │  GUMB   │    |          |  │  GUMB   │    |
    24px →    |  └─────────┘    |          |  └─────────┘    |
              +------------------+          +------------------+
                 PROBLEM:                      REŠITEV:
              Kamen prekrit!               Kamen nad gumbom
```

## Rešitev

### Sprememba 1: Povečaj `bottomButtonSpace`

```typescript
// PREJ:
const bottomButtonSpace = 90;

// ZDAJ:
const bottomButtonSpace = 130; // Nad gumbom (vrh gumba ~104px + 26px razmaka)
```

### Zakaj 130px?

- Gumb je na `bottom: 24px` z višino ~80px
- Vrh gumba = 24 + 80 = **104px**
- Razmak med gumbom in kamnom = **~26px**
- `bottomButtonSpace = 104 + 26 = 130px`

To pomeni da bo spodnji rob kamna y=0 na `bottom: 130px`, kar je **26px nad gumbom**.

### Sprememba 2: Odstrani `-2` pri gapY

Da bodo kamni lepo razporejeni čez celoten prostor brez dodatnega stiskanja:

```typescript
// PREJ:
const gapY = Math.floor((availableHeight - stoneHeight) / (rows - 1)) - 2;

// ZDAJ:
const gapY = Math.floor((availableHeight - stoneHeight) / (rows - 1));
```

## Povzetek sprememb

| Element | Prej | Zdaj |
|---------|------|------|
| `bottomButtonSpace` | 90px | **130px** (nad gumbom) |
| `gapY` formula | `... - 2` | Brez odštevanja |
| `rows` | 8 | 8 (ostane enako - pravilno!) |

## Datoteka za spremembo

`src/components/games/PonoviPovedGame.tsx` - vrstice 318 in 329

