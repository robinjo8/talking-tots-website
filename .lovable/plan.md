

## Celostna analiza: Letni življenjski cikel uporabnika TomiTalk

### TRENUTNO STANJE SISTEMA

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    TRENUTNA LOGIKA (KOT JE ZDAJ)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  NAROČNINE:                                                         │
│  ├─ Start (22€/mesec) — mesečna, brez preverjanja izgovorjave ✅   │
│  │   → 'test' in 'challenges' sta v PRO_ONLY_ACTIVITIES            │
│  │   → Start uporabnik JE blokiran na frontend-u (ActivityOptions) │
│  │                                                                   │
│  └─ Pro (120€/leto) — letna, s preverjanjem izgovorjave            │
│      → subscriptionEnd = current_period_end iz Stripe              │
│      → Ni nobene povezave med subscriptionEnd in test cooldown-om  │
│                                                                     │
│  PREVERJANJE IZGOVORJAVE:                                           │
│  ├─ Cooldown: vedno 90 dni od zadnjega testa (addMonths(last, 3))  │
│  ├─ Ni omejitve števila testov (session_number = last + 1, brez    │
│  │   max limita)                                                     │
│  ├─ Obvestila: dnevi 83, 90, 93, 97 po zadnjem testu              │
│  ├─ check-test-reminders NE preverja naročnine — pošlje obvestila  │
│  │   VSEM otrokom z opravljenim testom, tudi če naročnina ni Pro   │
│  └─ Admin portal prikazuje "Predvidene datume" za 5 sej            │
│     (3m, 6m, 9m, 12m-1t) — SAMO vizualno, brez logike v ozadju   │
│                                                                     │
│  OSEBNI NAČRT:                                                      │
│  ├─ Generira se po logopedovem poročilu (report_update mode)       │
│  ├─ 30 sklopov, vsak traja 24 ur (odpre se → 24h timer → done)    │
│  ├─ Renewal: ob začetku 30. sklopa ali ko vsi dokončani            │
│  │   → doda 30 NOVIH sklopov (31-60, 61-90 itd.)                  │
│  │   → renewal uporablja ISTI report_id (zadnje poročilo)          │
│  ├─ report_update: ko logoped ustvari NOVO poročilo                │
│  │   → ohrani opravljene sklope, posodobi prihodnje                │
│  └─ Starostni prehod: nov renewal/report_update zazna novo starost │
│                                                                     │
│  ⚠️ KLJUČNA VRZEL:                                                 │
│  Ni nobene povezave med:                                            │
│  1. Datumom poteka naročnine (subscriptionEnd)                     │
│  2. Cooldown-om preverjanja (vedno 90 dni)                         │
│  3. Številom sej (ni max limita)                                   │
│  4. Zadnjim preverjanjem pred potekom naročnine                    │
│                                                                     │
│  ⚠️ BUG v check-test-reminders:                                    │
│  Funkcija ne preverja ali ima starš aktivno Pro naročnino.         │
│  Če je otrok naredil test pred prehodom na Start (ali po poteku    │
│  naročnine), bo še vedno prejel obvestila o novem preverjanju.     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### TRENUTNI TOK ZA ENEGA OTROKA (PRO, 1 LETO)

```text
DAN 0: Starš kupi Pro naročnino (subscriptionEnd = Dan 365)
       Otrok opravi 1. preverjanje izgovorjave
       → Seja se pojavi v admin portalu
       → session_number = 1

DAN 1-7: Logoped oceni preverjanje, ustvari poročilo
         → generate-monthly-plan(reportId, mode: "report_update")
         → Ustvari 30 sklopov (sklopi 1-30)
         → Otrok začne z osebnim načrtom

DAN 1-30+: Otrok igra sklope (1 sklop/24h)
           → Ob začetku 30. sklopa: renewal → sklopi 31-60
           → Renewal uporablja ISTI report_id
           → Otrok nadaljuje brez prekinitve

DAN 83: Obvestilo "7 dni pred novim preverjanjem"
DAN 90: Obvestilo "Novo preverjanje je na voljo"
        → Cooldown poteče, otrok LAHKO naredi 2. preverjanje
DAN 93: Opomnik (če ni naredil)
DAN 97: Zadnji opomnik

DAN 90-??: Otrok opravi 2. preverjanje
           → session_number = 2
           → Logoped oceni, ustvari novo poročilo
           → generate-monthly-plan(newReportId, mode: "report_update")
           → Ohrani opravljene sklope, posodobi prihodnje
           → Novi sklopi imajo POSODOBLJENE vaje/igre

DAN 173-180: Obvestila za 3. preverjanje (90 dni od 2.)
DAN 180-??: 3. preverjanje → nov report → posodobljen načrt

DAN 263-270: Obvestila za 4. preverjanje
DAN 270-??: 4. preverjanje → nov report → posodobljen načrt

DAN 353-358: Obvestila za 5. preverjanje
DAN 358-??: 5. preverjanje → nov report → končno poročilo

DAN 365: Naročnina poteče ali se podaljša
```

