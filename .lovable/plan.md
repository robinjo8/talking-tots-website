

## Analiza stanja + Navodila za simulacijo celotnega leta

### Del 1: Stanje baze za "Testni otrok"

Otrok je bil izbrisan iz tabele `children`, vendar je **ostal 1 osirotel zapis** v bazi:

| Tabela | Zapis | child_id |
|--------|-------|----------|
| `articulation_test_results` | `3751f46e-b2c4-41d8-a068-0e2ca408f4e2` | `0e054bde-ab83-4728-b55d-e02134e6d35b` |

Vse ostale tabele (`articulation_test_sessions`, `articulation_word_results`, `child_monthly_plans`, `plan_set_tracking`, `plan_activity_completions`, `child_stickers`, `child_album_stats`, `child_documents`, `progress`, `additional_test_assignments`) so **prazne** za tega otroka.

**Sprememba:** Izbrišem ta osirotel zapis z `DELETE FROM articulation_test_results WHERE child_id = '0e054bde-ab83-4728-b55d-e02134e6d35b'`.

---

### Del 2: Navodila za simulacijo 1 leta — korak za korakom

Naročnina za uporabnika `kujavec.robert@gmail.com` je aktivna do **17. 2. 2027** (Pro). Ko dodaš novega otroka "Testni otrok" in opraviš preverjanje, sledi ta postopek na strani `/profile`:

```text
KORAK   KAJ NAREDIŠ                                    KJE (zavihek)
─────   ────────────────────────────────────────────    ─────────────────────
1       Dodaj otroka "Testni otrok" z vsemi podatki    Otroci
2       Izberi otroka v izbirniku zgoraj                Header
3       Opravi preverjanje izgovorjave (ali simuliraj)  Preverjanje izgovorjave
4       Na admin portalu: logoped oceni test,           Admin portal
        zaključi ocenjevanje, generira poročilo
5       Na admin portalu: klikni "Generiraj načrt"      Admin portal
        ─── TUKAJ IMAŠ 1. CIKEL (seti 1-30) ───
6       Klikni "Zaključi vseh 30 sklopov"               Lifecycle orodja
        ─── SISTEM SPROŽI RENEWAL → seti 31-60 ───
7       Klikni "Predogled cooldown datumov"              Lifecycle orodja
        → vidiš kdaj je 2. test predviden (~90 dni)
8       Klikni "Simuliraj zamudo" z 0 dni               Lifecycle orodja
        → to vstavi 2. test rezultat za danes
9       Na admin portalu: logoped oceni 2. test,        Admin portal
        zaključi, generira poročilo
10      Na admin portalu: "Generiraj načrt"             Admin portal
        → report_update posodobi prihodnje sete
        ─── 2. CIKEL POSODOBLJEN ───
11      Klikni "Zaključi vseh 30 sklopov"               Lifecycle orodja
        → seti 31-60 zaključeni, renewal → 61-90
12      Ponovi korake 8-11 za 3. in 4. preverjanje
        ─── 3. CIKEL (61-90), 4. CIKEL (91-120) ───
13      Za 5. (zadnje) preverjanje:
        Klikni "Predogled cooldown datumov"
        → zadnji test mora pasti 7 dni pred 17.2.2027
14      Simuliraj 5. test z ustreznim daysAgo
15      Logoped oceni, zaključi, generira poročilo
16      "Generiraj načrt" → zadnji cikel (121-150)
17      Zaključi zadnjih 30 sklopov
        ─── KONEC LETA ───

BONUS SCENARIJI:
18      Klikni "Prekliči" naročnino                     Lifecycle orodja
        → preveri da se nastavi cancel_at_period_end
19      Klikni "Poteci" naročnino                       Lifecycle orodja
        → preveri da se zakleni dostop
20      Klikni "Podaljšaj" naročnino                    Lifecycle orodja
        → preveri da se odklene + cooldown se preračuna
```

### Problem: manjka gumb za simulacijo 2.-5. preverjanja

Trenutni gumb "Izvedi test (simulacija)" na zavihku **Preverjanje izgovorjave** ustvari pravo sejo s 60 besedami. To je OK za 1. preverjanje.

Za 2.-5. preverjanje pa imaš na voljo **"Simuliraj zamudo"** na zavihku **Lifecycle orodja**, ki vstavi le zapis v `articulation_test_results`. Ampak to **ne ustvari seje** (`articulation_test_sessions`) z besedami, ki bi jo logoped potem ocenil.

**Zato predlagam dodatek:** Nov gumb **"Simuliraj celotno preverjanje"** na Lifecycle orodja, ki:
1. Kliče obstoječo Edge funkcijo `simulate-articulation-test` (ustvari sejo s 60 besedami)
2. Vstavi `articulation_test_results` zapis
3. Sejo označi kot `is_completed = true`

S tem boš lahko simuliral 2.-5. preverjanje brez ročnega opravljanja testa, logoped pa bo imel sejo za ocenjevanje.

### Spremembe

1. **Izbris osirotelega zapisa** — 1 DELETE query
2. **Nov gumb "Simuliraj celotno preverjanje"** v `PlanLifecycleTools.tsx` — kliče `simulate-articulation-test` + doda `articulation_test_results`
3. **Posodobitev `simulate-plan-lifecycle` Edge funkcije** — nova akcija `simulate_full_test` ki kliče obstoječo simulate funkcijo in doda test result

### Obseg
- 1 DELETE operacija v bazi
- 1 Edge funkcija posodobljena (nova akcija)
- 1 UI komponenta posodobljena (nov gumb)

