
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
