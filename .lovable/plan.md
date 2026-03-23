

## Čiščenje podatkov za "Testni otrok" + gumb za izbris dodatnega preverjanja

### 1. Izbris podatkov za otroka "Testni otrok" (child_id: `c3940422-e5ce-44b4-a2e4-f73c11323776`)

Podatki v bazi:
- 1x `child_monthly_plans` (osebni načrt, status: active)
- 2x `plan_set_tracking` (sledenje sklopov)
- 1x `plan_activity_completions` (opravljene aktivnosti)
- 1x `additional_test_assignments` (status: completed, session_id: `7c3aaa10-...`)
- Povezane `additional_test_words` za ta assignment
- Povezana seja `7c3aaa10-...` in morebitni `articulation_word_results` / `articulation_evaluations`

Vse to izbrišem z SQL migracijo (service role), v pravilnem vrstnem redu:
1. `plan_activity_completions` → 2. `plan_set_tracking` → 3. `child_monthly_plans`
4. `articulation_word_results` za sejo → 5. `articulation_evaluations` za sejo
6. `additional_test_words` → 7. `additional_test_assignments`
8. `articulation_test_sessions` za sejo

### 2. Gumb za izbris dodatnega preverjanja v `AdditionalTestSection.tsx`

Dodam rdeč "Izbriši" gumb v vsak accordion item, ki pokliče edge funkcijo `reset-additional-test`. Ker ta edge funkcija trenutno preverja `parent_id` (deluje samo za starše), jo razširim, da podpira tudi logopedistov klic:

**Edge funkcija `reset-additional-test/index.ts`:**
- Dodam opcijsko polje `adminOverride: true` v body
- Če je `adminOverride`, preveri ali je klicatelj logopedist (prek `logopedist_profiles`)
- Preveri ali je otrok dodeljen temu logopedu (prek `logopedist_children`) ALI pa je super admin
- Obstoječa logika brisanja ostane enaka

**`AdditionalTestSection.tsx`:**
- Dodam `onReset` prop ali pa neposredno klic edge funkcije
- Rdeč gumb "Izbriši" z confirm dialogom
- Po uspešnem brisanju invalidira query cache

### Datoteke
- `supabase/migrations/...` — SQL za čiščenje podatkov testnega otroka
- `supabase/functions/reset-additional-test/index.ts` — razširitev za admin klic
- `src/components/admin/AdditionalTestSection.tsx` — dodan gumb za izbris

