

## Plan: Popravek kritičnih težav v naročniškem sistemu

### 1. `useSubscription.ts` — preverjanje `current_period_end` za `active` status

**Problem**: Vrstici 126 in 158 — `isActive` ne preverja ali je `current_period_end` še v prihodnosti. Če webhook zataji, uporabnik z `status: active` in preteklim datumom obdrži dostop.

**Popravek** (na dveh mestih v datoteki):
```ts
// Vrstica 126 (fallback blok) IN vrstica 158 (glavni blok)
// PREJ:
const isActive = sub.status === 'active' || sub.status === 'trialing';

// POTEM:
const isActive = (sub.status === 'active' || sub.status === 'trialing') && isStillInPeriod !== false;
```

Uporabimo `!== false` namesto `&& isStillInPeriod` ker če `current_period_end` je `null` (logopedisti brez Stripe), ne smemo blokirati. `isStillInPeriod` je `null` ko ni datuma, `false` ko je preteklo, `true` ko je veljavno.

Popraviti je treba tudi vrstici 133 (`isSubscribed` v fallback bloku):
```ts
// PREJ:
isSubscribed: isActive || (isCanceled && !!isStillInPeriod),
// POTEM:
isSubscribed: isActive || (isCanceled && !!isStillInPeriod),
// Ta vrstica je že OK ker isActive zdaj vključuje isStillInPeriod preverjanje
```

---

### 2. `check-subscription/index.ts` — enako preverjanje (vrstice 79-82)

```ts
// PREJ (vrstica 79):
const isActive = sub.status === 'active' || sub.status === 'trialing';

// POTEM:
const isActive = (sub.status === 'active' || sub.status === 'trialing') && isStillInPeriod !== false;
```

---

### 3. `stripe-webhook/index.ts` — `listUsers` paginacija (vrstici 44, 122)

**Problem**: `supabase.auth.admin.listUsers()` privzeto vrne max 50 uporabnikov. Če jih je več, webhook ne najde novejših uporabnikov.

**Popravek**: Zamenjaj obe mesti z iskanjem po emailu:
```ts
// PREJ (vrstica 44 in 122):
const { data: users } = await supabase.auth.admin.listUsers();
const user = users?.users?.find(u => u.email === customer.email);

// POTEM:
const { data: users } = await supabase.auth.admin.listUsers({ 
  page: 1, perPage: 1000 
});
const user = users?.users?.find(u => u.email === targetEmail);
```

Še boljši pristop — uporabi `profiles` tabelo za iskanje po emailu namesto `listUsers`, kar je O(1) namesto O(n):
```ts
// Alternativa za findUserIdByCustomerId (vrstica 38-55):
async function findUserIdByEmail(email: string): Promise<string | null> {
  const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = users?.users?.find(u => u.email === email);
  return user?.id || null;
}
```

Za `handleCheckoutCompleted` (vrstica 122) — enaka sprememba.

---

### 4. `stripe-webhook/index.ts` — `handleSubscriptionDeleted` ohrani `plan_id` in `current_period_end`

**Problem**: Vrstice 259-267 — ob brisanju naročnine se `plan_id` takoj nastavi na `null`, kar lahko odvzame dostop pred koncem plačanega obdobja.

**Popravek**:
```ts
// PREJ:
.update({
  status: "inactive",
  stripe_subscription_id: null,
  plan_id: null,
  cancel_at_period_end: false,
  updated_at: new Date().toISOString()
})

// POTEM:
.update({
  status: "inactive",
  stripe_subscription_id: null,
  cancel_at_period_end: false,
  updated_at: new Date().toISOString()
  // plan_id in current_period_end OHRANIMO — 
  // useSubscription bo preveril isStillInPeriod
})
```

S tem uporabnik obdrži dostop do konca plačanega obdobja, nato `isStillInPeriod` postane `false` in dostop se samodejno zaklene.

---

### Obseg
- `src/hooks/useSubscription.ts` — 2 vrstici spremenjeni
- `supabase/functions/check-subscription/index.ts` — 1 vrstica spremenjena
- `supabase/functions/stripe-webhook/index.ts` — 3 spremembe (~10 vrstic)

