

# Načrt: Prenova dizajna igre "Ponovi Poved"

## Pregled zahtev

Na podlagi referenčne slike je potrebna popolna prenova vizualnega dizajna in interakcijske logike igre. Glavne spremembe vključujejo:

1. **Cik-cak pot navzgor** (namesto linearne poti)
2. **Uporaba slik kamnov** iz bucketa `slike`
3. **Menjava slike zmaja** glede na smer gibanja
4. **Kartice besed spodaj** ki se kumulativno prikazujejo
5. **Pop-up dialog za poved** z odštevanjem za "snemanje"
6. **Zeleni gumb za skok** z ikono zmaja

---

## Vizualna postavitev (po referenčni sliki)

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    [SIV]  ←─────────────────────────────────────── CILJ     │
│                                                             │
│    [RUMEN] [RDEC] [ZELEN] [SIV]    ← 4. poved (vrstica 4)   │
│                                                             │
│    [SIV] [ZELEN] [RDEC] [RUMEN]    ← 3. poved (vrstica 3)   │
│                                                             │
│    [RUMEN] [RDEC] [ZELEN] [SIV]    ← 2. poved (vrstica 2)   │
│                                                             │
│    🐉 [RUMEN] [RDEC] [ZELEN] [SIV] ← 1. poved (vrstica 1)   │
│   [SIV]                                                     │
│   START                                                     │
│                                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │
│  │ 🐉     │ │ Kača   │ │  ima   │ │  kapo  │  ← Kartice   │
│  │(gumb)  │ │        │ │        │ │        │    besed     │
│  └────────┘ └────────┘ └────────┘ └────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## Logika poti (20 pozicij)

### Struktura poti:

| Pozicija | Vrstica | Tip | Kamen | Smer |
|----------|---------|-----|-------|------|
| 0 | 0 | START | siv | - |
| 1 | 1 | beseda 1 | rumen | desno → |
| 2 | 1 | beseda 2 | rdeč | desno → |
| 3 | 1 | beseda 3 | zelen | desno → |
| 4 | 1 | POVED 1 | siv | desno → |
| 5 | 2 | beseda 1 | rumen | ← levo |
| 6 | 2 | beseda 2 | rdeč | ← levo |
| 7 | 2 | beseda 3 | zelen | ← levo |
| 8 | 2 | POVED 2 | siv | ← levo |
| 9 | 3 | beseda 1 | rumen | desno → |
| 10 | 3 | beseda 2 | rdeč | desno → |
| 11 | 3 | beseda 3 | zelen | desno → |
| 12 | 3 | POVED 3 | siv | desno → |
| 13 | 4 | beseda 1 | rumen | ← levo |
| 14 | 4 | beseda 2 | rdeč | ← levo |
| 15 | 4 | beseda 3 | zelen | ← levo |
| 16 | 4 | POVED 4 | siv | ← levo |
| 17 | 5 | CILJ | siv | - |

### Vizualizacija smeri po vrsticah:

- **Vrstica 1 (poved 1)**: START → levo, potem desno → [rumen] → [rdeč] → [zelen] → [siv REST]
- **Vrstica 2 (poved 2)**: ← levo [siv REST] ← [zelen] ← [rdeč] ← [rumen]
- **Vrstica 3 (poved 3)**: desno → [rumen] → [rdeč] → [zelen] → [siv REST]
- **Vrstica 4 (poved 4)**: ← levo [siv REST] ← [zelen] ← [rdeč] ← [rumen]
- **Vrstica 5**: CILJ [siv]

---

## Slike kamnov (iz bucket `slike`)

| Tip kamna | Datoteka | Uporaba |
|-----------|----------|---------|
| Siv | `kamen_siv.webp` | START, počivališča (po vsaki povedi), CILJ |
| Rumen | `kamen_rumen.webp` | 1. beseda (osebek) |
| Rdeč | `kamen_rdec.webp` | 2. beseda (povedek) |
| Zelen | `kamen_zelen.webp` | 3. beseda (predmet) |

**URL-ji:**
```typescript
const STONE_IMAGES = {
  gray: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_siv.webp",
  yellow: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rumen.webp",
  red: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rdec.webp",
  green: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_zelen.webp",
};
```

---

## Slike zmaja (iz bucket `zmajcki`)

| Situacija | Datoteka | Opis |
|-----------|----------|------|
| Gibanje desno | `Zmajcek_4.png` | Zmaj gleda v desno |
| Pristal desno (počivališče na desni) | `Zmajcek_4_1.PNG` | Zmaj gleda v levo |
| Gibanje levo | `Zmajcek_4_1.PNG` | Zmaj gleda v levo |
| Pristal levo (počivališče na levi) | `Zmajcek_4.png` | Zmaj gleda v desno |

**Logika menjave:**
```typescript
const getDragonImage = () => {
  const isOnRightSide = [4, 12].includes(dragonPosition); // Siva počivališča na desni
  const isOnLeftSide = [8, 16].includes(dragonPosition);  // Siva počivališča na levi
  const isMovingRight = currentRow % 2 === 1;  // Lihe vrstice = desno
  
  if (isOnRightSide || !isMovingRight) {
    return "Zmajcek_4_1.PNG"; // Gleda levo
  }
  return "Zmajcek_4.png"; // Gleda desno
};
```

---

## Kartice besed (spodnji del)

### Struktura kartic:
1. **Kartica zmaja (gumb za skok)** - zeleno ozadje z ikono zmaja
2. **Kartice besed** - bel okvir, slika + beseda pod sliko

### Prikaz kartic:
- Na začetku: samo kartica zmaja (gumb)
- Po 1. skoku: kartica zmaja + kartica 1. besede
- Po 2. skoku: kartica zmaja + kartica 1. + kartica 2. besede
- Po 3. skoku: kartica zmaja + vse 3 kartice → odpre se pop-up

