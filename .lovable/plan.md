
# Načrt: Popolna vizualna prenova igre "Ponovi Poved"

## Analiza referenčne slike

Na podlagi slike sem identificiral naslednje zahteve za popolno prenovo:

### 1. Struktura poti (17 kamnov namesto 18)
Odstrani čisto zgornji siv kamen - CILJ je sivi kamen v 5. vrstici, ne posebna 6. vrstica.

| Pozicija | Vrstica | Tip | Oznaka |
|----------|---------|-----|--------|
| 0 | 0 | siv | START |
| 1-4 | 1 | rumena, rdeč, zelen, siv | Poved 1 |
| 5-8 | 2 | rumena, rdeč, zelen, siv | Poved 2 |
| 9-12 | 3 | rumena, rdeč, zelen, siv | Poved 3 |
| 13-16 | 4 | rumena, rdeč, zelen, siv | Poved 4 (CILJ na sivi) |

### 2. Nove slike kamnov
Zamenjava starih .webp slik z novimi preglednimi slikami:
```typescript
const STONE_IMAGES = {
  gray: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_siv-Photoroom.png",
  yellow: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rumen-Photoroom.png",
  red: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rdec-Photoroom.png",
  green: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_zelen-Photoroom.png",
};
```

### 3. Slika zmajčka za gumb SKOK
```typescript
const DRAGON_JUMP_BUTTON = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_111.png";
```

### 4. Pozicija zmajčka NA kamnu
Trenutno zmajček lebdi v zraku. Popravek:
```typescript
const getDragonPixelPosition = () => {
  const pos = getStonePixelPosition(dragonPosition);
  return {
    left: pos.left + stoneWidth / 2 - dragonSize / 2,
    bottom: pos.bottom + stoneHeight * 0.6,  // Zmaj sedi na sredini kamna
  };
};
```

### 5. Dinamične velikosti glede na zaslon

**Desktop (polni zaslon):**
```typescript
// Izračun na podlagi velikosti okna (podobno kot MemoryGrid)
const stoneWidth = Math.floor(Math.min(
  (window.innerWidth - 200) / 5,  // 5 stolpcev z margino
  (window.innerHeight - 200) / 6  // 6 vrstic z margino
) * 1.2);

const stoneHeight = stoneWidth * 0.75;  // Razmerje stranic
const gapX = stoneWidth * 1.15;
const gapY = stoneHeight * 1.2;
const dragonSize = stoneWidth * 0.9;
```

**Mobilno (<768px):**
- Manjše vrednosti, prilagojene za portrait/landscape
- Fullscreen in landscape lock kot pri igri Spomin

### 6. Odstranitev pokala in zgornjega sivega kamna
- STONE_POSITIONS bo imel 17 elementov (0-16) namesto 18
- Zadnji sivi kamen (pozicija 16) bo CILJ
- Odstrani "🏆" in "CILJ" oznako iz renderiranja
- CILJ oznaka ostane samo na zadnjem sivem kamnu

### 7. Gumb hiška - OKROGEL (ne kvadraten)
```tsx
<Button
  className="h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
  size="icon"
>
  <Home className="h-7 w-7 text-white" />
</Button>
```

### 8. Gumb SKOK - z Zmajcek_111.png
```tsx
<div className="bg-sky-400 rounded-xl p-3 shadow-lg">
  <button
    onClick={handleNext}
    disabled={isJumping || phase === "complete" || showSentenceDialog}
    className="w-24 h-28 md:w-28 md:h-32 rounded-xl flex flex-col items-center justify-center
      bg-gradient-to-b from-green-400 to-green-600"
  >
    <img
      src={DRAGON_JUMP_BUTTON}
      alt="Skok"
      className="w-16 h-16 md:w-20 md:h-20 object-contain"
    />
    <span className="text-white font-bold text-sm mt-1">SKOK</span>
  </button>
</div>
```

### 9. Razporeditev čez celoten ekran

Uporaba podobnega pristopa kot MemoryGrid - dinamično izračunavanje velikosti na podlagi razpoložljivega prostora:

