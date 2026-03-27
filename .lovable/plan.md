

## Analiza: Kaj se zgodi po poteku naročnine

### Trenutno stanje

**1. Podatki so varni — nikoli se ne brišejo**
Vsi podatki (testi, poročila, osebni načrti, napredek) ostanejo v bazi ne glede na status naročnine. Tabele `articulation_test_sessions`, `child_monthly_plans`, `plan_set_tracking` itd. nimajo nobene logike za brisanje ob poteku.

**2. Zaščita dostopa — DELNO deluje**
- `ActivityOptions.tsx` (glavna stran): Preverja `isPro` in blokira navigacijo na `/moji-izzivi` in `/artikulacijski-test` s toast sporočilom
- `SubscriptionGate` se uporablja na: Govorne vaje, Klepet, Album, Moja stran, itd.
- **PROBLEM: `MojiIzzivi.tsx` NIMA `SubscriptionGate`!** Če uporabnik pozna URL `/moji-izzivi`, lahko dostopa do osebnega načrta brez aktivne naročnine

**3. Subscription status logika**
`useSubscription.ts` pravilno obravnava:
- `status: "expired"` → `isSubscribed = false` (ker ni `active` ali `trialing`)
- `status: "canceled"` + `period_end > now()` → `isSubscribed = true` (do konca obdobja)
- `status: "active"` → `isSubscribed = true`

**4. Podaljšanje po poteku**
Ko uporabnik znova plača prek Stripe-a, webhook posodobi `user_subscriptions` → `status: "active"`, nov `current_period_end`. `useSubscription` ob naslednjem checku zazna spremembo → `isSubscribed = true` → vse se "odmrzne".

Obstoječi osebni načrt v `child_monthly_plans` ostane v bazi. Sistem nadaljuje tam kjer je bil, ker `useMonthlyPlan` bere zadnji aktivni plan ne glede na naročnino.

### Kar je treba popraviti

**Edini popravek: Dodaj `SubscriptionGate` na `MojiIzzivi.tsx`**

Trenutno je to edina Pro stran brez zaščite. Ko dodamo gate, bo ob poteku naročnine stran prikazala "Vsebina je zaščitena" namesto načrta.

### Logika "pavze/zamrznitve"

Že deluje pravilno brez dodatnih sprememb:
- **Potek** → `isSubscribed = false` → `ActivityOptions` blokira, `SubscriptionGate` blokira
- **Ponovna naročnina** → Stripe webhook → `status: "active"` → vse se odmrzne
- **Podatki** → Nikoli se ne brišejo, načrt ostane v bazi
- **Nadaljevanje** → Uporabnik nadaljuje na istem sklopu kot pred potekom

### Obseg spremembe
- 1 datoteka (`MojiIzzivi.tsx`) — ovij vsebino v `SubscriptionGate`
- Brez sprememb edge funkcij ali baze

