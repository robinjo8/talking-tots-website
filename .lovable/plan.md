

# Analiza in predlog: Preureditev strani /admin/all-tests

## Trenutno stanje v bazi

**Lea (8 let)** ima 2 seji:
- `986ae4ed` — `is_completed=false`, `word_count=0`, `session_number=1` (prazna/opuščena seja)
- `974b21a0` — `is_completed=true`, `word_count=67`, `session_number=1`, zaključena z poročilom

**Tristan (6 let)** ima 2 seji:
- `9aa7479c` — `is_completed=false`, `word_count=0` (opuščena)
- `821fbeb7` — `is_completed=false`, `word_count=0`, ampak `status=completed` (nekonsistentno stanje — verjetno ročno spremenjen status brez dejanskih podatkov)

## Zakaj nastanejo "podvojeni" zapisi

Ko uporabnik začne test, se takoj ustvari nova vrstica v `articulation_test_sessions`. Če uporabnik zapusti test brez dokončanja in pozneje začne znova, se ustvari **nova seja** z istim `session_number=1`. Stara prazna seja ostane v bazi. To ni bug — je posledica "resume" logike, ki pa ne prepreči ustvarjanja nove seje, če je stara opuščena.

## Odgovor na vprašanje: Kaj se zgodi pri drugem preverjanju?

Ko isti otrok naredi drugo preverjanje (npr. čez 3 mesece), se ustvari nova seja s `session_number=2`. Ta seja se pojavi na `/admin/all-tests` kot **nova vrstica**. Logoped jo mora prevzeti nase, neodvisno od prvega preverjanja.

## Predlog preureditve

### Pristop: Grupiranje po otroku z razširljivimi sejami

Namesto ploskega seznama sej predlagam **en zapis (vrstica) na otroka**, ki se razširi in prikaže posamezne seje znotraj.

```text
┌──────────────────────────────────────────────────────────┐
│ Uporabnik    │ Otrok      │ Starost │ Seje │ Status      │
├──────────────────────────────────────────────────────────┤
│ ▶ Ana Novak  │ Lea        │ 8 let   │  1   │ Zaključeno  │
│ ▶ Ema Vidmar │ Tristan    │ 6 let   │  1   │ V čakanju   │
└──────────────────────────────────────────────────────────┘

Klik na "▶ Lea" razširi:
┌──────────────────────────────────────────────────────────┐
│ ▼ Ana Novak  │ Lea        │ 8 let   │  1   │ Zaključeno  │
│   └─ Seja 1  │ 22. 2. 2026 │ 60 besed │ Zaključeno │ [Ogled] │
│ ▶ Ema Vidmar │ Tristan    │ 6 let   │  1   │ V čakanju   │
└──────────────────────────────────────────────────────────┘

Če bi Lea naredila drugo preverjanje:
┌──────────────────────────────────────────────────────────┐
│ ▼ Ana Novak  │ Lea        │ 8 let   │  2   │ V čakanju   │
│   └─ Seja 1  │ 22. 2. 2026 │ 60 besed │ Zaključeno │ [Ogled] │
│   └─ Seja 2  │ 22. 5. 2026 │ 60 besed │ V čakanju  │ [Ogled] │
└──────────────────────────────────────────────────────────┘
```

### Konkretne spremembe

**1. Skrij prazne/opuščene seje (brez spremembe baze)**
V `useAdminTests.ts` — filtriraj seje kjer `is_completed = false` **IN** `word_count = 0` (ali preprosto samo `is_completed = false`, kar že ustreza obstoječi logiki iz konteksta). Te seje nimajo nobenih podatkov in so neuporabne za logopede.

**2. Grupiranje po otroku v `AdminTests.tsx`**
- Po pridobitvi sej jih grupiraj po `child_id` (za parent source) oz. `logopedist_child_id` (za logopedist source)
- Vsaka skupina = ena vrstica v tabeli
- Glavni status vrstice = status najnovejše seje
- Stolpec "Seje" prikaže število dokončanih sej (npr. "2")
- Klik na vrstico razširi/zapre seznam sej znotraj

**3. Razširjena vrstica prikaže seje**
- Vsaka seja: Seja X, datum oddaje, število besed, status, gumb "Ogled"
- Klik na "Ogled" odpre obstoječo stran `/admin/tests/{sessionId}`

**4. Podatek o številu besed v seji**
Dodaj `word_count` v `useAdminTests` (COUNT iz `articulation_word_results`), da se v razširjeni vrstici prikaže koliko besed je bilo izgovorjenih. Tristanovi seji imata 0 besed ker sta obe prazni — ni 54 besed. Morda si videl `total_words=60` minus `current_word_index` nekje?

**5. Manjkajoče ime starša**
Za Leino starš (`767acee5`) ni `first_name`/`last_name` v `profiles`. V vrstici se prikaže "Ni podatka" (to že deluje v trenutni kodi).

### Datoteke za spremembo
- `src/hooks/useAdminTests.ts` — filtriranje opuščenih sej, dodaj `word_count`, dodaj grupiranje pomožno
- `src/pages/admin/AdminTests.tsx` — nova logika grupiranja po otroku, razširljive vrstice, stolpec "Seje"
- Stats prilagoditev — `total` šteje otroke namesto sej, ali pa ohranimo oba pogleda

### Kaj ostane nespremenjeno
- Stran `/admin/tests/{sessionId}` — ostane kot je, prikazuje eno sejo
- Baza podatkov — brez sprememb sheme
- RLS politike — brez sprememb

