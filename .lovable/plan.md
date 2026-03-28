

## Plan: Popravek preostalih odprtih težav (#3, #4, #12)

### Prioriteta 1: Fallback `new Date()` za periode (#3)

**Datoteka**: `supabase/functions/stripe-webhook/index.ts`, vrstici 222-223

Zamenjaj `new Date().toISOString()` z `null`. Dodaj opozorilo v log če ni datuma.

```ts
// PREJ:
const periodStart = safeTimestamp(...) || new Date().toISOString();
const periodEnd = safeTimestamp(...) || new Date().toISOString();

// POTEM:
const periodStart = safeTimestamp(item?.current_period_start) || safeTimestamp((subscription as any).current_period_start) || null;
const periodEnd = safeTimestamp(item?.current_period_end) || safeTimestamp((subscription as any).current_period_end) || null;

if (!periodEnd) {
  logStep("WARNING: No period_end found", { subscriptionId: subscription.id });
}
```

---

### Prioriteta 2: Periodično osveževanje naročnine (#4)

**Datoteka**: `src/hooks/useSubscription.ts`, vrstice 197-216

Dodaj `setInterval` vsakih 5 minut v obstoječi `useEffect`:

```ts
useEffect(() => {
  if (!user) { /* ... obstoječa koda ... */ return; }

  const timeoutId = setTimeout(() => { checkSubscription(); }, 100);

  // Periodično osveževanje vsakih 5 minut
  const intervalId = setInterval(() => {
    lastCheckedUserIdRef.current = null;
    checkSubscription();
  }, 5 * 60 * 1000);

  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
}, [user?.id, checkSubscription]);
```

---

### Prioriteta 3: Zmanjšaj API klice v webhook (#12)

**Datoteka**: `supabase/functions/stripe-webhook/index.ts`, vrstice 188-199

Namesto klicanja `admin.getUserById` za vsakega kandidata, omejimo na max 3 preverjanja:

```ts
for (const record of existingRecords.slice(0, 3)) {
  // ... obstoječa logika ...
}
```

---

### Obseg
- `supabase/functions/stripe-webhook/index.ts` — 2 spremembi (~8 vrstic)
- `src/hooks/useSubscription.ts` — dodaj interval (~6 vrstic)

### Ostale točke (5, 8, 9, 10, 11, 13, 15) — ne zahtevajo popravka zdaj
- #5, #8, #9, #11: manjši UX/edge case, ni kritično
- #10: `check-test-reminders` — smart cooldown že preverja `subscriptionEnd > now`
- #13: `productToPlan` — vzdržljivostni dolg, ne vpliva na delovanje
- #15: `past_due` — poslovna odločitev, trenutna logika (takojšen blok) je varna

