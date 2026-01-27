
# Načrt: Popolna prenova igre "Ponovi Poved"

## Analiza referenčne slike

Na podlagi priložene slike sem identificiral naslednje zahteve:

### Postavitev elementov:
1. **Pot kamnov**: Cik-cak postavitev od spodaj levo navzgor, z večjimi kamni
2. **Zmajček**: Stoji NA kamnu (ne lebdi v zraku)
3. **Gumb hiška**: Spodaj levo, oranžni okrogli gumb, ločen od ostalih elementov
4. **Gumb za skok**: Spodaj desno na modri podlagi, z ikono zmajčka
5. **Kartice besed**: Na sredini spodaj, med gumbom hiške in gumbom za skok
6. **Ozadje**: svetlomodro_ozadje.webp iz bucketa "ozadja"

### Razmerja velikosti:
- Kamni so veliko večji (cca 100-120px širine)
- Zmajček je proporcionalno večji
- Kartice besed so večje (cca 80-100px)
- Celoten grid zapolni večino zaslona

---

## Tehnične spremembe

### 1. Ozadje strani
```typescript
const BACKGROUND_URL = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/svetlomodro_ozadje.webp';

// V return:
<div 
  className="min-h-screen w-full fixed inset-0 flex flex-col"
  style={{
    backgroundImage: `url(${BACKGROUND_URL})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
