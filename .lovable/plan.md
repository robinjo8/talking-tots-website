
## Celoten življenjski cikel uporabnika TomiTalk Pro — scenariji in problemi

### Razlaga: `current_period_end`
`current_period_end` je datum, do katerega je uporabnikova naročnina plačana. Če ima uporabnik letno Pro naročnino (120€/leto) in jo plača 30. marca 2026, je `current_period_end` = 26. marec 2027 (ali podoben datum, ki ga nastavi Stripe). Ko ta datum mine in uporabnik ne podaljša, mu dostop poteče.

---

### SCENARIJ A: Idealen potek (1 leto brez zamud)

```text
Časovnica (365 dni):
Dan 0  (30.3.2026)   Uporabnik kupi Pro. current_period_end = 26.3.2027
                      Opravi 1. preverjanje izgovorjave
                      → Logoped oceni + generira poročilo
                      → Osebni načrt 1 (sklopi 1–30) se avtomatsko ustvari

Dan 1–90              Otrok dela sklope 1–30 (~3 dni na sklop)
                      Po sklopu 30 se sproži renewal → Načrt 2 (sklopi 31–60)

Dan 90 (28.6.2026)   2. preverjanje izgovorjave je na voljo (cooldown 90 dni)
                      Uporabnik opravi test
                      → Logoped oceni + poročilo
                      → Načrt 2 se arhivira, nov načrt 1 (sklopi 1–30, setOffset=0) na podlagi novega poročila

Dan 91–180            Sklopi 1–30 → renewal → 31–60

Dan 180 (26.9.2026)  3. preverjanje na voljo (cooldown 90 dni)
                      Uporabnik opravi test → logoped → poročilo → nov načrt

Dan 181–262           Sklopi 1–30 → 31–60

Dan 262               Smart cooldown: naslednji test bi bil čez 90 dni = ~dan 352
                      Ampak current_period_end - 7 = dan 358
                      352 < 358, torej ostane pri 90 dneh

Dan 352 (17.3.2027)  4. preverjanje (zadnje pred potekom)
                      → Logoped → poročilo → nov načrt

Dan 358 (23.3.2027)  7 dni pred potekom naročnine
Dan 365 (26.3.2027)  Naročnina poteče → SubscriptionGate zaklene vse Pro vsebine
                      Podatki ostanejo shranjeni
```

**Skupaj v 1 letu:** 4 preverjanja, 4 poročila, do 12× 30 sklopov (360 sklopov)

---

### SCENARIJ B: Uporabnik zamudi 100 dni z enim preverjanjem

```text
Dan 0  (30.3.2026)   1. preverjanje
Dan 1–90              Sklopi 1–30 → renewal → 31–60 → renewal → 61–90
Dan 90                2. preverjanje bi moralo biti opravljeno
Dan 90–190            Uporabnik NE opravi testa 100 dni (zamuda)
                      Osebni načrt je že pri 90 sklopih → prikaže "Čas za novo preverjanje"
                      Cooldown je potekel, test je na voljo (isTestAvailable = true)
                      
Dan 190 (6.10.2026)  Uporabnik končno opravi 2. preverjanje
                      → Logoped → poročilo → nov načrt (sklopi 1–30, setOffset=0)

Dan 190–280           Sklopi 1–30 → 31–60 → 61–90

Dan 280               Naslednji test: dan 190 + 90 = dan 280 (4.1.2027)
                      Smart cooldown: current_period_end - 7 = dan 358
                      280 < 358 → ostane 90 dni

Dan 280 (4.1.2027)   3. preverjanje
Dan 280–358           Sklopi 1–30 → 31–60

Dan 370               Naslednji test bi bil dan 280 + 90 = 370
                      Smart cooldown: 370 > 358, minimum 30 dni od 280 = 310
                      310 < 358, torej test = dan 358 (19.3.2027)
                      → Test 7 dni pred potekom ✓

Dan 365 (26.3.2027)  Naročnina poteče
```

**Posledica zamude:** Namesto 4 preverjanj v letu ima uporabnik samo 3 (ali 4 z smart cooldownom). Manj podatkov za spremljanje napredka.

---

### SCENARIJ C: Uporabnik predčasno prekine naročnino (Cancel)

```text
Dan 120               Uporabnik klikne "Prekliči naročnino" v Stripe
                      → Stripe pošlje webhook: cancel_at_period_end = true
                      → status ostane "canceled" v bazi
                      → useSubscription: isCanceled = true, isStillInPeriod = true
                      → isSubscribed = true (dostop ohranjen do poteka)

Dan 120–365           Vse deluje normalno: igre, načrt, preverjanja
                      Cooldown, obvestila — vse teče naprej

Dan 365               current_period_end mine
                      → Stripe pošlje customer.subscription.deleted webhook
                      → status = "inactive" v bazi (plan_id ohranjen)
                      → useSubscription: isStillInPeriod = false → isSubscribed = false
                      → SubscriptionGate zaklene vse
```

---

### SCENARIJ D: Naročnina poteče (brez preklica — Stripe ne uspe zaračunati)

```text
Dan 365               Stripe ne more zaračunati (kartica potekla itd.)
                      → invoice.payment_failed webhook → status = "past_due"
                      → Stripe ponovi 3× v 3 tednih

Dan 365               useSubscription: past_due ≠ active → isSubscribed = false
                      → Takojšen blok dostopa (brez grace period)

Dan 386 (po 3 tednih) Stripe ustavi ponovne poskuse
                      → customer.subscription.deleted webhook
                      → status = "inactive"
```

