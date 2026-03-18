

# Dodatno preverjanje izgovorjave — Implementacijski načrt

## Odgovor na odprto vprašanje

Povezava NI potrebna. Logoped bo dodelil dodatno preverjanje **iz pregleda obstoječega preverjanja izgovorjave** (stran `/admin/tests/{sessionId}`). Tam že ima `child_id` iz uporabniškega portala. Dodatno preverjanje bo delovalo enako kot navadno — ustvari se `articulation_test_session` z `child_id`, posnetki gredo v isto čakalno vrsto, logoped jih pregleda na enak način.

---

## 1. Baza podatkov (3 migracije)

### A) Nova tabela `additional_test_assignments`
```sql
CREATE TABLE public.additional_test_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,           -- otrok iz uporabniškega portala (children tabela)
  assigned_by uuid NOT NULL,        -- logopedist_profiles.id
  status text NOT NULL DEFAULT 'assigned', -- 'assigned' | 'in_progress' | 'completed'
  session_id uuid,                  -- articulation_test_sessions.id ko otrok začne test
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
```

### B) Nova tabela `additional_test_words`
```sql
CREATE TABLE public.additional_test_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES additional_test_assignments(id) ON DELETE CASCADE,
  word text NOT NULL,
  image text NOT NULL,
  audio text,
  letter text,              -- črka/glas (za grupiranje)
  sort_order integer DEFAULT 0
);
```

### C) Stolpec na `articulation_test_sessions`
```sql
ALTER TABLE articulation_test_sessions 
  ADD COLUMN additional_assignment_id uuid REFERENCES additional_test_assignments(id);
```
Nullable — obstoječe seje ostanejo nedotaknjene.

### D) Enum razširitev
```sql
ALTER TYPE notification_type ADD VALUE 'additional_test_completed';
```

### E) RLS politike
- `additional_test_assignments`: logopedi INSERT/SELECT za svojo organizacijo; starši SELECT za `child_id` svojih otrok
- `additional_test_words`: branje za logopede in starše (preko assignment_id)
- Na `articulation_test_sessions`: obstoječe politike že pokrivajo parent INSERT/UPDATE/SELECT

---

## 2. Admin portal — gumb na pregledu seje

### Na `AdminSessionReview.tsx`
- Dodaj gumb **"Dodeli dodatno preverjanje"** v header ali na dno strani
- Klik odpre dialog/drawer z iskalnikom besed

### Nova komponenta `AdditionalTestAssignDialog.tsx`
- Iskalnik: tekstovno polje za filtriranje besed iz `artikulacijaVajeConfig.ts` (vse besede iz wheel + bingo iger, ~200+) IN besed iz `articulationTestData.ts` (60 besed)
- Prikaz: seznam s sličico, besedo, checkboxom
- Grupiranje po črkah (C, Č, K, L, R, S, Š, Z, Ž)
- Gumb **"Dodeli uporabniku"** — shrani v `additional_test_assignments` + `additional_test_words`
- `child_id` se vzame iz trenutne seje

---

## 3. Uporabniški portal — nova kartica

### `ActivityOptions.tsx`
- Nov hook `useAdditionalTestAssignment.ts` preveri ali ima `selectedChild` aktivno dodelitev (`status = 'assigned'` ali `'in_progress'`)
- Če da, prikaže kartico **"Dodatno preverjanje"** (enak stil kot "Preverjanje izgovorjave", druga slika/barva)
- Ko otrok zaključi, kartica izgine

### Nova stran `/dodatno-preverjanje` (`DodatnoPreverjanje.tsx`)
- Struktura identična `ArtikuacijskiTest.tsx`:
  - Info dialog: "Opravljate dodatno preverjanje izgovorjave za natančnejšo oceno govora."
  - Enak dizajn (slika, beseda, gumb za snemanje, progress grid)
  - Snemanje, shranjevanje posnetkov, nadaljevanje
- Razlike:
  - Besede se naložijo iz `additional_test_words` (namesto fiksnih 20/60)
  - Ustvari `articulation_test_session` z `additional_assignment_id` in `source_type: 'parent'`
  - Ob zaključku posodobi `additional_test_assignments.status = 'completed'`

### Nov hook `useAdditionalTestSession.ts`
- Podoben `useUserSessionManager.ts`
- Inicializira/nadaljuje sejo z `additional_assignment_id`
- Naloži besede iz `additional_test_words` in jih pretvori v format za `useArticulationTestNew`

---

## 4. Obvestila

### DB trigger ali frontend INSERT ob zaključku
- Vstavi v `notifications`:
  - `type: 'additional_test_completed'`
  - `title: 'Dodatno preverjanje zaključeno'`
  - `message: '{ime otroka} je opravil/a dodatno preverjanje izgovorjave'`
  - `link: '/admin/pending'`
  - `recipient_id: logopedist.user_id` (ki je dodelil)
  - `organization_id` iz logopedovega profila
- Dashboard zvonček in `/admin/notifications` že berejo vse notification_type — nova vrednost se bo samodejno prikazala

---

## 5. Admin pregled rezultatov

Dodatno preverjanje ustvari normalno `articulation_test_session` — posnetki se shranijo v isto Storage pot, seja se prikaže v `/admin/pending`, logoped jo prevzame in oceni na enak način kot navadno preverjanje. Stolpec `additional_assignment_id` omogoča razlikovanje, da se na UI prikaže oznaka "Dodatno preverjanje".

### `AdminPending.tsx` in `AdminSessionReview.tsx`
- Dodaj vizualno oznako (badge) za seje z `additional_assignment_id` — npr. "Dodatno preverjanje"
- Ostala logika (prevzem, ocenjevanje) ostane enaka

---

## 6. Prikaz na strani podrobnosti otroka

### `AdminLogopedistChildDetail.tsx` — NE
Ker dodelitev poteka iz pregleda seje (uporabniški portal otrok), ta stran ni vključena.

### Na pregledu uporabniškega otroka (opcijsko)
Če logoped želi videti pretekle dodatne dodelitve, se te lahko prikažejo na `AdminSessionReview` strani ali v `AdminTests` seznamu s filtrom.

---

## Povzetek sprememb

### Nove datoteke (~5):
1. `src/pages/DodatnoPreverjanje.tsx` — stran za test
2. `src/hooks/useAdditionalTestSession.ts` — upravljanje sej
3. `src/hooks/useAdditionalTestAssignment.ts` — preverjanje aktivne dodelitve
4. `src/components/admin/AdditionalTestAssignDialog.tsx` — dialog za izbiro besed
5. SQL migracija (tabele, RLS, enum)

### Spremenjene datoteke (~4):
1. `src/pages/admin/AdminSessionReview.tsx` — gumb za dodelitev + badge
2. `src/components/ActivityOptions.tsx` — nova kartica
3. `src/components/routing/AdminRoutes.tsx` ali routes config — nova ruta
4. `src/pages/admin/AdminPending.tsx` — badge za dodatno preverjanje

### Nedotaknjene datoteke:
- `ArtikuacijskiTest.tsx` — brez sprememb
- `useArticulationTestNew.ts` — se re-uporabi (read-only)
- `useUserSessionManager.ts` — brez sprememb
- `articulationTestData.ts` — brez sprememb

