

# Nacrt: Popravki desktop verzije igre "Ponovi Poved"

## Analiza problema

Na podlagi posnetka zaslona sem identificiral naslednje tezave in zahteve:

### Trenutne tezave:
1. Elementi so preveliki - kamni, zmajcek in razmiki so predimenzijonirani
2. Gumb hiska je zgoraj levo namesto spodaj levo
3. Gumb SKOK ima modro podlago namesto bele
4. Besedi "START" in "CILJ" sta prikazani na kamnih
5. Slika zmajcka v gumbu se ne nalaga pravilno (vidno kot "Skok" brez slike)

---

## Tehnicne spremembe

### 1. Zmanjsanje velikosti elementov za Desktop

Trenutne (prevelike) vrednosti:
| Element | Trenutno | Novo (logicno prilagojeno) |
|---------|----------|---------------------------|
| stoneWidth | 200px | 140px |
| stoneHeight | 150px | 105px |
| gapX | 250px | 175px |
| gapY | 200px | 155px |
| dragonSize | 180px | 130px |

```typescript
// v calculatedSizes useMemo - DESKTOP del
if (!isMobile) {
  const stoneWidth = 140;   // Zmanjsano iz 200
  const stoneHeight = 105;  // Zmanjsano iz 150
  const gapX = 175;         // Zmanjsano iz 250
  const gapY = 155;         // Zmanjsano iz 200
  const dragonSize = 130;   // Zmanjsano iz 180
  
  // Izracun za boljse centriranje - grid zapolni zaslon proporcionalno
  const gridWidth = 3 * gapX + stoneWidth;
  const gridHeight = 4 * gapY + stoneHeight;
  
  const offsetX = (containerSize.width - gridWidth) / 2;
  const offsetY = 120; // Spodnji offset za gumb SKOK
  
  return { stoneWidth, stoneHeight, gapX, gapY, dragonSize, offsetX, offsetY };
}
```

### 2. Gumb hiska - premakni SPODAJ LEVO

Iz:
```tsx
<div className="fixed top-4 left-4 z-30">
```

V:
```tsx
<div className="fixed bottom-6 left-4 z-30">
```

### 3. Gumb SKOK - bel krog z zmajckom

Preoblikovanje gumba SKOK:
- Odstrani modro podlago (`bg-sky-400`)
- Bel okrogel gumb z zmajckom notri
- Napis "SKOK" pod sliko
- Popravek URL slike: `Zmajcek_111.PNG` (veliko P)

```tsx
{/* BOTTOM CENTER: SKOK button - WHITE CIRCLE with dragon */}
<div className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
  <button
    onClick={handleNext}
    disabled={isJumping || phase === "complete" || showSentenceDialog}
    className={`flex flex-col items-center justify-center transition-all
      ${isJumping || phase === "complete" || showSentenceDialog
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:scale-105 active:scale-95'
      }`}
  >
    {/* White circle container */}
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
      <img
        src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_111.PNG"
        alt="Skok"
        className="w-14 h-14 md:w-18 md:h-18 object-contain"
      />
    </div>
    <span className="text-gray-700 font-bold text-sm md:text-base mt-2 uppercase">SKOK</span>
  </button>
</div>
```

### 4. Odstrani "START" in "CILJ" napisa

Odstrani obe besedi iz renderiranja kamnov (vrstice 548-557):

```tsx
// ODSTRANI to kodo:
{isStart && (
  <span className="absolute -bottom-6 md:-bottom-8 text-xs md:text-sm font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded shadow">
    START
  </span>
)}
{isGoal && (
  <span className="absolute -bottom-6 md:-bottom-8 text-xs md:text-sm font-bold text-yellow-700 bg-white/80 px-2 py-0.5 rounded shadow">
    CILJ
  </span>
)}
```

### 5. Posodobitev URL za sliko zmajcka v gumbu

```typescript
// Sprememba konstante - uporabi .PNG namesto .png
const DRAGON_JUMP_BUTTON = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_111.PNG";
```

---

## Vizualizacija koncnega rezultata

```text
+------------------------------------------------------------------+
|                                                                  |
|        [Zbrane besede...] <- zgoraj na sredini                   |
|                                                                  |
|                  [SIV] <- CILJ (brez napisa)                     |
|          [RUM] [RDEC] [ZEL] [SIV]                               |
|      [SIV] [ZEL] [RDEC] [RUM]                                   |
|          [RUM] [RDEC] [ZEL] [SIV]                               |
|       ZM [ZEL] [RDEC] [RUM] [SIV]                               |
|          [SIV] <- START (brez napisa)                            |
|                                                                  |
|                      ( O )   <- bel krog z zmajckom              |
|                      SKOK                                         |
|                                                                  |
| [HOME]                                                           |
| (spodaj levo)                                                    |
+------------------------------------------------------------------+
```

---

## Struktura sprememb

| Lokacija | Sprememba |
|----------|-----------|
| Vrstica 58 | Spremeni `.png` v `.PNG` za DRAGON_JUMP_BUTTON |
| Vrstice 139-162 | Zmanjsaj velikosti za desktop |
| Vrstica 462 | Premakni home gumb iz `top-4` v `bottom-6` |
| Vrstice 548-557 | Odstrani START in CILJ napisa |
| Vrstice 586-606 | Preoblikuj gumb SKOK v bel krog |

---

## Povzetek sprememb

1. **Zmanjsanje velikosti** - kamni 140x105px, zmajcek 130px, razmiki 175x155px
2. **Gumb hiska spodaj levo** - fixed bottom-6 left-4
3. **Gumb SKOK v belem krogu** - bel okrogel gumb z Zmajcek_111.PNG
4. **Odstrani START/CILJ** - brez napisov na kamnih
5. **Popravek URL** - .PNG namesto .png za pravilno nalaganje slike

