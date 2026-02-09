

## Problem

Ko si izbrisal staro narocnino in kupil novo, so se Stripe webhooks sprozili v tem vrstnem redu:

1. `customer.subscription.deleted` -- status nastavljen na "inactive"
2. `customer.subscription.created` -- webhook iskal zapis po `stripe_customer_id`, a ga NI NASEL (ker je `checkout.session.completed` prisel sele potem)
3. `checkout.session.completed` -- posodobil `stripe_customer_id`, ampak NI posodobil statusa narocnine

Rezultat: v bazi ostane `status: inactive`, `plan_id: null` -- aplikacija misli, da nimas narocnine.

Poleg tega webhook na vrstici 27 se vedno uporablja stari Pro produkt ID (`prod_TmbZ19RhCaSzrp`) namesto novega (`prod_TwXXpvPhSYVzvN`).

---

## Nacrt popravkov

### 1. Dodati novi Pro produkt ID v webhook

**Datoteka:** `supabase/functions/stripe-webhook/index.ts` (vrstica 25-28)

Preslikava produktov se posodobi:

```
'prod_TuvCF2Vlvmvp3M' -> 'start'
'prod_TmbZ19RhCaSzrp' -> 'pro'   (stari, ohranimo za nazaj)
'prod_TwXXpvPhSYVzvN' -> 'pro'   (novi)
```

### 2. Popraviti `handleSubscriptionUpdate` -- dodati fallback iskanje po emailu

Trenutno, ce webhook ne najde zapisa po `stripe_customer_id`, se ustavi. Popravek: ce ne najde zapisa, poisce Stripe stranko, dobi email, najde uporabnika v Supabase in ustvari/posodobi zapis.

```text
1. Poisci zapis po stripe_customer_id
2. Ce ne najdes -> poisci Stripe customer -> dobi email
3. Poisci uporabnika po emailu v auth.users
4. Ustvari ali posodobi zapis v user_subscriptions z upsert
```

### 3. Popraviti `handleCheckoutCompleted` -- uporabiti upsert namesto update

Trenutno `checkout.session.completed` naredi samo `update` -- ce zapis se ne obstaja, se nic ne zgodi. Spremenimo v `upsert`, da se vedno ustvari zapis s `stripe_customer_id` in statusom `inactive` (ki ga nato `subscription.created` posodobi).

### 4. Popraviti Stripe API verzijo

Webhook trenutno uporablja `apiVersion: "2025-12-15.clover"`, kar je zastarelo. Posodobimo na `2025-08-27.basil`.

---

## Povzetek sprememb

| Datoteka | Sprememba |
|---|---|
| `supabase/functions/stripe-webhook/index.ts` | Dodati novi Pro produkt ID, dodati fallback iskanje po emailu v `handleSubscriptionUpdate`, spremeniti `handleCheckoutCompleted` v upsert, popraviti API verzijo |

### Za takoj (po deployu)

Ko bo webhook popravljen, bo treba osveziti narocnino za uporabnika `qjavec@gmail.com`. To se naredi tako, da se v bazi rocno posodobi zapis ali pa se poklice `refreshSubscription` na frontendu. Lahko tudi dodam kodo v webhook, ki ob deployu takoj popravi obstojecega uporabnika, ali pa preprosto posodobim bazo neposredno z SQL ukazom.
