
# Popravek napačnega mapiranja posnetkov in datumov preverjanja izgovorjave

## Identificirani problemi

### 1. Neskladje wordIndex med fonetičnim in abecednim vrstnim redom

**Vzrok**: Pri snemanju se uporablja `currentWordIndex` iz fonetično sortiranih podatkov (P, B, M, T, D, ...), pri parsiranju imen datotek v admin portalu pa se wordIndex mapira nazaj na abecedni vrstni red (B, C, Č, D, F, ...).

**Primer**:
- Uporabnik posname besedo "PAJEK" (črka P), ki ima v fonetičnem redu wordIndex = 0
- Shrani se kot `P-0-PAJEK-timestamp.webm`
- Admin portal parsira wordIndex 0 in ga mapira na abecedni vrstni red → črka B (namesto P)
- Zato se posnetek predvaja pod napačno črko

### 2. Dve ločeni seji za istega otroka

V bazi obstajata dve seji za otroka Žak:
| Seja ID | Datum | Status | Posnetki v Storage |
|---------|-------|--------|-------------------|
| d3742796-ad32-4880-90b3-f89767dfdb33 | 23.1.2026 | completed | Seja-1 (3 posnetki) |
| fc3dd757-5bd2-40e6-a0c6-e19aab3ffc03 | 28.1.2026 | pending | Seja-2 (60 posnetkov) |

Admin portal prikazuje sejo od 23.1. ker je to URL ki se pregleduje. Posnetki od 28.1. pripadajo drugi seji.

### 3. Nalaganje napačne mape posnetkov

Hook `useSessionReview.ts` išče posnetke v `Preverjanje-izgovorjave/` in vzame **zadnjo** (najnovejšo) mapo Seja-X. To pomeni, da za sejo od 23.1. prikazuje posnetke iz Seja-2 (od 28.1.) - napačna seja!

---

## Rešitev

### Korak 1: Popravi mapiranje wordIndex v evaluationOptions.ts

Spremeniti je potrebno funkcijo za generiranje mapiranja, da uporablja **fonetični** vrstni red namesto abecednega:

```typescript
// evaluationOptions.ts

// Fonetični vrstni red - enak kot v useArticulationTestNew
const PHONETIC_LETTER_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'];

// Sortiraj articulationData po fonetičnem redu pred generiranjem mapiranja
const sortedArticulationData = [...articulationData].sort((a, b) => {
  const indexA = PHONETIC_LETTER_ORDER.indexOf(a.letter.toUpperCase());
  const indexB = PHONETIC_LETTER_ORDER.indexOf(b.letter.toUpperCase());
  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});

// Dinamično mapiranje wordIndex → črka iz sortiranih podatkov
const wordIndexToLetterMap = new Map<number, string>();
const wordIndexToWordMap = new Map<number, string>();
let currentIndex = 0;
sortedArticulationData.forEach(letterData => {
  letterData.words.forEach(word => {
    wordIndexToLetterMap.set(currentIndex, letterData.letter);
    wordIndexToWordMap.set(currentIndex, word.text);
    currentIndex++;
  });
});
```

### Korak 2: Poveži sejo z ustrezno mapo posnetkov

V `useSessionReview.ts` je potrebno najti pravilno mapo Seja-X glede na **sessionNumber** shranjeno v seji, ne pa kar najnovejšo mapo.

**Opcija A**: Dodaj polje `session_number` v tabelo `articulation_test_sessions`

**Opcija B**: Uporabi datum seje za določitev pravilne mape (Seja-1 za prvo, Seja-2 za drugo, itd.)

Priporočam Opcijo A za jasnost in zanesljivost.

### Korak 3: Dodaj session_number v tabelo sej

Migracija:
```sql
ALTER TABLE articulation_test_sessions 
ADD COLUMN session_number INTEGER DEFAULT 1;

-- Posodobi obstoječe seje glede na vrstni red
UPDATE articulation_test_sessions ats
SET session_number = subq.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY child_id ORDER BY created_at) as rn
  FROM articulation_test_sessions
) subq
WHERE ats.id = subq.id;
```

### Korak 4: Posodobi useSessionReview.ts za uporabo session_number

```typescript
// V fetchSessionReviewData funkciji:
const sessionNumber = session.session_number || 1;
const targetFolder = `${storagePath}/Seja-${sessionNumber}`;

// Direktno uporabi to mapo namesto iskanja najnovejše
const { data: files, error: filesError } = await supabase.storage
  .from('uporabniski-profili')
  .list(targetFolder);
```

### Korak 5: Posodobi Edge funkcijo in hook za shranjevanje session_number

Pri ustvarjanju nove seje v bazi, shrani tudi `session_number`:

```typescript
// Pri ustvarjanju seje
const { data: newSession } = await supabase
  .from('articulation_test_sessions')
  .insert({
    child_id: childId,
    parent_id: userId,
    session_number: sessionNumber, // Dodaj to polje
    status: 'pending'
  });
```

---

## Rezultat po popravku

1. Posnetki se bodo pravilno prikazovali pod ustreznimi črkami v admin portalu
2. Vsaka seja bo povezana s pravilno mapo posnetkov (Seja-1, Seja-2, ...)
3. Admin portal bo prikazoval pravilne datume in posnetke za vsako sejo posebej
4. Ne bo več zmede med različnimi sejami istega otroka

## Obstoječi podatki

Posnetki shranjeni pred popravkom (wordIndex 51-59 v Seja-2) bodo še vedno napačno mapirani. Za te je potrebna ročna korekcija ali posebna migracija, ki preslika wordIndex iz fonetičnega v pravilni vrstni red.
