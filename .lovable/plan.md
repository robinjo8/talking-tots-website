

## Plan: Virtualni datumi v simulaciji + kontrola naročnine

### Analiza problema

Simulacija **nima koncepta virtualnega časa**. Vsak klik na "Simuliraj celotno preverjanje" vstavi `articulation_test_results.completed_at = new Date()` — vedno današnji datum. Zato cooldown preview kaže vse teste na 2026-03-27. Smart cooldown logika deluje pravilno v kodi, a nima pravih datumov za računanje.

**Odgovori na tvoja vprašanja:**

1. **Zakaj si po 5. preverjanju dobil nov osebni načrt?** — Ker `auto_evaluate_and_report` VEDNO pokliče `generate-monthly-plan`. V realnosti je to pravilno: po preverjanju logoped napiše poročilo in otrok dobi nov načrt. Ampak 7 dni pred potekom naročnine je ta načrt kratkotrajen — otrok ima le 7 dni za delo.

2. **Ali te spusti naprej brez podaljšanja naročnine?** — Trenutno **da**, ker simulacija ne preverja naročnine. V produkciji pa `MojiIzzivi.tsx` in igre preverjajo Pro naročnino — ko poteče, so zaklenjene. Osebni načrt ostane v bazi, ampak uporabnik ga ne more odpreti.

3. **Čemu so gumbi Podaljšaj/Prekliči/Poteci?** — Za testiranje kaj se zgodi z UI ko se naročnina spremeni:
   - **Podaljšaj**: Premakne `current_period_end` za 1 leto → testiraš ali se cikel nadaljuje
   - **Prekliči**: Nastavi `cancel_at_period_end = true` → testiraš ali UI kaže "naročnina se izteka"  
   - **Poteci**: Nastavi datum v preteklost + status "expired" → testiraš ali se vse zaklene

4. **Ali simulacija vodi virtualne datume?** — Trenutno **NE**. To je glavni problem ki ga moramo popraviti.

### Sprememba 1: Virtualni datumi v `simulate-articulation-test`

Namesto `completed_at: new Date()`, izračunaj pravi virtualni datum:

```text
simulate-articulation-test/index.ts:

1. Preberi vse obstoječe articulation_test_results za childId
2. Preberi subscription current_period_end za parentId
3. Izračunaj virtualDate po smart cooldown logiki:
   - Če je 1. test → subscription start datum (ali danes)
   - Če je 2.+ test → lastTestDate + 90 dni (z smart cooldown za subscription end)
4. Uporabi virtualDate za:
   - articulation_test_results.completed_at
   - articulation_test_sessions.submitted_at
```

### Sprememba 2: Virtualni datum v `auto_evaluate_and_report`

V `simulate-plan-lifecycle` (vrstica 397-401): uporabi isti virtualni datum kot session za `reviewed_at` in `completed_at` (dodaj npr. 2 dni na session datum).

### Sprememba 3: Virtualni datum v `complete_all_sets`

V `simulate-plan-lifecycle` (vrstica 62-136): nastavi `started_at` in `completed_at` za vsak sklop na datume med dvema testoma (razdeli 90 dni / 30 sklopov = 3 dni na sklop).

### Sprememba 4: Cooldown preview — že deluje pravilno

Ko bodo datumi v bazi pravilni, bo cooldown preview avtomatsko kazal prave datume ker že bere iz `articulation_test_results.completed_at`.

### Rezultat po popravku

Cooldown preview bo kazal:
```text
Test 1: 2026-03-27    opravljen
Test 2: 2026-06-25    opravljen  (90d)
Test 3: 2026-09-23    opravljen  (90d)
Test 4: 2026-12-21    opravljen  (89d, smart cooldown)
Test 5: 2027-03-14    opravljen  (83d, 7d pred potekom)
Potek naročnine: 2027-03-21
```

### Navodila za testiranje (po popravku)

**Scenarij 1: Idealen cikel (1 leto)**

| Korak | Klik | Kaj se zgodi | Virtualni datum |
|-------|------|-------------|-----------------|
| 0 | Ponastavi celoten cikel | Čisti start | - |
| 1 | Simuliraj celotno preverjanje | Seja 1, test datum = danes | Dan 0 |
| 2 | Simuliraj ocenjevanje + poročilo | Poročilo 1 + osebni načrt | Dan 2 |
| 3 | Zaključi vseh 30 sklopov (×3) | 90 sklopov, 3 kliki | Dan 3-90 |
| 4 | Simuliraj celotno preverjanje | Seja 2, test datum = dan 90 | Dan 90 |
| 5 | Simuliraj ocenjevanje + poročilo | Poročilo 2 + nov načrt | Dan 92 |
| 6 | Zaključi vseh 30 sklopov (×3) | 90 sklopov | Dan 93-180 |
| 7 | Ponovi korake 4-6 za Test 3 in 4 | | Dan 180-358 |
| 8 | Simuliraj celotno preverjanje | Seja 5, 7d pred potekom | Dan 358 |
| 9 | Simuliraj ocenjevanje + poročilo | Končno poročilo | Dan 360 |
| 10 | Poteci (naročnina) | Vse se zaklene | Dan 365 |

**Gumbi Podaljšaj/Prekliči/Poteci** uporabiš po koraku 9:
- **Podaljšaj** → naročnina +1 leto → začneš nov cikel od koraka 3
- **Poteci** → vse zaklenjeno → testiraš ali UI pravilno blokira dostop
- **Prekliči** → ostane aktivno do poteka → testiraš ali UI kaže opozorilo

### Obseg
- 2 Edge funkciji posodobljeni (`simulate-articulation-test`, `simulate-plan-lifecycle`)
- ~40 vrstic spremenjenih skupaj

