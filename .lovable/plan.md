
# Načrt: Stran za pregled artikulacijskega testa (Session Review Page)

## Povzetek

Ustvarimo novo stran `/admin/tests/:sessionId` za logopede, ki omogoča sistematičen pregled posnetkov in ocenjevanje artikulacije otroka. Stran bo organizirana po glasovih v fonetičnem vrstnem redu.

---

## Arhitektura rešitve

### Ločitev odgovornosti

```text
┌─────────────────────────────────────────────────────────────────┐
│                        PREGLED SEJE                              │
│              /admin/tests/:sessionId                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Podatki otroka: Ime, Starost, Datum preverjanja         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ČRKA P  ▼                                               │    │
│  │  ├─ PAJEK  [▶ Play] [■ Stop]                           │    │
│  │  ├─ KAPA   [▶ Play] [■ Stop]                           │    │
│  │  └─ REP    [▶ Play] [■ Stop]                           │    │
│  │                                                         │    │
│  │  □ Možnost 1 (v pripravi)                              │    │
│  │  □ Možnost 2 (v pripravi)                              │    │
│  │  Komentar: [___________________]                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ČRKA S  ▼                                               │    │
│  │  ├─ SOK   [▶ Play] [■ Stop]                            │    │
│  │  ├─ OSA   [▶ Play] [■ Stop]                            │    │
│  │  └─ NOS   [▶ Play] [■ Stop]                            │    │
│  │                                                         │    │
│  │  ☑ Črko S izgovarja kot Š                              │    │
│  │  □ Črke S ne izgovarja                                 │    │
│  │  □ Prehitro izgovarja                                  │    │
│  │  □ Prepočasi izgovarja                                 │    │
│  │  Komentar: [___________________]                        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Razporeditev sej (Session 1-5)

Odločitev: **Zgodovina sej ostane na strani uporabnika** (`/admin/users/:parentId/:childId`).

- Stran `/admin/tests/:sessionId` prikazuje **samo eno preverjanje** (sejo)
- V bazi `articulation_test_sessions` ima vsaka seja svoj ID
- Ko uporabnik naredi novo preverjanje, se ustvari nova seja v bazi
- Za vsakega otroka bo lahko do 5 sej
- Na strani uporabnika (AdminUserDetail) logoped vidi vse seje in lahko izbira med njimi

---

## Struktura datotek

```text
src/
├── pages/admin/
│   └── AdminSessionReview.tsx          # NOVA - glavna stran za pregled seje
├── components/admin/
│   ├── SessionReviewHeader.tsx         # NOVA - header z podatki otroka
│   ├── LetterAccordion.tsx             # NOVA - zložljiv sklop za vsako črko
│   ├── RecordingPlayer.tsx             # NOVA - predvajalnik za posamezen posnetek
│   └── EvaluationCheckboxes.tsx        # NOVA - check boxi za ocenjevanje
├── hooks/
│   └── useSessionReview.ts             # NOVA - hook za pridobivanje podatkov seje
└── data/
    └── evaluationOptions.ts            # NOVA - definicije check boxov po črkah
```

---

## Komponente

### 1. AdminSessionReview.tsx (Nova stran)

Glavna stran, ki:
- Pridobi podatke o seji iz `articulation_test_sessions`
- Pridobi posnetke iz Supabase Storage
- Organizira posnetke po črkah v fonetičnem vrstnem redu
- Omogoča shranjevanje ocen v bazo

### 2. LetterAccordion.tsx

Zložljiva sekcija za vsako črko:
- Naslov: "ČRKA P", "ČRKA S", itd.
- Vsebuje 3 posnetke (za 3 besede)
- Check boxi za tipične napake
- Polje za dodaten komentar

### 3. RecordingPlayer.tsx

Preprost predvajalnik zvoka:
- Gumb Play/Pause
- Gumb Stop (reset)
- Ime datoteke (beseda)
- Vizualni indikator predvajanja

### 4. EvaluationCheckboxes.tsx

Check boxi za ocenjevanje:

**Za črko S (definirani):**
```typescript
{
  letter: 'S',
  options: [
    { id: 's_as_sh', label: 'Črko S izgovarja kot Š' },
    { id: 's_missing', label: 'Črke S ne izgovarja' },
    { id: 's_too_fast', label: 'Prehitro izgovarja' },
    { id: 's_too_slow', label: 'Prepočasi izgovarja' },
  ]
}
```

**Za vse ostale črke:**
```typescript
{
  letter: 'P', // B, M, T, D, K, G, N, H, V, J, F, L, Z, C, Š, Ž, Č, R
  options: [
    { id: 'option_1', label: 'V pripravi', disabled: true },
    { id: 'option_2', label: 'V pripravi', disabled: true },
    { id: 'option_3', label: 'V pripravi', disabled: true },
    { id: 'option_4', label: 'V pripravi', disabled: true },
  ]
}
```

---

## Hook: useSessionReview.ts

```typescript
interface SessionReviewData {
  session: {
    id: string;
    childId: string;
    parentId: string;
    status: string;
    submittedAt: string | null;
  };
  child: {
    name: string;
    age: number | null;
    gender: string | null;
  };
  parent: {
    firstName: string | null;
    lastName: string | null;
  };
  recordingsByLetter: Map<string, Recording[]>;
  // Ocene shranjene v bazi
  evaluations: Map<string, LetterEvaluation>;
}

interface Recording {
  letter: string;
  word: string;
  wordIndex: number;
  path: string;
  filename: string;
}