---

### SCENARIJ E: Naročnina poteče, uporabnik podaljša 10 dni po poteku

```text
Dan 365               Naročnina poteče → status = "inactive"
Dan 375               Uporabnik kupi novo Pro naročnino
                      → checkout.session.completed → posodobi stripe_customer_id
                      → customer.subscription.created → status = "active"
                      → current_period_end = dan 375 + 365 = dan 740
                      → plan_id = "pro"
                      → useSubscription: isSubscribed = true

                      Preverjanje izgovorjave:
                      - Zadnji test je bil npr. dan 280
                      - Cooldown: dan 280 + 90 = 370
                      - 370 < zdaj (375) → isTestAvailable = true
                      - Uporabnik lahko takoj opravi test

                      Osebni načrt:
                      - Stari načrt je zamrznjen (SubscriptionGate ga je skrival)
                      - Ko se SubscriptionGate odklene, uporabnik vidi obstoječ načrt
                      - Ob novem preverjanju + poročilu se stari načrt arhivira, nov se ustvari
```

---

### SCENARIJ F: Uporabnik podaljša naročnino (normalno obnovi)

```text
Dan 365               Stripe avtomatsko zaračuna letno naročnino
                      → customer.subscription.updated webhook
                      → current_period_end = dan 730
                      → status ostane "active"
                      → Brez prekinitve, vse teče naprej
```

---

### UGOTOVLJENE TEŽAVE V KODI

**Problem 1 — Simulacija zamude ustvari "opravljen" test**
Trenutna `simulate_delayed_test` akcija pokliče `simulate-articulation-test`, ki ustvari NOVO sejo + word results + test result z `completed_at`. To je narobe — zamuda pomeni, da uporabnik NI opravil testa, samo rok se premakne.

**Popravek:** Simulacija zamude naj NE ustvari novega testa. Namesto tega:
- V `articulation_test_results` posodobi `completed_at` zadnjega zapisa (ali doda nov zapis z zamaknjennim datumom kot "predviden")
- ALI: simulacija zamude naj samo izpiše predogled kako bi se datumi spremenili, brez spremembe baze

**Problem 2 — Cooldown predogled ne upošteva naročnine za "opravljene"**
Predogled kaže vse zapise iz `articulation_test_results` kot "opravljen" ne glede na datum naročnine. Test, ki pade po `current_period_end`, bi moral biti označen kot "blokiran" ali "ni mogoč brez podaljšanja".

**Problem 3 — `simulate-articulation-test` nima preverjanja naročnine**
Funkcija ne preverja, ali je datum virtualnega testa znotraj veljavne naročnine. Lahko ustvari test po poteku.

**Problem 4 — `calculateVirtualDate` dodaja `delayDays` POLEG cooldowna**
Zamuda 50 dni k datumu 26.9. + 90 + 50 = 15.2.2027. To je narobe — zamuda pomeni, da je uporabnik 50 dni prepozno opravil test, torej bi moral datum biti 26.9. + 90 + 50 = 4.2.2027... pravzaprav je to pravilno *če* bi šlo za nov test, ampak uporabnik želi da se NE ustvari test, le premakne se rok.

---

### PREDLAGAN PLAN POPRAVKOV

#### 1. Predelaj `simulate_delayed_test` (v `simulate-plan-lifecycle/index.ts`)
Namesto klicanja `simulate-articulation-test`, naj:
- Prebere zadnji `articulation_test_results` za otroka
- Izračuna: `zadnjiTest + 90 + delayDays` = predviden datum naslednjega testa
- **NE ustvari** novega zapisa v bazi
- Vrne: `{ nextPredictedDate, delayDays, originalDate, note }`
- Opcijsko: posodobi `completed_at` zadnjega testa za `delayDays` nazaj, da cooldown poteče prej (simulira zgodnejši test)

**Pravilna semantika:** "Zamuda X dni" = uporabnik bo naslednji test opravil X dni pozneje kot je predvideno. To pomeni, da se v predogledu naslednji predviden test premakne za X dni naprej. Ampak baza se NE spremeni — to je samo "what-if" simulacija.

#### 2. Predelaj `calculate_cooldown_preview`
- Za predvidene teste preveri, ali datum pade znotraj `current_period_end`
- Če pade po poteku: prikaži status "blokiran (naročnina potečena)" namesto "predviden"
- Dodaj polje `delayDays` ki ga prebere iz UI (če je nastavljeno)
- Upoštevaj smart cooldown tudi za predvidene teste po zamudi

#### 3. Počisti testne podatke za "Testni otrok"
- Izbriši 2 dodatna zapisa iz `articulation_test_results` (testa 4 in 5 z datumi 13.2.2027 in 8.5.2027), ki sta bila ustvarjena z napačno simulacijo
- Izbriši pripadajoči seji iz `articulation_test_sessions`
- Izbriši word results za ti dve seji

### Obseg
- `supabase/functions/simulate-plan-lifecycle/index.ts` — predelaj `simulate_delayed_test` (~20 vrstic) in `calculate_cooldown_preview` (~15 vrstic)
- `src/components/profile/PlanLifecycleTools.tsx` — dodaj `delayDays` parameter v cooldown preview klic (~3 vrstice)
- SQL migracija za čiščenje napačnih testnih podatkov
- Deploy edge function
