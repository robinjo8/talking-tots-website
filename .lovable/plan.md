

# Načrt: Popravek nakupa na Apple napravah (Safari popup blokada)

## Analiza problema

**Vzrok napake:** Safari (in drugi Apple brskalniki) blokirajo `window.open()` klice, ki niso neposredno sproženi ob uporabniškem kliku. Ker je med klikom in odprtjem okna asinhrona operacija (`supabase.functions.invoke`), Safari to zazna kot popup in ga blokira.

**Trenutno stanje v kodi:**
- `src/components/PricingSection.tsx` (vrstica 80): `window.open(data.url, '_blank')`
- `src/components/profile/SubscriptionSection.tsx` (vrstica 73): `window.open(data.url, '_blank')`
- `src/components/profile/SubscriptionSection.tsx` (vrstica 105): `window.open(data.url, '_blank')` (customer portal)

**Rešitev:** Zamenjati `window.open(data.url, '_blank')` z `window.location.href = data.url` za preusmeritev v istem oknu, kar Safari ne blokira.

---

## Spremembe

| Datoteka | Vrstica | Sprememba |
|----------|---------|-----------|
| `src/components/PricingSection.tsx` | 80 | `window.open(data.url, '_blank')` → `window.location.href = data.url` |
| `src/components/profile/SubscriptionSection.tsx` | 73 | `window.open(data.url, '_blank')` → `window.location.href = data.url` |
| `src/components/profile/SubscriptionSection.tsx` | 105 | `window.open(data.url, '_blank')` → `window.location.href = data.url` |

---

## Tehnična implementacija

### PricingSection.tsx (vrstica 78-81)

```typescript
// Pred:
if (data?.url) {
  window.open(data.url, '_blank');
}

// Po:
if (data?.url) {
  window.location.href = data.url;
}
```

### SubscriptionSection.tsx (vrstica 72-74)

```typescript
// Pred:
if (data?.url) {
  window.open(data.url, '_blank');
}

// Po:
if (data?.url) {
  window.location.href = data.url;
}
```

### SubscriptionSection.tsx (vrstica 104-106 - customer portal)

```typescript
// Pred:
if (data?.url) {
  window.open(data.url, '_blank');
}

// Po:
if (data?.url) {
  window.location.href = data.url;
}
```

---

## Prednosti rešitve

1. **Safari kompatibilnost** - preusmeritev v istem oknu ni blokirana
2. **iOS kompatibilnost** - deluje tudi na iPhone in iPad napravah
3. **Konsistentnost** - enako obnašanje na vseh brskalnikih
4. **Enostavnost** - minimalna sprememba kode

---

## Opomba

Po uspešnem plačilu na Stripe se uporabnik vrne na `success_url` (trenutno `/payment-success`), kar je že pravilno nastavljeno v edge funkciji `create-checkout`.

