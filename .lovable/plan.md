

## Plan: Varnostni popravki (CORS, devAccess, Right to Erasure)

### 1. CORS popravek za `simulate-plan-lifecycle`

**Problem**: Uporablja `"Access-Control-Allow-Origin": "*"` medtem ko vse ostale funkcije uporabljajo `getCorsHeaders` helper z omejenimi domenami.

**Popravek**: Zamenjaj vrstice 3-6 v `supabase/functions/simulate-plan-lifecycle/index.ts` z enakim `getCorsHeaders` vzorcem kot ga uporabljajo ostale funkcije (`allowedOrigins` + dinamična validacija `Origin` glave). Vzorec je že implementiran v `archive-and-delete-user/index.ts` (vrstice 3-17).

---

### 2. `devAccess.ts` — premik hardcodiranih emailov na backend

**Problem**: Email naslovi razvijalcev so vidni v frontend source kodi (`src/lib/devAccess.ts`). Čeprav ni varnostna luknja (preverjanje je samo za UI prikaz, backend pa ima svojo preverjanje), je to slab vzorec.

**Popravek**: Zamenjaj hardcodirane emaile z preverjanjem preko `admin_permissions` tabele:
```ts
// Namesto hardcodiranih emailov preveri ali ima uporabnik admin pravice
const { data } = await supabase
  .from("admin_permissions")
  .select("role")
  .eq("user_id", userId)
  .eq("is_active", true)
  .maybeSingle();
return !!data;
```

Posodobi `isDevUser` v asinhrono funkcijo ali uporabi React query za predpomnjenje. Na frontendu se bo komponenta `PlanLifecycleTools` prikazala na podlagi admin pravic namesto email naslova.

Backend v `simulate-plan-lifecycle` že ima svojo email preverbo (vrstica 44), ki ostane kot dodatna zaščita.

---

### 3. Pravica do izbrisa (Right to Erasure) — manjkajoči podatki

**Problem**: `archive-and-delete-user` funkcija eksplicitno briše le:
- `articulation_word_results`
- `articulation_test_sessions`
- `user_subscriptions`
- Storage datoteke (`uporabniski-profili`)
- Auth uporabnika

**NE briše** (in verjetno ostanejo osirotelih zapisov):
- `children` (parent_id verjetno nima FK CASCADE na auth.users)
- `progress` (child_id → children)
- `chat_conversations` in `chat_messages` (user_id)
- `child_monthly_plans` (child_id)
- `articulation_test_results` (child_id)
- `articulation_evaluations` (child_id)
- `logopedist_reports` (child_id/parent_id)
- `child_stickers` in `child_album_stats`
- `child_documents`
- `children_access_log`
- `additional_test_assignments`
- `mfa_codes`
- `profiles`

**Popravek**: Dodaj eksplicitno brisanje vseh tabel pred brisanjem auth uporabnika. Vrstni red brisanja mora upoštevati FK odvisnosti (najprej otroške tabele, nato children, nato profiles):

```
1. chat_messages (preko conversation_id)
2. chat_conversations (user_id)
3. mfa_codes (user_id)
4. Za vsak child_id:
   - progress, child_stickers, child_album_stats
   - child_monthly_plans, articulation_test_results
   - articulation_evaluations, logopedist_reports
   - child_documents, children_access_log
   - additional_test_words → additional_test_assignments
5. children (parent_id)
6. profiles (id)
7. user_subscriptions (že implementirano)
8. Auth user deletion
```

---

### Obseg
- `supabase/functions/simulate-plan-lifecycle/index.ts` — CORS popravek (~15 vrstic)
- `src/lib/devAccess.ts` + `src/components/profile/PlanLifecycleTools.tsx` — zamenjaj email preverjanje z admin_permissions (~20 vrstic)
- `supabase/functions/archive-and-delete-user/index.ts` — dodaj brisanje vseh manjkajočih tabel (~50 vrstic)
- Deploy obeh edge funkcij

