

# Nacrt: Popravki desktop verzije igre "Ponovi Poved"

## Pregled zahtev

1. **Sivi kamen (START)** - premakni levo od prvega zelenega kamna (oba v isti vrstici spodaj)
2. **Gumb SKOK** - uporabi sliko `gumb_modri.png` iz bucket `slike-ostalo`, dodaj utripanje (pulsing animacija), odstrani napis "SKOK"
3. **Gumb spodaj na sredini** - ohrani pozicijo
4. **Pomanjsaj/premakni igro navzdol** - da se slike kartic prikazujejo nad igro brez prekrivanja
5. **Samo desktop verzija** - mobilna ostane nespremenjena

---

## Tehnicne spremembe

### 1. Nova struktura STONE_POSITIONS za desktop

Trenutno je START kamen na poziciji `{x: 0, y: 0}` sam v svoji vrstici. Nova postavitev:

```typescript
// Sprememba: START kamen je LEVO od prvega zelenega (x: -1, y: 1)
// Posodobljen vrstni red za desktop verzijo

// Stara struktura:
// Row 0: { x: 0, y: 0 } START (sam)
// Row 1: { x: 0, y: 1 } zeleni, { x: 1, y: 1 } rdeci...

// NOVA struktura za desktop:
// START bo na x: -1, y: 1 (levo od zelenega)
// Pozicije se zamaknejo tako da je START v isti vrstici kot prva poved
```

Sprememba v `STONE_POSITIONS[0]`:
```typescript
{ x: -1, y: 1, type: 'gray', isRest: false },  // START - levo od zelenega
```

### 2. Nova slika za gumb SKOK

```typescript
// Dodaj novo konstanto
const JUMP_BUTTON_IMAGE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/gumb_modri.png";
```

### 3. Gumb SKOK z utripanjem (brez napisa)

```tsx
{/* BOTTOM CENTER: SKOK button - use gumb_modri.png with pulse animation */}
<div className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
  <button
    onClick={handleNext}
    disabled={isJumping || phase === "complete" || showSentenceDialog}
    className={`transition-all
      ${isJumping || phase === "complete" || showSentenceDialog
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:scale-105 active:scale-95'
      }`}
  >
    <motion.img
      src={JUMP_BUTTON_IMAGE}
      alt="Skok"
      className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg"
      animate={{ 
        scale: [1, 1.08, 1],
        opacity: [1, 0.85, 1]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    {/* Napis SKOK odstranjen */}
  </button>
</div>
```

### 4. Pomanjsanje/premik igre navzdol (samo desktop)

Posodobitev `calculatedSizes` za desktop:

```typescript
if (!isMobile) {
  const stoneWidth = 120;   // Pomanjsano iz 140
  const stoneHeight = 90;   // Pomanjsano iz 105
  const gapX = 150;         // Pomanjsano iz 175
  const gapY = 130;         // Pomanjsano iz 155
  const dragonSize = 110;   // Pomanjsano iz 130
  
  // Grid zavzema manj prostora - vec prostora za kartice zgoraj
  const gridWidth = 4 * gapX + stoneWidth;  // 4 stolpcev (vkljucno z START na -1)
  const gridHeight = 4 * gapY + stoneHeight; // 4 vrstice (brez dodatne vrstice 0)
  
  const offsetX = (containerSize.width - gridWidth) / 2 + gapX; // Zamik za START na -1
  const offsetY = 100; // Nizji offset - igra je bolj spodaj
  
  return { stoneWidth, stoneHeight, gapX, gapY, dragonSize, offsetX, offsetY };
}
```

### 5. Prilagoditev pozicije START kamna

Ker START gremo na `x: -1`, moramo prilagoditi izracun pozicije:

```typescript
const getStonePixelPosition = (index: number) => {
  const stone = STONE_POSITIONS[index];
  
  return {
    left: offsetX + stone.x * gapX,  // Deluje tudi za x: -1
    bottom: offsetY + stone.y * gapY,
  };
};
```

To ze deluje, ker `stone.x * gapX` za `x = -1` vrne negativno vrednost, kar postavi kamen levo.

---

## Vizualizacija koncnega rezultata

```text
+------------------------------------------------------------------+
|                                                                  |
|        [Kartice besed - brez prekrivanja]                        |
|                                                                  |
|                                                                  |
|      [SIV] [ZEL] [RDEC] [RUM]  <- Poved 4 (CILJ)                |
|  [RUM] [RDEC] [ZEL] [SIV]      <- Poved 3                       |
|      [SIV] [ZEL] [RDEC] [RUM]  <- Poved 2                       |
| [SIV][ZEL] [RDEC] [RUM] [SIV]  <- Poved 1 + START levo          |
|  START 🐉                                                        |
|                                                                  |
|                    (modri gumb utripa)                           |
|                                                                  |
| [HOME]                                                           |
+------------------------------------------------------------------+
```

---

## Spremembe v datoteki

| Lokacija | Sprememba |
|----------|-----------|
| Nova konstanta | Dodaj `JUMP_BUTTON_IMAGE` URL |
| STONE_POSITIONS[0] | Spremeni `{x: 0, y: 0}` v `{x: -1, y: 1}` |
| calculatedSizes (desktop) | Pomanjsaj velikosti in prilagodi offsete |
| Gumb SKOK (vrstice 577-598) | Uporabi novo sliko z utripanjem, odstrani napis |

---

## Povzetek

1. **START kamen levo** - `{x: -1, y: 1}` namesto `{x: 0, y: 0}`
2. **Gumb SKOK** - slika `gumb_modri.png` z `motion.img` utripanjem
3. **Brez napisa SKOK** - odstranjena `<span>` za tekst
4. **Manjsa igra** - kamni 120x90px, gap-i 150x130px, offsetY: 100
5. **Samo desktop** - mobilna verzija ostane nespremenjena

