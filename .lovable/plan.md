

## Spremembe v poročilu — LetterSelector

### Problem
1. LetterSelector ponuja vseh 20 črk, moralo bi biti samo 9: C, Č, K, L, R, S, Š, Z, Ž
2. Pozicija glasu se izbira z dropdown (ena možnost), namesto tega bi moral biti **checkbox** za izbiro več pozicij hkrati
3. R ima 3 opcije (Začetek, Sredina/konec, Začetne vaje), ostale črke 2 (Začetek, Sredina/konec)

### Plan

#### 1. Sprememba podatkovnega modela (`LetterSelector.tsx`)
- `ALL_LETTERS` → samo `['C', 'Č', 'K', 'L', 'R', 'S', 'Š', 'Z', 'Ž']`
- `RecommendedLetter.position` → `positions: ('start' | 'middle-end' | 'initial-exercises')[]` (množina, array)
- Ko se črka doda, privzeto `positions: ['start']`
- Dropdown zamenjati s checkboxi (Checkbox komponenta že obstaja)

#### 2. UI sprememba — checkboxi namesto dropdown
Za vsako izbrano črko prikaz:
- Badge z X za odstranitev
- ☑ Začetek  ☑ Sredina/konec (checkboxi)
- Za R dodatno: ☑ Začetne vaje
- Vsaj en checkbox mora biti označen (validacija)

#### 3. Posodobitev formatirnih funkcij (`LetterSelector.tsx`)
- `formatRecommendedLettersText` — prilagoditi za `positions[]` (npr. "glas R na začetku besed in na sredini/koncu besed")
- `convertLegacyLetters` — stare podatke `position: string` pretvoriti v `positions: [string]`

#### 4. Posodobitev `formatCombinedRecommendationText` (`ReportTemplateEditor.tsx`)
- Prilagoditi za novo strukturo `positions[]`

#### 5. Posodobitev shranjevanja/nalaganja (`AdminUserDetail.tsx`, `AdminLogopedistChildDetail.tsx`)
- Podatki se shranjujejo v `report_details.letters` — format se spremeni v `positions[]`
- Nalaganje starih poročil: `convertLegacyLetters` pretvori stari `position` v `positions: [position]`

#### 6. PDF generiranje (`generateReportPdf.ts`)
- Že uporablja `formatCombinedRecommendationText` — bo delovalo po posodobitvi te funkcije

### Datoteke za urejanje
1. `src/components/admin/LetterSelector.tsx` — podatkovni model, UI (checkboxi), formatirne funkcije
2. `src/components/admin/ReportTemplateEditor.tsx` — `formatCombinedRecommendationText`
3. `src/pages/admin/AdminUserDetail.tsx` — morebitna prilagoditev nalaganja
4. `src/pages/admin/AdminLogopedistChildDetail.tsx` — enako

