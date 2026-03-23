
### Kaj se je zgodilo pri **Testni otrok** (diagnoza iz podatkov)

1. Za otroka obstaja poročilo:
   - staro: `0348d835...` (status `revised`)
   - popravljeno: `4b85fed4...` (status `submitted`)
2. V `child_monthly_plans` je samo en plan `b9aaa254...` in je **archived** (ni `active`).
3. Za ta arhiviran plan že obstaja napredek:
   - `plan_set_tracking`: set 1 je bil začet
   - `plan_activity_completions`: vsaj 1 aktivnost zaključena
4. UI (`useMonthlyPlan`) bere samo plane s statusom `active/generating`, zato otrok “nima plana”, čeprav je plan v bazi arhiviran.

To potrjuje, da je v nekem trenutku generacija plana padla po arhiviranju starega plana (tipičen “archive-before-create” problem), zato je ostal “orphan” scenarij: napredek obstaja, aktivnega plana pa ni.

---

### Kako se osebni plan trenutno generira (trenutni flow)

1. Admin klikne **Generiraj** / **Generiraj popravljeno**.
2. PDF se naloži v storage.
3. V `logopedist_reports` se doda nov zapis.
4. Frontend sproži `generate-monthly-plan` (trenutno fire-and-forget).
5. Edge funkcija:
   - validira auth
   - prebere poročilo
   - določi `child_id` (iz `session_id` ali `pdf_url`)
   - prebere otroka + glasove/pozicije + motoriko
   - zgradi summary + 30 setov
   - **arhivira obstoječe active/generating plane**
   - vstavi nov active plan
6. Starševski portal `/moji-izzivi` prikaže zadnji `active/generating` plan.

Kritična slabost: če korak po arhiviranju pade, plan “izgine”.

---

### Predlagana optimalna rešitev (robustno za ta in podobne primere)

## 1) Backend pravilo: **nikoli več “archive-first”**
V `generate-monthly-plan` preuredimo logiko:
- najprej priprava + validacija + izračun plana
- nato:
  - **update in-place** (če plan že obstaja in želimo ohraniti napredek), ali
  - **create new**, šele potem arhiviranje starega
- če karkoli pade, obstoječi active plan ostane nedotaknjen.

## 2) Pri popravku poročila: plan se **posodobi**, ne resetira
Novo pravilo za admin scenarij:
- če ima otrok že napredek (tracking/completions), plan ostane isti `plan_id`
- posodobi se:
  - `summary`
  - `focus_letters`
  - `report_id`
  - prihodnji seti
- že začeti/zaključeni seti ostanejo nespremenjeni (da ne pokvarimo indeksov aktivnosti in zvezdic).

## 3) Podpora za oba režima
Razširimo edge funkcijo z “mode”:
- `mode: "report_update"` (default): preserve-progress update
- `mode: "renewal"` (ko je 30/30 dokončano): ustvari nov plan (nova iteracija)
`MojiIzzivi` renewal klic uporablja `renewal`; admin generiranje uporablja `report_update`.

## 4) Frontend zanesljivost (admin)
V `AdminUserDetail` in `AdminLogopedistChildDetail`:
- odstranimo fire-and-forget
- `await supabase.functions.invoke(...)`
- jasen toast:
  - uspeh: “Plan ustvarjen/posodobljen”
  - napaka: konkretno sporočilo
- po uspehu invalidacija/refetch relevantnih queryjev.

## 5) Natančno mapiranje poročila (brez `ilike` po imenu)
`GeneratePlanButton` trenutno išče report po `%filename%` (lahko zadene napačen zapis, npr. `porocilo...` vs `popravljeno-porocilo...`).
Popravek:
- uporabljamo točen `pdf_url` (ali direktno `report.id`) namesto fuzzy filename matcha.

## 6) Samodejna sanacija “orphan” primerov
Dodamo recovery logiko:
- če otrok nima active plana, ima pa archived plan z napredkom, ga funkcija zna “oživiti” (reactivate + update).
- enkratni repair script za obstoječe stanje (npr. Testni otrok), da se plan takoj vrne brez izgube napredka.

---

### Robni scenariji, ki jih ta rešitev pokrije

- Popravek poročila med aktivnim setom → plan ostane viden, napredek ostane.
- Dvojni klik “Generiraj” / paralelni klici → brez izgube active plana.
- Delni backend failure → brez “izginotja” plana.
- 30/30 completion auto-renewal → nov plan, stari ostane kot zgodovina.
- Napačen match poročila po imenu datoteke → odpravljen z exact mapping.

---

### Konkretni implementacijski koraki (datoteke)

1. `supabase/functions/generate-monthly-plan/index.ts`
   - mode-based behavior (`report_update` vs `renewal`)
   - remove archive-first pattern
   - in-place update with progress preservation
   - orphan recovery branch
2. `src/pages/admin/AdminUserDetail.tsx`
   - await invoke + jasen rezultat uporabniku
   - klic z `mode: "report_update"`
3. `src/pages/admin/AdminLogopedistChildDetail.tsx`
   - enako kot zgoraj
4. `src/pages/MojiIzzivi.tsx`
   - renewal klic z `mode: "renewal"`
5. `src/components/admin/GeneratePlanButton.tsx`
   - prehod na exact report reference (id ali exact pdf_url), ne `ilike %filename%`

---

### Kaj bo to pomenilo za tvojo poslovno logiko

Tvoje predpostavke so pravilne in smiselne:
- ob izdelavi poročila naj se plan avtomatsko generira,
- ob popravkih naj se plan posodobi,
- že dosežen napredek (zvezdice, aktivni seti) se ne sme brisati,
- plan ne sme “izginiti” zaradi tehnične napake.

Ta plan točno to zagotovi.
