

## Plan: Popravi dvojni zapis v simulate_full_test

### Problem
Akcija `simulate_full_test` v Edge funkciji `simulate-plan-lifecycle` pokliče `simulate-articulation-test` (ki **sam že vstavi** zapis v `articulation_test_results`), nato pa **še enkrat** vstavi zapis v `articulation_test_results`. Rezultat: 2 zapisa z istim datumom za isti test.

### Sprememba

**`supabase/functions/simulate-plan-lifecycle/index.ts`** — v akciji `simulate_full_test` odstrani drugi INSERT v `articulation_test_results` (po klicu `simulate-articulation-test`), ker ga Edge funkcija `simulate-articulation-test` že naredi sama.

Alternativno: preveri ali `simulate-articulation-test` dejansko vstavi `articulation_test_results` — če ne, obdrži le enega od dveh insertov.

### Obseg
- 1 Edge funkcija, ~5 vrstic odstranjenih

