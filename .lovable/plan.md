
# Načrt: Popravek problema s checkout-om na Apple napravah

## Diagnoza problema

Po analizi sem odkril **dva ločena problema**:

### Problem 1: Neveljaven refresh token (GLAVNI PROBLEM)
Iz network logov vidim, da klic `supabase.auth.refreshSession()` vrača napako:
```
Status: 400
{"code":"refresh_token_not_found","message":"Invalid Refresh Token: Refresh Token Not Found"}
```

To pomeni, da uporabnici `selpyy@gmail.com` refresh token ni veljaven. Ko klikne gumb "Izberi TomiTalk Pro":
1. Koda pokliče `refreshSession()` → **NAPAKA**
2. Koda bi morala prikazati toast in preusmeriti na login
3. Stripe checkout se nikoli ne kliče

Možni vzroki:
- Refresh token je potekel (dolga neaktivnost)
- Uporabnica se je prijavila na drugi napravi
- Lokalni storage je bil počiščen ali pokvarjen
- Token podvojitev pri Google prijavi

### Problem 2: Safari popup blocker (POTENCIALNA TEŽAVA)
Čeprav to ni vzrok trenutnega problema, je `window.open(url, '_blank')` problematičen na Safari:
- Safari blokira popup okna če klic ni neposreden rezultat uporabniške akcije
- Ker koda najprej pokliče `await refreshSession()` in `await functions.invoke()`, Safari meni da `window.open` ni več povezan z uporabniškim klikom

---

## Rešitev

### 1. Izboljšano obravnavanje napak pri refresh session

Trenutno koda prikaže toast in preusmeri na login, ampak toast je mogoče prezrt. Dodaj bolj eksplicitno obvestilo.

**Datoteke za spremeniti:**
- `src/components/PricingSection.tsx`
- `src/components/profile/SubscriptionSection.tsx`

**Spremembe:**
```typescript
// Namesto samo toast.error, dodaj bolj vidno obvestilo
if (refreshError || !refreshData.session) {
  console.error('Session refresh error:', refreshError);
  
  // Počisti stare podatke seje
  await supabase.auth.signOut();
  
  toast.error("Seja je potekla. Prosimo, prijavite se znova.", {
    duration: 5000,
    action: {
      label: "Prijava",
      onClick: () => navigate("/login", { state: { returnTo: "/cenik" } }),
    },
  });
  navigate("/login", { state: { returnTo: "/cenik" } });
  return;
}
```

### 2. Uporabi `window.location.href` namesto `window.open` (Safari fix)

Safari zanesljiveje obravnava preusmeritev v istem oknu. Spremeni:

**Trenutno:**
```typescript
if (data?.url) {
  window.open(data.url, '_blank');
}
```

**Novo:**
```typescript
if (data?.url) {
  // Uporabi preusmeritev v istem oknu za Safari kompatibilnost
  // window.open se lahko blokira na Safari/iOS
  window.location.href = data.url;
}
```

**Opomba:** To pomeni, da se uporabnik preusmeri stran od aplikacije. Po uspešni plačilu ga Stripe vrne na `/payment-success`.

### 3. Alternativna rešitev: Pametna izbira metode

Če želiš ohraniti `window.open` za Chrome/Firefox, ampak uporabiti `location.href` za Safari:

```typescript
if (data?.url) {
  // Zaznaj Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    window.location.href = data.url;
  } else {
    // window.open z fallback
    const newWindow = window.open(data.url, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup je bil blokiran, uporabi preusmeritev
      window.location.href = data.url;
    }
  }
}
```

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/PricingSection.tsx` | Izboljšaj obravnavanje napak pri refreshSession, spremeni window.open v window.location.href |
| `src/components/profile/SubscriptionSection.tsx` | Isto kot zgoraj |

---

## Takojšnja rešitev za uporabnico

Za uporabnico `selpyy@gmail.com` lahko svetuješ:
1. Naj se odjavi iz aplikacije
2. Naj izbriše podatke brskalnika za TomiTalk (localStorage)
3. Naj se ponovno prijavi z Google računom
4. Nato naj poskusi kupiti naročnino

Alternativno: V Safari naj gre v Settings > Safari > Clear History and Website Data za to stran.

---

## Vizualni prikaz

```text
TRENUTNO:
Uporabnik klikne gumb → refreshSession() → NAPAKA (400) → Toast "Seja potekla" → Nič se ne zgodi vidno

NOVO:
Uporabnik klikne gumb → refreshSession() → NAPAKA (400) → signOut() → Preusmeritev na /login z obvestilom
```

---

## Tehnična obrazložitev Safari problema

Safari ima strožjo politiko popup oken:
1. `window.open` mora biti klican neposredno v event handlerju
2. Če je med klikom in `window.open` kakšen `await`, Safari to obravnava kot "programsko odprt popup"
3. Safari blokira programsko odprte popupe

Ker koda najprej pokliče:
```typescript
await supabase.auth.refreshSession();  // ~100-500ms
await supabase.functions.invoke(...);  // ~500-2000ms
window.open(data.url, '_blank');       // Safari: BLOKIRANO!
```

Safari blokira `window.open` ker je preteklo preveč časa od uporabniškega klika.

`window.location.href` ni popup in ni blokiran.