interface LetterEvaluation {
  selectedOptions: string[];
  comment: string;
}
```

---

## Baza podatkov

### Nova tabela: `articulation_evaluations`

Za shranjevanje ocen logopedov potrebujemo novo tabelo:

```sql
CREATE TABLE public.articulation_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.articulation_test_sessions(id) ON DELETE CASCADE,
  letter CHAR(2) NOT NULL,
  selected_options TEXT[] DEFAULT '{}',
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, letter)
);

-- RLS policies
ALTER TABLE public.articulation_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logopedi lahko berejo ocene svojih sej"
ON public.articulation_evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = session_id
    AND s.assigned_to IN (
      SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Logopedi lahko ustvarijo ocene svojih sej"
ON public.articulation_evaluations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = session_id
    AND s.assigned_to IN (
      SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Logopedi lahko posodobijo ocene svojih sej"
ON public.articulation_evaluations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    WHERE s.id = session_id
    AND s.assigned_to IN (
      SELECT id FROM logopedist_profiles WHERE user_id = auth.uid()
    )
  )
);
```

---

## Routing

Posodobitev v `AdminRoutes.tsx`:

```typescript
// Nova lazy komponenta
const AdminSessionReview = lazy(() => import('@/pages/admin/AdminSessionReview'));

// Nova ruta namesto trenutne
<Route 
  path="tests/:sessionId" 
  element={
    <AdminLayoutWrapper>
      <AdminSessionReview />
    </AdminLayoutWrapper>
  } 
/>
```

---

## Fonetični vrstni red

Posnetki bodo organizirani po tem vrstnem redu:

```text
P → B → M → T → D → K → G → N → H → V → J → F → L → S → Z → C → Š → Ž → Č → R
```

Za vsako črko 3 besede (iz `articulationTestData.ts`).

---

## UI/UX

### Videz strani

1. **Header** - Podatki otroka
   - Ime otroka, starost, spol
   - Datum preverjanja
   - Gumb "Nazaj"

2. **Accordion po črkah** - 20 sekcij
   - Vsaka sekcija zložljiva
   - Po privzetku vse zaprte
   - Klik odpre sekcijo

3. **Znotraj vsake sekcije:**
   - 3 posnetki z gumbi Play/Stop
   - 4 check boxi (specifični za S, "v pripravi" za ostale)
   - Tekstovno polje za komentar

4. **Footer** - Akcijski gumbi
   - "Shrani ocene" - shrani v bazo
   - "Zaključi pregled" - označi sejo kot completed

### Barve in stili

- Uporaba obstoječih Shadcn komponent
- Accordion iz `@radix-ui/react-accordion`
- Checkbox iz Shadcn UI
- Konsistentnost z obstoječim admin portalom

---

## Obravnava 5 sej

Vsak otrok lahko naredi do 5 preverjanj:

1. **V bazi**: Vsaka seja ima svoj `articulation_test_sessions` zapis
2. **V Storage**: Vsaka seja ima svojo mapo `Seja-1`, `Seja-2`, itd.
3. **V adminu**: 
   - "Moji pregledi" prikazuje zadnje oddano sejo
   - "Vsa preverjanja" prikazuje vse seje
   - Stran uporabnika prikazuje celotno zgodovino sej

---

## Koraki implementacije

1. **Baza podatkov**
   - Ustvari tabelo `articulation_evaluations`
   - Dodaj RLS politike

2. **Hook useSessionReview**
   - Pridobi podatke seje
   - Pridobi posnetke iz storage
   - Organiziraj po črkah

3. **Komponente**
   - `EvaluationCheckboxes` - definicije check boxov
   - `RecordingPlayer` - predvajalnik zvoka
   - `LetterAccordion` - zložljiva sekcija
   - `SessionReviewHeader` - header

4. **Glavna stran**
   - `AdminSessionReview` - sestavljena stran

5. **Routing**
   - Posodobi `AdminRoutes.tsx`

6. **Shranjevanje**
   - Implementiraj shranjevanje ocen
   - Implementiraj zaključitev pregleda

---

## Tehnične podrobnosti

### Parsanje imen datotek posnetkov

Ime datoteke: `S-39-SOK-2026-01-15T17-32-57-092Z.webm`

```typescript
function parseRecordingFilename(filename: string): {
  letter: string;
  wordIndex: number;
  word: string;
} | null {
  const match = filename.match(/^([A-ZČŠŽćčžšđĐ]+)-(\d+)-([A-ZČŠŽ]+)-/i);
  if (!match) return null;
  return {
    letter: match[1].toUpperCase(),
    wordIndex: parseInt(match[2], 10),
    word: match[3].toUpperCase(),
  };
}
```

### Grupiranje posnetkov po črkah

```typescript
const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'];

function groupRecordingsByLetter(recordings: StorageFile[]): Map<string, Recording[]> {
  const grouped = new Map<string, Recording[]>();
  
  // Inicializiraj vse črke
  PHONETIC_ORDER.forEach(letter => grouped.set(letter, []));
  
  recordings.forEach(file => {
    const parsed = parseRecordingFilename(file.name);
    if (parsed) {
      const letterRecordings = grouped.get(parsed.letter) || [];
      letterRecordings.push({
        letter: parsed.letter,
        word: parsed.word,
        wordIndex: parsed.wordIndex,
        path: file.path,
        filename: file.name,
      });
      grouped.set(parsed.letter, letterRecordings);
    }
  });
  
  // Sortiraj posnetke znotraj vsake črke po wordIndex
  grouped.forEach((recordings, letter) => {
    recordings.sort((a, b) => a.wordIndex - b.wordIndex);
  });
  
  return grouped;
}
```
