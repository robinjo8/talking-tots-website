

## Plan: Popravi auto_evaluate napako + dodaj gumb za popoln reset

### Problem 1: auto_evaluate_and_report ne najde seje

Uporabnik je na admin strani "prevzel" sejo, kar je spremenilo status iz `pending` v `assigned` ali `in_review`. Funkcija `auto_evaluate_and_report` išče samo statuse `["pending", "assigned"]` — če je status `in_review`, seje ne najde in vrne 404.

**Popravek:** Razširi filter na `["pending", "assigned", "in_review"]` v Edge funkciji (vrstica 290).

### Problem 2: Ni gumba za popoln reset celotnega cikla

Trenutni gumb "Ponastavi osebni načrt" (`reset_plan`) pobriše samo načrte in tracking. Manjka možnost za popoln reset vsega — da je otrok "kot nov".

**Nova akcija `reset_full_lifecycle`** v Edge funkciji pobriše:

1. `plan_activity_completions` — za vse načrte tega otroka
2. `plan_set_tracking` — za vse načrte tega otroka
3. `child_monthly_plans` — vse načrte (ne samo active/pending)
4. `articulation_evaluations` — za vse seje tega otroka
5. `logopedist_reports` — za vse seje tega otroka
6. `articulation_word_results` — za vse seje tega otroka
7. `articulation_test_sessions` — vse seje tega otroka
8. `articulation_test_results` — vse rezultate tega otroka

Vrstni red je pomemben (foreign key odvisnosti).

### Spremembe

**1. `supabase/functions/simulate-plan-lifecycle/index.ts`**
- Vrstica 290: dodaj `"in_review"` v status filter
- Nova akcija `reset_full_lifecycle` (~40 vrstic): zaporedno briše podatke iz vseh 8 tabel za childId
- Vrne povzetek koliko zapisov je bilo izbrisanih

**2. `src/components/profile/PlanLifecycleTools.tsx`**
- Nov gumb "Ponastavi celoten cikel" (rdeč, z ikono RotateCcw) z dialogom za potrditev
- Kliče `invoke("reset_full_lifecycle")`

### Obseg
- 1 Edge funkcija posodobljena (1 popravek + 1 nova akcija)
- 1 UI komponenta posodobljena (nov gumb)