**Kaj NE deluje v zgornjem idealnem scenariju:**

1. **Zadnje preverjanje 7 dni pred potekom** — ni logike za to. Cooldown je vedno 90 dni, ne glede na datum poteka. Če ima otrok 4. preverjanje na dan 270, je 5. šele na dan 360 (in ne na dan 358).

2. **Logoped nima informacije o datumu poteka naročnine** — admin portal ne prikazuje kdaj naročnina poteče.

3. **Renewal sklopov teče neodvisno od preverjanj** — otrok lahko opravi 90+ sklopov brez novega preverjanja.

---

### ANALIZA SCENARIJEV

**SCENARIJ D (Hitri uporabnik) — tvoje vprašanje:**

Otrok NE MORE končati 30 sklopov v 15 dneh. Vsak sklop traja natanko 24 ur (timer). Najhitreje je 30 sklopov v 30 dneh (1 sklop/dan). Po 30 dneh se sproži renewal → sklopi 31-60. Ti sklopi še vedno uporabljajo ISTO poročilo (zadnje logopedovo). Nov report_update se zgodi šele ko logoped ustvari novo poročilo po naslednjem preverjanju.

```text
Realen scenarij D:
Dan 0:  1. preverjanje → poročilo → sklopi 1-30
Dan 30: Konec 30. sklopa → renewal → sklopi 31-60 (isti report)
Dan 60: Konec 60. sklopa → renewal → sklopi 61-90 (isti report)
Dan 90: 2. preverjanje → novo poročilo → report_update
        → Sklopi 61-90 se posodobijo (ohranijo opravljene, posodobijo prihodnje)
```

To JE pravilno obnašanje — otrok dela vaje glede na zadnje poročilo, dokler ne dobi novega.

**SCENARIJ E (Starostni prehod):**
Pravilno razumeš. Otrok dokonča obstoječih 30 sklopov z originalno težavnostjo. Renewal zazna novo starost in generira sklope z ustreznimi URL-ji. ✅ Že implementirano.

**SCENARIJ F (Preklic naročnine):**
Že implementirano. `useSubscription` preverja `cancel_at_period_end` in `isStillInPeriod`. Dostop velja do `current_period_end`. ✅

**SCENARIJ G (Start → Pro):**
Start nima preverjanja (blokirano z PRO_ONLY). Ob prehodu na Pro se šteje od prvega preverjanja. `session_number` gre od 1 naprej. ✅ Pravilno.

**SCENARIJ H (Več otrok):**
1 otrok na račun — ni problema. ✅

**SCENARIJ I (Logoped zamudi):**
Načrt se NE kreira avtomatsko ob preverjanju. Kreira se šele ko logoped ustvari poročilo. Zamuda logopeda = zamuda načrta. Otrok medtem nadaljuje s starimi sklopi (renewal). To je sprejemljivo.

**SCENARIJ J (Test pred potekom + podaljšanje):**
Če se naročnina podaljša, cooldown teče naprej normalno (90 dni od zadnjega testa). Session_number nadaljuje (6, 7...). Ni nobene logike, ki bi resetirala session_number ob novem letu. To je pravilno — terapevtski proces je kontinuiran.

---

### PROBLEM: Zadnje preverjanje 7 dni pred potekom

To je edini res zahteven problem. Trenutni sistem vedno čaka 90 dni. Potrebna je logika:

