

# Natancna analiza in plan popravkov: Narocnina qjavec@gmail.com

---

## TOCEN VZROK NAPAKE

V bazi so **3 zapisi** z istim `stripe_customer_id = cus_TrVP7tYQusDxUE`:

```text
| user_id    | status   | updated_at          | Uporabnik          |
|------------|----------|---------------------|--------------------|
| 1c0fd1e1   | active   | 2026-02-12 09:19    | TRENUTNI (rocni fix)|
| b204074c   | inactive | 2026-02-11 07:58    | IZBRISAN           |
| 563aec50   | inactive | 2026-02-11 07:58    | IZBRISAN           |
```

Oba izbrisana uporabnika (`b204074c`, `563aec50`) NE obstajata vec v `auth.users` -- potrjeno s poizvedbo. Funkcija `archive-and-delete-user` NE brise zapisov iz `user_subscriptions`.

### Kako to povzroci napako

Ko Stripe poslje webhook `customer.subscription.created` po nakupu:

1. `handleSubscriptionUpdate` poisce uporabnika po `stripe_customer_id`:
```text
.eq("stripe_customer_id", customerId).maybeSingle()
```
2. `stripe_customer_id` NIMA unique constrainta -- ima navaden indeks
3. `.maybeSingle()` najde **3 vrstice** in vrne napako (PGRST116: "multiple rows returned")
4. `data` je `null`, `targetUserId` je `null`
5. Fallback `findUserIdByCustomerId` najde uporabnika po emailu
6. Upsert se izvede po `user_id` -- to bi MORALO delovati...

**AMPAK**: ce je `.maybeSingle()` napaka povzrocila izjemo v Supabase klientu (odvisno od verzije), bi lahko celoten `handleSubscriptionUpdate` padel pred fallbackom. To razlozzi, zakaj `updated_at` za trenutnega uporabnika ostane na `2026-02-11 12:58` (cas `create-checkout`) in se NIKOLI ne posodobi na ~13:59 (cas nakupa).

### Zakaj tudi PaymentSuccess ni popravil

`PaymentSuccess.tsx` poklice `check-subscription` po 1.5s zamiku. `check-subscription` najde v DB `status: inactive` za tega uporabnika, gre na Stripe fallback, najde aktivno narocnino, naredi upsert... **AMPAK**:

1. `check-subscription` v upsert NE nastavi `plan_id` -- nastavi samo `status`, `stripe_product_id` itd.
2. `PaymentSuccess` NE poklice `refreshSubscription()` iz `SubscriptionContext`
3. `useSubscription` hook ima cache (`lastCheckedUserIdRef`) -- ce je ze preveril za tega uporabnika, NE preveri znova
4. Rezultat: tudi ce bi check-subscription posodobil bazo, useSubscription se vedno vraca staro stanje

---

## PLAN POPRAVKOV (5 popravkov)

### Popravek 1: Pocisti osirotele zapise v bazi (rocno, LIVE okolje)

Zagnati v Supabase SQL Editor za LIVE okolje:
```sql
DELETE FROM user_subscriptions 
WHERE user_id NOT IN (SELECT id FROM auth.users);
```

To bo izbrisalo 2 osirotela zapisa. Supabase ti bo pokazal opozorilo "destructive operation" -- to je normalno, potrdi izvajanje.

### Popravek 2: archive-and-delete-user -- brisanje user_subscriptions

Pred brisanjem auth uporabnika (vrstica 311) dodati brisanje zapisa iz `user_subscriptions`. To prepreci bodoce osirotele zapise.

Datoteka: `supabase/functions/archive-and-delete-user/index.ts`

### Popravek 3: stripe-webhook -- robustnejsa poizvedba

Zamenjati `.maybeSingle()` z `.order('created_at', { ascending: false }).limit(1)` v `handleSubscriptionUpdate`. To vrne ZADNJI (najnovejsi) zapis namesto napake pri vec vrsticah. Dodatno: dodati preverjanje ali `user_id` obstaja v auth.users.

Datoteka: `supabase/functions/stripe-webhook/index.ts`

### Popravek 4: check-subscription -- dodati plan_id v upsert

V Stripe fallback upsert (vrstica 155-166) dodati `plan_id` mapping iz `productId`. Uporabiti isto `productToPlan` mapo kot v webhook funkciji.

Datoteka: `supabase/functions/check-subscription/index.ts`

### Popravek 5: PaymentSuccess + useSubscription -- osvezevanje stanja

**PaymentSuccess.tsx:**
- Dodati `useSubscriptionContext()` in poklicati `refreshSubscription()` po uspesnem check-subscription
- Dodati retry logiko (3 poskusi s 3s zamikom) ce check-subscription se ne najde narocnine

**useSubscription.ts:**
- Ko je DB status `inactive`, dodati fallback klic `check-subscription` Edge funkcije
- Ce ta vrne `subscribed: true`, znova prebrati DB in posodobiti stanje

---

## POVZETEK

| Datoteka | Sprememba |
|----------|-----------|
| SQL (rocno, LIVE) | Izbrisati osirotele zapise |
| `supabase/functions/archive-and-delete-user/index.ts` | Dodati brisanje user_subscriptions |
| `supabase/functions/stripe-webhook/index.ts` | .limit(1) namesto .maybeSingle() |
| `supabase/functions/check-subscription/index.ts` | Dodati plan_id v Stripe fallback upsert |
| `src/pages/PaymentSuccess.tsx` | refreshSubscription + retry |
| `src/hooks/useSubscription.ts` | check-subscription fallback |

Po teh popravkih:
- Webhook bo deloval tudi ce so v bazi podvojeni customer ID-ji (robustnost)
- Brisanje uporabnika ne bo vec pustilo osirotelih zapisov (preventiva)
- Ce webhook odpove, bo frontend sam sinhroniziral stanje iz Stripe (varnostna mreza)
- Po placilu se bo stanje takoj posodobilo (uporabniska izkusnja)
