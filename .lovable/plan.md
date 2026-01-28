

# Načrt: Popravki pozicije kartic in zamenjava gumba s kocko

## Pregled sprememb

1. **Slike/kartice znotraj kamnov** - premakni okvir s karticami iz fiksnega `fixed` pozicioniranja v koordinatni sistem kamnov (med x=0 in x=6 pri y=1)
2. **Zamenjava gumba s 3D kocko** - uporabi popolnoma enako `DiceRoller` komponento kot na strani `/govorne-igre/met-kocke/c`

---

## 1. Pozicija kartic znotraj kamnov

### Trenutno stanje (napačno):
```tsx
<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
```
To postavi okvir na sredino **zaslona**, ne pa na sredino **med kamni**.

### Nova rešitev:
Izračunaj pozicijo okvirja glede na koordinatni sistem kamnov:

```typescript
// Izračunaj pozicijo za okvir (med levim in desnim srednjim kamnom)
const getCardContainerPosition = useMemo(() => {
  if (!calculatedSizes || isMobile) return null;
  
  // Levi srednji kamen je na (x=0, y=1)
  // Desni srednji kamen je na (x=6, y=1)
  
  const leftStonePos = {
    left: offsetX + 0 * gapX,
    bottom: offsetY + 1 * gapY,
  };
  
  const rightStonePos = {
    left: offsetX + 6 * gapX,
    bottom: offsetY + 1 * gapY,
  };
  
  // Okvir naj bo na sredini med njima
  const containerWidth = 360; // Fiksna širina okvirja
  const containerLeft = leftStonePos.left + stoneWidth + 20; // 20px od levega kamna
  const containerBottom = leftStonePos.bottom; // Ista višina kot srednji kamni
  
  return {
    left: containerLeft,
    bottom: containerBottom,
  };
}, [calculatedSizes, isMobile, offsetX, offsetY, gapX, gapY, stoneWidth]);
```

### Nova JSX struktura:
```tsx
{/* DESKTOP: Word cards + Dice positioned WITHIN the grid (between middle stones) */}
{!isMobile && getCardContainerPosition && (
  <div 
    className="absolute z-20 flex items-center gap-4"
    style={{
      left: getCardContainerPosition.left,
      bottom: getCardContainerPosition.bottom,
    }}
  >
    {/* Fixed size word container */}
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-dragon-green/30 w-[320px] h-[130px] flex items-center justify-center p-3">
      {/* ... vsebina kartic ... */}
    </div>
    
    {/* 3D Dice */}
    <JumpDice onClick={handleNext} disabled={isJumping || showSentenceDialog} />
  </div>
)}
```

---

## 2. Zamenjava JumpButton s 3D kocko (DiceRoller stil)

### Nova komponenta `JumpDice`:
Uporabimo popolnoma enak stil kot `DiceRoller`, samo brez vrtenja - fiksna kocka, ki ob kliku sproži skok:

```tsx
// JumpDice component - 3D dice identical to DiceRoller from Met Kocke
function JumpDice({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  // Dice dots helper (same as DiceRoller)
  const DiceDots = ({ count }: { count: number }) => {
    const dotPositions: Record<number, string[]> = {
      1: ['center'],
      2: ['top-right', 'bottom-left'],
      3: ['top-right', 'center', 'bottom-left'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
    };

    const getPositionClass = (pos: string) => {
      switch (pos) {
        case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
        case 'top-left': return 'top-2 left-2';
        case 'top-right': return 'top-2 right-2';
        case 'bottom-left': return 'bottom-2 left-2';
        case 'bottom-right': return 'bottom-2 right-2';
        case 'middle-left': return 'top-1/2 left-2 -translate-y-1/2';
        case 'middle-right': return 'top-1/2 right-2 -translate-y-1/2';
        default: return '';
      }
    };

    return (
      <>
        {dotPositions[count]?.map((pos, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full bg-gray-800 ${getPositionClass(pos)}`}
          />
        ))}
      </>
    );
  };

  return (
    <div 
      className={`cursor-pointer ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      style={{ perspective: '600px' }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Dice Container - identical to DiceRoller */}
      <div
        className={`relative w-24 h-24 transition-transform ${!disabled ? 'animate-pulse' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered && !disabled ? 'rotateY(10deg) rotateX(-5deg)' : 'rotateY(0deg)',
          transitionDuration: '300ms',
        }}
      >
        {/* Face 1 - Front */}
        <div 
          className="absolute w-24 h-24 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ transform: 'translateZ(48px)' }}
        >
          <DiceDots count={1} />
        </div>
        
        {/* Face 6 - Back */}
        <div 
          className="absolute w-24 h-24 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ transform: 'rotateY(180deg) translateZ(48px)' }}
        >
          <DiceDots count={6} />
        </div>
        
        {/* Face 2 - Right */}
        <div 
          className="absolute w-24 h-24 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
        >
          <DiceDots count={2} />
        </div>
        
        {/* Face 5 - Left */}
        <div 
          className="absolute w-24 h-24 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}
        >
          <DiceDots count={5} />
        </div>
        
        {/* Face 3 - Top */}
        <div 
          className="absolute w-24 h-24 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ transform: 'rotateX(90deg) translateZ(48px)' }}
        >
          <DiceDots count={3} />
        </div>
        
        {/* Face 4 - Bottom */}
        <div 
          className="absolute w-24 h-24 bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ transform: 'rotateX(-90deg) translateZ(48px)' }}
        >
          <DiceDots count={4} />
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Prilagoditve velikosti za boljši prikaz

Za boljši prikaz med kamni:
- Zmanjšaj širino okvirja s karticami: `w-[320px]` namesto `w-[360px]`
- Zmanjšaj višino: `h-[120px]` namesto `h-[140px]`
- Kocka: `w-20 h-20` namesto `w-28 h-28` (da se prilega prostoru)

---

## Vizualizacija končnega rezultata

```text
+------------------------------------------------------------------------+
|                                                                        |
| [HOME]                                                                 |
|                                                                        |
|  [RUM] [ZEL] [SIV] [RDEC] [RUM] [ZEL] [SIV]   <- zgornja vrstica      |
|                                                                        |
|         +------------------------+  +----+                             |
|  [RDEC] |  [KAČA] [IMA] [KAPO]  |  | 🎲 |  [RDEC]  <- srednja vrstica |
|         +------------------------+  +----+                             |
|          (znotraj grid sistema)     3D kocka                           |
|                                     (kot Met Kocke)                    |
|                                                                        |
| 🐉[SIV] [ZEL] [RUM] [RDEC] [SIV] [ZEL] [RUM]   <- spodnja vrstica     |
|  START                                                                 |
|                                                                        |
+------------------------------------------------------------------------+
```

---

## Tehnične spremembe v datoteki

| Komponenta | Sprememba |
|------------|-----------|
| `JumpButton` | **Odstrani** - zamenjana z `JumpDice` |
| `JumpDice` | **Nova** - 3D kocka identična `DiceRoller` iz Met Kocke |
| Desktop UI | Pozicija okvirja in kocke izračunana iz grid sistema (ne `fixed`) |
| `getCardContainerPosition` | **Nov** useMemo za izračun pozicije med srednjima kamnoma |

---

## Povzetek

1. **Kartice znotraj kamnov** - namesto `fixed top-1/2 left-1/2` uporabimo izračunano pozicijo znotraj grid sistema kamnov
2. **3D kocka** - popolnoma enaka kot `DiceRoller` komponenta iz igre Met Kocke, samo brez vrtenja
3. **Samo desktop** - mobilna verzija ostane nespremenjena

