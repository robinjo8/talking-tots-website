

## Plan: Popravi cooldown predogled — zamuda mora zamakniti naslednji predvideni test

### Problem

Admin stran kaže 4 opravljene seje (Seja 1-4), ker je bila Seja 4 ustvarjena s simulacijo "Simuliraj celotno preverjanje". Cooldown predogled zdaj bere iz `articulation_test_sessions` in vidi 4 opravljene teste, zato zamuda (+50d) velja šele za Test 5. Prej (ko je bral iz `articulation_test_results` s samo 3 zapisi) je pravilno kazal Test 4 kot "predviden (140d)".

### Rešitev

Uporabnik želi videti: "Kaj se zgodi, če po 3. testu zamudim 50 dni?" Zato moramo izbrisati Sejo 4 (ki je bila ustvarjena s simulacijo, ne z dejansko zamudo), da se vrnemo na 3 opravljene teste. Potem bo predogled s +50d zamudo pravilno kazal:

```text
Test 1: 2026-03-30  opravljen
Test 2: 2026-06-28  opravljen
Test 3: 2026-09-26  opravljen
Test 4: 2027-02-13  predviden (140d = 90 + 50)
Test 5: 2027-03-19  predviden (34d, smart cooldown)
Test 6: blokiran
```

### Spremembe

**1. SQL migracija — izbriši Sejo 4 za Testni otrok**

Izbriši:
- `articulation_test_sessions` zapis s `session_number = 4` za tega otroka
- Pripadajoče `articulation_word_results` za to sejo
- Pripadajoči `articulation_test_results` zapis (če obstaja, z datumom ~2026-12-25)
- Pripadajoče datoteke v `articulation_evaluations` za to sejo

To bo sinhroniziralo admin stran (3 seje) in predogled (3 opravljeni testi).

**2. Brez sprememb v kodi** — logika v `calculate_cooldown_preview` že pravilno aplicira `delayDays` na prvi predvideni test po opravljenih. Problem so bili odvečni podatki, ne logika.

### Obseg
- 1 SQL migracija za čiščenje podatkov
- Admin stran bo po tem kazala 3 seje, predogled bo s +50d zamudo pravilno kazal Test 4 kot predviden

