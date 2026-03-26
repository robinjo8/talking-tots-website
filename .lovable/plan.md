

## Plan: Popravi auto_evaluate_and_report — manjkajoč logopedist profil

### Problem

Ko klikneš "Simuliraj ocenjevanje + poročilo", funkcija na vrstici 290-300 poišče `logopedist_profiles` zapis za tvojega uporabnika (`qjavec@gmail.com`). Ker ta uporabnik je **starš** (ne logoped), v tabeli `logopedist_profiles` ni zapisa zanj. Funkcija vrne napako 400: "Dev uporabnik nima logopedist profila".

### Rešitev

Namesto da zahteva logopedist profil od dev uporabnika, naj funkcija uporabi **kateregakoli obstoječega internega logopeda** kot ocenjevalca. Konkretno:

**`supabase/functions/simulate-plan-lifecycle/index.ts`** — v akciji `auto_evaluate_and_report` (vrstica 289-301):

Zamenjaj iskanje logopedist profila za `userId` z iskanjem prvega dostopnega internega logopeda:

```ts
// Namesto:
const { data: logProfile } = await supabase
  .from("logopedist_profiles")
  .select("id")
  .eq("user_id", userId)
  .maybeSingle();

// Uporabi:
const { data: logProfile } = await supabase
  .from("logopedist_profiles")
  .select("id")
  .limit(1)
  .single();
```

To bo vzelo prvega logopeda iz baze (npr. Robert, id `6837d765-...`) in ga uporabilo kot ocenjevalca. Funkcija bo tako delovala ne glede na to, ali je dev uporabnik starš ali logoped.

### Obseg
- 1 Edge funkcija, ~3 vrstice spremenjene