```text
PREDLOG: "Pametni cooldown"

Ob vsakem preverjanju sistem izračuna:
  normalniNaslednji = zadnjePreverjanje + 90 dni
  potekNaročnine = subscriptionEnd (iz user_subscriptions)
  zadnjiMožniTest = potekNaročnine - 7 dni

  ČE normalniNaslednji > zadnjiMožniTest:
    → cooldown = zadnjiMožniTest (skrajšan interval)
    → Minimum cooldown: 30 dni (da test sploh ima smisel)
  DRUGAČE:
    → cooldown = normalniNaslednji (90 dni kot ponavadi)
```

**Primer z zamudo:**
```text
Dan 0:   1. preverjanje
Dan 120: 2. preverjanje (30 dni zamude)
         → Normalni naslednji: dan 210
         → Potek naročnine: dan 365
         → 210 < 358 → cooldown ostane 90 dni

Dan 210: 3. preverjanje
         → Normalni naslednji: dan 300
         → 300 < 358 → cooldown ostane 90 dni

Dan 300: 4. preverjanje
         → Normalni naslednji: dan 390
         → 390 > 358 → SKRAJŠAN cooldown na dan 358
         → Minimum razlika: 358 - 300 = 58 dni ✅ (nad 30 dni)

Dan 358: 5. preverjanje (7 dni pred potekom) ✅
```

**Primer z veliko zamude:**
```text
Dan 0:   1. preverjanje
Dan 150: 2. preverjanje (60 dni zamude)
Dan 240: 3. preverjanje
Dan 330: 4. preverjanje
         → Normalni naslednji: dan 420
         → 420 > 358 → SKRAJŠAN na dan 358
         → Razlika: 358 - 330 = 28 dni < 30 dni minimum
         → V tem primeru: zadnje preverjanje je dan 358,
           ampak otrok dobi samo 4 preverjanja v letu
```

**Kaj če otrok zamudi za 30 dni že pri 1. preverjanju?**
```text
Dan 0:   Naročnina kupljena
Dan 30:  1. preverjanje (30 dni zamude)
         → Normalni: dan 120, potek: dan 358
Dan 120: 2. preverjanje
Dan 210: 3. preverjanje
Dan 300: 4. preverjanje
         → Normalni: dan 390, potek: 358
         → Skrajšan na 358 (razlika 58 dni) ✅
Dan 358: 5. preverjanje ✅
```

Tudi z 30-dnevno zamudo pri prvem testu še vedno dobimo 5 preverjanj.

---

### KONKRETEN NAČRT SPREMEMB

#### 1. check-test-reminders: dodaj preverjanje naročnine
- Pred pošiljanjem obvestil preveri ali ima starš aktivno Pro naročnino v `user_subscriptions`
- Če nima Pro → preskoči otroka

#### 2. useArticulationTestStatus: pametni cooldown
- Poleg `addMonths(lastCompletedAt, 3)` preveri tudi `subscriptionEnd`
- Če je `lastCompletedAt + 90d > subscriptionEnd - 7d`, uporabi `subscriptionEnd - 7d`
- Potrebuje dostop do `subscriptionEnd` (iz SubscriptionContext)

#### 3. check-test-reminders: pametni cooldown za obvestila
- MILESTONES morajo biti dinamični, ne fiksni (83, 90, 93, 97)
- Izračunaj glede na `subscriptionEnd` kdaj pade naslednji test
- Obvestila 7 dni pred, na dan, 3 dni po, 7 dni po

#### 4. Admin portal: prikaži datum poteka naročnine
- V `AdminUserDetail` prikaži `subscriptionEnd` ob otrokovem profilu
- Logoped vidi kdaj naročnina poteče

#### 5. SessionAccordion: dinamični datumi
- Namesto fiksnih (3m, 6m, 9m, 12m-1t) izračunaj glede na dejanske datume sej + pametni cooldown

### VRSTNI RED IMPLEMENTACIJE

1. **Bug fix**: `check-test-reminders` naj preverja Pro naročnino
2. **Pametni cooldown**: `useArticulationTestStatus` + `check-test-reminders`
3. **Admin prikaz**: datum poteka naročnine
4. **Simulacijsko orodje**: za testiranje vseh scenarijev
5. **Dinamični datumi v admin portalu**

### Ali želiš da nadaljujem z implementacijskim planom za katerega od teh korakov?

