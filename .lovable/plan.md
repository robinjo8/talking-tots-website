# Osebni načrt — Set-based sistem (implementirano)

## Implementirane spremembe

### 1. DB migracija
- Nova tabela `plan_set_tracking` za beleženje stanja sklopov
- Dodan `set_number` stolpec v `plan_activity_completions`
- Dodan `expires_at` stolpec v `child_monthly_plans`
- RLS politike za starše in logopede

### 2. Edge function `generate-monthly-plan`
- 90 dni → 30 sklopov
- Vsak sklop: 5 aktivnosti (1 motorika + 4 igre ALI 5 iger)
- Motorika frekvenca se preračuna v "vsak N-ti sklop"
- `expires_at` nastavljeno na 90 dni

### 3. Frontend
- `useMonthlyPlan.ts` — novi tipi (PlanSet)
- `usePlanProgress.ts` — set tracking, 24h expiry, 1 sklop/dan
- `MojiIzzivi.tsx` — prikaz trenutnega sklopa, progress bar, auto-renew
- `MojiIzziviArhiv.tsx` — koledarski prikaz zgodovine
- `PlanSetCard.tsx` — nova komponenta za sklop
- `AdminOsebniNacrt.tsx` — napredek otroka s statistiko

---

# Popravki preverjanja izgovorjave (implementirano)

## Implementirane spremembe

### 1. Edge function `transcribe-articulation` — filtri
- **Profanity filter**: Seznam prepovedanih besed (SLO + EN), nikoli ne vrne kletvic uporabniku
- **Filter dolžine**: Če Whisper vrne >2 besedi → zavrnitev (halucinacija)
- **Filter relevantnosti**: Če podobnost < 0.25 s ciljno besedo → zavrnitev
- Za zavrnjene rezultate se nikoli ne pošlje surova transkripcija na klienta (pošlje se prazen string)
- Zavrnjeni rezultati se logirajo v DB z matchType `rejected_profanity/too_many_words/irrelevant`

### 2. Čiščenje `articulationTestData.ts`
- Odstranjena varianta "HIŠKA" pri HIŠA (ni legitimna fonetična variacija)

### 3. Prikaz napak
- Namesto "Slišano: [surova transkripcija]" se prikaže: "BESEDA NI BILA DOBRO ZAZNANA, PROSIMO PONOVITE"
- Nikoli se ne prikaže surova Whisper transkripcija uporabniku

### 4. Samodejno predvajanje zvoka
- Ob prikazu nove besede se po 1 sekundi samodejno predvaja zvočni posnetek besede
- Gumb "Izgovori besedo" je onemogočen med predvajanjem (`isAudioPlaying`)
- Dodan gumb zvočnika (Volume2) nad record gumbom za ponovno predvajanje

---

# Dodatno preverjanje izgovorjave (implementirano)

## Implementirane spremembe

### 1. DB migracija
- Nova tabela `additional_test_assignments` za dodelitve dodatnega preverjanja
- Nova tabela `additional_test_words` za besede v dodelitvi
- Dodan `additional_assignment_id` stolpec v `articulation_test_sessions`
- RLS politike za logopede (INSERT/SELECT) in starše (SELECT/UPDATE)
- Nov enum `additional_test_completed` v `notification_type`

### 2. Admin portal
- Gumb "Dodeli dodatno preverjanje" na strani pregleda seje (`AdminSessionReview.tsx`)
- `AdditionalTestAssignDialog.tsx` — dialog z iskalnikom besed iz vseh iger in testa
- Grupiranje po črkah, checkbox izbira, gumb "Dodeli uporabniku"

### 3. Uporabniški portal
- Nova kartica "Dodatno preverjanje" v `ActivityOptions.tsx` (vidna samo ko ima otrok aktivno dodelitev)
- Nova stran `/dodatno-preverjanje` (`DodatnoPreverjanje.tsx`) — enak dizajn kot artikulacijski test
- `useAdditionalTestAssignment.ts` — preverjanje aktivne dodelitve + nalaganje besed
- `useAdditionalTestSession.ts` — upravljanje sej za dodatno preverjanje

### 4. Obvestila
- Ob zaključku dodatnega preverjanja se ustvari obvestilo za logopeda
- Seja se prikaže v `/admin/pending` za pregled

### 5. Nedotaknjene datoteke
- `ArtikuacijskiTest.tsx` — brez sprememb
- `useArticulationTestNew.ts` — se re-uporabi (read-only)
- `useUserSessionManager.ts` — brez sprememb
- `articulationTestData.ts` — brez sprememb