```

### 2. Povečanje velikosti elementov

**Desktop (768px+):**
| Element | Trenutno | Novo |
|---------|----------|------|
| Kamni | 64x48px | 120x90px |
| Zmajček | 70x70px | 110x110px |
| Kartice besed | 96x112px | 100x120px |
| Gap X | 80px | 140px |
| Gap Y | 70px | 100px |

**Mobilno (<768px):**
| Element | Velikost |
|---------|----------|
| Kamni | 80x60px |
| Zmajček | 80x80px |
| Kartice | 80x100px |
| Gap X | 90px |
| Gap Y | 75px |

### 3. Pozicija zmajčka na kamnu

Trenutno zmajček lebdi 50px nad kamnom. Nova logika:
```typescript
const getDragonPixelPosition = () => {
  const pos = getStonePixelPosition(dragonPosition);
  return {
    left: pos.left + stoneWidth/2 - dragonWidth/2,  // Centriraj horizontalno
    bottom: pos.bottom + stoneHeight - 10,  // Sedi na kamnu, ne lebdi
  };
};
```

### 4. Popravek slike zmajčka za levo smer

Trenutna koda pravilno referira `Zmajcek_4_1.PNG`, vendar je potrebno preveriti ali obstaja v bucketu. Uporabim malo črko:
```typescript
const DRAGON_LEFT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4_1.png";
```

### 5. Nova postavitev spodnjega dela

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────┐                                         ┌───────────┐ │
│  │ 🏠   │    ┌────┐ ┌────┐ ┌────┐                 │   🐉      │ │
│  │      │    │Kača│ │ima │ │kapo│                 │   SKOK    │ │
│  └──────┘    └────┘ └────┘ └────┘                 │  (modro)  │ │
│  (oranžno)      (kartice na sredini)               └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**CSS struktura:**
```jsx
{/* Spodnji del - fixed pozicija */}
<div className="fixed bottom-0 left-0 right-0 p-4 flex items-end justify-between">
  {/* Levo: Gumb hiška */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="h-14 w-14 rounded-xl bg-app-orange hover:bg-app-orange/90 shadow-lg">
        <Home className="h-7 w-7 text-white" />
      </Button>
    </DropdownMenuTrigger>
    ...
  </DropdownMenu>
  
  {/* Sredina: Kartice besed */}
  <div className="flex-1 flex justify-center gap-3 mx-4">
    {collectedWords.map((word) => (
      <div className="w-20 h-24 md:w-24 md:h-28 bg-white rounded-xl border-2 border-dragon-green shadow-md flex flex-col items-center justify-center p-2">
        <img src={getImageUrl(word.image)} className="w-14 h-14 md:w-16 md:h-16 object-contain" />
        <p className="text-xs md:text-sm font-bold text-gray-700">{word.word}</p>
      </div>
    ))}
  </div>
  
  {/* Desno: Gumb za skok na modri podlagi */}
  <div className="bg-sky-400 rounded-xl p-2 shadow-lg">
    <button
      onClick={handleNext}
      className="w-20 h-24 md:w-24 md:h-28 bg-gradient-to-b from-green-400 to-green-600 rounded-xl flex flex-col items-center justify-center"
    >
      <img src={DRAGON_RIGHT} className="w-16 h-16 md:w-18 md:h-18 object-contain" />
      <span className="text-white font-bold text-xs">SKOK</span>
    </button>
  </div>
</div>
```

### 6. Pop-up dialog (stil "Smešne Povedi")

Prevzamem dizajn iz `DiceResultDialog.tsx`:

```jsx
<Dialog open={showSentenceDialog} onOpenChange={() => {}}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="font-bold text-dragon-green text-center text-lg md:text-2xl uppercase">
        ODLIČNO!
      </DialogTitle>
    </DialogHeader>
    
    <div className="space-y-3 md:space-y-4 py-2 md:py-4">
      <p className="text-black text-center uppercase text-xs md:text-sm font-medium">
        POSLUŠAJ IN PONOVI POVED
      </p>
      
      {/* Tri slike v vrsti */}
      <div className="flex justify-center gap-3 md:gap-4">
        {currentSentence?.words.map((word, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1 md:space-y-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-dragon-green bg-gray-50">
              <img
                src={getImageUrl(word.image)}
                alt={word.word}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-medium text-center text-xs md:text-sm text-black uppercase">
              {word.word.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
      
      {/* Tekst povedi */}
      <p className="text-base md:text-lg font-semibold text-gray-800 text-center uppercase">
        "{currentSentence?.fullSentence.toUpperCase()}"
      </p>

      {/* Gumbi */}
      <div className="flex justify-center gap-3 pt-2">
        <Button
          onClick={playSentenceAudio}
          className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 uppercase font-medium h-10 w-32"
        >
          <Volume2 className="w-4 h-4" />
          PREDVAJAJ
        </Button>
        
        <Button
          onClick={handleRepeat}
          disabled={isRecording}
          className="relative bg-app-orange hover:bg-app-orange/90 text-white gap-2 uppercase font-medium h-10 w-32"
        >
          <Mic className="w-4 h-4" />
          {isRecording ? "..." : "PONOVI"}
          {isRecording && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {countdown}
            </span>
          )}
        </Button>
        
        <Button onClick={handleContinueFromDialog} variant="outline" className="uppercase h-10 w-32">
          NAPREJ
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

### 7. Responzivnost (Desktop vs. Mobilno)

Uporabim hook `useIsMobile()`:

```typescript
import { useIsMobile } from "@/hooks/use-mobile";

const isMobile = useIsMobile();

// Dinamične velikosti
const stoneWidth = isMobile ? 80 : 120;
const stoneHeight = isMobile ? 60 : 90;
const gapX = isMobile ? 90 : 140;
const gapY = isMobile ? 75 : 100;
const dragonSize = isMobile ? 80 : 110;
const offsetX = isMobile ? 30 : 60;
const offsetY = isMobile ? 60 : 100;
```

### 8. Odstranitev glave (header)

Referenčna slika nima zelenega naslova na vrhu. Odstranimo header za čist dizajn:

```jsx
// ODSTRANI:
{/* Header */}
<div className="bg-dragon-green text-white py-3 px-4 shadow-md">
  <h1 className="text-xl font-bold text-center">
    Ponovi poved - Črka {config.displayLetter}
  </h1>
</div>
```

---

## Struktura datotek za spremembe

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/PonoviPovedGame.tsx` | Popolna prenova vizualnega prikaza |

---

## Vizualizacija končnega rezultata

```text
┌─────────────────────────────────────────────────────────────┐
│                 svetlomodro_ozadje.webp                     │
│                                                             │
│     [SIV]                                                   │
│      CILJ                                                   │
│                                                             │
│     [RUM] [RDEČ] [ZEL]  [SIV]                              │
│                                                             │
│     [SIV]  [ZEL] [RDEČ] [RUM]                              │
│                                                             │
│     [RUM] [RDEČ] [ZEL]  [SIV]                              │
│                                                             │
│  🐉                                                         │
│ [SIV]  [RUM] [RDEČ] [ZEL]  [SIV]                           │
│ START                                                       │
│                                                             │
│ ┌────┐    ┌────┐┌────┐┌────┐           ┌────────────┐     │
│ │ 🏠 │    │Kača││ima ││kapo│           │▓▓▓▓▓▓▓▓▓▓▓▓│     │
│ └────┘    └────┘└────┘└────┘           │ 🐉 SKOK   │     │
│ oranžno    kartice besed               │ (modro)   │     │
│                                         └────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Povzetek sprememb

1. **Ozadje**: svetlomodro_ozadje.webp na celotni strani
2. **Velikost**: Vse povečano za ~50-80%
3. **Gumb hiška**: Spodaj levo, ločen, oranžni okrogli gumb
4. **Gumb skok**: Spodaj desno na modri podlagi
5. **Kartice**: Na sredini spodaj
6. **Zmajček**: Sedi na kamnu (ne lebdi)
7. **Zmajček levo**: Popravljena slika Zmajcek_4_1.png
8. **Pop-up**: Stil enak kot "Smešne Povedi" (DiceResultDialog)
9. **Brez glave**: Čist dizajn brez zelenega naslova
10. **Responzivno**: Prilagojeno za desktop in mobilno

