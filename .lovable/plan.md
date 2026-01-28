
# Nacrt: Preoblikovanje igre "Ponovi Poved" - Pravokotna pot

## Pregled zahtevane postavitve

Na podlagi referenčne slike in opisa je jasna nova struktura:

```text
      [RUM] [SIV] [RDEC] [RUM] [ZEL] [SIV]  <- zgornja vrstica (kamni 7-12)
        ^                               |
        |                               v
      [SIV]                           [RDEC]
        ^                               |
        |                               v
      [ZEL]                           [RUM]
        ^                               |
        |                               v
   🐉 [SIV] [ZEL] [RDEC] [RUM] [SIV] [ZEL]  <- spodnja vrstica (kamni 0-6)
        ^                               
     START/CILJ
```

### Nova pot zmajcka (16 korakov v krogu):
1. **START** na levem spodnjem sivem kamnu
2. **2x GOR** (leva stran - vertikalno)
3. **6x DESNO** (zgornja vrstica - horizontalno)
4. **Ko pride na desni zgornji siv kamen**: zmeni sliko iz `Zmajcek_4.webp` v `Zmajcek_4_1.png` (gleda levo)
5. **2x DOL** (desna stran - vertikalno)
6. **6x LEVO** (spodnja vrstica nazaj do starta)
7. **KONEC** na istem sivem kamnu kot START

### Logika besed in povedi:
- **Skok 1 (gor)**: 1. beseda
- **Skok 2 (gor)**: 2. beseda
- **Skok 3 (desno)**: 3. beseda
- **Skok 4 (desno)**: PONOVI POVED 1
- ...in tako naprej za vse 4 povedi

---

## Tehnicne spremembe

### 1. Nova definicija STONE_POSITIONS (pravokotna pot)

Pot bo potekala v obliki pravokotnika:
- 18 kamnov (ne vec 17): START + 4 povedi x 4 kamni + CILJ = START

```typescript
// Pravokotna pot: 18 pozicij
// Spodnja vrstica: x=0 do x=5, y=0
// Leva stran: x=0, y=0 do y=2
// Zgornja vrstica: x=0 do x=5, y=2
// Desna stran: x=5, y=2 do y=0

const STONE_POSITIONS: StonePosition[] = [
  // START - levi spodnji sivi kamen
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Poved 1: 2x gor + 1 desno + sivi (ponovi)
  { x: 0, y: 1, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 0 },  // 1. beseda
  { x: 0, y: 2, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },    // 2. beseda
  { x: 1, y: 2, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 2 }, // 3. beseda
  { x: 2, y: 2, type: 'gray', isRest: true, sentenceIndex: 0 },                  // Ponovi poved 1
  
  // Poved 2: 3 kamni desno + sivi
  { x: 3, y: 2, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 4, y: 2, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 5, y: 2, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 5, y: 1, type: 'gray', isRest: true, sentenceIndex: 1 },                  // Ponovi poved 2
  
  // Poved 3: 2x dol + 1 levo + sivi
  { x: 5, y: 0, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 4, y: 0, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 3, y: 0, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 2, y: 0, type: 'gray', isRest: true, sentenceIndex: 2 },                  // Ponovi poved 3
  
  // Poved 4: 2 kamni levo + CILJ (START)
  { x: 1, y: 0, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  // CILJ = START kamen (pozicija 0) - krog je zakljucen
];

// Skupaj 14 kamnov + START = 15, zadnji je na sivem START kamnu
```

**Popravek**: Glede na opis uporabnika:
- 2x gor, 6x desno, 2x dol, 6x levo = 16 skokov
- Vsaka poved ima 3 besede + 1 ponovi = 4 skoki
- 4 povedi x 4 skoki = 16 skokov

### 2. Sprememba slike zmajcka glede na smer

```typescript
const getDragonImage = useCallback(() => {
  const stone = STONE_POSITIONS[dragonPosition];
  if (!stone) return DRAGON_RIGHT;
  
  // Določi smer gibanja
  // Leva stran (x=0): gibanje GOR -> gleda desno (DRAGON_RIGHT)
  // Zgornja vrstica (y=2): gibanje DESNO -> gleda desno, nato po sivem gleda LEVO
  // Desna stran (x=5): gibanje DOL -> gleda levo (DRAGON_LEFT)
  // Spodnja vrstica (y=0): gibanje LEVO -> gleda levo (DRAGON_LEFT)
  
  if (stone.x === 0) return DRAGON_RIGHT;      // Leva stran - gleda desno
  if (stone.y === 2 && stone.x <= 2) return DRAGON_RIGHT; // Zgornja leva
  if (stone.y === 2 && stone.x >= 3) return DRAGON_LEFT;  // Zgornja desna (po obratu)
  if (stone.x === 5) return DRAGON_LEFT;       // Desna stran
  if (stone.y === 0) return DRAGON_LEFT;       // Spodnja vrstica
  
  return DRAGON_RIGHT;
}, [dragonPosition]);
```

