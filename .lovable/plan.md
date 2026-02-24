

## Popravek: Sinhronizacija narocnin med Stripe in bazo podatkov

### Analiza problema

#### jasna.kas@gmail.com - zakaj ne deluje

| Kaj | Stripe | Baza podatkov |
|-----|--------|---------------|
| Status | **active** | **inactive** |
| Obdobje | 24.2.2026 - 24.2.2027 | 24.2.2026 08:35 - 24.2.2026 08:35 |
| Narocnina | sub_1T4H56... (Pro letni) | sub_1T4H56... |

Casovnica dogodkov:
1. **08:35 UTC** - Stara narocnina izbrisana -> webhook `customer.subscription.deleted` nastavi status na `inactive`
2. **09:34 UTC** - Nova narocnina ustvarjena v Stripe
3. Webhook `customer.subscription.created` bi moral nastaviti status na `active`, AMPAK...
4. Webhook `checkout.session.completed` nastavi status NAZAJ na `inactive` (vrstica 138 v webhook kodi: `status: 'inactive'`)
5. Ko uporabnica odpre aplikacijo, frontend poklice `check-subscription` edge funkcijo
6. Funkcija vidi `inactive` v bazi, gre na Stripe fallback
7. **CRASH**: `subscription.current_period_start` NE OBSTAJA v Stripe API verziji `2025-08-27.basil` (polje je bilo premaknjeno na `subscription.items.data[0]`)
8. `new Date(undefined * 1000).toISOString()` vrze `RangeError` -> funkcija vrne 500 -> uporabnica ostane "nenarocena"

#### Sistemska napaka - prizadeti VSI uporabniki

| Uporabnik | DB current_period_end | Stripe current_period_end | Napaka |
|-----------|----------------------|--------------------------|--------|
| kujavec.robert@gmail.com | 17.2.**2026** | 17.2.**2027** | -1 leto |
| lea.erzar@gmail.com | 10.2.**2026** | 10.2.**2027** | -1 leto |
| erzar.marija@gmail.com | 22.2.**2026** | 22.2.**2027** | -1 leto |
| selpyy@gmail.com | 16.2.**2026** | 16.2.**2027** | -1 leto |
| jasna.kas@gmail.com | 24.2.2026 08:35 | 24.2.**2027** | inactive + -1 leto |

Vzrok: Webhook uporablja `subscription.current_period_start` in `subscription.current_period_end`, ki v API verziji `2025-01-27.basil` ne obstajata na subscription objektu. `safeTimestamp()` vrne `null`, fallback `new Date().toISOString()` zapise trenutni cas namesto pravilnega datuma.

**Zakaj uporabniki (razen jasne) kljub temu delujejo**: Imajo `status: active`, frontend preveri samo status. Napacen `current_period_end` bi postal problem sele ce bi kdo preklical narocnino (logika `isCanceled && isStillInPeriod` bi nepravilno zavrnila dostop).

### 3 napake za popravek

#### Napaka 1: `checkout.session.completed` prepisuje status

V `stripe-webhook/index.ts`, funkcija `handleCheckoutCompleted` (vrstica 133-140) dela upsert s `status: 'inactive'`. Ce se ta webhook pozene PO `customer.subscription.created`, prepisuje aktiven status nazaj na neaktiven.

**Popravek**: Namesto upsert z `inactive`, preveriti ali zapis ze obstaja. Ce obstaja, posodobiti samo `stripe_customer_id`. Ce ne obstaja, ustvariti nov zapis brez nastavljanja statusa (pustiti da `customer.subscription.created` nastavi pravilni status).

#### Napaka 2: Napacno branje `current_period_start/end` v obeh funkcijah

V Stripe API verzijah `2025-01-27.basil` in `2025-08-27.basil` sta polji `current_period_start` in `current_period_end` na **subscription items** (`subscription.items.data[0].current_period_start`), NE na subscription objektu.

**Popravek v `stripe-webhook/index.ts`** (vrstica 206-207):
```text
// PREJ:
current_period_start: safeTimestamp(subscription.current_period_start) || new Date().toISOString(),
current_period_end: safeTimestamp(subscription.current_period_end) || new Date().toISOString(),

// POTEM:
const item = subscription.items.data[0];
const periodStart = safeTimestamp(item?.current_period_start) || safeTimestamp(subscription.current_period_start) || new Date().toISOString();
const periodEnd = safeTimestamp(item?.current_period_end) || safeTimestamp(subscription.current_period_end) || new Date().toISOString();
```

**Popravek v `check-subscription/index.ts`** (vrstice 141-143 in 170-171):
```text
// PREJ:
if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
  subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
}
// in:
current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),

// POTEM:
const subItem = subscription.items?.data?.[0];
const rawPeriodEnd = subItem?.current_period_end || subscription.current_period_end;
if (rawPeriodEnd && typeof rawPeriodEnd === 'number') {
  subscriptionEnd = new Date(rawPeriodEnd * 1000).toISOString();
}
// in:
const rawPeriodStart = subItem?.current_period_start || subscription.current_period_start;
current_period_start: rawPeriodStart ? new Date(rawPeriodStart * 1000).toISOString() : new Date().toISOString(),
```

#### Napaka 3: Takojsnja sinhronizacija podatkov v bazi

SQL migracija za posodobitev jasninega zapisa in sprožitev ponovne sinhronizacije:

```text
-- Takojsen popravek za jasna.kas@gmail.com
UPDATE user_subscriptions
SET status = 'active',
    current_period_start = '2026-02-24T09:34:57Z',
    current_period_end = '2027-02-24T09:34:57Z',
    updated_at = now()
WHERE user_id = 'e5c6f750-7149-40c3-b607-afebf66dc1bb';

-- Popravek za kujavec.robert@gmail.com
UPDATE user_subscriptions
SET current_period_end = '2027-02-17T08:29:34Z'
WHERE user_id = '629a649f-15fb-44f8-b6f1-6be93ceac221';

-- Popravek za lea.erzar@gmail.com
UPDATE user_subscriptions
SET current_period_end = '2027-02-10T21:26:05Z'
WHERE user_id = '3d4f1163-fd09-4063-93d5-64c937af77c0';

-- Popravek za erzar.marija@gmail.com
UPDATE user_subscriptions
SET current_period_end = '2027-02-22T16:37:37Z'
WHERE user_id = '767acee5-340f-49fb-9e3f-ac80a42b196a';

-- Popravek za selpyy@gmail.com
UPDATE user_subscriptions
SET current_period_end = '2027-02-16T21:01:08Z'
WHERE user_id = '57af441e-fb66-42f4-8457-18a9578473d7';
```

### Datoteke za spremembo

- **`supabase/functions/stripe-webhook/index.ts`** - popravek `handleCheckoutCompleted` (ne prepisuj statusa) + branje period datumov iz items
- **`supabase/functions/check-subscription/index.ts`** - branje period datumov iz items namesto subscription objekta
- **Nova SQL migracija** - takojsnja sinhronizacija vseh uporabnikov s pravilnimi datumi iz Stripe

### Kaj ostane nespremenjeno

- Frontend koda (`useSubscription.ts`) - logika je pravilna, problem je v podatkih
- Pricing konfiguracija - brez sprememb
- Webhook event handling za `customer.subscription.deleted` in `invoice.payment_failed` - brez sprememb

