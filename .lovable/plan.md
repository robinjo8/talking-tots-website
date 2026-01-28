

# Nacrt: Popravki desktop verzije igre "Ponovi Poved" - 7 kamnov

## Pregled pravilne strukture

Na podlagi referenčne slike je jasna struktura pravokotnika:

```text
      [RUM] [ZEL] [SIV] [RDEC] [RUM] [ZEL] [SIV]  <- zgornja vrstica (7 kamnov, y=2)
        ^                                     |
        |                                     v
                +---------------------------+  +-------+
                |  [KAČA]  [IMA]  [KAPO]    |  |  🐉   |
      [RDEC]    | (fiksna sirina okvirja)  |  | (gumb)|   [RDEC]  <- srednja vrstica (y=1)
                +---------------------------+  +-------+
                                               3D stil
        ^                                                  |
        |                                                  v
   🐉 [SIV] [ZEL] [RUM] [RDEC] [SIV] [ZEL] [RUM]  <- spodnja vrstica (7 kamnov, y=0)
     START/CILJ
```

### Kljucne tocke:
- **Zgornja vrstica**: 7 kamnov (x: 0-6, y: 2)
- **Srednja vrstica**: SAMO 2 kamna - levi (x: 0, y: 1) in desni (x: 6, y: 1)
- **Spodnja vrstica**: 7 kamnov (x: 0-6, y: 0)
- **Okvir za slike**: Na sredini zaslona med srednjima kamnoma, fiksna velikost od zacetka
- **Gumb za skok**: Desno od okvirja, 3D stil podoben kocki v Smesne Povedi

---

## Tehnicne spremembe

### 1. Nova definicija STONE_POSITIONS_DESKTOP (17 kamnov)

Pot: START (0,0) → 2x GOR → 7x DESNO → 2x DOL → 7x LEVO → nazaj na START

```typescript
const STONE_POSITIONS_DESKTOP: StonePosition[] = [
  // START - spodaj levo (x=0, y=0) - SIV
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Poved 1: GOR (x=0, y=1), GOR (x=0, y=2), DESNO (x=1, y=2), SIV (x=2, y=2)
  { x: 0, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 0 },   // 1. beseda
  { x: 0, y: 2, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 1 },// 2. beseda  
  { x: 1, y: 2, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 2 }, // 3. beseda
  { x: 2, y: 2, type: 'gray', isRest: true, sentenceIndex: 0 },                 // Ponovi poved 1
  
  // Poved 2: 3x DESNO + SIV
  { x: 3, y: 2, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 4, y: 2, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 5, y: 2, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 6, y: 2, type: 'gray', isRest: true, sentenceIndex: 1 },                 // Ponovi poved 2
  
  // Poved 3: DOL (x=6, y=1), DOL (x=6, y=0), LEVO (x=5, y=0), SIV (x=4, y=0)
  { x: 6, y: 1, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 6, y: 0, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 5, y: 0, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 4, y: 0, type: 'gray', isRest: true, sentenceIndex: 2 },                 // Ponovi poved 3
  
  // Poved 4: 3x LEVO nazaj na START
  { x: 3, y: 0, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 0, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 1, y: 0, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  // Zmajcek se vrne na START (0,0) za koncno ponovitev povedi 4
];
```

### 2. Posodobitev calculatedSizes za 7 stolpcev

```typescript
if (!isMobile) {
  const stoneWidth = 80;    // Manjsi kamni za 7 stolpcev
  const stoneHeight = 60;
  const gapX = 95;          // Manjsi razmik za 7 stolpcev
  const gapY = 120;         // Vecji vertikalni razmik (3 vrstice)
  const dragonSize = 85;
  
  // 7 stolpcev (x: 0-6), 3 vrstice (y: 0-2)
  const gridWidth = 6 * gapX + stoneWidth;
  const gridHeight = 2 * gapY + stoneHeight;
  
  const offsetX = (containerSize.width - gridWidth) / 2;
  const offsetY = 60;
  
  return { stoneWidth, stoneHeight, gapX, gapY, dragonSize, offsetX, offsetY };
}
```

### 3. Fiksna velikost okvirja za slike

Okvir ima fiksno velikost `w-[360px] h-[140px]` od zacetka igre:

```tsx
{/* Word cards container - FIXED SIZE */}
<div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-dragon-green/30 w-[360px] h-[140px] flex items-center justify-center">
  {collectedWords.length === 0 ? (
    <p className="text-gray-400 text-sm font-medium italic">Pritisni gumb za skok...</p>
  ) : (
    <div className="flex gap-4 items-center">
      <AnimatePresence>
        {collectedWords.map((word, idx) => (
          <motion.div
            key={`${word.word}-${idx}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
              <img
                src={getImageUrl(word.image)}
                alt={word.word}
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-sm font-bold text-gray-800 mt-1 uppercase">
              {word.word}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )}
