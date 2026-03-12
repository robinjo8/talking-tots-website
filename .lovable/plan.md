

# Preoblikovanje osebnega nacrta: 90 dni → 30 sklopov (set-based)

## Povzetek sprememb

Trenutni sistem generira 90-dnevni nacrt vezan na koledar. Nov sistem bo generiral **30 zaporednih sklopov**, kjer otrok napreduje na naslednji sklop sele ko opravi trenutnega (ali po 24 urah).

---

## Pravila sistema

### Sestava sklopa
- Vsak sklop ima **5 aktivnosti**
- Ce je motorika vkljucena (npr. vsak dan): **1 motorika + 4 igre**
- Ce motorika ni vkljucena v tem sklopu (npr. enkrat na teden): **5 iger**
- Vsaka **igra** zahteva **2 igranji** (2 zvezdici)
- **Motorika** zahteva **1 izvedbo** (2 zvezdici)
- Maksimum na sklop: **10 zvezdic** = sklop opravljen

### Casovna pravila
- Ko otrok **odpre** sklop, ima **24 ur** da ga dokonca
- Po 24 urah se sklop **zakljuci** ne glede na napredek (zabelezi se delno opravljanje)
- Otrok lahko opravi **najvec 1 sklop na dan** — naslednji sklop se odpre z novim dnem
- Tudi ce otrok opravi sklop v 10 minutah, se naslednji odpre sele jutri

### Nacrt 30 sklopov
- Ko otrok opravi vseh 30 sklopov → avtomatsko generiranje novega nacrta
- Ce po **90 dneh** otrok ne opravi 30 sklopov → nacrt se arhivira, logoped in stars dobita obvestilo
- Novo porocilo logopeda = nov nacrt (stari se arhivira)

### Arhiv / zgodovina
- Koledarski prikaz po dnevih
- Za vsak dan se prikaze: opravljen sklop (z zvezdicami), delno opravljen (s podatki kaj je naredil), ali "ni vadil"
- Vizualno pregleden koledar za starsa

---

## Tehnicni nacrt

### 1. Migracija baze (`supabase/migrations/...`)

```sql
-- Dodaj set_number in started_at v plan_activity_completions
ALTER TABLE plan_activity_completions 
  ADD COLUMN set_number INTEGER,
  ALTER COLUMN activity_index DROP NOT NULL; -- activity_index check se posodobi

-- Dodaj constraint za activity_index (0-4 za 5 aktivnosti, ze obstaja)
-- Posodobi unique constraint
ALTER TABLE plan_activity_completions 
  DROP CONSTRAINT plan_activity_completions_unique_play;
ALTER TABLE plan_activity_completions 
  ADD CONSTRAINT plan_activity_completions_unique_play 
  UNIQUE (plan_id, child_id, set_number, activity_index, play_number);

-- Tabela za belezenje odprtih/zakljucenih sklopov
CREATE TABLE public.plan_set_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES child_monthly_plans(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,        -- NULL = se v teku
  expired_at TIMESTAMPTZ,          -- NULL = ni potekel, set z datumom ko je 24h poteklo
  total_stars INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, expired
  UNIQUE(plan_id, child_id, set_number)
);

ALTER TABLE plan_set_tracking ENABLE ROW LEVEL SECURITY;
-- RLS: parents can view/insert for their children
```

### 2. Edge function `generate-monthly-plan/index.ts`

Glavne spremembe:
- `TOTAL_PLAN_DAYS = 90` → `TOTAL_SETS = 30`
- `generateDeterministicPlan()` generira `sets[]` namesto `days[]`
- Vsak set ima 5 aktivnosti (1 motorika + 4 igre ALI 5 iger)
- Motorika frekvenca se preracuna v "vsak N-ti set" namesto "vsak N-ti dan"
- Ne nastavi `end_date` (ni casovno omejen)
- `plan_data` struktura:

```typescript
{
  summary: "...",
  targetLetters: ["R", "S"],
  totalSets: 30,
  sets: [
    {
      setNumber: 1,
      activities: [
        { type: "motorika", title: "...", path: "..." },
        { type: "igra", title: "Spomin R", path: "...", letter: "R", gameId: "spomin" },
        { type: "igra", title: "Bingo S", path: "...", letter: "S", gameId: "bingo" },
        { type: "igra", title: "Kolo besed R", path: "...", letter: "R", gameId: "kolo-srece" },
        { type: "igra", title: "Labirint S", path: "...", letter: "S", gameId: "labirint" },
      ]
    },
    ...
  ]
}
```

