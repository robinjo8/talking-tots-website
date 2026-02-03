

# Načrt: Izboljšan prikaz aktivnosti otroka na strani napredka

## Povzetek

Trenutni prikaz "Zgodovina aktivnosti" prikazuje kronološki seznam vseh izvedenih aktivnosti. To ni pregledno za logopeda, ki želi videti **katere igre otrok najpogosteje igra**.

Nov dizajn bo prikazoval **agregirane podatke po igrah** v obliki lepih kartic s:
- Ime igre/vaje
- Število odigranih (pod imenom)
- Progress bar z deležem med vsemi aktivnostmi
- Brez ikon (čist, minimalističen dizajn)

---

## Popoln seznam iger in vaj

### IGRE (10)

| # | Ime za prikaz | Vzorec activity_subtype | Barva |
|---|---------------|-------------------------|-------|
| 1 | Sestavljanka | `puzzle_*` | purple |
| 2 | Drsna sestavljanka | `sliding_puzzle_*` | blue |
| 3 | Labirint | `labirint-*` | green |
| 4 | Spomin | črke: `C`, `Č`, `K`, `L`, `R`, `S`, `Š`, `Z`, `Ž` | orange |
| 5 | Zaporedja | `sequence_*` | teal |
| 6 | Povezi pare | `povezi-pare-*` ali `matching_*` | pink |
| 7 | Igra ujemanja | `matching_*` (3+ stolpcev) | rose |
| 8 | Vrti kolo | `wheel-*` | amber |
| 9 | Bingo | `artikulacija_bingo_*` | yellow |
| 10 | Met kocke | `smesne-povedi-*` | indigo |

### VAJE (3)

| # | Ime za prikaz | Vzorec activity_subtype | Barva |
|---|---------------|-------------------------|-------|
| 1 | Vaje za jezik | `vaje_motorike_govoril` | red |
| 2 | Ponovi poved | `ponovi-poved-*` | cyan |
| 3 | Video navodila | `video-navodila-*` | slate |

---

## Vizualni koncept (brez ikon)

```text
┌─────────────────────────────────────────────────────────────┐
│  Pregled aktivnosti                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  IGRE                                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐│
│  │ Sestavljanka     │ │ Spomin           │ │ Labirint     ││
│  │ 12 odigranih     │ │ 8 odigranih      │ │ 5 odigranih  ││
│  │ ▓▓▓▓▓▓▓░░░ 40%   │ │ ▓▓▓▓▓░░░░ 27%   │ │ ▓▓▓░░░░ 17% ││
│  └──────────────────┘ └──────────────────┘ └──────────────┘│
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐│
│  │ Drsna sestav.    │ │ Povezi pare      │ │ Zaporedja    ││
│  │ 3 odigranih      │ │ 2 odigranih      │ │ 4 odigranih  ││
│  │ ▓▓░░░░░░░░ 10%   │ │ ▓░░░░░░░░ 6%    │ │ ▓▓░░░░░ 13% ││
│  └──────────────────┘ └──────────────────┘ └──────────────┘│
│  ... ostale igre ...                                        │
│                                                             │
│  VAJE                                                       │
│  ┌──────────────────┐ ┌──────────────────┐                 │
│  │ Vaje za jezik    │ │ Ponovi poved     │                 │
│  │ 15 opravljenih   │ │ 4 opravljenih    │                 │
│  │ ▓▓▓▓▓▓▓▓░ 79%    │ │ ▓▓░░░░░░░ 21%   │                 │
│  └──────────────────┘ └──────────────────┘                 │
│                                                             │
│  [ Prikaži zgodovino ▼ ]  (za ogled kronološkega seznama)  │
└─────────────────────────────────────────────────────────────┘
```

---

## Podatkovni model

```typescript
interface ActivityAggregate {
  gameKey: string;          // "puzzle", "memory", "labirint", itd.
  displayName: string;      // "Sestavljanka", "Spomin", itd.
  count: number;            // Število odigranih
  percentage: number;       // Delež od skupnega števila
  color: string;            // Tailwind barva za progress bar
}
```

---

## Tehnične spremembe

### 1. Nova komponenta: `ActivityBreakdownCard.tsx`

Komponenta za prikaz porazdelitve aktivnosti:
- Prikaže kartice v responzivni mreži (2-3 stolpcev odvisno od širine)
- Vsaka kartica ima ime, število in progress bar
- Kartice razdeljene v sekcije: IGRE in VAJE
- Brez ikon - čist tipografski dizajn

