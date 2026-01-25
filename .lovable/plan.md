
# Načrt: Prestavitev generiranih poročil in prikaz vseh poročil organizacije

## Povzetek ugotovitev

### Trenutno stanje

1. **Generirana poročila na strani Podrobnosti uporabnika:**
   - Sekcija "Generirana poročila" je trenutno del desnega stolpca pod "Poročila" (vrstice 774-821)
   - Uporabnik želi to prestaviti pod "Dokumenti" na levi strani z naslovom "Generirana poročila logopeda"

2. **Zakaj poročila niso vidna na /admin/reports:**
   - Ko generirate PDF, se datoteka shrani SAMO v Supabase Storage (`uporabniski-profili` bucket)
   - V tabelo `logopedist_reports` se NE vstavi noben zapis
   - Stran `/admin/reports` bere podatke iz tabele `logopedist_reports`, ki je prazna

3. **Omejitev RLS politik:**
   - Trenutna RLS politika dovoljuje logopedu vpogled SAMO v svoja poročila
   - Potrebna je sprememba za vpogled v vsa poročila znotraj organizacije

---

## Spremembe

### 1. Prestavitev sekcije "Generirana poročila" pod "Dokumenti"

V datoteki `AdminUserDetail.tsx`:
- Odstrani sekcijo "Generirana poročila" iz desnega stolpca (pod "Poročila")
- Dodaj novo sekcijo "Generirana poročila logopeda" v levem stolpcu, pod "Dokumenti" kartice
- Uporabi enak slog prikaza kot trenutno (zeleno ozadje, ikone za ogled/prenos/bris)

**Nova postavitev:**
```text
┌─────────────────────────────────────────────────────────────────────┐
│  Levi stolpec                    │  Desni stolpec                  │
├──────────────────────────────────┼──────────────────────────────────┤
│  📄 Dokumenti                    │  📋 Poročila                     │
│     - dokument1.pdf              │     [Urejevalnik poročila]       │
│     - dokument2.pdf              │     [Gumbi: Shrani, Naloži,      │
│                                  │      Generiraj]                  │
│  📝 Generirana poročila logopeda │     Shranjena poročila:          │
│     - porocilo-zak-2026.pdf      │     - osnutek1.txt               │
│                                  │                                  │
│  🎤 Preverjanje izgovorjave      │                                  │
│     [Posnetki...]                │                                  │
└──────────────────────────────────┴──────────────────────────────────┘
```

### 2. Shranjevanje poročila v bazo ob generiranju PDF

V funkciji `handleGeneratePdf` v `AdminUserDetail.tsx`:
- Po uspešnem nalaganju PDF v storage, vstavi zapis v tabelo `logopedist_reports`
- Shrani: `logopedist_id`, `session_id`, `summary`, `pdf_url`, `status: 'draft'`

```typescript
// Po uploadu PDF-ja v storage:
const { data: reportRecord, error: insertError } = await supabase
  .from('logopedist_reports')
  .insert({
    logopedist_id: logopedistProfile.id,
    session_id: reportData.selectedSessionId,
    summary: reportData.ugotovitve?.substring(0, 200) || '',
    findings: { anamneza: reportData.anamneza, ugotovitve: reportData.ugotovitve },
    recommendations: reportData.predlogVaj || '',
    next_steps: reportData.opombe || '',
    pdf_url: filePath,
    status: 'draft'
  })
  .select()
  .single();
```

### 3. RLS politika za vpogled v poročila organizacije

Nova SQL migracija za posodobitev RLS politike:

```sql
-- Odstrani staro politiko
DROP POLICY IF EXISTS "Logopedists can view own reports" ON public.logopedist_reports;

-- Nova politika: logoped vidi vsa poročila v svoji organizaciji
CREATE POLICY "Logopedists can view organization reports"
  ON public.logopedist_reports FOR SELECT
  USING (
    logopedist_id IN (
      SELECT lp.id 
      FROM public.logopedist_profiles lp
      WHERE lp.organization_id = public.get_user_organization_id(auth.uid())
    )
  );
```

### 4. Posodobitev hook-a za pridobivanje poročil organizacije

V `useLogopedistReports.ts`:
- Namesto filtriranja po `logopedist_id = profile.id`
- Pridobi vse logopedist_id-je v isti organizaciji in filtriraj po njih
- Dodaj ime logopeda k vsakemu poročilu za razločevanje

```typescript
// Pridobi vse logopede v organizaciji
const { data: orgLogopedists } = await supabase
  .from('logopedist_profiles')
  .select('id, first_name, last_name')
  .eq('organization_id', profile.organization_id);

const logopedistIds = orgLogopedists?.map(l => l.id) || [profile.id];

// Pridobi vsa poročila za te logopede
const { data: reports } = await supabase
  .from('logopedist_reports')
  .select('*')
  .in('logopedist_id', logopedistIds)
  .order('created_at', { ascending: false });
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/pages/admin/AdminUserDetail.tsx` | Posodobi | 1) Prestavi sekcijo generiranih poročil pod Dokumenti, 2) Dodaj vstavljanje v bazo ob generiranju PDF |
| `src/hooks/useLogopedistReports.ts` | Posodobi | Pridobivaj vsa poročila v organizaciji, dodaj ime logopeda |
| Nova migracija | Ustvari | Posodobi RLS politiko za vpogled v poročila organizacije |
| `src/pages/admin/AdminReports.tsx` | Posodobi | Dodaj stolpec "Logoped" za prikaz avtorja poročila |

---

## Tehnični diagram

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Generiranje PDF poročila                                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Uporabnik klikne "Generiraj"                                         │
│           │                                                              │
│           ▼                                                              │
│  2. generateReportPdf() → ustvari PDF blob                               │
│           │                                                              │
│           ▼                                                              │
│  3. Upload v Supabase Storage                                            │
│     (uporabniski-profili/{parentId}/{childId}/Generirana-porocila/)      │
│           │                                                              │
│           ▼                                                              │
│  4. INSERT v logopedist_reports tabelo ← NOVO!                           │
│     (logopedist_id, session_id, pdf_url, summary, status)                │
│           │                                                              │
│           ▼                                                              │
│  5. Poročilo vidno na /admin/reports                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Prikaz poročil na /admin/reports                                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Trenutno:                                                               │
│  useLogopedistReports → WHERE logopedist_id = moj_id                     │
│  Rezultat: Samo moja poročila                                            │
│                                                                          │
│  Po spremembi:                                                           │
│  useLogopedistReports → WHERE logopedist_id IN (vsi v moji org.)         │
│  Rezultat: Vsa poročila v organizaciji                                   │
│                                                                          │
│  + RLS politika omogoča branje poročil celotne organizacije              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```
