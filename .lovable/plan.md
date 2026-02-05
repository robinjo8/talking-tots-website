

# Plan: Optimizacija DiceResultDialog in preprečitev osveževanja strani

## Pregled sprememb

### 1. DiceResultDialog - mobilna optimizacija

**Odstrani gumb ZAPRI:**
- Uporabnik bo zaprl dialog s klikom na X križec v zgornjem desnem kotu
- Dialog se samodejno zapre po končanem 5-sekundnem snemanju (že deluje)

**Gumba PREDVAJAJ in PONOVI v eni vrstici:**
- Na mobilnih napravah bosta gumba prikazana eden poleg drugega
- Širina gumbov prilagojena za mobilni zaslon

**Dodatne mobilne prilagoditve:**
- Manjše slike na mobilnih napravah
- Manjši razmiki
- `max-h-[90vh] overflow-y-auto` za preprečitev prelivanja

Vizualni rezultat:
```text
┌─────────────────────────────────┐
│                             [X] │
│           ODLIČNO!              │
│    POSLUŠAJ IN PONOVI POVED     │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │slika│ │slika│ │slika│       │
│  └─────┘ └─────┘ └─────┘       │
│  KAČA     NESE   KORUZO         │
│ "KAČA NESE KORUZO"              │
│   [PREDVAJAJ]  [PONOVI]         │
└─────────────────────────────────┘
```

### 2. Preprečitev Pull-to-Refresh v igrah

**Problem:**
Na telefonu, ko uporabnik podrsne navzdol v igri, se stran osveži in prekine igro.

**Rešitev:**
1. V `src/index.css` dodaj globalni CSS razred `.game-container`
2. V `GenericMetKockeGame.tsx` dodaj ta razred in JavaScript handler
3. Enako naredim za vse ostale igre

---

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/dice/DiceResultDialog.tsx` | Odstrani ZAPRI gumb, prilagodi za mobilni zaslon |
| `src/index.css` | Dodaj `.game-container` razred |
| `src/components/games/GenericMetKockeGame.tsx` | Dodaj zaščito pred pull-to-refresh |
| `src/components/games/GenericSpominGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericSestavljankaGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericLabirintGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericBingoGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericZaporedjaGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericDrsnaSestavljankaGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericIgraUjemanjaGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/GenericWheelGame.tsx` | Preveri in dodaj zaščito |
| `src/components/games/PonoviPovedGame.tsx` | Preveri in dodaj zaščito |

---

## Tehnični detajli

### DiceResultDialog.tsx spremembe

```tsx
<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
  {/* ... vsebina ... */}
  
  {/* Samo dva gumba v vrsti */}
  <div className="flex justify-center gap-3 pt-2">
    <Button className="bg-dragon-green h-10 w-28 sm:w-32">
      <Volume2 /> PREDVAJAJ
    </Button>
    <Button className="bg-app-orange h-10 w-28 sm:w-32">
      <Mic /> PONOVI
    </Button>
    {/* ZAPRI gumb odstranjen - uporabi X v kotu */}
  </div>
</DialogContent>
```

### index.css spremembe

```css
/* Prepreči pull-to-refresh na igrah */
.game-container {
  overscroll-behavior-y: contain;
  touch-action: pan-x pinch-zoom;
  -webkit-overflow-scrolling: auto;
}
```

### GenericMetKockeGame.tsx spremembe

```tsx
// Dodaj useEffect za preprečitev pull-to-refresh
useEffect(() => {
  const preventRefresh = (e: TouchEvent) => {
    // Prepreči samo če je uporabnik na vrhu strani in drsa navzdol
    if (e.touches.length === 1 && window.scrollY === 0) {
      const touch = e.touches[0];
      const startY = touch.clientY;
      
      const handleMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].clientY;
        if (currentY > startY) {
          moveEvent.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', handleMove);
      }, { once: true });
    }
  };
  
  document.addEventListener('touchstart', preventRefresh, { passive: true });
  return () => document.removeEventListener('touchstart', preventRefresh);
}, []);

// Glavni wrapper dobi razred game-container
<div className="fixed inset-0 overflow-hidden select-none game-container touch-none">
```