```typescript
// Kartice ki so vidne
const visibleCards = phase === "start" 
  ? [] 
  : currentSentence.words.slice(0, currentWordIndex + 1);
```

---

## Pop-up dialog za poved (na sivem kamnu)

Ko zmaj pristane na sivem kamnu (počivališče), se odpre dialog:

```text
┌─────────────────────────────────────────┐
│                                         │
│   ┌─────┐  ┌─────┐  ┌─────┐            │
│   │ 🐍  │  │ ima │  │ 🧢  │            │
│   │Kača │  │     │  │kapo │            │
│   └─────┘  └─────┘  └─────┘            │
│                                         │
│   "Kača ima kapo."                      │
│                                         │
│   ┌─────────────────────┐               │
│   │  🔊 PONOVI (3s)     │               │
│   └─────────────────────┘               │
│                                         │
│   ┌─────────────────────┐               │
│   │      NAPREJ         │               │
│   └─────────────────────┘               │
│                                         │
└─────────────────────────────────────────┘
```

### Logika gumba "PONOVI":
1. Ob kliku začne 3-sekundno odštevanje (3... 2... 1...)
2. Med odštevanjem je gumb onemogočen
3. Po koncu odštevanja se dialog samodejno zapre (ali ostane odprt za klik "NAPREJ")

```typescript
const [isRecording, setIsRecording] = useState(false);
const [countdown, setCountdown] = useState(3);

const handleRepeat = () => {
  setIsRecording(true);
  setCountdown(3);
  
  const interval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setIsRecording(false);
        return 3;
      }
      return prev - 1;
    });
  }, 1000);
};
```

---

## Gumb za skok (kartica zmaja)

Namesto klasičnega gumba "NAPREJ" uporabimo kartico z zmajčkom:

```jsx
<button 
  onClick={handleNext}
  disabled={isJumping}
  className="w-24 h-32 bg-gradient-to-b from-green-300 to-green-500 
             rounded-xl shadow-lg flex items-center justify-center
             hover:scale-105 transition-transform"
>
  <img 
    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4.png"
    alt="Skok"
    className="w-20 h-20 object-contain"
  />
</button>
```

---

## Tehnična implementacija

### Spremembe v `PonoviPovedGame.tsx`:

1. **Novi state-i:**
```typescript
const [showSentenceDialog, setShowSentenceDialog] = useState(false);
const [isRecording, setIsRecording] = useState(false);
const [countdown, setCountdown] = useState(3);
const [collectedWords, setCollectedWords] = useState<SentenceWord[]>([]);
```

2. **Izračun pozicije zmaja (grid namesto linearne poti):**
```typescript
// Pozicije kamnov v mreži
const STONE_POSITIONS = [
  { x: 0, y: 4, type: 'gray' },   // 0: START
  { x: 1, y: 3, type: 'yellow' }, // 1: beseda 1
  { x: 2, y: 3, type: 'red' },    // 2: beseda 2
  { x: 3, y: 3, type: 'green' },  // 3: beseda 3
  { x: 4, y: 3, type: 'gray' },   // 4: počivališče 1
  { x: 3, y: 2, type: 'yellow' }, // 5: beseda 1 (nazaj)
  // ... itd.
];
```

3. **Renderiranje mreže kamnov:**
```typescript
const renderStoneGrid = () => {
  return STONE_POSITIONS.map((pos, index) => (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: `${pos.x * 100}px`,
        bottom: `${pos.y * 80}px`,
      }}
    >
      <img 
        src={STONE_IMAGES[pos.type]}
        alt="kamen"
        className="w-16 h-12 object-contain"
      />
    </div>
  ));
};
```

4. **Kartice besed spodaj:**
```typescript
<div className="fixed bottom-4 left-4 right-4 flex gap-4">
  {/* Gumb zmaj */}
  <button onClick={handleNext} className="...">
    <img src={dragonJumpButtonImage} />
  </button>
  
  {/* Kartice zbranih besed */}
  {collectedWords.map((word, idx) => (
    <div key={idx} className="bg-white rounded-xl border-2 border-green-500 p-2">
      <img src={getImageUrl(word.image)} className="w-20 h-20" />
      <p className="text-center font-bold">{word.word}</p>
    </div>
  ))}
</div>
```

---

## Struktura datotek za spremembe

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/PonoviPovedGame.tsx` | Popolna prenova vizualnega prikaza in logike |
| `src/data/ponoviPovedConfig.ts` | Brez sprememb (podatki ostajajo enaki) |

---

## Povzetek glavnih sprememb

1. **Pot**: Iz linearne v cik-cak mrežo (5 vrstic × 5 stolpcev)
2. **Kamni**: Iz CSS krogov v slike (`kamen_*.webp`)
3. **Zmaj**: Menjava slike glede na smer (`Zmajcek_4.png` ↔ `Zmajcek_4_1.PNG`)
4. **Gumb za skok**: Zelena kartica z zmajčkom namesto "NAPREJ" gumba
5. **Kartice besed**: Kumulativni prikaz spodaj
6. **Pop-up za poved**: Dialog s 3-sekundnim odštevanjem za "snemanje"
7. **Animacija skoka**: Premik v mrežni koordinatni sistem

---

## Predviden rezultat

Po implementaciji bo igra vizualno ustrezala referenčni sliki:
- Zmajček bo začel na sivem kamnu spodaj levo
- Skakal bo po barvnih kamnih navzgor v cik-cak vzorcu
- Kartice besed se bodo nabirale spodaj
- Na vsakem sivem kamnu (počivališču) se bo odprl pop-up za ponavljanje povedi
- Zmaj bo spreminjal orientacijo glede na smer gibanja

