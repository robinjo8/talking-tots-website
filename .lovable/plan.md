
# Načrt: Popravek odjave - čiščenje localStorage

## Ugotovljen problem

Ko uporabnik klikne "Odjava":
1. `supabase.auth.signOut()` vrne napako 403 (`session_not_found`) - seja na strežniku ne obstaja več
2. Koda pravilno ujame napako in počisti React stanje (`setUser(null)`)
3. **PROBLEM**: Supabase SDK ob napaki NE počisti žetonov iz localStorage
4. Po preusmeritvi na `/admin/login` se stran ponovno naloži
5. `supabase.auth.getSession()` prebere stare žetone iz localStorage
6. `AdminAuthContext` nastavi uporabnika nazaj na veljaven
7. `AdminLogin` zazna veljavnega uporabnika in preusmeri nazaj na `/admin`

## Rešitev

Prisilno počistiti localStorage žetone, če `signOut()` ne uspe:

```typescript
const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('SignOut error (ignored):', error);
    // Prisilno počisti localStorage žetone
    localStorage.removeItem('sb-ecmtctwovkheohqwahvt-auth-token');
  }
  // Vedno počisti lokalno stanje
  setUser(null);
  setSession(null);
  setProfile(null);
  setIsSuperAdmin(false);
  setIsProfileLoading(false);
};
```

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/contexts/AdminAuthContext.tsx` | Posodobi | V catch bloku dodaj `localStorage.removeItem()` za Supabase žeton |

---

## Diagram toka dela (popravljeno)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  SCENARIJ: Odjava ko seja na strežniku ne obstaja več                   │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Uporabnik klikne "Odjava"                                           │
│  2. supabase.auth.signOut() vrne napako 403                             │
│  3. Catch blok:                                                         │
│     a) Zapiše warning v konzolo                                         │
│     b) NOVO: Počisti localStorage žeton                                 │
│  4. Počisti React stanje (user, session, profile)                       │
│  5. Preusmeri na /admin/login                                           │
│  6. getSession() ne najde žetona v localStorage                         │
│  7. Uporabnik ostane odjavljen                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Pričakovani rezultat

Po popravku:
1. Odjava bo vedno uspela, tudi če seja na strežniku ne obstaja
2. localStorage žetoni bodo počiščeni
3. Uporabnik bo ostal na `/admin/login` strani in ne bo avtomatsko vrnjen v portal