### 3. Prikaz kartic besed na sredini

Kartice besed bodo prikazane na **sredini zaslona**, ne zgoraj:

```tsx
{/* CENTER: Collected word cards - displayed horizontally in the middle */}
<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex justify-center items-center pointer-events-none">
  <div className="flex gap-4 items-center">
    {/* Word cards */}
    <div className="flex gap-2 md:gap-4">
      <AnimatePresence>
        {collectedWords.map((word, idx) => (
          <motion.div
            key={`${word.word}-${idx}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-white rounded-xl p-2 shadow-lg border-2 border-dragon-green"
          >
            <img
              src={getImageUrl(word.image)}
              alt={word.word}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
            <p className="text-xs md:text-sm font-bold text-gray-800 mt-1 uppercase">
              {word.word}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
    
    {/* Jump button - RIGHT of word cards */}
    {collectedWords.length > 0 && (
      <JumpButton onClick={handleNext} disabled={isJumping || showSentenceDialog} />
    )}
  </div>
</div>
```

### 4. Nov gumb za skok (podoben kocki v Smešne Povedi)

Namesto modrega gumba bo nov eleganten gumb z zmajčkovo tačko/nogo, ki bo vizualno podoben 3D kocki:

```tsx
// Nova komponenta JumpButton
function JumpButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative cursor-pointer pointer-events-auto"
      style={{ perspective: '600px' }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative w-20 h-20 md:w-24 md:h-24 ${disabled ? 'opacity-50' : ''}`}
        animate={!disabled ? { 
          scale: [1, 1.05, 1],
          rotateY: isHovered ? 10 : 0,
        } : {}}
        transition={{ 
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 0.3 }
        }}
      >
        {/* Eleganten okrogel gumb z zmajčkom */}
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-dragon-green to-green-600 shadow-xl border-4 border-white flex items-center justify-center">
          <img 
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_111.PNG"
            alt="Skok"
            className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md"
          />
        </div>
      </motion.div>
    </div>
  );
}
```

### 5. Prilagoditev velikosti in pozicije za desktop

```typescript
// DESKTOP verzija - pravokotna pot
if (!isMobile) {
  const stoneWidth = 100;
  const stoneHeight = 75;
  const gapX = 120;  // Horizontalni razmik
  const gapY = 150;  // Vertikalni razmik (večji za 3 vrstice)
  const dragonSize = 100;
  
  // 6 stolpcev (x: 0-5), 3 vrstice (y: 0-2)
  const gridWidth = 5 * gapX + stoneWidth;
  const gridHeight = 2 * gapY + stoneHeight;
  
  const offsetX = (containerSize.width - gridWidth) / 2;
  const offsetY = (containerSize.height - gridHeight) / 2 - 50; // Centriranje
  
  return { stoneWidth, stoneHeight, gapX, gapY, dragonSize, offsetX, offsetY };
}
```

### 6. Odstranitev modrega gumba spodaj

Modri gumb na sredini spodaj se odstrani in nadomesti z gumbom desno od kartic.

---

## Struktura datotek

| Datoteka | Spremembe |
|----------|-----------|
| `src/components/games/PonoviPovedGame.tsx` | Celotna preoblikovanje poti, UI in logike |

---

## Vizualizacija koncnega rezultata

```text
+------------------------------------------------------------------+
|                                                                  |
| [HOME]                                                           |
|                                                                  |
|   [SIV] [ZEL] [RDEC] [RUM] [SIV] [ZEL]   <- zgornja vrstica     |
|                                    |                             |
|   [RDEC]                        [RDEC]   <- srednja vrstica     |
|     |                              |                             |
|   [ZEL]                          [RUM]                          |
|     |                              |                             |
|  🐉[SIV] [ZEL] [RDEC] [RUM] [SIV] [ZEL]   <- spodnja vrstica    |
|   START                                                          |
|                                                                  |
|              [KAČA] [IMA] [KAPO]  [🐉]  <- kartice + gumb SKOK   |
|               (bela okvirja)      (zelen gumb)                   |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Povzetek sprememb

1. **Nova pravokotna pot** - 16 skokov v krogu (2 gor, 6 desno, 2 dol, 6 levo)
2. **START = CILJ** - levi spodnji sivi kamen
3. **Sprememba smeri zmajčka** - `Zmajcek_4.webp` za desno, `Zmajcek_4_1.png` za levo
4. **Kartice besed na sredini** - ena zraven druge horizontalno
5. **Gumb SKOK desno od kartic** - eleganten zelen gumb z zmajčkom (podoben kocki)
6. **Odstranitev modrega gumba** - ni več na sredini spodaj
7. **Samo desktop verzija** - mobilna ostane nespremenjena
