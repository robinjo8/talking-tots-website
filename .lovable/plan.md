

# Plan: Dinamično prilagajanje velikosti za igre na Desktop verziji

## Opis problema

Pri igri Bingo (in nekaterih drugih igrah) je na manjših računalniških zaslonih zgornja vrstica (tekoči trak/reel) odrezana. Problem je v tem, da se vsebina ne prilagaja velikosti zaslona - uporablja se le statični `md:scale-[1.2]`, ki ne upošteva dejanske višine okna.

Pri `/artikulacijski-test` je ta problem že rešen z dinamičnim izračunom višin na osnovi `windowSize`, kar zagotavlja, da se vsa vsebina prilega v vidno območje.

## Rešitev

Implementacija viewport-based scaling pristopa iz `/artikulacijski-test` v vse igre, ki imajo ta problem:

1. **GenericBingoGame** - Dodati dinamično skaliranje
2. **GenericWheelGame** - Dodati `overflow-auto` in `min-h-full` za drsenje
3. **GenericSpominGame** - Preveriti layout (že ima `min-h-screen`)
4. **GenericIgraUjemanjaGame** - Preveriti layout
5. **GenericZaporedjaGame** - Preveriti layout
6. **GenericLabirintGame** - Že ima `overflow-auto` in `min-h-full`
7. **GenericSestavljankaGame** - Že ima `min-h-screen`

## Tehnične spremembe

### Sprememba 1: GenericBingoGame.tsx

Trenutna struktura:
```tsx
<div className="fixed inset-0 overflow-hidden select-none">
  <div className="h-full flex flex-col items-center justify-center p-2 md:p-4 gap-1 md:gap-2 md:scale-[1.2] md:origin-center">
```

Problem: `md:scale-[1.2]` povečuje vsebino za 20% na srednje velikih zaslonih, kar povzroči, da se elementi pomaknejo izven vidnega območja.

Nova struktura z dinamičnim skaliranjem:
```tsx
// Dodaj window size tracking
const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

useEffect(() => {
  const updateSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, []);

// Izračunaj dinamični scale factor
const scaleFactor = useMemo(() => {
  if (windowSize.height === 0) return 1;
  // Reel: ~80px, Grid: ~400px, Label: ~40px, Gaps: ~40px = ~560px base
  const baseHeight = 560;
  const availableHeight = windowSize.height - 80; // padding
  const scale = Math.min(availableHeight / baseHeight, 1.2);
  return Math.max(0.7, scale); // minimum 0.7, maximum 1.2
}, [windowSize.height]);
```

Layout:
```tsx
<div className="fixed inset-0 overflow-hidden select-none">
  <div 
    className="h-full flex flex-col items-center justify-center p-2 md:p-4 gap-1 md:gap-2"
    style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'center center' }}
  >
```

### Sprememba 2: GenericWheelGame.tsx

Trenutna struktura je že dobra z `overflow-auto` in `min-h-full`, vendar bi morala imeti tudi dinamično prilagajanje za manjše zaslone.

Dodaj podobno logiko kot pri Bingo:
```tsx
const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

useEffect(() => {
  const updateSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, []);

const scaleFactor = useMemo(() => {
  if (windowSize.height === 0) return 1;
  const baseHeight = 600; // wheel + title + padding
  const availableHeight = windowSize.height - 120;
  const scale = Math.min(availableHeight / baseHeight, 1);
  return Math.max(0.7, scale);
}, [windowSize.height]);
```

### Sprememba 3: Igra Ujemanja in Zaporedja

Te igre že imajo `min-h-screen` in `overflow-auto`, kar pomeni, da se lahko drsi. Vendar bi lahko dodali tudi dinamično skaliranje za boljšo uporabniško izkušnjo.

## Diagram spremembe

```text
PRED POPRAVKOM:
┌─────────────────────────┐
│     [ODREZANO]          │ ← Reel ni viden
├─────────────────────────┤
│                         │
│    ┌───┬───┬───┬───┐   │
│    │   │   │   │   │   │
│    ├───┼───┼───┼───┤   │
│    │   │   │   │   │   │
│    ├───┼───┼───┼───┤   │
│    │   │   │   │   │   │
│    ├───┼───┼───┼───┤   │
│    │   │   │   │   │   │
│    └───┴───┴───┴───┘   │
│                         │
│    NAJDI: BESEDA        │
└─────────────────────────┘

PO POPRAVKU (dinamično skaliranje):
┌─────────────────────────┐
│  [🖼️][🖼️][🖼️][🖼️][🖼️]    │ ← Reel viden
│      [ZAVRTI]           │
│                         │
│    ┌───┬───┬───┬───┐   │
│    │   │   │   │   │   │
│    ├───┼───┼───┼───┤   │
│    │   │   │   │   │   │
│    ├───┼───┼───┼───┤   │
│    │   │   │   │   │   │
│    ├───┼───┼───┼───┤   │
│    │   │   │   │   │   │
│    └───┴───┴───┴───┘   │
│                         │
│    NAJDI: BESEDA        │
└─────────────────────────┘
```

## Prizadete igre

| Igra | Datoteka | Potrebna sprememba |
|------|----------|-------------------|
| Bingo | `GenericBingoGame.tsx` | Dinamično skaliranje |
| Kolo besed | `GenericWheelGame.tsx` | Dinamično skaliranje |
| Spomin | `GenericSpominGame.tsx` | Že ima min-h-screen |
| Igra ujemanja | `GenericIgraUjemanjaGame.tsx` | Že ima min-h-screen |
| Zaporedja | `GenericZaporedjaGame.tsx` | Že ima fixed inset-0 |
| Labirint | `GenericLabirintGame.tsx` | Že ima overflow-auto |
| Sestavljanke | `GenericSestavljankaGame.tsx` | Že ima min-h-screen |

## Testiranje

1. Odpri igro Bingo na manjšem zaslonu (1366x768 ali manjši)
2. Preveri, da je tekoči trak (reel) v celoti viden
3. Preveri, da se vsa vsebina prilega v vidno območje brez odrezanja
4. Ponovi za igro Kolo besed
5. Testiraj na različnih velikostih zaslona (1920x1080, 1366x768, 1280x720)