### 3. `src/hooks/useMonthlyPlan.ts`

- Dodaj tipe za `PlanSet` (z `setNumber` in `activities[]`)
- Razsiri `MonthlyPlanData` z `sets?: PlanSet[]` in `totalSets?: number`
- Ohrani `days` za backward compatibility

### 4. `src/hooks/usePlanProgress.ts`

- Nov hook `useSetTracking(planId, childId)` — bere `plan_set_tracking`
- `getCurrentSet()` — vrne trenutni aktiven set ali naslednji neodprt
- `useCompleteActivity` posodobi da zapisuje `set_number`
- Nova logika za 24-urno potekanje: ko otrok odpre stran, preveri ali je aktiven set potekel
- `startSet()` — ustvari zapis v `plan_set_tracking`
- `expireSet()` — oznaci set kot expired z dejanskimi zvezdicami
- `buildCompletionCountsBySet()` namesto `buildCompletionCountsByDay`

### 5. `src/pages/MojiIzzivi.tsx`

Glavne spremembe:
- Namesto iskanja "danes" po datumu → poisce naslednji nedokoncan sklop
- Prikaze "Sklop 12/30" napredek
- Ko otrok pride na stran:
  1. Preveri ali obstaja aktiven (neodprt) set
  2. Ce aktiven set obstaja in je starejsi od 24h → expire ga, odpri naslednjega
  3. Ce ni aktivnega seta → odpri naslednjega (ce je nov dan)
  4. Prikazi aktivnosti trenutnega seta
- Ko otrok opravi sklop 30/30 → sprozi `generate-monthly-plan` z istim reportId
- Omejitev 1 sklop/dan: ce je danes ze en sklop opravljen, prikazi "Pridi jutri nazaj!"

### 6. `src/pages/MojiIzziviArhiv.tsx` → Koledarski prikaz

- Preimenuj v koledarski pregled
- Prikazi mesecni koledar (grid 7 stolpcev)
- Za vsak dan:
  - Zelen: sklop opravljen v celoti (10 zvezdic)
  - Rumen/oranzen: delno opravljen (s stevilom zvezdic)
  - Siv: ni vadil
- Klik na dan odpre podrobnosti (kateri sklop, katere aktivnosti opravljene)
- Podatke bere iz `plan_set_tracking` (started_at daje datum)

### 7. `src/components/plan/PlanDayCard.tsx` → `PlanSetCard.tsx`

- Preimenuj komponento
- Header: "Sklop 12" namesto datuma
- Badge: "Na vrsti" za aktiven, stevilka zvezdic
- 24-urni timer: prikazi preostali cas (opcijsko)
- Grid aktivnosti ostane enak (5 kartic)

### 8. 90-dnevni safety net

- Dodaj polje `expires_at` v `child_monthly_plans` (nastavi na created_at + 90 dni)
- Frontend preveri: ce je nacrt starejsi od 90 dni in ni opravljen → arhiviraj
- Posli obvestilo (nova vrstica v `notifications` tabelo) logopedu in starsu

### 9. Admin stran `AdminOsebniNacrt.tsx`

- Prikazi napredek: "Sklop 15/30"
- Seznam opravljenih sklopov z datumi
- Vizualizacija napredka (progress bar)

---

### Datoteke za spremembo:
1. **Nova migracija SQL** — `plan_set_tracking` tabela, posodobitev `plan_activity_completions`
2. **`supabase/functions/generate-monthly-plan/index.ts`** — 30 sklopov z 5 aktivnostmi
3. **`src/hooks/useMonthlyPlan.ts`** — novi tipi (PlanSet)
4. **`src/hooks/usePlanProgress.ts`** — set tracking logika, 24h expiry, 1 sklop/dan
5. **`src/pages/MojiIzzivi.tsx`** — prikaz trenutnega sklopa, napredek
6. **`src/pages/MojiIzziviArhiv.tsx`** — koledarski prikaz zgodovine
7. **`src/components/plan/PlanDayCard.tsx`** → preoblikuj v `PlanSetCard.tsx`
8. **`src/components/plan/DayStarDisplay.tsx`** — brez sprememb (ze podpira maxStars prop)
9. **`src/pages/admin/AdminOsebniNacrt.tsx`** — napredek otroka

