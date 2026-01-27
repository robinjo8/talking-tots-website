

# Načrt: Preoblikovanje igre "Ponovi Poved" - Desktop verzija

## Analiza referenčne slike

Na podlagi slike sem identificiral naslednje zahteve:

### 1. Struktura postavitve (od zgoraj navzdol):
- **ZGORAJ**: Kartice besed v svetlo modrem polju, vsaka v belem krogu/okvirju brez obrobe
- **SREDINA**: Pot s kamni, centrirana horizontalno in vertikalno
- **SPODAJ NA SREDINI**: Eleganten gumb "SKOK" z zmajčkom

### 2. Spremembe velikosti za Desktop:
| Element | Trenutno | Novo (2x večje) |
|---------|----------|-----------------|
| Kamni (stoneWidth) | 140px | 200px |
| Kamni (stoneHeight) | 105px | 150px |
| Zmajček | 126px | 180px |
| Gap X | 175px | 250px |
| Gap Y | 141px | 200px |

### 3. Nova struktura UI:
```text
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠                                                                  │
│  (zgoraj levo)                                                      │
│                                                                     │
│        ┌─────────────────────────────────────────────┐              │
│        │   ┌─────┐    ┌─────┐    ┌─────┐            │              │
│        │   │ 🐍  │    │ 👤  │    │ 🧢  │            │              │
│        │   │KAČA │    │ IMA │    │KAPO │            │              │
│        │   └─────┘    └─────┘    └─────┘            │              │
│        │            (beli krogi)                     │              │
│        └─────────────────────────────────────────────┘              │
│                    (svetlo modro ozadje)                            │
│                                                                     │
│                           [CILJ]                                    │
│                       🟡  🔴  🟢  ⬜                                │
│                   ⬜  🟢  🔴  🟡                                    │
│                       🟡  🔴  🟢  ⬜                                │
│                   🐉  🟢  🔴  🟡                                    │
│                       [START]                                       │
│                                                                     │
│                       ┌──────────┐                                  │
│                       │   🐉     │                                  │
│                       │  SKOK   │                                  │
│                       └──────────┘                                  │
│                    (zeleno na modrem)                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tehnične spremembe

### 1. Povečanje velikosti za Desktop (2x)

```typescript
const calculatedSizes = useMemo(() => {
  // ...existing code...
  
  // Desktop: DOUBLE the size
  if (!isMobile) {
    const stoneWidth = 200;  // Was ~140
    const stoneHeight = 150; // Was ~105
    const gapX = 250;        // Was ~175
    const gapY = 200;        // Was ~141
    const dragonSize = 180;  // Was ~126
    
    // Center calculation
    const gridWidth = 3 * gapX + stoneWidth;
    const gridHeight = 4 * gapY + stoneHeight;
    const offsetX = (containerSize.width - gridWidth) / 2;
    const offsetY = (containerSize.height - gridHeight) / 2 + 60; // Shift up for cards
    
    return { stoneWidth, stoneHeight, gapX, gapY, dragonSize, offsetX, offsetY };
  }
  
  // Mobile stays the same...
}, [containerSize, isMobile]);
```

### 2. Kartice besed ZGORAJ (ne spodaj)

Premakni kartice iz spodnjega dela v zgornji del, v svetlo modrem polju:

```tsx
{/* TOP: Collected word cards in light blue container */}
<div className="fixed top-4 left-0 right-0 z-20 flex justify-center px-4">
  <div className="bg-sky-100 rounded-2xl p-4 shadow-lg min-w-[400px]">
    <div className="flex justify-center gap-6">
      <AnimatePresence>
        {collectedWords.map((word, idx) => (
          <motion.div
            key={`${word.word}-${idx}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {/* White circle without border */}
            <div className="w-24 h-24 rounded-xl bg-white shadow-md flex items-center justify-center p-2">
              <img
                src={getImageUrl(word.image)}
                alt={word.word}
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-sm font-bold text-gray-800 mt-2 uppercase">
              {word.word}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
</div>
```

### 3. Gumb hiška (Home) - zgoraj levo

Premakni gumb "Home" iz spodaj levo v zgoraj levo:

```tsx
{/* Home button - TOP LEFT */}
<div className="fixed top-4 left-4 z-30">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className="h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
        size="icon"
      >
        <Home className="h-7 w-7 text-white" />
      </Button>
    </DropdownMenuTrigger>
    {/* ...dropdown content... */}
  </DropdownMenu>
</div>
```

### 4. Gumb "SKOK" - sredina spodaj, eleganten

Preoblikuj gumb "SKOK" - postavljen na sredini spodaj, večji, elegantnejši:

```tsx
{/* SKOK button - BOTTOM CENTER, elegant design */}
<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
  <div className="bg-sky-400 rounded-2xl p-4 shadow-xl">
    <button
      onClick={handleNext}
      disabled={isJumping || phase === "complete" || showSentenceDialog}
      className={`w-32 h-36 rounded-xl flex flex-col items-center justify-center transition-all
        ${isJumping || phase === "complete" || showSentenceDialog
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:scale-95 shadow-lg'
        }`}
    >
      <img
        src={DRAGON_JUMP_BUTTON}
        alt="Skok"
        className="w-20 h-20 object-contain"
      />
      <span className="text-white font-bold text-lg mt-1">SKOK</span>
    </button>
  </div>
</div>
```

### 5. Centriranje igre

Posodobi izračun pozicij, da bo grid centriran tako horizontalno kot vertikalno:

```typescript
// Calculate grid dimensions
const gridWidth = 3 * gapX + stoneWidth;
const gridHeight = 4 * gapY + stoneHeight;

// Center horizontally and vertically (with offset for top cards and bottom button)
const offsetX = (containerSize.width - gridWidth) / 2;
const offsetY = (containerSize.height - gridHeight) / 2 - 40; // Shift up slightly
```

---

## Struktura datotek

| Datoteka | Spremembe |
|----------|-----------|
| `src/components/games/PonoviPovedGame.tsx` | Preoblikovanje UI strukture |

---

## Povzetek sprememb

1. **Dvakrat večji elementi** - kamni 200x150px, zmajček 180px, gap-i 250x200px
2. **Centriranje igre** - horizontalno in vertikalno na sredini zaslona
3. **Kartice besed zgoraj** - v svetlo modrem polju, beli krogi brez obrobe
4. **Gumb Home zgoraj levo** - oranžen okrogel gumb
5. **Gumb SKOK na sredini spodaj** - eleganten z Zmajcek_111.png, na modri podlagi
6. **Mobilna verzija** - ostane enaka (brez sprememb)

