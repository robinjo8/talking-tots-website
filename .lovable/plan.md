

## Analiza: Zakaj uporabnik logopedskezgodbe@gmail.com lahko dela preverjanje pred 3 meseci

### Ugotovitve

**Simulacijska orodja NISO kriva.** Dovoljena so samo za emaila `qjavec@gmail.com` in `kujavec.robert@gmail.com`. Uporabnik `logopedskezgodbe@gmail.com` jih ne more uporabiti.

### Dva problema

**Problem 1 — Naročnina je potekla, ampak status je še vedno `active`**

Podatki v bazi za tega uporabnika:
- `status: active`
- `current_period_end: 2026-01-30` (skoraj 2 meseca nazaj!)
- `cancel_at_period_end: false`

Stripe webhook za potek naročnine (ali `invoice.payment_failed`) ni pravilno posodobil statusa v bazi. Zato `useSubscription` hook vrne `isSubscribed: true` in uporabnik ima še vedno dostop do Pro funkcionalnosti.

**Problem 2 — Smart Cooldown se obnaša napačno za potekle naročnine**

`calculateNextTestDate()` v `useArticulationTestStatus.ts` izračuna:
1. Zadnji test: **5. feb 2026**
2. Normalni naslednji test: 5. feb + 90 dni = **6. maj 2026**
3. `subscriptionEnd = 30. jan 2026` (že preteklo!)
4. `lastTestTarget = 30. jan - 7 dni = 23. jan` (v preteklosti!)
5. Ker je `lastTestTarget < normalNext`, skrajša cooldown
6. `minNext = 5. feb + 30 dni = 7. mar 2026`
7. Ker je `lastTestTarget (23. jan) < minNext (7. mar)`, uporabi minimum 30 dni
8. Danes (28. mar) > 7. mar → **test je odklenjen po 30 dneh namesto 90!**

Smart cooldown je bil zasnovan za naročnine, ki *bodo kmalu potekle*, ne za naročnine, ki *so že potekle*.

### Rešitev

**1. Popravek `calculateNextTestDate` — ignoriraj pretekle `subscriptionEnd`**

Če je `subscriptionEnd` že v preteklosti, uporabi normalni 90-dnevni cooldown:
```ts
function calculateNextTestDate(lastCompletedAt: Date, subscriptionEnd: string | null): Date {
  const normalNext = addMonths(lastCompletedAt, 3);
  if (!subscriptionEnd) return normalNext;
  
  const subEnd = new Date(subscriptionEnd);
  // Če je naročnina že potekla, uporabi normalni cooldown
  if (isBefore(subEnd, new Date())) return normalNext;
  
  // ... ostala logika ostane enaka
}
```

**2. Popravek enake logike v edge funkciji `check-test-reminders/index.ts`**

Enako preverjanje dodaj v edge funkcijo za opomnike (vrstica ~115), da tudi tam smart cooldown ne skrajša intervala za že potekle naročnine.

**3. Ročni popravek podatkov v bazi**

Uporabnikova naročnina (`sub_1Ssec4GncjlOci0kHP3Xwp2W`) ima `current_period_end` v preteklosti ampak `status: active`. To je potrebno ročno popraviti na `expired` ali preveriti v Stripe dashboardu zakaj webhook ni sprožil posodobitve.

### Obseg
- `src/hooks/useArticulationTestStatus.ts` — 2 vrstici dodani v `calculateNextTestDate`
- `supabase/functions/check-test-reminders/index.ts` — 3 vrstice dodane za enako preverjanje
- Ročni popravek statusa naročnine v bazi (ali preveritev Stripe webhookov)