```typescript
const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

useEffect(() => {
  const updateSize = () => {
    setContainerSize({
      width: window.innerWidth,
      height: window.innerHeight - 160  // Odštej spodnji del za kontrole
    });
  };
  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, []);

// Dinamične velikosti
const columns = 4;  // 4 stolpci (START + 3 besede)
const rows = 5;     // 5 vrstic (START + 4 povedi)

const calculatedStoneSize = useMemo(() => {
  if (containerSize.width === 0) return null;
  
  const availableWidth = containerSize.width - 100;  // Margine
  const availableHeight = containerSize.height - 100;
  
  const sizeByWidth = Math.floor(availableWidth / columns / 1.15);
  const sizeByHeight = Math.floor(availableHeight / rows / 1.2);
  
  return Math.min(sizeByWidth, sizeByHeight, isMobile ? 100 : 140);
}, [containerSize, isMobile]);
```

### 10. Mobilna verzija - landscape fullscreen
Podobno kot pri Spomin igri:
- Avtomatsko fullscreen in landscape lock
- Prilagojena velikost elementov
- Prikaz sporočila za obračanje telefona, če je v portrait načinu

---

## Spremembe v datoteki

**Datoteka:** `src/components/games/PonoviPovedGame.tsx`

### Povzetek vseh sprememb:

1. **STONE_POSITIONS**: Zmanjšaj na 17 elementov (odstrani zadnji sivi kamen)
2. **STONE_IMAGES**: Zamenjaj URL-je z novimi `-Photoroom.png` slikami
3. **DRAGON_JUMP_BUTTON**: Dodaj konstanto za `Zmajcek_111.png`
4. **getDragonPixelPosition**: Popravi, da zmaj sedi na kamnu
5. **containerSize + useEffect**: Dodaj dinamično merjenje velikosti okna
6. **calculatedStoneSize**: Izračunaj velikost na podlagi prostora
7. **Home gumb**: Spremeni iz `rounded-xl` v `rounded-full`
8. **SKOK gumb**: Uporabi `DRAGON_JUMP_BUTTON` sliko
9. **Odstrani pokal**: Odstrani "🏆" in "CILJ" iz zgornjega kamna
10. **Mobilna podpora**: Dodaj fullscreen/landscape lock kot pri Spomin

---

## Vizualizacija končnega rezultata

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    svetlomodro_ozadje.webp                          │
│                                                                     │
│   [SIV]  - samo CILJ oznaka, brez pokala                           │
│     ↑                                                               │
│   [RUM] [RDEČ] [ZEL] [SIV]  ← 4. poved                             │
│                                                                     │
│   [SIV] [ZEL] [RDEČ] [RUM]  ← 3. poved                             │
│                                                                     │
│   [RUM] [RDEČ] [ZEL] [SIV]  ← 2. poved                             │
│      🐉                                                             │
│   [ZEL] [RDEČ] [RUM] [SIV]  ← 1. poved                             │
│                                                                     │
│   [SIV] START                                                       │
│                                                                     │
│ ┌───┐      ┌───────┐┌───────┐┌───────┐           ┌──────────────┐  │
│ │🏠│      │ KUŽA  ││ VIDI  ││ KOST  │           │   🐉         │  │
│ └───┘      └───────┘└───────┘└───────┘           │   SKOK       │  │
│ okroglo                                          └──────────────┘  │
│ oranžno     kartice na sredini                   zeleno na modrem │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tehnična struktura

### Nova pot (17 kamnov):
```typescript
const STONE_POSITIONS: StonePosition[] = [
  { x: 0, y: 0, type: 'gray', isRest: false },  // START
  
  // Poved 1 (desno)
  { x: 0, y: 1, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 1, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 2, y: 1, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 3, y: 1, type: 'gray', isRest: true, sentenceIndex: 0 },
  
  // Poved 2 (levo) - začne od sive na desni
  { x: 3, y: 2, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 2, y: 2, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 1, y: 2, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 0, y: 2, type: 'gray', isRest: true, sentenceIndex: 1 },
  
  // Poved 3 (desno)
  { x: 0, y: 3, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 1, y: 3, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 2, y: 3, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 3, y: 3, type: 'gray', isRest: true, sentenceIndex: 2 },
  
  // Poved 4 (levo) - CILJ na sivi
  { x: 3, y: 4, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 4, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 1, y: 4, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  { x: 0, y: 4, type: 'gray', isRest: true, sentenceIndex: 3 },  // CILJ
];
```

**Opomba:** Glede na referenčno sliko je vrstni red barv: zelena → rdeča → rumena → siva (za vsako poved), ne rumena → rdeča → zelena kot je trenutno.
