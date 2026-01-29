

## Popravek kritične napake v Edge funkciji

### Problem

Edge funkcija `transcribe-articulation` ima **sintaktično napako** - spremenljivka `normalizedTarget` je deklarirana dvakrat v funkciji `isWordAccepted`.

To je bila **moja napaka** pri implementaciji dinamičnih pragov za zahtevnost. Dodal sem novo vrstico za izračun praga, vendar sem pozabil odstraniti staro deklaracijo.

### Napaka v kodi (vrstice 91-94)

```typescript
// TRENUTNO (NAPAČNO):
const normalizedTarget = normalizeText(targetWord);  // 1. deklaracija
const similarityThreshold = getThresholdForWord(normalizedTarget.length, difficulty);
const normalizedTranscribed = normalizeText(transcribed);
const normalizedTarget = normalizeText(targetWord);  // 2. deklaracija - PODVOJENA!
```

### Popravek

```typescript
// PRAVILNO:
const normalizedTranscribed = normalizeText(transcribed);
const normalizedTarget = normalizeText(targetWord);  // Samo ena deklaracija
const similarityThreshold = getThresholdForWord(normalizedTarget.length, difficulty);
```

### Potek napake

```text
Uporabnik izgovori besedo
        │
        ▼
Edge funkcija se poskusi zagnati
        │
        ▼
┌─────────────────────────────────────────┐
│ SyntaxError: Identifier 'normalizedTarget' │
│ has already been declared                   │
└─────────────────────────────────────────┘
        │
        ▼
Funkcija vrne napako (500)
        │
        ▼
transcriptionResult = null
        │
        ▼
hasRecorded = true, ampak accepted = undefined
        │
        ▼
showNext = false (ker transcriptionResult?.accepted !== true)
        │
        ▼
Gumb "Naprej" se NE prikaže, slika postane siva
```

---

### Datoteke za posodobitev

**`supabase/functions/transcribe-articulation/index.ts`**

Odstrani podvojeno deklaracijo in popravi vrstni red:

| Vrstica | Sprememba |
|---------|-----------|
| 91-94 | Odstrani prvo `const normalizedTarget`, ohrani samo drugo |

### Pravilna koda funkcije `isWordAccepted`

```typescript
function isWordAccepted(
  transcribed: string,
  targetWord: string,
  acceptedVariants: string[],
  difficulty: string = "srednja"
): { accepted: boolean; matchType: string; confidence: number } {
  const normalizedTranscribed = normalizeText(transcribed);
  const normalizedTarget = normalizeText(targetWord);  // SAMO ENKRAT
  const similarityThreshold = getThresholdForWord(normalizedTarget.length, difficulty);
  
  // ... ostala logika ostane enaka
}
```

---

### Testiranje

Po popravku:
1. Uporabnik izgovori besedo "PAJEK"
2. Edge funkcija uspesno transkribira
3. `transcriptionResult.accepted = true` (ali false z besedilom)
4. Prikaže se gumb "Naprej" ali sporočilo z napačno besedo
5. Uporabnik lahko nadaljuje na naslednjo besedo

