

## Dinamično prilagajanje strani `/artikulacijski-test` brez scrollanja

### Povzetek rešitve

Uporabimo enako logiko kot `MemoryGrid.tsx` - dinamično izračunavanje velikosti elementov glede na razpoložljivo višino zaslona. Vsi elementi se bodo proporcionalno prilagajali, tako da bo celotna vsebina vedno vidna na enem zaslonu brez scrollanja.

---

### Ključna logika iz MemoryGrid

```typescript
// 1. Merjenje velikosti okna
const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

useEffect(() => {
  const updateSize = () => {
    setContainerSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, []);

// 2. Dinamični izračun velikosti
const cardSize = useMemo(() => {
  const availableHeight = containerSize.height - PADDING;
  const sizeByHeight = Math.floor(availableHeight / rows);
  return Math.min(sizeByWidth, sizeByHeight);
}, [containerSize]);

// 3. Eksplicitne dimenzije
style={{ width: cardSize, height: cardSize }}
```

---

### Implementacija za Articulacijski test

#### Nova logika v `ArtikuacijskiTest.tsx`

```text
┌─────────────────────────────────────────────────────────────────┐
│ IZRAČUN RAZPOLOŽLJIVEGA PROSTORA                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Višina zaslona (100vh)                                         │
│  ├── Naslov: 60px (fiksno)                                      │
│  ├── Progress Grid: dinamično (8-12% višine)                    │
│  ├── Črka/Pozicija: 40px (fiksno, samo desktop)                 │
│  ├── Word Card: PREOSTALA VIŠINA                                │
│  │   ├── Beseda: 10% kartice                                    │
│  │   ├── Slika: 50-60% kartice                                  │
│  │   └── Gumb: 20-25% kartice                                   │
│  └── Bottom padding: 80px (za floating gumb)                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Struktura sprememb

```typescript
// 1. Dodaj state za merjenje okna
const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

// 2. Dodaj useEffect za merjenje
useEffect(() => {
  const updateSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  
  updateSize();
  window.addEventListener('resize', updateSize);
  window.addEventListener('orientationchange', () => setTimeout(updateSize, 100));
  
  return () => {
    window.removeEventListener('resize', updateSize);
    window.removeEventListener('orientationchange', ...);
  };
}, []);

// 3. Izračunaj dinamične velikosti
const dimensions = useMemo(() => {
  if (windowSize.height === 0) return null;
  
  const vh = windowSize.height;
  const isMobile = windowSize.width < 768;
  
  // Fiksni elementi
  const titleHeight = 60;
  const bottomPadding = 80;
  const letterInfoHeight = isMobile ? 0 : 50;
  
  // Razpoložljiva višina za vsebino
  const availableHeight = vh - titleHeight - bottomPadding - letterInfoHeight;
  
  // Progress grid: 15% razpoložljive višine
  const progressGridHeight = Math.min(Math.floor(availableHeight * 0.15), 120);
  
  // Preostalo za kartico z besedo
  const cardHeight = availableHeight - progressGridHeight - 20; // 20px gap
  
  // Znotraj kartice
  const wordHeight = Math.floor(cardHeight * 0.12);
  const imageHeight = Math.floor(cardHeight * 0.50);
  const buttonHeight = Math.floor(cardHeight * 0.25);
  const cardPadding = Math.floor(cardHeight * 0.05);
  
  return {
    progressGridHeight,
    cardHeight,
    wordHeight,
    imageHeight,
    buttonHeight,
    cardPadding,
    wordFontSize: Math.max(18, Math.min(32, Math.floor(wordHeight * 0.8))),
  };
}, [windowSize]);
```

---

### Vizualni prikaz prilagajanja

```text
VELIK ZASLON (1080px višina):          MANJŠI ZASLON (700px višina):
┌─────────────────────────┐            ┌─────────────────────────┐
│  PREVERJANJE IZGOVOR..  │ 60px       │  PREVERJANJE IZGOVOR..  │ 60px
├─────────────────────────┤            ├─────────────────────────┤
│  ┌───────────────────┐  │            │  ┌───────────────────┐  │
│  │ P B M T D K G N H │  │ 100px      │  │ P B M T D K G N H │  │ 70px
│  │ V J F L S Z C Š Ž │  │            │  │ V J F L S Z C Š Ž │  │
│  └───────────────────┘  │            │  └───────────────────┘  │
│        Č - ZAČETEK      │ 50px       ├─────────────────────────┤
├─────────────────────────┤            │  ┌───────────────────┐  │
│  ┌───────────────────┐  │            │  │      PAJEK        │  │ 30px
│  │       PAJEK       │  │ 50px       │  │                   │  │
│  │                   │  │            │  │      [slika]      │  │ 180px
│  │                   │  │            │  │                   │  │
│  │      [slika]      │  │ 280px      │  │  ┌─────────────┐  │  │
│  │                   │  │            │  │  │Izgovori bes.│  │  │ 70px
│  │                   │  │            │  │  └─────────────┘  │  │
│  │  ┌─────────────┐  │  │            │  └───────────────────┘  │
│  │  │Izgovori bes.│  │  │ 100px      ├─────────────────────────┤
│  │  └─────────────┘  │  │            │         [🏠]            │ 80px
│  └───────────────────┘  │            └─────────────────────────┘
├─────────────────────────┤
│         [🏠]            │ 80px
└─────────────────────────┘
```

---

### Datoteke za posodobitev

#### 1. `src/pages/ArtikuacijskiTest.tsx`

**Dodane spremembe:**

| Vrstica | Sprememba |
|---------|-----------|
| ~35 | Dodaj `windowSize` state |
| ~50 | Dodaj `useEffect` za merjenje okna |
| ~70 | Dodaj `useMemo` za `dimensions` izračun |
| 168-169 | Zamenjaj kontejner z `min-h-screen h-screen overflow-hidden` |
| 228-232 | Dinamična višina naslova |
| 237 | Dinamična višina progress grida s `style` |
| 253 | Dinamična višina kartice s `style` |
| 255 | Dinamična velikost pisave besede |
| 260 | Dinamična višina slike |
| 277 | Dinamična višina gumba |

**Ključne spremembe v JSX:**

```tsx
// Glavni kontejner
<div className="h-screen w-full flex flex-col overflow-hidden" ...>

