
# Načrt: Popravek race condition pri webhook obdelavi

## Analiza problema

**Vzrok:** Race condition med Stripe webhook eventi `customer.subscription.created` in `checkout.session.completed`.

**Časovnica napake:**
```text
09:33:00 - subscription.created → začne procesiranje, nastavi status: trialing
09:33:00 - checkout.completed → začne procesiranje skoraj istočasno
09:33:01 - subscription.created → zapiše "trialing" v bazo
09:33:01 - checkout.completed → upsertSubscription PREPIŠE z "inactive"
```

**Rezultat:** Končni status v bazi je `inactive` namesto `trialing`, kar blokira dostop do vsebine.

---

## Rešitev

Odstraniti `upsertSubscription` klic iz `checkout.session.completed` handlerja, ker:

1. `customer.subscription.created` webhook že pravilno nastavi vse podatke (status, plan, obdobje)
2. `create-checkout` funkcija že ustvari začetni zapis pred Stripe checkout-om
3. `checkout.session.completed` ne potrebuje posodabljati statusa - to je naloga `subscription.created`

---

## Spremembe

| Datoteka | Vrstica | Sprememba |
|----------|---------|-----------|
| `supabase/functions/stripe-webhook/index.ts` | 86-113 | Poenostavi `handleCheckoutCompleted` - samo posodobi `stripe_customer_id`, ne kliči `upsertSubscription` |

---

## Tehnična implementacija

### Nova verzija handleCheckoutCompleted:

```typescript
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  logStep("Processing checkout.session.completed", { sessionId: session.id });
  
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  
  if (!userId && !session.customer_email) {
    logStep("No userId in metadata and no customer_email, cannot process");
    return;
  }

  // Find user_id if not in metadata
  let targetUserId = userId;
  if (!targetUserId && session.customer_email) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === session.customer_email);
    if (user) {
      targetUserId = user.id;
    } else {
      logStep("Could not find user by email", { email: session.customer_email });
      return;
    }
  }

  // Only update stripe_customer_id, don't touch status
  // subscription.created webhook handles status update
  const { error } = await supabase
    .from("user_subscriptions")
    .update({ 
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", targetUserId);

  if (error) {
    logStep("Error updating customer ID", { error: error.message });
    // Don't throw - this is not critical if subscription.created already ran
  } else {
    logStep("Customer ID updated", { userId: targetUserId, customerId });
  }
}
```

### Odstrani upsertSubscription funkcijo:

Funkcija `upsertSubscription` (vrstice 209-246) ni več potrebna in jo lahko odstranimo.

---

## Zakaj ta rešitev deluje

1. **`create-checkout`** ustvari začetni zapis z `stripe_customer_id` in `status: inactive`
2. **`subscription.created` webhook** posodobi na pravi status (`trialing` ali `active`) s polnimi podatki
3. **`checkout.completed` webhook** samo zabeleži customer ID (če še ni) brez poseganja v status
4. Ni več race condition - samo en webhook upravlja status

---

## Takojšnji popravek za uporabnika

Za uporabnika `qjavec@gmail.com` je potrebno ročno popraviti status v bazi:

```sql
UPDATE user_subscriptions 
SET status = 'trialing', updated_at = NOW()
WHERE user_id = '9a1b1694-83ed-4bbd-8043-9c9e1deed538';
```

---

## Končni rezultat

Po implementaciji:
- Webhook eventi ne bodo več prepisovali drug drugega
- Status naročnine bo pravilno nastavljen ob nakupu
- Uporabniki bodo imeli takojšen dostop do vsebine po plačilu
