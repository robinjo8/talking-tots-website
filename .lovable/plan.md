

# Načrt: Povečaj prostor za zgornje kamne

## Problem

Na sliki vidim, da ko zmajček skoči na zgornjo vrstico kamnov (y=6), se njegov zgornji del skrije pod kartice z besedami. Zmajček ni v celoti viden.

## Trenutno stanje

```typescript
const topCardHeight = 120; // px
```

Zgornja vrstica kamnov je 120px pod vrhom zaslona, kar ni dovolj za prikaz celotnega zmajčka (~80-100px visok).

## Rešitev

Povečaj `topCardHeight` na **180px** (ali več), da bo zmajček v celoti viden:

```typescript
const topCardHeight = 180; // Prej 120px - več prostora za zmajčka
```

### Vizualizacija

```text
PREJ (120px):                     ZDAJ (180px):
┌─────────────────────┐           ┌─────────────────────┐
│  [KUŽA] [VIDI] [KOST]│          │  [KUŽA] [VIDI] [KOST]│
│                     │           │                     │
│ 🐉← odrezan!       │           │                     │
│ [ZEL] [SIV] [RDEČ] │           │      🐉 ← viden!   │
│                     │           │ [ZEL] [SIV] [RDEČ] │
```

## Sprememba

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`
**Vrstica:** 317

```typescript
// PREJ:
const topCardHeight = 120;

// ZDAJ:
const topCardHeight = 180;
```

Grid se bo samodejno prilagodil, ker je `gapY` dinamičen in se izračuna glede na razpoložljiv prostor.

