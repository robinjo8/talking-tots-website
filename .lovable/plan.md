

# Načrt: Nova igra "Ponovi Poved" (Repeat the Sentence)

## Pregled igre

Nova govorna terapevtska igra za otroke 3+, kjer otrok vadi ponavljanje tri-besednih povedi. Zmajček skače po barvnih kamnih vzdolž linearne poti, otrok pa ponavlja posamezne besede in nato cele povedi.

---

## Tehnična arhitektura

### Struktura datotek za implementacijo

```text
src/
├── data/
│   └── ponoviPovedConfig.ts          # Konfiguracija povedi za vsako črko
├── pages/
│   └── PonoviPoved.tsx               # Izbira črke (kot Labirint.tsx)
├── components/
│   ├── games/
│   │   └── PonoviPovedGame.tsx       # Glavna komponenta igre
│   └── routing/
│       └── PonoviPovedRouter.tsx     # Dinamični router
└── config/
    └── routes.tsx                    # Nove poti
```

---

## Del 1: Posodobitev GamesList.tsx

Dodati novo kartico za igro:

```typescript
{
  id: "ponovi-poved",
  title: "PONOVI POVED",
  description: "Ponovi tri-besedne povedi in vadi izgovorjavo",
  image: "[slika zmajčka]",
  gradient: "from-dragon-green/20 to-app-teal/20",
  customBackground: "radial-gradient(...)",
  path: "/govorne-igre/ponovi-poved",
  available: true,
  imageScale: "90%"
}
```

---

## Del 2: Konfiguracija povedi (ponoviPovedConfig.ts)

Za črko K (začetna implementacija):

```typescript
export interface SentenceWord {
  word: string;       // Beseda za prikaz
  image: string;      // Slika v bucketu 'slike'
  audio: string;      // Zvok v bucketu 'zvocni-posnetki'
}

export interface Sentence {
  words: [SentenceWord, SentenceWord, SentenceWord];  // 3 besede
  fullSentence: string;  // "Kača ima kapo."
  audio: string;         // Zvok cele povedi
}

export interface PonoviPovedConfig {
  letter: string;
  displayLetter: string;
  sentences: Sentence[];  // 4 povedi
}

// Povedi za K
export const ponoviPovedK: PonoviPovedConfig = {
  letter: "k",
  displayLetter: "K",
  sentences: [
    {
      words: [
        { word: "Kača", image: "kaca1.webp", audio: "kaca.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "kapo", image: "kapa1.webp", audio: "kapo.m4a" }
      ],
      fullSentence: "Kača ima kapo.",
      audio: "kaca_ima_kapo.m4a"  // Potrebno posneti
    },
    {
      words: [
        { word: "Kuža", image: "kuza1.webp", audio: "kuza.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "kost", image: "kost1.webp", audio: "kost.m4a" }
      ],
      fullSentence: "Kuža vidi kost.",
      audio: "kuza_vidi_kost.m4a"
    },
    {
      words: [
        { word: "Koza", image: "koza1.webp", audio: "koza.m4a" },
        { word: "riše", image: "Stickman_risati.webp", audio: "rise.m4a" },
        { word: "krog", image: "krog1.webp", audio: "krog.m4a" }
      ],
      fullSentence: "Koza riše krog.",
      audio: "koza_rise_krog.m4a"
    },
    {
      words: [
        { word: "Kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "koruzo", image: "koruza1.webp", audio: "koruzo.m4a" }
      ],
      fullSentence: "Kokoš je koruzo.",
      audio: "kokos_je_koruzo.m4a"
    }
  ]
};
```

### Razpoložljive slike v bucketu 'slike':

| Beseda | Slika | Obstaja |
|--------|-------|---------|
| Kača | kaca1.webp | Da |
| Kapo (kapa) | kapa1.webp | Da |
| Kuža | kuza1.webp | Da |
| Kost | kost1.webp | Da |
| Koza | koza1.webp | Da |
| Krog | krog1.webp | Da |
| Kokoš | kokos1.webp | Da |
| Koruzo (koruza) | koruza1.webp | Da |
| ima | Stickman_imeti.webp | Da |
| vidi | Stickman_gledati.webp | Da |
| riše | Stickman_risati.webp | Da |
| je | Stickman_jesti.webp | Da |

---

## Del 3: Stran za izbiro črke (PonoviPoved.tsx)

Enaka struktura kot `Labirint.tsx`:
- Zelena hero sekcija z naslovom "Ponovi poved"
- Progress bar za dnevni napredek
- Bela sekcija z 9 karticami črk (C, Č, K, L, R, S, Š, Z, Ž)
- Vsaka kartica vodi na `/govorne-igre/ponovi-poved/:letter`

---

## Del 4: Glavna komponenta igre (PonoviPovedGame.tsx)

### Vizualni elementi

```text
┌─────────────────────────────────────────────────────────────┐
│                       Belo ozadje                           │
│                                                             │
│  START ──── ○ ──── ○ ──── ○ ──── 🌿 ──── ...               │
│              1      2      3   (poved)                      │
│   🐉                                                        │
│  zmaj                                                       │
│                                                             │
│                    [Slika besede]                           │
│                                                             │
│              ▶ NAPREJ                                       │
└─────────────────────────────────────────────────────────────┘
```

### Elementi poti (12 kamni + 4 "počivališča"):

```text
START → Kamen1 → Kamen2 → Kamen3 → Počivališče1 →
        Kamen4 → Kamen5 → Kamen6 → Počivališče2 →
        Kamen7 → Kamen8 → Kamen9 → Počivališče3 →
        Kamen10 → Kamen11 → Kamen12 → CILJ
```

### Stanje igre (State Machine)

