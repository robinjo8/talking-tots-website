

# Plan: Posodobitev ocenjevalnega sistema na strani za pregled preverjanja izgovorjave

## Povzetek

Posodobiti stran `/admin/tests/:sessionId` z:
1. Novimi checkboxi za črko Ž (in druge črke)
2. 5-stopenjsko ocenjevalno lestvico v obliki razširljivih (collapsible) sekcij
3. Krajšim audio predvajalnikom
4. Popravkom prikaza besed s šumniki (ŽOGA namesto ZOGA)
5. Popravkom predvajanja zvoka (signed URL)

---

## 1. Posodobitev checkboxov za črko Ž

**Datoteka:** `src/data/evaluationOptions.ts`

Dodati specifične checkboxe za črko Ž:
- Ž izgovarja kot Z
- ne izgovarja  
- odlično izgovarja
- zamenjuje za Š

Enako strukturo uporabiti za ostale črke (npr. S, Š, Č itd.) po potrebi.

---

## 2. Nova 5-stopenjska ocenjevalna lestvica

**Nova komponenta:** `src/components/admin/ArticulationRatingScale.tsx`

Lestvica bo sestavljena iz 5 razširljivih sekcij (collapsible), vsaka z:
- Checkbox za izbiro
- Kratek naslov
- Razširljiv opis s podrobnostmi

| Stopnja | Naslov | Podrobnosti (ob razširitvi) |
|---------|--------|------------------------------|
| 1 | Neizvedljivo / odsotno | Glasu ne tvori, otrok glasu sploh ne izvede, nadomesti z drugim glasom ali ga izpusti |
| 2 | Močno odstopanje | Nepravilen glas, artikulacija je napačna, glas je težko prepoznaven, pogosta zamenjava (npr. /s/ → /š/) |
| 3 | Delno pravilno | Delno pravilen glas, osnovna oblika glasu je prepoznavna, napaka je prisotna (lega, zven, napetost …), razumljivost je srednja |
| 4 | Skoraj pravilno | Skoraj pravilen glas, manjša netočnost, pravilna artikulacija večino časa, napaka se pojavi občasno ali v težjih položajih |
| 5 | Pravilno | Pravilna artikulacija, glas je jasno in stabilno izveden, ustrezen položaj govornega aparata, brez opaznih napak |

**Oblika UI:**
- Uporaba `Collapsible` komponente iz Radix UI
- Vsaka stopnja je vrstica z checkboxom, naslovom in puščico za razširitev
- Ob kliku na puščico/naslov se prikaže podroben opis
- Samo ena stopnja je lahko izbrana (radio-button vedenje)

---

## 3. Posodobitev EvaluationCheckboxes komponente

**Datoteka:** `src/components/admin/EvaluationCheckboxes.tsx`

Struktura komponente:
```text
┌─────────────────────────────────────────┐
│ CHECKBOXI (2x2 mreža)                   │
│ ☐ Ž izgovarja kot Z   ☐ ne izgovarja   │
│ ☐ odlično izgovarja   ☐ zamenjuje za Š │
├─────────────────────────────────────────┤
│ 5-STOPENJSKA LESTVICA                   │
│ ☐ 1 Neizvedljivo / odsotno        ▼    │
│    └─ Glasu ne tvori, otrok...          │
│ ☐ 2 Močno odstopanje              ▼    │
│ ☐ 3 Delno pravilno                ▼    │
│ ☐ 4 Skoraj pravilno               ▼    │
│ ☐ 5 Pravilno                      ▼    │
├─────────────────────────────────────────┤
│ KOMENTAR                                │
│ [Textarea za dodatne opombe...]         │
└─────────────────────────────────────────┘
```

- Props razširiti za `rating?: number` in `onRatingChange: (rating: number | undefined) => void`

---

## 4. Krajši audio predvajalnik

**Datoteka:** `src/components/admin/RecordingPlayer.tsx`

Spremembe:
- Odstraniti slider za glasnost (obdržati samo mute gumb)
- Kompaktnejša oblika v eni vrstici
- Zmanjšati padding in margins

Pred:
```text
[BESEDA] [▶] [0:00] [━━━━━━━━━━━━━━━━━━━━━━━━] [0:05] [🔊] [━━━━━━]
```

Po:
```text
[BESEDA] [▶] [0:00] [━━━━━━━━━━━] [0:05] [🔊]
```

---

## 5. Popravek prikaza besed s šumniki

**Datoteka:** `src/data/evaluationOptions.ts`

Dodati novo funkcijo za pridobitev pravilnega imena besede:
```typescript
const wordIndexToWordMap = new Map<number, string>();
// Iz articulationData zgraditi mapiranje wordIndex → pravilna beseda

export function getWordFromWordIndex(wordIndex: number): string {
  return wordIndexToWordMap.get(wordIndex) || 'NEZNANO';
}
```

**Datoteka:** `src/hooks/useSessionReview.ts`

Uporabiti `getWordFromWordIndex(parsed.wordIndex)` namesto `parsed.word` za prikaz pravilnih besed:
- ŽOGA namesto ZOGA
- ROŽA namesto ROZA  
- JEŽ namesto JEZ

---

## 6. Popravek predvajanja zvoka

**Datoteka:** `src/hooks/useSessionReview.ts`

Problem: `getPublicUrl` vrne javni URL, ki ne deluje če bucket ni javno dostopen.

Rešitev: Uporabiti `createSignedUrl` za pridobitev začasnega avtoriziranega URL-ja:
```typescript
const { data: signedUrlData } = await supabase.storage
  .from('uporabniski-profili')
  .createSignedUrl(`${targetFolder}/${file.name}`, 3600); // 1 ura veljavnosti
```

---

## 7. Posodobitev podatkovne strukture

**Datoteka:** `src/hooks/useSessionReview.ts`

Razširiti vmesnik `LetterEvaluation`:
```typescript
export interface LetterEvaluation {
  selectedOptions: string[];
  comment: string;
  rating?: number; // 1-5 stopenjska ocena
}
```

**Datoteka:** `src/pages/admin/AdminSessionReview.tsx`

Posodobiti `handleEvaluationChange` za vključitev ratinga.

---

## Vrstni red implementacije

1. `src/data/evaluationOptions.ts` - Dodati checkboxe za Ž + funkcijo za pravilna imena besed
2. `src/hooks/useSessionReview.ts` - Signed URL + pravilna imena besed + rating v vmesniku
3. `src/components/admin/ArticulationRatingScale.tsx` - Nova komponenta za 5-stopenjsko lestvico
4. `src/components/admin/EvaluationCheckboxes.tsx` - Integracija lestvice
5. `src/components/admin/RecordingPlayer.tsx` - Kompaktnejša oblika
6. `src/components/admin/LetterAccordion.tsx` - Posodobitev za rating
7. `src/pages/admin/AdminSessionReview.tsx` - Posodobitev za shranjevanje ratinga

---

## Tehnični detajli

### Shranjevanje ratinga v bazo

Preveriti ali tabela `articulation_evaluations` že ima stolpec `rating`. Če ne, bo potrebno:
```sql
ALTER TABLE articulation_evaluations ADD COLUMN rating INTEGER;
```

Posodobiti `saveEvaluation` funkcijo za vključitev ratinga.

### Stiliranje

Uporabiti obstoječe Tailwind klase in komponente:
- `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` iz `@radix-ui/react-collapsible`
- `Checkbox` iz `src/components/ui/checkbox.tsx`
- `ChevronDown` ikona iz `lucide-react` za indikacijo razširitve

