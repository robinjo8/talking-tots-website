

# Načrt: Posodobitev pragov težavnosti za Levenshtein podobnost

## Povzetek

Posodobitev pragov podobnosti za preverjanje izgovorjave na novih vrednostih:

| Dolžina besede | NIZKA | SREDNJA | VISOKA |
|----------------|-------|---------|--------|
| 3 črke | 0.0 (0%) | 0.33 (33%) | 0.65 (65%) |
| 4 črke | 0.0 (0%) | 0.50 (50%) | 0.70 (70%) |
| 5 črk | 0.0 (0%) | 0.50 (50%) | 0.75 (75%) |
| 6 črk | 0.0 (0%) | 0.50 (50%) | 0.65 (65%) |

## Spremembe

### 1. Frontend hook (src/hooks/useArticulationSettings.ts)

**Vrstica 24-28** - Posodobitev konstante `SIMILARITY_THRESHOLDS`:

```typescript
// PREJ:
const SIMILARITY_THRESHOLDS: Record<DifficultyLevel, Record<number, number>> = {
  nizka: { 3: 0.33, 4: 0.25, 5: 0.35, 6: 0.30 },
  srednja: { 3: 0.65, 4: 0.50, 5: 0.50, 6: 0.50 },
  visoka: { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 },
};

// POTEM:
const SIMILARITY_THRESHOLDS: Record<DifficultyLevel, Record<number, number>> = {
  nizka: { 3: 0.0, 4: 0.0, 5: 0.0, 6: 0.0 },
  srednja: { 3: 0.33, 4: 0.50, 5: 0.50, 6: 0.50 },
  visoka: { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 },
};
```

### 2. Backend Edge function (supabase/functions/transcribe-articulation/index.ts)

**Vrstica 74-78** - Posodobitev funkcije `getThresholdForWord`:

```typescript
// PREJ:
const thresholds: Record<string, Record<number, number>> = {
  nizka:   { 3: 0.33, 4: 0.25, 5: 0.35, 6: 0.30 },
  srednja: { 3: 0.65, 4: 0.50, 5: 0.50, 6: 0.50 },
  visoka:  { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 },
};

// POTEM:
const thresholds: Record<string, Record<number, number>> = {
  nizka:   { 3: 0.0, 4: 0.0, 5: 0.0, 6: 0.0 },
  srednja: { 3: 0.33, 4: 0.50, 5: 0.50, 6: 0.50 },
  visoka:  { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 },
};
```

## Vpliv sprememb

| Težavnost | Učinek |
|-----------|--------|
| **Nizka** | Vsaka izgovorjena beseda bo sprejeta (0% prag) - idealno za mlajše otroke |
| **Srednja** | Zmeren prag - 33% za kratke besede, 50% za daljše |
| **Visoka** | Strožji prag - 65-75% podobnosti |

## Datoteke za spremembo

| Datoteka | Vrstice | Sprememba |
|----------|---------|-----------|
| `src/hooks/useArticulationSettings.ts` | 24-28 | Posodobitev pragov |
| `supabase/functions/transcribe-articulation/index.ts` | 74-78 | Posodobitev pragov |

## Opomba

Po spremembi Edge funkcije bo potrebno ponovno uvesti funkcijo (deploy), da se spremembe uveljavijo na strežniku.