```typescript
type GamePhase = 
  | "start"           // Zmaj na START poziciji
  | "word"            // Zmaj na kamnu, prikaže sliko + predvaja besedo
  | "sentence"        // Zmaj na počivališču, predvaja celo poved
  | "complete";       // Igra končana

interface GameState {
  phase: GamePhase;
  currentSentence: number;  // 0-3
  currentWord: number;      // 0-2 (znotraj povedi)
  dragonPosition: number;   // 0-15 (vseh pozicij)
}
```

### Animacija zmaja (framer-motion)

```typescript
// Skok z lokom (arc trajectory)
const jumpVariants = {
  jump: {
    x: [0, targetX/2, targetX],
    y: [0, -80, 0],  // Lok navzgor
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};
```

### Logika korakov

1. **Korak besede (Word Step)**:
   - Zmaj skoči na naslednji kamen
   - Prikaže se slika besede (npr. kača)
   - Predvaja se zvok besede
   - Gumb "NAPREJ" čaka na pritisk

2. **Korak povedi (Sentence Step)**:
   - Po 3 besedah zmaj skoči na "počivališče" (travnik)
   - Predvaja se celotna poved
   - Otrok ponovi celo poved
   - Gumb "NAPREJ" za naslednji sklop

3. **Zaključek**:
   - Po 4 povedih prikaže PuzzleSuccessDialog
   - Zvezdica in napredek se beležita

---

## Del 5: Router (PonoviPovedRouter.tsx)

```typescript
export default function PonoviPovedRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/ponovi-poved" replace />;
  }
  
  const config = getPonoviPovedConfig(letter);
  
  if (!config) {
    return <Navigate to="/govorne-igre/ponovi-poved" replace />;
  }
  
  return <PonoviPovedGame config={config} />;
}
```

---

## Del 6: Posodobitev routes.tsx

```typescript
// V lazy loaded sekciji
const PonoviPoved = lazy(() => import("@/pages/PonoviPoved"));
const PonoviPovedRouter = lazy(() => import("@/components/routing/PonoviPovedRouter"));

// V Routes
<Route path="/govorne-igre/ponovi-poved" element={<ProtectedLazyRoute><PonoviPoved /></ProtectedLazyRoute>} />
<Route path="/govorne-igre/ponovi-poved/:letter" element={<ProtectedLazyRoute><PonoviPovedRouter /></ProtectedLazyRoute>} />
```

---

## Vizualni stil

### Ozadje
- Belo ozadje (kot zahtevano)
- Čista, preprosta postavitev

### Kamni (stones)
- Barviti okrogli/ovalni elementi
- Barve: zelena, modra, roza, oranžna (izmenjevanje)
- Animacija utripanja pri aktivnem kamnu

### Počivališča (meadows)
- Manjši travnik/trata med skupinami
- Svetlo zelena barva
- Rahlo večji od kamnov

### Zmaj
- `Zmajcek_1.webp` iz bucketa 'zmajcki'
- Velikost prilagojena mobilnim/namiznim napravam
- Animiran skok (arc trajectory)

### Slika besede
- Centrirana na zaslonu
- Bel okvir s senco
- Responsive velikost

---

## Zvočni elementi

### Obstoječi zvoki (v bucketu 'zvocni-posnetki')
- Vse posamezne besede: kaca.m4a, kapa.m4a, kuza.m4a, itd.
- Glagoli: ima.m4a, vidi.m4a, rise.m4a, je.m4a

### Potrebni novi zvoki (za snemanje)
Za vsako poved je potreben posnetek celotne povedi:
- kaca_ima_kapo.m4a
- kuza_vidi_kost.m4a
- koza_rise_krog.m4a
- kokos_je_koruzo.m4a

Če teh posnetkov še ni, igra lahko začasno predvaja vse 3 besede zaporedoma.

---

## Responzivnost

### Mobilne naprave
- Landscape način (zaklep orientacije)
- Fullscreen način
- Kamni manjši, pot bolj kompaktna
- Slika besede manjša

### Namizje
- Pot čez celotno širino zaslona
- Večje slike in kamni
- Naslov igre na vrhu

---

## Floating meni (kot pri drugih igrah)

- Oranžni okrogli gumb spodaj levo
- Opcije:
  - 🏠 Nazaj (potrditveni dialog)
  - 🔄 Nova igra
  - 📖 Navodila

---

## Povzetek implementacije

| Korak | Datoteka | Opis |
|-------|----------|------|
| 1 | ponoviPovedConfig.ts | Konfiguracija povedi za K (osnova) |
| 2 | GamesList.tsx | Nova kartica za igro |
| 3 | PonoviPoved.tsx | Stran za izbiro črke |
| 4 | PonoviPovedGame.tsx | Glavna komponenta igre |
| 5 | PonoviPovedRouter.tsx | Dinamični router |
| 6 | routes.tsx | Nove poti |
| 7 | BreadcrumbNavigation.tsx | Drobtinice za novo igro |

---

## Začetna implementacija (samo črka K)

Prvo implementiram samo za črko K s 4 povedmi:
1. Kača ima kapo.
2. Kuža vidi kost.
3. Koza riše krog.
4. Kokoš je koruzo.

Ostale črke (C, Č, L, R, S, Š, Z, Ž) bodo dodane v prihodnjih iteracijah.

---

## Opomba o zvočnih posnetkih

Trenutno manjkajo zvočni posnetki celih povedi. Implementacija bo uporabila:
1. **Če obstaja posnetek celotne povedi** → predvaja ga
2. **Če ne obstaja** → predvaja vse 3 besede zaporedoma z zamikom 500ms

To omogoča takojšnje delovanje igre, medtem ko se posnetki dodajajo.

