
# Načrt: Popravek odjave (Logout)

## Ugotovitev problema

Napaka `session_not_found` (403) iz Supabase pomeni, da seja na strežniku ne obstaja več (je potekla ali bila že izbrisana), vendar ima brskalnik še vedno stare žetone v pomnilniku.

**Vzrok:** Funkcija `signOut` v `AdminAuthContext.tsx` kliče `await supabase.auth.signOut()`. Če Supabase vrne napako (ker seja ne obstaja), lahko to prekine normalen tok odjave.

**To NI posledica mojih zadnjih sprememb** - spremenil sem samo kodo za poročila, ne za avtentikacijo.

---

## Rešitev

### 1. AdminAuthContext.tsx - signOut funkcija mora ignorirati napake

Trenutna koda:
```typescript
const signOut = async () => {
  await supabase.auth.signOut();
  setUser(null);
  setSession(null);
  setProfile(null);
  setIsSuperAdmin(false);
  setIsProfileLoading(false);
};
```

Nova koda:
```typescript
const signOut = async () => {
  // Ignoriraj napake - tudi če seja ne obstaja, počisti lokalno stanje
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('SignOut error (ignored):', error);
  }
  // Vedno počisti lokalno stanje, ne glede na napako
  setUser(null);
  setSession(null);
  setProfile(null);
  setIsSuperAdmin(false);
  setIsProfileLoading(false);
};
```

### 2. AdminSidebar.tsx - handleSignOut mora vedno preusmeriti

Trenutna koda:
```typescript
const handleSignOut = async () => {
  await signOut();
  window.location.href = '/admin/login';
};
```

Nova koda (za večjo zanesljivost):
```typescript
const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.warn('SignOut failed, redirecting anyway:', error);
  }
  // Vedno preusmeri, tudi če pride do napake
  window.location.href = '/admin/login';
};
```

### 3. AdminMobileNav.tsx - enak popravek

Enak vzorec za mobilno navigacijo.

---

## Datoteke za spremembo

| Datoteka | Akcija | Opis |
|----------|--------|------|
| `src/contexts/AdminAuthContext.tsx` | Posodobi | Ovij `supabase.auth.signOut()` v try-catch |
| `src/components/admin/AdminSidebar.tsx` | Posodobi | Ovij `await signOut()` v try-catch |
| `src/components/admin/AdminMobileNav.tsx` | Posodobi | Ovij `await signOut()` v try-catch |

---

## Pričakovani rezultat

Po popravku:
1. Odjava bo vedno uspela, tudi če seja na Supabase strežniku ne obstaja
2. Lokalno stanje se bo počistilo
3. Uporabnik bo preusmerjen na `/admin/login`