// Progress grid z dinamično višino
<div 
  className="w-full max-w-lg bg-white/90 ..."
  style={{ maxHeight: dimensions?.progressGridHeight }}
>

// Kartica z besedo
<div 
  className="w-full max-w-sm bg-white/95 ..."
  style={{ height: dimensions?.cardHeight }}
>

// Beseda z dinamično pisavo
<h3 
  className="font-bold text-center text-gray-800"
  style={{ fontSize: dimensions?.wordFontSize }}
>

// Slika z dinamično višino
<div 
  className="relative w-full flex items-center justify-center"
  style={{ height: dimensions?.imageHeight }}
>
  <img className="max-h-full max-w-full object-contain" ... />
</div>

// Gumb z dinamično višino
<div 
  className="flex flex-col items-center justify-center"
  style={{ height: dimensions?.buttonHeight }}
>
```

#### 2. `src/components/articulation/ArticulationProgressGrid.tsx`

**Manjše prilagoditve:**
- Dodaj prop `compact?: boolean` za manjše zaslone
- Zmanjšaj velikost črkovnih polj na kompaktnih zaslonih

```tsx
// Dinamična velikost polj
className={cn(
  "relative rounded-md flex items-center justify-center font-bold transition-all",
  compact ? "w-6 h-6 text-xs" : "w-8 h-8 md:w-10 md:h-10 text-sm md:text-base"
)}
```

#### 3. `src/components/articulation/ArticulationRecordButton.tsx`

**Manjše prilagoditve:**
- Dodaj prop `compact?: boolean`
- Zmanjšaj višine elementov na kompaktnih zaslonih

```tsx
// Dinamični container
<div className={cn(
  "flex flex-col items-center gap-2",
  compact ? "min-h-[80px]" : "min-h-[100px]"
)}>

// Dinamična velikost gumba
className={cn(
  "rounded-full font-medium shadow-lg",
  compact ? "w-[180px] h-11 text-base" : "w-[220px] h-14 text-lg"
)}
```

---

### Diagram poteka

```text
┌─────────────────────────────────────────────────────────────────┐
│                    NALAGANJE STRANI                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Izmeri window.innerWidth in window.innerHeight              │
│                                                                 │
│  2. Izračunaj dimensions z useMemo:                             │
│     ├── progressGridHeight = min(15% višine, 120px)             │
│     ├── cardHeight = preostala višina - 20px gap                │
│     ├── imageHeight = 50% kartice                               │
│     ├── buttonHeight = 25% kartice                              │
│     └── wordFontSize = max(18px, min(32px, 80% wordHeight))     │
│                                                                 │
│  3. Uporabi dimensions v style atributih                        │
│                                                                 │
│  4. Ob resize/orientation change: ponovi korake 1-3             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Dodatna obravnava: Besedilo "PAJEK" na Apple napravah

Poleg dinamičnega prilagajanja dodamo zaščito proti odrezanju besedila:

```tsx
<h3 
  className="font-bold text-center text-gray-800 leading-relaxed"
  style={{ 
    fontSize: dimensions?.wordFontSize,
    paddingBottom: '0.25rem', // Prostor za descenders
    lineHeight: 1.3,
  }}
>
  {getCurrentWord().toUpperCase()}
</h3>
```

---

### Testiranje

Po implementaciji preverite na:
1. **Manjših zaslonih** (1280x720, 1366x768) - vse vidno brez scrollanja
2. **Apple napravah** (Safari) - beseda ni odrezana
3. **Ob spremembi velikosti okna** - elementi se dinamično prilagodijo
4. **Mobilnih napravah** - portrait in landscape delujeta

