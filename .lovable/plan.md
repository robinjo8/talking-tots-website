
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
