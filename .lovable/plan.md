

## Plan: Popravi neskladje v cooldown predogledu

### Problem

Cooldown predogled bere podatke iz tabele `articulation_test_results`, medtem ko admin portal kaže podatke iz `articulation_test_sessions`. Ti dve tabeli sta lahko nesinhronizirani — `articulation_test_sessions` ima 4 zapise (Seja 1-4), `articulation_test_results` pa morda samo 3. Zato prvi klik predogleda vidi 3 teste in predvidi 4. ob drugem potek naslednje poizvedbe, ko se podatki morda že sinhronizirajo, vidi 4 teste.

Poleg tega: `simulate_delayed_test` prav tako bere iz `articulation_test_results`, kar pomeni da obe orodji delata na morebitno nepopolnih podatkih.

### Popravek

**1. `supabase/functions/simulate-plan-lifecycle/index.ts`**

Zamenjaj vir podatkov za cooldown predogled in simulate_delayed_test:

```
// PREJ (vrstica 563):
.from("articulation_test_results")
.select("completed_at")

// POTEM:
.from("articulation_test_sessions")
.select("submitted_at")
.eq("is_completed", true)
.not("submitted_at", "is", null)
```

Isto za `simulate_delayed_test` (vrstica 270).

S tem bo predogled bral iste podatke kot admin portal — `articulation_test_sessions` je vir resnice za opravljene teste.

**2. Preveri podatke za Testni otrok**

Po deployu preveri ali `articulation_test_results` in `articulation_test_sessions` vsebujeta enako število zapisov za tega otroka. Če ne, sinhroniziraj manjkajoči zapis.

### Obseg
- 1 datoteka: `supabase/functions/simulate-plan-lifecycle/index.ts` — 2 poizvedbi spremenjeni
- Deploy edge function
- Preverba podatkov

