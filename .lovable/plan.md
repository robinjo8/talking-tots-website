
# Načrt: Ločitev admin in uporabniškega portala pri odjavi

## Ugotovljen problem

### Arhitektura
Oba konteksta (`AuthContext` in `AdminAuthContext`) uporabljata **isti Supabase klient**, kar pomeni:
- Ista localStorage seja za oba portala
- Oba konteksta poslušata `onAuthStateChange` dogodke
- Odjava iz enega portala vpliva na drugega

### Specifični problemi

1. **Mešanje sej**: Ko ste bili vpisani kot `kujavec.robert@gmail.com` na uporabniškem portalu in ste odprli admin portal, je `AdminAuthContext` prebral isto sejo in poiskal logopedist profil. Če ima ta email tudi logopedist profil pod drugim računom, to povzroči zmedo.

2. **Nepopolna odjava**: V `AdminAuthContext.signOut()` se localStorage žeton počisti **samo ob napaki** (v catch bloku), ne pa vedno. To pomeni, da `AuthContext` še vedno vidi "živo" sejo.

3. **AuthContext reagira na odjavo**: Ko admin portal pokliče `signOut()`, `AuthContext` (ki je globalno ovit okoli celotne aplikacije) prejme `SIGNED_OUT` dogodek in nastavi `profile: null`, kar lahko povzroči čudno obnašanje.

---

## Rešitev

### 1. AdminAuthContext.tsx - Vedno počisti localStorage

Trenutna koda (napačna):
```typescript
const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('SignOut error (ignored):', error);
    // PROBLEM: Samo tu se počisti localStorage
    localStorage.removeItem('sb-ecmtctwovkheohqwahvt-auth-token');
  }
  // ...
};
```

Popravljena koda:
```typescript
const signOut = async () => {
  // VEDNO počisti localStorage - preden kličemo Supabase
  localStorage.removeItem('sb-ecmtctwovkheohqwahvt-auth-token');
  
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('SignOut error (ignored):', error);
  }
  
  // Počisti lokalno stanje
  setUser(null);
  setSession(null);
  setProfile(null);
  setIsSuperAdmin(false);
  setIsProfileLoading(false);
};
```

### 2. AdminSidebar.tsx in AdminMobileNav.tsx - Počisti tudi sessionStorage

Popravljen `handleSignOut`:
```typescript
const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.warn('SignOut failed, redirecting anyway:', error);
  }
  // Dodatno počisti sessionStorage za splash screen
  sessionStorage.removeItem('splashShown');
  // Vedno preusmeri s trdo osveževanje
  window.location.href = '/admin/login';
};
```

### 3. AdminAuthContext - Ignoriraj če smo že v procesu odjave

Dodaj zastavico, ki prepreči da `onAuthStateChange` ponovno nastavi uporabnika med odjavo:

```typescript
const [isSigningOut, setIsSigningOut] = useState(false);

// V onAuthStateChange:
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    // Ignoriraj vse dogodke med odjavo
    if (isSigningOut) {
      console.log('AdminAuthContext: Ignoring event during signout:', event);
      return;
    }
    // ... ostala logika
  }
);

// V signOut:
const signOut = async () => {
  setIsSigningOut(true);
  localStorage.removeItem('sb-ecmtctwovkheohqwahvt-auth-token');
  // ...
};
```

---

## Datoteke za spremembo

| Datoteka | Sprememba |
|----------|-----------|
| `src/contexts/AdminAuthContext.tsx` | 1. Premakni `localStorage.removeItem()` pred `supabase.auth.signOut()` 2. Dodaj `isSigningOut` zastavico za preprečevanje ponovne prijave |
| `src/components/admin/AdminSidebar.tsx` | Počisti tudi `sessionStorage` pred preusmeritvijo |
| `src/components/admin/AdminMobileNav.tsx` | Enako kot AdminSidebar |

---

## Diagram toka (popravljeno)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  SCENARIJ: Odjava iz admin portala                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Uporabnik klikne "Odjava"                                           │
│  2. handleSignOut() nastavi isSigningOut = true                         │
│  3. localStorage.removeItem() TAKOJ počisti žeton                       │
│  4. supabase.auth.signOut() poskusi počistiti sejo na strežniku         │
│  5. onAuthStateChange prejme SIGNED_OUT - ignorira zaradi zastavice     │
│  6. Počisti lokalno stanje (user, session, profile)                     │
│  7. sessionStorage.removeItem('splashShown')                            │
│  8. window.location.href = '/admin/login' - trda preusmeritev           │
│  9. Nova seja - uporabnik je popolnoma odjavljen                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Pričakovani rezultat

Po popravku:
1. Odjava iz admin portala bo vedno uspela
2. LocalStorage žeton bo počiščen takoj na začetku
3. `onAuthStateChange` ne bo znova nastavil uporabnika med odjavo
4. Trda preusmeritev bo zagotovila čisto stanje brskalnika
5. Admin in uporabniški portal ne bosta več vmešana

---

## Tehnični povzetek

- **Vzrok**: Deljen Supabase klient = deljena seja v localStorage
- **Simptom**: Odjava ne deluje ker se uporabnik takoj znova prijavi
- **Rešitev**: Počisti localStorage takoj, uporabi zastavico za ignoriranje dogodkov, trda preusmeritev
