

## Popravek: Shranjevanje ocen in navigacija po zakljucku testa

### Prizadeti logopedi

| Logoped | Organizacija | Tip | Sej | Ocen | Status |
|---------|-------------|-----|-----|------|--------|
| Spela Kastelic | OS Test | school | 2 | 0 | NE DELUJE |
| Janez Novak | OS Test | school | 1 | 0 | NE DELUJE |
| Spela Kastelic | TomiTalk | internal | 1 | 20 | DELUJE |
| Robert Kujavec | TomiTalk | super_admin | - | - | DELUJE |
| Ema Erzar Vidmar | TomiTalk | internal | 0 | - | Bi imela tezavo pri INSERT/UPDATE za nesvoje seje |

### Vzrok

RLS politike na tabeli `articulation_evaluations`:
- **SELECT**: ima `is_internal_logopedist` politiko - zato interni logopedi VIDIJO ocene
- **INSERT/UPDATE**: nimata `is_internal_logopedist` niti organizacijske politike - preverja SAMO `assigned_to` match + subquery na `articulation_test_sessions`

Za OS Test logopede subquery na `articulation_test_sessions` verjetno ne vrne rezultatov, ker se RLS na tej tabeli aplicira rekurzivno.

Robert deluje ker ima `is_super_admin()` bypass v vseh politikah.

### Resitev

#### 1. SQL migracija - nove RLS politike za `articulation_evaluations`

Tri nove politike za organizacijske logopede:

```sql
-- INSERT za organizacijske logopede
CREATE POLICY "Org logopedists can create evaluations for org sessions"
ON articulation_evaluations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    JOIN logopedist_profiles lp ON lp.organization_id = s.organization_id
    WHERE s.id = articulation_evaluations.session_id
    AND lp.user_id = auth.uid()
  )
);

-- UPDATE za organizacijske logopede
CREATE POLICY "Org logopedists can update evaluations for org sessions"
ON articulation_evaluations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    JOIN logopedist_profiles lp ON lp.organization_id = s.organization_id
    WHERE s.id = articulation_evaluations.session_id
    AND lp.user_id = auth.uid()
  )
);

-- SELECT za organizacijske logopede
CREATE POLICY "Org logopedists can view evaluations for org sessions"
ON articulation_evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM articulation_test_sessions s
    JOIN logopedist_profiles lp ON lp.organization_id = s.organization_id
    WHERE s.id = articulation_evaluations.session_id
    AND lp.user_id = auth.uid()
  )
);
```

Dodatno, za interno logopedinje (Ema) ki nimajo `assigned_to` match:

```sql
-- INSERT za interne logopede
CREATE POLICY "Internal logopedists can create all evaluations"
ON articulation_evaluations FOR INSERT
WITH CHECK (is_internal_logopedist(auth.uid()));

-- UPDATE za interne logopede
CREATE POLICY "Internal logopedists can update all evaluations"
ON articulation_evaluations FOR UPDATE
USING (is_internal_logopedist(auth.uid()));
```

#### 2. `src/hooks/useSessionReview.ts` - dodaj `evaluatedBy` in logiranje

Funkcija `saveEvaluation` dobi nov parameter `evaluatedBy` (logopedist profile ID) in podrobno logiranje napak:

```text
// PREJ:
export async function saveEvaluation(
  sessionId, letter, selectedOptions, comment, rating?
)

// POTEM:
export async function saveEvaluation(
  sessionId, letter, selectedOptions, comment, rating?, evaluatedBy?
)
```

Dodaj `evaluated_by` v upsert payload in `console.log`/`console.error` za diagnostiko.

#### 3. `src/pages/admin/AdminSessionReview.tsx` - posreduj evaluatedBy

V `handleSaveLetter` (vrstica 91-97) in `handleSaveAll` (vrstica 126-132) dodaj `logopedistProfile?.id` kot zadnji parameter klica `saveEvaluation`.

#### 4. `src/components/admin/articulation/AdminArticulationCompletionDialog.tsx` - navigacija na pregled

Po zakljucku testa preusmeri na stran pregleda seje (`/admin/tests/{sessionId}`) namesto na delovni prostor. Dodaj `sessionId` prop:

```text
// PREJ:
interface AdminArticulationCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  childId: string;
  sessionNumber: number;
  onComplete?: () => Promise<void>;
}

// POTEM: dodaj sessionId prop
interface AdminArticulationCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  childId: string;
  sessionNumber: number;
  sessionId?: string;
  onComplete?: () => Promise<void>;
}
```

V `handleClose` po uspesnem shranjevanju navigiraj na `/admin/tests/${sessionId}` ce je sessionId na voljo.

#### 5. `src/pages/admin/AdminArtikulacijskiTest.tsx` - posreduj sessionId

Na vrstici 287-293 dodaj `sessionId={sessionInfo?.sessionId}` prop v `AdminArticulationCompletionDialog`. Posodobi `handleCloseCompletion` da ne navigira na workspace ampak pusti dialog da navigira.

### Datoteke za spremembo

- **Nova SQL migracija** - 5 novih RLS politik za `articulation_evaluations`
- **`src/hooks/useSessionReview.ts`** - `saveEvaluation` z `evaluatedBy` + logiranje
- **`src/pages/admin/AdminSessionReview.tsx`** - posreduj `logopedistProfile.id`
- **`src/components/admin/articulation/AdminArticulationCompletionDialog.tsx`** - navigacija na pregled
- **`src/pages/admin/AdminArtikulacijskiTest.tsx`** - posreduj `sessionId`

### Kaj ostane nespremenjeno

- Uporabniski portal (starsevski tok) - brez sprememb
- Obstojece ocene (20 ocen za TomiTalk sejo) - nespremenjene
- Generiranje PDF porocila - ostane rocno
- Dodajanje/brisanje otrok - brez sprememb
- Vse obstojece RLS politike ostanejo, dodajo se le nove