### 2. Nova pomožna funkcija: `aggregateActivities()`

Funkcija za agregacijo `activity_subtype` v 10 iger + 3 vaje:

```typescript
// Mapiranje vzorcev v kategorije
const categoryPatterns = [
  { pattern: /^puzzle_/, key: 'puzzle', name: 'Sestavljanka', type: 'game' },
  { pattern: /^sliding_puzzle_/, key: 'sliding_puzzle', name: 'Drsna sestavljanka', type: 'game' },
  { pattern: /^labirint-/, key: 'labirint', name: 'Labirint', type: 'game' },
  { pattern: /^(C|Č|K|L|R|S|Š|Z|Ž)$/, key: 'memory', name: 'Spomin', type: 'game' },
  { pattern: /^sequence_/, key: 'sequence', name: 'Zaporedja', type: 'game' },
  { pattern: /^povezi-pare-|^matching_/, key: 'povezi_pare', name: 'Povezi pare', type: 'game' },
  { pattern: /^wheel-/, key: 'wheel', name: 'Vrti kolo', type: 'game' },
  { pattern: /^artikulacija_bingo_/, key: 'bingo', name: 'Bingo', type: 'game' },
  { pattern: /^smesne-povedi-/, key: 'met_kocke', name: 'Met kocke', type: 'game' },
  { pattern: /^vaje_motorike_govoril$/, key: 'tongue_gym', name: 'Vaje za jezik', type: 'exercise' },
  { pattern: /^ponovi-poved-/, key: 'ponovi_poved', name: 'Ponovi poved', type: 'exercise' },
  { pattern: /^video-navodila-/, key: 'video', name: 'Video navodila', type: 'exercise' },
];
```

### 3. Posodobitev `AdminChildProgress.tsx`

- Zamenjaj trenutni seznam z novo komponento `ActivityBreakdownCard`
- Dodaj zložljiv (collapsible) razdelek za kronološki seznam
- Uporabi obstoječe podatke iz `history` query-ja

---

## Seznam datotek

| Datoteka | Akcija |
|----------|--------|
| `src/components/progress/ActivityBreakdownCard.tsx` | **NOVA** - glavna komponenta za prikaz |
| `src/utils/activityAggregation.ts` | **NOVA** - pomožne funkcije za agregacijo |
| `src/pages/admin/AdminChildProgress.tsx` | Posodobi - uporabi novo komponento |

---

## Dizajn kartic (brez ikon)

```tsx
<Card className={cn(
  "p-4 border-l-4",
  `border-l-${color}-500 bg-gradient-to-br from-${color}-50 to-white`
)}>
  <div className="flex items-center justify-between mb-2">
    <div>
      <h4 className="font-semibold text-sm text-gray-900">{displayName}</h4>
      <p className="text-xs text-muted-foreground">
        {count} {count === 1 ? 'odigrana' : count < 5 ? 'odigrane' : 'odigranih'}
      </p>
    </div>
    <span className={cn("text-lg font-bold", `text-${color}-600`)}>
      {percentage}%
    </span>
  </div>
  <Progress value={percentage} className={cn("h-2", `bg-${color}-100`)} />
</Card>
```

---

## Barve po kategorijah

| Kategorija | Tailwind barva |
|------------|----------------|
| Sestavljanka | purple |
| Drsna sestavljanka | blue |
| Labirint | green |
| Spomin | orange |
| Zaporedja | teal |
| Povezi pare | pink |
| Igra ujemanja | rose |
| Vrti kolo | amber |
| Bingo | yellow |
| Met kocke | indigo |
| Vaje za jezik | red |
| Ponovi poved | cyan |
| Video navodila | slate |

---

## Rezultat

Po implementaciji bo stran `/admin/children/:id/progress` prikazovala:

1. **Glava** z imenom otroka
2. **UnifiedProgressDisplay** (pokali, zmajčki, zvezdice)
3. **Pregled aktivnosti** - 10 iger + 3 vaje v karticah z deleži
4. **Zgodovina aktivnosti** (zložljiv seznam) - kronološki seznam za detajle
5. **Gumb** "Začni delo z otrokom"

Logoped bo takoj videl:
- Katere igre otrok najraje igra
- Katere igre še ni igral (0%)
- Kje potrebuje več dela