</div>
```

### 4. Nov 3D gumb za skok (podoben kocki v Smesne Povedi)

Eleganten 3D gumb z zmajckom, uporabim podoben stil kot DiceRoller:

```tsx
function JumpButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`cursor-pointer ${disabled ? 'pointer-events-none' : 'pointer-events-auto'}`}
      style={{ perspective: '600px' }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Button Container - similar to dice cube styling */}
      <div
        className={`relative w-24 h-24 transition-transform ${!disabled ? 'animate-pulse' : ''} ${disabled ? 'opacity-50' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered && !disabled ? 'rotateY(10deg) rotateX(-5deg)' : 'rotateY(0deg) rotateX(0deg)',
          transitionDuration: '300ms',
        }}
      >
        {/* Front face - main button */}
        <div 
          className="absolute w-24 h-24 bg-gradient-to-br from-dragon-green to-green-600 rounded-xl border-4 border-white shadow-2xl flex items-center justify-center"
          style={{ transform: 'translateZ(12px)' }}
        >
          <img 
            src={JUMP_DRAGON_IMAGE}
            alt="Skok"
            className="w-16 h-16 object-contain drop-shadow-md"
          />
        </div>
        
        {/* Back face - shadow */}
        <div 
          className="absolute w-24 h-24 bg-green-800 rounded-xl"
          style={{ transform: 'translateZ(-4px)' }}
        />
        
        {/* Right edge */}
        <div 
          className="absolute top-1 right-0 w-3 h-[calc(100%-8px)] bg-gradient-to-r from-green-600 to-green-700 rounded-r-xl"
          style={{ transform: 'translateZ(4px)' }}
        />
        
        {/* Bottom edge */}
        <div 
          className="absolute bottom-0 left-1 w-[calc(100%-8px)] h-3 bg-gradient-to-b from-green-600 to-green-700 rounded-b-xl"
          style={{ transform: 'translateZ(4px)' }}
        />
      </div>
    </div>
  );
}
```

### 5. Pozicija okvirja in gumba - na sredini med srednjima kamnoma

```tsx
{/* DESKTOP: Word cards + Jump button in CENTER of the screen */}
{!isMobile && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
    <div className="flex items-center gap-4">
      {/* Fixed size word container */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-dragon-green/30 w-[360px] h-[140px] flex items-center justify-center p-4">
        {/* ... vsebina ... */}
      </div>
      
      {/* 3D Jump button */}
      <JumpButton 
        onClick={handleNext} 
        disabled={isJumping || phase === "complete" || showSentenceDialog} 
      />
    </div>
  </div>
)}
```

### 6. Posodobitev getDragonImage za nove koordinate

```typescript
const getDragonImage = useCallback(() => {
  const stone = STONE_POSITIONS[dragonPosition];
  if (!stone) return DRAGON_RIGHT;
  
  if (!isMobile) {
    // Leva stran (x=0): gibanje GOR -> gleda desno
    if (stone.x === 0) return DRAGON_RIGHT;
    
    // Zgornja vrstica do sredine (x <= 3) -> gleda desno
    if (stone.y === 2 && stone.x <= 3) return DRAGON_RIGHT;
    
    // Zgornja vrstica od sredine naprej (x >= 4) -> gleda levo
    if (stone.y === 2 && stone.x >= 4) return DRAGON_LEFT;
    
    // Desna stran (x=6): gibanje DOL -> gleda levo
    if (stone.x === 6) return DRAGON_LEFT;
    
    // Spodnja vrstica (y=0) razen START -> gleda levo
    if (stone.y === 0 && dragonPosition > 0) return DRAGON_LEFT;
    
    return DRAGON_RIGHT;
  }
  
  // MOBILE: nespremenjena logika
  // ...
}, [dragonPosition, isMobile, STONE_POSITIONS]);
```

---

## Vizualizacija koncnega rezultata

```text
+------------------------------------------------------------------------+
|                                                                        |
| [HOME]                                                                 |
|                                                                        |
|  [RUM] [ZEL] [SIV] [RDEC] [RUM] [ZEL] [SIV]   <- zgornja vrstica (7)  |
|    ^                                      |                            |
|    |                                      v                            |
|         +----------------------------+  +------+                       |
|  [RDEC] | [KAČA] [IMA] [KAPO]       | |  🐉  |  [RDEC]  <- srednja    |
|         | (fiksna velikost 360x140) | | gumb |                         |
|         +----------------------------+  +------+                       |
|    ^                                                  |                |
|    |                                                  v                |
| 🐉[SIV] [ZEL] [RUM] [RDEC] [SIV] [ZEL] [RUM]   <- spodnja vrstica (7) |
|  START                                                                 |
|                                                                        |
+------------------------------------------------------------------------+
```

---

## Povzetek sprememb

| Sprememba | Opis |
|-----------|------|
| **STONE_POSITIONS_DESKTOP** | 17 pozicij: 7 kamnov zgoraj, 2 v sredini, 7 spodaj |
| **calculatedSizes** | Prilagojeno za 7 stolpcev (x: 0-6) z manjsimi kamni (80x60px) |
| **Okvir za slike** | Fiksna velikost `w-[360px] h-[140px]` od zacetka igre |
| **JumpButton** | 3D stil s `perspective` in `preserve-3d`, podoben kocki v Smesne Povedi |
| **Pozicija UI** | Okvir + gumb na sredini zaslona (`top-1/2 left-1/2`) |
| **getDragonImage** | Posodobljena logika za koordinate x: 0-6 |
| **Samo desktop** | Vsi popravki obveljajo samo za `!isMobile` |

